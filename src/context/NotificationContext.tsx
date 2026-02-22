import React, { createContext, useContext, useState } from "react";
import type { AppNotification, NotificationType } from "../types";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";

interface NotificationContextType {
  notifications: AppNotification[];
  addNotification: (
    type: NotificationType,
    issueId: string,
    issueCode: string
  ) => void;
  markAsRead: (id: string) => void;
  removeNotification: (id: string) => void;
clearAll: () => void;
}
const STORAGE_KEY = "@issueflow_notifications";
const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {

  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const STORAGE_KEY = "@issueflow_notifications";

  /* ---------- LOAD ON START ---------- */
  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) {
        setNotifications(JSON.parse(saved));
      }
    })();
  }, []);

  /* ---------- SAVE ON UPDATE ---------- */
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  }, [notifications]);

  const getTitle = (type: NotificationType) => {
    switch (type) {
      case "assigned":
        return "Technician assigned to your issue";
      case "resolved":
        return "Issue resolved";
      case "comment":
        return "New comment on your issue";
      case "issue_created":
        return "Issue raised successfully";
      case "unassigned":
        return "Technician unassigned";
      default:
        return "Notification";
    }
  };
  const removeNotification = (id: string) => {
  setNotifications(prev => prev.filter(n => n.id !== id));
};

const clearAll = () => {
  setNotifications([]);
};
  const addNotification = async (
    type: NotificationType,
    issueId: string,
    issueCode: string
  ) => {
    const newNotification: AppNotification = {
      id: Date.now().toString(),
      type,
      issueId,
      issueCode,
      createdAt: new Date().toISOString(),
      read: false,
    };

    setNotifications(prev => [newNotification, ...prev]);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: getTitle(type),
        body: `Issue ID ${issueCode}`,
        sound: true,
      },
      trigger: null,
    });
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <NotificationContext.Provider
      value={{
  notifications,
  addNotification,
  markAsRead,
  removeNotification,
  clearAll,
}}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error("useNotifications must be used inside provider");
  }
  return ctx;
};
