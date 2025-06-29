import { useEffect, useState } from "react";
import {
  getServiceWorkerRegistration,
  isNotificationSupported,
  requestNotificationPermission,
  sendLocalNotification,
  type PushNotificationOptions,
} from "../utils/push-notifications";

interface UsePushNotificationsReturn {
  isSupported: boolean;
  permission: NotificationPermission;
  isSubscribed: boolean;
  requestPermission: () => Promise<NotificationPermission>;
  sendNotification: (options: PushNotificationOptions) => void;
  initializePushNotifications: () => Promise<void>;
}

export const usePushNotifications = (): UsePushNotificationsReturn => {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] =
    useState<NotificationPermission>("default");
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    // Проверяем поддержку уведомлений
    setIsSupported(isNotificationSupported());

    if (isNotificationSupported()) {
      setPermission(Notification.permission);
    }
  }, []);

  const handleRequestPermission = async (): Promise<NotificationPermission> => {
    try {
      const newPermission = await requestNotificationPermission();
      setPermission(newPermission);

      // Если разрешение получено, сразу инициализируем push уведомления
      if (newPermission === "granted") {
        await initializePushNotifications();
      }

      return newPermission;
    } catch (error) {
      console.error("Ошибка при запросе разрешения:", error);
      return "denied";
    }
  };

  const handleSendNotification = (options: PushNotificationOptions): void => {
    sendLocalNotification(options);
  };

  const initializePushNotifications = async (): Promise<void> => {
    try {
      // Получаем уже зарегистрированный Service Worker
      const registration = await getServiceWorkerRegistration();

      if (!registration) {
        console.warn("Не удалось зарегистрировать Service Worker");
        return;
      }

      // Запрашиваем разрешение если нужно
      if (permission === "default") {
        await handleRequestPermission();
      }

      setIsSubscribed(true);
      console.log("Push уведомления инициализированы");
    } catch (error) {
      console.error("Ошибка инициализации push уведомлений:", error);
    }
  };

  return {
    isSupported,
    permission,
    isSubscribed,
    requestPermission: handleRequestPermission,
    sendNotification: handleSendNotification,
    initializePushNotifications,
  };
};
