import { useEffect, useState } from "react";

interface GeolocationData {
  city?: string;
  country?: string;
  error?: string;
  source?: "gps" | "ip"; // Добавляем источник данных
}

interface GeolocationState {
  location: GeolocationData | null;
  loading: boolean;
  error: string | null;
}

export function useGeolocation(): GeolocationState {
  const [state, setState] = useState<GeolocationState>({
    location: null,
    loading: true,
    error: null,
  });

  // Функция для получения локации по IP
  const getLocationByIP = async (): Promise<GeolocationData | null> => {
    try {
      console.log("Пробуем получить локацию по IP...");

      // Пробуем несколько сервисов IP-геолокации
      const ipServices = [
        "https://ipapi.co/json/",
        "https://ipwhois.app/json/",
        "https://ipinfo.io/json",
      ];

      for (const service of ipServices) {
        try {
          const response = await fetch(service);
          if (!response.ok) continue;

          const data = await response.json();
          console.log("IP геолокация ответ:", data);

          let city, country;

          // Разные API возвращают разную структуру данных
          if (service.includes("ipapi.co")) {
            city = data.city;
            country = data.country_name;
          } else if (service.includes("ipwhois.app")) {
            city = data.city;
            country = data.country;
          } else if (service.includes("ipinfo.io")) {
            city = data.city;
            country = data.country;
          }

          if (city && country) {
            return { city, country, source: "ip" };
          }
        } catch (serviceError) {
          console.log(`Ошибка сервиса ${service}:`, serviceError);
          continue;
        }
      }

      return null;
    } catch (error) {
      console.error("Ошибка IP геолокации:", error);
      return null;
    }
  };

  useEffect(() => {
    const getLocation = async () => {
      // Определяем iOS в начале функции
      const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);

      // Сначала пробуем IP-геолокацию (быстро и надежно)
      const ipLocation = await getLocationByIP();
      if (ipLocation) {
        setState({
          location: ipLocation,
          loading: false,
          error: null,
        });
        return;
      }

      // Если IP-геолокация не сработала, пробуем GPS
      try {
        // Проверяем поддержку геолокации
        if (!navigator.geolocation) {
          setState({
            location: null,
            loading: false,
            error: "Геолокация не поддерживается",
          });
          return;
        }

        if (!isIOS && "permissions" in navigator) {
          try {
            const permission = await navigator.permissions.query({
              name: "geolocation",
            });
            console.log("Геолокация разрешение:", permission.state);

            if (permission.state === "denied") {
              setState({
                location: null,
                loading: false,
                error:
                  "Доступ к геолокации запрещен. Разрешите в настройках браузера.",
              });
              return;
            }
          } catch (permissionError) {
            console.log(
              "Не удалось проверить разрешения геолокации:",
              permissionError
            );
          }
        }

        console.log("Запрашиваем геолокацию...", { isIOS });

        // Получаем координаты
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            console.log("Получены координаты:", { latitude, longitude });

            try {
              // Используем OpenStreetMap Nominatim API для получения адреса
              const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=ru`,
                {
                  // Добавляем заголовки для лучшей совместимости
                  headers: {
                    "User-Agent": "ReactPWAApp/1.0",
                  },
                }
              );

              if (!response.ok) {
                throw new Error("Ошибка получения адреса");
              }

              const data = await response.json();
              console.log("Получены данные адреса:", data);

              const city =
                data.address?.city ||
                data.address?.town ||
                data.address?.village ||
                "Неизвестный город";
              const country = data.address?.country || "Неизвестная страна";

              setState({
                location: { city, country, source: "gps" },
                loading: false,
                error: null,
              });
            } catch (reverseError) {
              console.error("Ошибка получения адреса:", reverseError);
              setState({
                location: { city: "Неизвестная локация", source: "gps" },
                loading: false,
                error: "Ошибка определения адреса",
              });
            }
          },
          async (error) => {
            console.error("Ошибка GPS геолокации:", error);

            // Если GPS не сработал, пробуем менее точную геолокацию
            if (
              error.code === error.TIMEOUT ||
              error.code === error.POSITION_UNAVAILABLE
            ) {
              console.log("Пробуем менее точную геолокацию...");

              navigator.geolocation.getCurrentPosition(
                async (position) => {
                  const { latitude, longitude } = position.coords;
                  console.log("Получены координаты (менее точные):", {
                    latitude,
                    longitude,
                  });

                  try {
                    const response = await fetch(
                      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=ru`,
                      {
                        headers: {
                          "User-Agent": "ReactPWAApp/1.0",
                        },
                      }
                    );

                    if (!response.ok) {
                      throw new Error("Ошибка получения адреса");
                    }

                    const data = await response.json();
                    const city =
                      data.address?.city ||
                      data.address?.town ||
                      data.address?.village ||
                      "Неизвестный город";
                    const country =
                      data.address?.country || "Неизвестная страна";

                    setState({
                      location: { city, country, source: "gps" },
                      loading: false,
                      error: null,
                    });
                    return;
                  } catch (reverseError) {
                    console.error(
                      "Ошибка получения адреса (второй раз):",
                      reverseError
                    );
                  }
                },
                () => {
                  // Если и это не сработало, используем fallback
                  console.log("GPS совсем не работает, используем fallback");
                  setState({
                    location: null,
                    loading: false,
                    error: "Не удалось определить местоположение",
                  });
                },
                {
                  enableHighAccuracy: false,
                  timeout: 30000, // Еще больше времени
                  maximumAge: 600000,
                }
              );
              return;
            }

            let errorMessage = "Ошибка получения геолокации";

            switch (error.code) {
              case error.PERMISSION_DENIED:
                errorMessage = isIOS
                  ? "Разрешите доступ к геолокации в настройках Safari"
                  : "Доступ к геолокации запрещен";
                break;
              case error.POSITION_UNAVAILABLE:
                errorMessage = "Информация о местоположении недоступна";
                break;
              case error.TIMEOUT:
                errorMessage = "Превышено время ожидания";
                break;
            }

            setState({
              location: null,
              loading: false,
              error: errorMessage,
            });
          },
          {
            // Используем менее точную геолокацию для лучшей совместимости
            enableHighAccuracy: false,
            timeout: 20000, // Увеличиваем таймаут до 20 секунд
            maximumAge: 600000, // 10 минут кэша
          }
        );
      } catch {
        setState({
          location: null,
          loading: false,
          error: "Неожиданная ошибка",
        });
      }
    };

    getLocation();
  }, []);

  return state;
}
