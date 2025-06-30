import { useCallback, useEffect, useState } from "react";
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

  // Функция для инициализации push уведомлений
  const initializePushNotifications = useCallback(async (): Promise<void> => {
    try {
      // Получаем уже зарегистрированный Service Worker
      const registration = await getServiceWorkerRegistration();

      if (!registration) {
        console.warn("Не удалось зарегистрировать Service Worker");
        return;
      }

      // Проверяем актуальное состояние разрешений
      const currentPermission = Notification.permission;

      // Если разрешение уже получено и мы еще не подписаны
      if (currentPermission === "granted" && !isSubscribed) {
        setIsSubscribed(true);
        console.log("Push уведомления инициализированы");
      }
    } catch (error) {
      console.error("Ошибка инициализации push уведомлений:", error);
    }
  }, [isSubscribed]);

  // Функция для проверки и обновления состояния разрешений
  const checkPermissionStatus = useCallback(() => {
    if (isNotificationSupported()) {
      const currentPermission = Notification.permission;
      if (currentPermission !== permission) {
        console.log(
          `Permission status changed: ${permission} -> ${currentPermission}`
        );
        setPermission(currentPermission);
      }
    }
  }, [permission]);

  useEffect(() => {
    // Проверяем поддержку уведомлений
    setIsSupported(isNotificationSupported());

    if (isNotificationSupported()) {
      setPermission(Notification.permission);
    }

    // Добавляем слушатели для отслеживания изменений состояния
    const handleFocus = () => {
      console.log("Window focused - checking permission status");
      checkPermissionStatus();
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log("App became visible - checking permission status");
        checkPermissionStatus();
      }
    };

    // Добавляем слушатели событий
    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Проверяем состояние при монтировании
    checkPermissionStatus();

    // Дополнительная проверка каждые 2 секунды для iOS
    const permissionCheckInterval = setInterval(() => {
      if (document.visibilityState === "visible") {
        checkPermissionStatus();
      }
    }, 2000);

    // Очистка слушателей при размонтировании
    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearInterval(permissionCheckInterval);
    };
  }, [checkPermissionStatus]);

  // Автоматически инициализируем push уведомления при получении разрешения
  useEffect(() => {
    if (permission === "granted" && !isSubscribed && isSupported) {
      console.log("Permission granted - auto-initializing push notifications");
      initializePushNotifications();
    }
  }, [permission, isSubscribed, isSupported, initializePushNotifications]);

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

  return {
    isSupported,
    permission,
    isSubscribed,
    requestPermission: handleRequestPermission,
    sendNotification: handleSendNotification,
    initializePushNotifications,
  };
};
