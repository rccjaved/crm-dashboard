"use client";
import { usePathname } from "next/navigation";
import { LayoutDashboard, File, Settings, MessageSquare, Projector, User, InspectIcon, Activity, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useSelector } from "react-redux";

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const pathname = usePathname();
  
  // Get user and modules from Redux store
  const { userInfo, modules } = useSelector((state) => state.auth);

  // Dashboard is mandatory - always shown
  const dashboardItem = { name: "Dashboard", icon: <LayoutDashboard />, path: "/", moduleKey: "dashboard" };

  // Other menu items with their module keys
  const otherMenuItems = [
    { name: "All Projects", icon: <Projector />, path: "/projects", moduleKey: "projects" },
    { name: "Users", icon: <User />, path: "/users", moduleKey: "users" },
    { name: "Complaint", icon: <File />, path: "/complaint", moduleKey: "complaints" },
    { name: "Trustmark Audit", icon: <Settings />, path: "/trustmark", moduleKey: "trustmarks" },
    { name: "C3 Inspection", icon: <InspectIcon />, path: "/inspection", moduleKey: "inspections" },
    { name: "Notifications", icon: <AlertCircle />, path: "/notifications", moduleKey: "notifications" },
    { name: "Activity Screen", icon: <Activity />, path: "/activity", moduleKey: "activity" },
    // { name: "Chat", icon: <MessageSquare />, path: "/chat", moduleKey: "chat" },
  ];

  // All menu items (for admin users)
  const allMenuItems = [dashboardItem, ...otherMenuItems];

  // Determine which menu items to show
  const getMenuItems = () => {
    if (!userInfo) {
      return [dashboardItem]; // Only Dashboard if not logged in
    }
    
    // Check if user is admin (is_admin = true) - admins see all menu items
    if (userInfo.is_admin === true || userInfo.role === 'admin') {
      return allMenuItems;
    }
    
    // For non-admin users, always include Dashboard, then filter others based on modules
    if (!modules || modules.length === 0) {
      return [dashboardItem]; // Only Dashboard if no modules
    }

    // Get enabled module keys from user's modules
    const enabledModuleKeys = modules
      .filter(module => module.is_enabled === true)
      .map(module => module.module_key);

    // Filter other menu items based on enabled modules
    // Dashboard is always included
    const filteredItems = otherMenuItems.filter(item => {
      // Check if the menu item's module key is in the enabled modules
      return enabledModuleKeys.includes(item.moduleKey);
    });

    // Always include Dashboard first, then filtered items
    return [dashboardItem, ...filteredItems];
  };

  const menuItems = getMenuItems();

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <div>
            <h1 className="text-xl font-bold text-gray-800">CRMS</h1>
            {userInfo && (
              <p className="text-xs text-gray-500 mt-1">
                {userInfo.full_name || userInfo.email}
                {userInfo.is_admin && <span className="ml-1">(Admin)</span>}
              </p>
            )}
          </div>
        </div>

        <nav className="mt-6">
          <div className="px-4 mb-4">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Main Menu
            </h2>
          </div>

          <ul className="space-y-1 px-3">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.path}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    pathname === item.path
                      ? "bg-blue-500 text-white"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}