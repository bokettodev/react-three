import React from 'react';
import { useGeolocation } from '../hooks/useGeolocation';
import './LocationBanner.css';

export const LocationBanner: React.FC = () => {
  const { location, loading, error } = useGeolocation();

  const getLocationText = () => {
    if (loading) return 'Определяем ваше местоположение...';
    if (error) return null; // Не показываем ошибки в баннере
    if (location?.city && location?.country) {
      return `${location.city}, ${location.country}`;
    }
    if (location?.city) return location.city;
    return null;
  };

  const locationText = getLocationText();
  
  // Если есть ошибка или нет локации, не показываем баннер
  if (error || !locationText) {
    return null;
  }

  return (
    <div className="location-banner">
      <div className="location-content">
        <span className="location-icon">📍</span>
        <div className="location-text">
          <span className="location-label">
            Ваше местоположение{location?.source === 'ip' ? ' (по IP)' : location?.source === 'gps' ? ' (GPS)' : ''}:
          </span>
          <span className="location-value">{locationText}</span>
        </div>
        {loading && (
          <div className="location-loading">
            <div className="loading-spinner"></div>
          </div>
        )}
      </div>
    </div>
  );
};