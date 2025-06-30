// Service Worker для push уведомлений
const CACHE_NAME = "3d-shapes-v1";

// Получаем базовый путь
const getBasePath = () => {
  // Используем base из vite config для GitHub Pages
  return "/react-three";
};

const basePath = getBasePath();

const urlsToCache = [
  `${basePath}/`,
  `${basePath}/index.html`,
  `${basePath}/manifest.json`,
  `${basePath}/vite.svg`,
];

// Установка Service Worker
self.addEventListener("install", (event) => {
  console.log("Service Worker: Installing...");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Service Worker: Caching files");
      return cache.addAll(urlsToCache).catch((err) => {
        console.error("Failed to cache:", err);
        // Не блокируем установку если не удалось кешировать
        return Promise.resolve();
      });
    })
  );
  // Принудительно активируем новый SW
  self.skipWaiting();
});

// Активация Service Worker
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activating...");
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log("Service Worker: Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        // Управляем всеми клиентами
        return self.clients.claim();
      })
  );
});

// Обработка запросов
self.addEventListener("fetch", (event) => {
  // Только для GET запросов
  if (event.request.method !== "GET") {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      // Возвращаем кэшированную версию или загружаем из сети
      return (
        response ||
        fetch(event.request).catch(() => {
          // Fallback для офлайн режима
          if (event.request.destination === "document") {
            return caches.match(`${basePath}/index.html`);
          }
        })
      );
    })
  );
});

// Обработка push уведомлений
self.addEventListener("push", (event) => {
  console.log("Service Worker: Push received", event);

  let notificationData = {
    title: "3D Shapes Collection",
    body: "Новое уведомление от 3D Shapes!",
    icon: `${basePath}/vite.svg`,
    badge: `${basePath}/vite.svg`,
    tag: "default",
    data: {
      url: `${basePath}/`,
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
  };

  // Если есть данные в push событии
  if (event.data) {
    try {
      const pushData = event.data.json();
      notificationData = { ...notificationData, ...pushData };
    } catch (e) {
      console.log("Push data is not JSON:", event.data.text());
      notificationData.body = event.data.text();
    }
  }

  const options = {
    body: notificationData.body,
    icon: notificationData.icon,
    badge: notificationData.badge,
    tag: notificationData.tag,
    data: notificationData.data,
    vibrate: [100, 50, 100],
    requireInteraction: false,
    actions: [
      {
        action: "explore",
        title: "Посмотреть продукты",
        icon: `${basePath}/vite.svg`,
      },
      {
        action: "close",
        title: "Закрыть",
        icon: `${basePath}/vite.svg`,
      },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(notificationData.title, options)
  );
});

// Обработка кликов по уведомлению
self.addEventListener("notificationclick", (event) => {
  console.log("Service Worker: Notification clicked", event);
  event.notification.close();

  const urlToOpen = event.notification.data?.url || `${basePath}/`;

  if (event.action === "explore") {
    event.waitUntil(clients.openWindow(urlToOpen));
  } else if (event.action === "close") {
    // Уведомление уже закрыто выше
  } else {
    // Клик по самому уведомлению
    event.waitUntil(
      clients
        .matchAll({ type: "window", includeUncontrolled: true })
        .then((clientList) => {
          // Ищем уже открытое окно
          for (const client of clientList) {
            if (client.url.includes(basePath) && "focus" in client) {
              return client.focus();
            }
          }
          // Если нет открытого окна, открываем новое
          if (clients.openWindow) {
            return clients.openWindow(urlToOpen);
          }
        })
    );
  }
});

// Обработка закрытия уведомления
self.addEventListener("notificationclose", (event) => {
  console.log("Service Worker: Notification closed", event);
  // Здесь можно отправить аналитику
});
