/**
 * Форматирует цену в USD формате
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

/**
 * Форматирует размеры 3D объекта
 */
export const formatSize = (size: [number, number, number]): string => {
  return size.map((s) => s.toFixed(1)).join(" × ");
};
