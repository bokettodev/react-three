import React from 'react';
import { Link } from 'react-router-dom';
import { usePushNotifications } from '../hooks/usePushNotifications';
import { usePWA } from '../hooks/usePWA';

export const PushNotifications: React.FC = () => {
  const { 
    permission, 
    isSubscribed 
  } = usePushNotifications();
  
  const { isPWA } = usePWA();

  // Если уведомления настроены и работают, не показываем баннер
  if (permission === 'granted' && isSubscribed && isPWA) {
    return null;
  }

  return (
    <div style={{ 
      padding: '0.75rem 1rem',
      background: '#e3f2fd',
      borderBottom: '1px solid #bbdefb',
      textAlign: 'center'
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        gap: '1rem',
        flexWrap: 'wrap'
      }}>
        <span>
          🔔 {!isPWA ? 'Установите приложение для получения уведомлений' : 
              permission === 'default' ? 'Включите push-уведомления' : 
              permission === 'denied' ? 'Настройте уведомления в настройках' :
              'Настройка push-уведомлений'}
        </span>
        <Link 
          to="/push" 
          style={{
            padding: '0.5rem 1rem',
            background: '#1976d2',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
            fontSize: '0.9rem',
            fontWeight: '500'
          }}
        >
          Настроить
        </Link>
      </div>
    </div>
  );
};
