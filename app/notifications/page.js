"use client";
import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Info,
  Check,
} from "lucide-react";
import axiosClient from "@/lib/axiosClient";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  setNotifications,
  setLoading,
  setError,
  markAsRead,
  clearAllNotifications,
} from "@/lib/store/slices/notificationsSlice";

export default function NotificationPage() {
  const dispatch = useAppDispatch();
  const { notifications, loading, error, unreadCount } = useAppSelector(
    (state) => state.notifications
  );

  // Fetch notifications from API
  const fetchNotifications = async () => {
    try {
      dispatch(setLoading(true));
      const response = await axiosClient.get("/notifications");

      if (response.data) {
        // Calculate unread count
        const unreadCount =
          response.data.data?.filter((n) => !n.read_at)?.length || 0;

        dispatch(
          setNotifications({
            data: response.data.data || [],
            unreadCount: unreadCount,
          })
        );
      }
    } catch (error) {
      dispatch(setError("Failed to load notifications"));
      toast.error("Failed to load notifications");
      console.error("Error fetching notifications:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Mark single notification as read
  const handleMarkAsRead = async (id) => {
    try {
      const response = await axiosClient.post(`/notifications/${id}/read`, {
        mark: "read",
      });

      if (response.data) {
        dispatch(markAsRead(id));
        toast.success("Notification marked as read");
      }
    } catch (error) {
      toast.error("Failed to mark notification as read");
      console.error("Error marking notification as read:", error);
    }
  };

  // Mark all notifications as read
  const handleMarkAllAsRead = async () => {
    try {
      // Agar API mein "mark all as read" endpoint hai to use karo
      // Warna har notification ke liye individually mark karo
      const unreadNotifications = notifications.filter((n) => !n.read_at);

      for (const notification of unreadNotifications) {
        await axiosClient.post(`/notifications/${notification.id}/read`, {
          mark: "read",
        });
      }

      // Dispatch action for each notification
      unreadNotifications.forEach((n) => dispatch(markAsRead(n.id)));

      toast.success("All notifications marked as read");
    } catch (error) {
      toast.error("Failed to mark all notifications as read");
      console.error("Error marking all notifications as read:", error);
    }
  };

  // Clear all notifications
  const handleClearAll = async () => {
    if (confirm("Are you sure you want to clear all notifications?")) {
      try {
        const response = await axiosClient.post("/notifications/clear", {
          delete: true,
        });

        if (response.data) {
          dispatch(clearAllNotifications());
          toast.success("All notifications cleared");
        }
      } catch (error) {
        toast.error("Failed to clear notifications");
        console.error("Error clearing notifications:", error);
      }
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "";

    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;

      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return dateString;
    }
  };

  // Get icon based on notification type
  const getIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "success":
        return (
          <CheckCircle2 className="text-green-500 w-5 h-5 mt-1 flex-shrink-0" />
        );
      case "warning":
        return (
          <AlertCircle className="text-yellow-500 w-5 h-5 mt-1 flex-shrink-0" />
        );
      case "error":
        return <XCircle className="text-red-500 w-5 h-5 mt-1 flex-shrink-0" />;
      default:
        return <Info className="text-blue-500 w-5 h-5 mt-1 flex-shrink-0" />;
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Notifications
                {unreadCount > 0 && (
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    {unreadCount} new
                  </span>
                )}
              </h1>
              <p className="text-gray-600 mt-1">
                Stay updated with the latest system alerts and updates.
              </p>
            </div>

            <div className="flex gap-3">
              {notifications.length > 0 && unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <Check className="w-4 h-4" />
                  Mark all as read
                </button>
              )}

              {notifications.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-gray-500 mt-2">Loading notifications...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="text-center py-12">
              <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Error loading notifications
              </h3>
              <p className="mt-1 text-sm text-gray-500">{error}</p>
              <button
                onClick={fetchNotifications}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          )}

          {/* Notifications List */}
          {!loading && !error && (
            <div className="bg-white shadow-sm border border-gray-200 rounded-lg divide-y">
              {notifications.length > 0 ? (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-5 flex justify-between items-start ${
                      n.read_at ? "bg-white" : "bg-blue-50"
                    } hover:bg-gray-50 transition-colors`}
                  >
                    <div className="flex items-start gap-3 flex-1">
                      {getIcon(n.type)}

                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900 truncate">
                          {n.title || "Notification"}
                        </h3>
                        <p className="text-sm text-gray-600 mt-0.5 break-words">
                          {n.message || n.body || n.content}
                        </p>

                        {/* Notification metadata */}
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <span className="text-xs text-gray-400">
                            {formatDate(n.created_at || n.date)}
                          </span>

                          {n.created_at && n.read_at && (
                            <span className="text-xs text-green-500">
                              Read {formatDate(n.read_at)}
                            </span>
                          )}

                          {n.type && (
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                n.type === "success"
                                  ? "bg-green-100 text-green-800"
                                  : n.type === "warning"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : n.type === "error"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {n.type}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {!n.read_at && (
                      <button
                        onClick={() => handleMarkAsRead(n.id)}
                        className="text-sm text-blue-600 hover:text-blue-800 ml-4 flex-shrink-0"
                      >
                        Mark as Read
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <Bell className="mx-auto h-10 w-10 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No notifications
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    You're all caught up for now!
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Refresh Button */}
          {!loading && (
            <div className="mt-6 text-center">
              <button
                onClick={fetchNotifications}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Refresh notifications
              </button>
            </div>
          )}
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </Layout>
  );
}
