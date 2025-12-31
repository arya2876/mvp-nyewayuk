"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Bell, Check, Package, Clock, Star, Camera, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

interface Notification {
    id: string;
    type: string;
    title: string;
    message: string;
    linkUrl?: string;
    isRead: boolean;
    createdAt: string;
}

const getNotificationIcon = (type: string) => {
    switch (type) {
        case "NEW_RESERVATION":
            return <Package className="w-4 h-4 text-blue-500" />;
        case "RESERVATION_ACCEPTED":
            return <Check className="w-4 h-4 text-green-500" />;
        case "RESERVATION_REJECTED":
            return <X className="w-4 h-4 text-red-500" />;
        case "REVIEW_RECEIVED":
            return <Star className="w-4 h-4 text-yellow-500" />;
        case "CONDITION_APPROVED":
        case "CONDITION_PENDING":
            return <Camera className="w-4 h-4 text-purple-500" />;
        default:
            return <Clock className="w-4 h-4 text-gray-500" />;
    }
};

export default function NotificationDropdown() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchNotifications = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/notifications?limit=10");
            if (response.ok) {
                const data = await response.json();
                setNotifications(data.notifications || []);
                setUnreadCount(data.unreadCount || 0);
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchNotifications();
        // Poll for new notifications every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, [fetchNotifications]);

    const handleNotificationClick = async (notification: Notification) => {
        // Mark as read
        if (!notification.isRead) {
            try {
                await fetch("/api/notifications", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ notificationIds: [notification.id] }),
                });
                setUnreadCount((prev) => Math.max(0, prev - 1));
                setNotifications((prev) =>
                    prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n))
                );
            } catch (error) {
                console.error("Error marking notification as read:", error);
            }
        }

        // Navigate if there's a link
        if (notification.linkUrl) {
            router.push(notification.linkUrl);
            setIsOpen(false);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await fetch("/api/notifications", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ markAll: true }),
            });
            setUnreadCount(0);
            setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        } catch (error) {
            console.error("Error marking all as read:", error);
        }
    };

    return (
        <div className="relative">
            {/* Bell Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full hover:bg-white/10 transition-colors"
                aria-label="Notifikasi"
            >
                <Bell className="w-5 h-5 text-white" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Dropdown content */}
                    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-neutral-800 rounded-xl shadow-2xl border border-gray-200 dark:border-neutral-700 z-50 overflow-hidden">
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-neutral-700">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                Notifikasi
                            </h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={handleMarkAllRead}
                                    className="text-xs text-[#00A99D] hover:underline"
                                >
                                    Tandai semua dibaca
                                </button>
                            )}
                        </div>

                        {/* Notification List */}
                        <div className="max-h-80 overflow-y-auto">
                            {loading && notifications.length === 0 ? (
                                <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                                    <Clock className="w-6 h-6 mx-auto mb-2 animate-pulse" />
                                    <p className="text-sm">Memuat...</p>
                                </div>
                            ) : notifications.length === 0 ? (
                                <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                                    <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">Belum ada notifikasi</p>
                                </div>
                            ) : (
                                notifications.map((notification) => (
                                    <button
                                        key={notification.id}
                                        onClick={() => handleNotificationClick(notification)}
                                        className={`w-full px-4 py-3 flex items-start gap-3 text-left hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors ${!notification.isRead ? "bg-blue-50 dark:bg-blue-900/20" : ""
                                            }`}
                                    >
                                        <div className="flex-shrink-0 mt-0.5">
                                            {getNotificationIcon(notification.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm ${notification.isRead
                                                    ? "text-gray-600 dark:text-gray-300"
                                                    : "text-gray-900 dark:text-white font-medium"
                                                }`}>
                                                {notification.title}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                                                {notification.message}
                                            </p>
                                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                                {formatDistanceToNow(new Date(notification.createdAt), {
                                                    addSuffix: true,
                                                    locale: id,
                                                })}
                                            </p>
                                        </div>
                                        {!notification.isRead && (
                                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />
                                        )}
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
