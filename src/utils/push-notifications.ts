// Утилиты для работы с push уведомлениями

export interface PushNotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: Record<string, unknown>;
}

// Проверяем поддержку уведомлений
export const isNotificationSupported = (): boolean => {
  return "Notification" in window;
};

// Проверяем поддержку Service Worker
export const isServiceWorkerSupported = (): boolean => {
  return "serviceWorker" in navigator;
};

// Проверяем поддержку Push API
export const isPushSupported = (): boolean => {
  return "PushManager" in window;
};

// Проверяем, является ли приложение PWA (добавлено на главный экран)
export const isPWAInstalled = (): boolean => {
  // Для iOS Safari
  if (
    "standalone" in window.navigator &&
    (window.navigator as { standalone?: boolean }).standalone
  ) {
    return true;
  }

  // Для других браузеров
  if (window.matchMedia("(display-mode: standalone)").matches) {
    return true;
  }

  return false;
};

// Получаем базовый путь для ресурсов
const getBasePath = (): string => {
  // Используем base из vite config для GitHub Pages
  const base = (import.meta.env.BASE_URL || "/react-three/").replace(/\/$/, "");
  return base;
};

// Получаем существующую регистрацию Service Worker от vite-plugin-pwa
export const getServiceWorkerRegistration =
  async (): Promise<ServiceWorkerRegistration | null> => {
    if (!isServiceWorkerSupported()) {
      console.warn("Service Worker не поддерживается");
      return null;
    }

    try {
      // Получаем уже зарегистрированный SW от vite-plugin-pwa
      const registration = await navigator.serviceWorker.ready;
      console.log("Service Worker уже зарегистрирован:", registration);
      return registration;
    } catch (error) {
      console.error("Ошибка получения Service Worker:", error);
      return null;
    }
  };

// Запрашиваем разрешение на уведомления
export const requestNotificationPermission =
  async (): Promise<NotificationPermission> => {
    if (!isNotificationSupported()) {
      throw new Error("Уведомления не поддерживаются");
    }

    if (Notification.permission === "granted") {
      return "granted";
    }

    if (Notification.permission === "denied") {
      return "denied";
    }

    const permission = await Notification.requestPermission();
    return permission;
  };

// Отправляем локальное уведомление (для тестирования)
export const sendLocalNotification = (
  options: PushNotificationOptions
): void => {
  if (!isNotificationSupported()) {
    console.warn("Уведомления не поддерживаются");
    return;
  }

  if (Notification.permission !== "granted") {
    console.warn("Разрешение на уведомления не предоставлено");
    return;
  }

  const basePath = getBasePath();
  const notification = new Notification(options.title, {
    body: options.body,
    icon: options.icon || `${basePath}/vite.svg`,
    badge: options.badge || `${basePath}/vite.svg`,
    tag: options.tag,
    data: options.data,
  });

  // Автоматически закрываем через 5 секунд
  setTimeout(() => {
    notification.close();
  }, 5000);

  notification.onclick = () => {
    window.focus();
    notification.close();
  };
};
