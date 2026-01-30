"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Layout from "../components/Layout";
import { Plus, ChevronLeft, ChevronRight, Edit, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  setUsers,
  setLoading,
  setError,
  deleteUser,
  startUpdatingUser,
  stopUpdatingUser,
  updateUserModules,
} from "@/lib/store/slices/usersSlice";
import axiosClient from "@/lib/axiosClient";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function UsersPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { users, pagination, isLoading, error, updatingUserId } =
    useAppSelector((state) => state.users);

  // State for update modal
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedModules, setSelectedModules] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);

  // Available modules
  const allModules = [
    "projects",
    "complaints",
    "users",
    "settings",
    "reports",
    "dashboard",
  ];

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Fetch users
  const fetchUsers = async (page = 1) => {
    try {
      dispatch(setLoading(true));
      const response = await axiosClient.get(`/admin/fetch-users?page=${page}`);

      const transformedUsers = response?.data?.data?.map((user, index) => {
        // Get modules from API response - could be in modules array or module_name string
        let modulesArray = [];
        let moduleNameString = "";

        // Check if modules is an array
        if (Array.isArray(user?.modules) && user.modules.length > 0) {
          modulesArray = user.modules;
          // If modules is array of objects with module_key, extract keys
          if (user.modules[0]?.module_key) {
            moduleNameString = user.modules
              .map((m) => m.module_key || m.title || m.name)
              .join(", ");
          } else if (typeof user.modules[0] === "string") {
            // If modules is array of strings
            moduleNameString = user.modules.join(", ");
          }
        } else if (user?.module_name) {
          // If module_name is a string, split it and create array
          moduleNameString = user.module_name;
          modulesArray = user.module_name
            .split(",")
            .map((m) => m.trim())
            .filter((m) => m);
        } else if (user?.modules && typeof user.modules === "string") {
          // If modules is a string
          moduleNameString = user.modules;
          modulesArray = user.modules
            .split(",")
            .map((m) => m.trim())
            .filter((m) => m);
        }

        return {
          id: user?.id,
          number: (page - 1) * response.data.meta.per_page + index + 1,
          name: user?.full_name,
          email: user?.email,
          moduleName: moduleNameString || "No Modules",
          modules: modulesArray, // Store modules array
          createdAt: user?.created_at,
          formattedDate: formatDate(user?.created_at),
        };
      });

      dispatch(
        setUsers({
          users: transformedUsers,
          pagination: response?.data?.meta,
        })
      );
    } catch (error) {
      dispatch(setError("Failed to load users"));
      toast.error("Failed to load users");
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle Edit button click
  const handleEditClick = (user) => {
    setSelectedUser(user);
    // Parse existing modules - prefer modules array over moduleName string
    let existingModules = [];
    
    if (Array.isArray(user.modules) && user.modules.length > 0) {
      // If modules is array of objects with module_key
      if (user.modules[0]?.module_key) {
        existingModules = user.modules.map((m) => m.module_key);
      } else if (typeof user.modules[0] === "string") {
        // If modules is array of strings
        existingModules = user.modules;
      }
    } else if (user.moduleName) {
      // Fallback to parsing moduleName string
      existingModules = user.moduleName
        .split(",")
        .map((m) => m.trim().toLowerCase());
    }
    
    setSelectedModules(existingModules);
    dispatch(startUpdatingUser(user.id));
    setIsUpdateModalOpen(true);
  };

  // Close update modal
  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedUser(null);
    setSelectedModules([]);
    dispatch(stopUpdatingUser());
  };

  // Handle module selection
  const handleModuleToggle = (module) => {
    setSelectedModules((prev) =>
      prev.includes(module)
        ? prev.filter((m) => m !== module)
        : [...prev, module]
    );
  };

  // Update user modules
  const handleUpdateUser = async () => {
    if (!selectedUser || selectedModules.length === 0) {
      toast.error("Please select at least one module");
      return;
    }

    setIsUpdating(true);
    try {
      const response = await axiosClient.post(
        `/admin/user/update/${selectedUser.id}`,
        {
          modules: selectedModules,
        }
      );

      if (response.data) {
        // Update in Redux store
        dispatch(
          updateUserModules({
            userId: selectedUser.id,
            modules: selectedModules,
          })
        );

        toast.success(
          response.data.msg || "User modules updated successfully!"
        );
        closeUpdateModal();
      } else {
        throw new Error(response.data?.msg || "Failed to update user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      const errorMessage =
        error.response?.data?.msg ||
        error.response?.data?.message ||
        error.message ||
        "Failed to update user modules";
      toast.error(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (userId) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        await axiosClient.delete(`/admin/users/${userId}`);
        dispatch(deleteUser(userId));
        toast.success("User deleted successfully");
      } catch (error) {
        toast.error("Failed to delete user");
      }
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.last_page) {
      fetchUsers(newPage);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Users</h1>
                <p className="text-gray-600 mt-1">
                  Manage system users and their permissions.
                </p>
              </div>
              <button
                onClick={() => router.push("/create-user")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center"
              >
                <Plus className="w-5 h-5 text-white mx-1" />
                Add User
              </button>
            </div>
          </div>

          {/* Desktop Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Module Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users?.map((user) => (
                    <tr key={user?.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user?.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                        {user?.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user?.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user?.modules && Array.isArray(user.modules) && user.modules.length > 0 ? (
                          <div className="flex flex-col gap-1">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {user.modules.length} {user.modules.length === 1 ? 'Module' : 'Modules'}
                            </span>
                            <span className="text-xs text-gray-600 max-w-xs truncate" title={user.moduleName}>
                              {user.moduleName}
                            </span>
                          </div>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            No Modules
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user?.formattedDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleEditClick(user)}
                          className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                        >
                          <Edit className="w-4 h-4" />
                        
                        </button>
                        {/* <button
                          onClick={() => handleDelete(user?.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button> */}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {users?.length > 0 && (
              <div className="mt-6 flex items-center justify-between p-4">
                <div className="text-sm text-gray-700">
                  Showing{" "}
                  {(pagination.current_page - 1) * pagination.per_page + 1} to{" "}
                  {Math.min(
                    pagination.current_page * pagination.per_page,
                    pagination.total
                  )}{" "}
                  of {pagination.total} results
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      handlePageChange(pagination.current_page - 1)
                    }
                    disabled={pagination.current_page === 1}
                    className="p-2 border rounded disabled:opacity-50 hover:bg-gray-50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-sm">
                    Page {pagination.current_page} of {pagination.last_page}
                  </span>
                  <button
                    onClick={() =>
                      handlePageChange(pagination.current_page + 1)
                    }
                    disabled={pagination.current_page === pagination.last_page}
                    className="p-2 border rounded disabled:opacity-50 hover:bg-gray-50"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Update User Modal */}
      {isUpdateModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={closeUpdateModal}
            ></div>

            {/* Modal */}
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              {/* Modal Header */}
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Update User Modules - {selectedUser.name}
                  </h3>
                  <button
                    onClick={closeUpdateModal}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Module Selection */}
                <div>
                  <p className="text-sm text-gray-600 mb-3">
                    Select modules for this user:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {allModules.map((module) => (
                      <div key={module} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`module-${module}`}
                          checked={selectedModules.includes(module)}
                          onChange={() => handleModuleToggle(module)}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label
                          htmlFor={`module-${module}`}
                          className="ml-2 text-sm text-gray-700 capitalize"
                        >
                          {module}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedModules.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">
                      Selected modules:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedModules.map((module) => (
                        <span
                          key={module}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize"
                        >
                          {module}
                          <button
                            onClick={() => handleModuleToggle(module)}
                            className="ml-2 text-blue-600 hover:text-blue-800"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleUpdateUser}
                  disabled={isUpdating || selectedModules.length === 0}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdating ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Updating...
                    </>
                  ) : (
                    "Update User"
                  )}
                </button>
                <button
                  type="button"
                  onClick={closeUpdateModal}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" />
    </Layout>
  );
}
