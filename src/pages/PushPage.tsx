import React, { useEffect, useState } from 'react';
import { usePushNotifications } from '../hooks/usePushNotifications';
import { usePWA } from '../hooks/usePWA';
import './PushPage.css';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface PushPageProps {
  autoInit?: boolean;
}

export const PushPage: React.FC<PushPageProps> = ({ 
  autoInit = true 
}) => {
  const { 
    isSupported, 
    permission, 
    isSubscribed, 
    requestPermission, 
    sendNotification, 
    initializePushNotifications 
  } = usePushNotifications();
  
  const { isPWA } = usePWA();
  
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    if (autoInit && isSupported && isPWA) {
      initializePushNotifications();
    }
  }, [autoInit, isSupported, isPWA, initializePushNotifications]);

  // PWA Install logic
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('PWA: beforeinstallprompt event fired');
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setCanInstall(true);
    };

    const handleAppInstalled = () => {
      console.log('PWA: App was installed');
      setDeferredPrompt(null);
      setCanInstall(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleTestNotification = () => {
    sendNotification({
      title: '3D Shapes Collection',
      body: 'Тестовое уведомление! Push уведомления работают! 🎉',
      tag: 'test-notification'
    });
  };

  const handlePromotionalNotification = () => {
    sendNotification({
      title: 'Специальное предложение!',
      body: 'Скидка 20% на все 3D фигуры! Не упустите возможность!',
      tag: 'promo-notification'
    });
  };

  const handleInstallPWA = async () => {
    if (!deferredPrompt) {
      return;
    }

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
        setDeferredPrompt(null);
        setCanInstall(false);
      } else {
        console.log('User dismissed the install prompt');
      }
    } catch (error) {
      console.error('Error during installation:', error);
    }
  };

  // Если браузер не поддерживает уведомления, показываем инструкции по установке
  if (!isSupported) {
    return (
      <div className="push-page">
        <h1><span className="emoji">🔔</span>Push Уведомления</h1>
        <div className="push-card info">
          <h3><span className="emoji">📱</span>Установка приложения</h3>
          <p>Для получения push-уведомлений установите приложение на главный экран:</p>
          
          <div style={{ margin: '1rem 0' }}>
            <h4>📱 На iPhone/iPad (Safari):</h4>
            <ol style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
              <li>Нажмите кнопку "Поделиться" <span style={{fontSize: '1.2em'}}>⎋</span> внизу экрана</li>
              <li>Выберите "На экран «Домой»"</li>
              <li>Нажмите "Добавить"</li>
              <li>Откройте приложение с главного экрана</li>
            </ol>
          </div>
          
          <div style={{ margin: '1rem 0' }}>
            <h4>🤖 На Android (Chrome):</h4>
            <ol style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
              <li>Нажмите меню (три точки) в браузере</li>
              <li>Выберите "Установить приложение" или "Добавить на главный экран"</li>
              <li>Подтвердите установку</li>
              <li>Откройте приложение с главного экрана</li>
            </ol>
          </div>
          
          <p><small>💡 После установки вы сможете получать push-уведомления!</small></p>
        </div>
      </div>
    );
  }

  // Если это iOS Safari и приложение не добавлено на главный экран
  if (!isPWA && /iPhone|iPad|iPod/.test(navigator.userAgent)) {
    return (
      <div className="push-page">
        <h1><span className="emoji">🔔</span>Push Уведомления</h1>
        <div className="push-card info">
          <h3><span className="emoji">📱</span>Установка приложения на iOS</h3>
          <p>Для получения push-уведомлений на iPhone/iPad:</p>
          <ol>
            <li>Нажмите кнопку "Поделиться" <span style={{fontSize: '1.2em'}}>⎋</span> внизу экрана</li>
            <li>Выберите "На экран «Домой»"</li>
            <li>Нажмите "Добавить"</li>
            <li>Откройте приложение с главного экрана</li>
          </ol>
          <p><small>💡 После этого вы сможете получать уведомления!</small></p>
        </div>
      </div>
    );
  }

  return (
    <div className="push-page">
      <h1><span className="emoji">🔔</span>Push Уведомления</h1>
      
      {/* Статус системы */}
      <div className="push-card status">
        <h3><span className="emoji">📊</span>Статус системы</h3>
        <ul className="status-list">
          <li>Поддержка: {isSupported ? '✅' : '❌'}</li>
          <li>PWA режим: {isPWA ? '✅ Активен' : '❌ Требуется'}</li>
          <li>Разрешение: {
            permission === 'granted' ? '✅ Разрешено' :
            permission === 'denied' ? '❌ Запрещено' :
            '⏳ Не запрошено'
          }</li>
          <li>Подписка: {isSubscribed ? '✅ Активна' : '❌ Неактивна'}</li>
        </ul>
      </div>

      {/* Установка PWA */}
      {canInstall && !isPWA && (
        <div className="push-card install">
          <h3><span className="emoji">📱</span>Установка приложения</h3>
          <p>Для лучшего опыта установите приложение на устройство:</p>
          <button 
            onClick={handleInstallPWA}
            className="push-button install"
          >
            <span className="emoji">📱</span>Установить приложение
          </button>
        </div>
      )}

      {/* Запрос разрешения */}
      {(permission === 'default' || permission === 'denied') && isPWA && (
        <div className={`push-card permission ${permission === 'denied' ? 'denied' : ''}`}>
          <h3><span className="emoji">🔔</span>Настройка уведомлений</h3>
          <p>{permission === 'denied' ? 'Разрешение было отклонено. Попробуйте снова:' : 'Разрешите приложению отправлять уведомления:'}</p>
          
          <button 
            onClick={requestPermission}
            className={`push-button ${permission === 'denied' ? 'danger' : 'primary'}`}
          >
            <span className="emoji">🔔</span>
            {permission === 'denied' ? 'Попробовать снова' : 'Включить уведомления'}
          </button>
          
          <div className="help-text">
            <p>⚡ Safari требует быстрого отклика - диалог появится сразу после нажатия</p>
            {permission === 'denied' && (
              <p>💡 Если не работает, проверьте системные настройки iOS</p>
            )}
          </div>
        </div>
      )}

      {/* Активация уведомлений */}
      {!isSubscribed && permission === 'granted' && isPWA && (
        <div className="push-card permission">
          <h3><span className="emoji">⚡</span>Активация уведомлений</h3>
          <p>Разрешение получено! Теперь активируйте push-уведомления:</p>
          <button 
            onClick={initializePushNotifications}
            className="push-button info"
          >
            <span className="emoji">⚡</span>Активировать уведомления
          </button>
        </div>
      )}

      {/* Тестирование уведомлений */}
      {permission === 'granted' && isPWA && (
        <div className="push-card testing">
          <h3><span className="emoji">🧪</span>Тестирование уведомлений</h3>
          <p>Уведомления настроены! Попробуйте отправить тестовые сообщения:</p>
          
          <div className="button-group">
            <button 
              onClick={handleTestNotification}
              className="push-button success"
            >
              <span className="emoji">📨</span>Тестовое уведомление
            </button>
            
            <button 
              onClick={handlePromotionalNotification}
              className="push-button warning"
            >
              <span className="emoji">🎉</span>Промо уведомление
            </button>
          </div>
        </div>
      )}

      {/* Справочная информация */}
      {isPWA && (permission === 'default' || permission === 'denied') && (
        <div className="push-card info">
          <h3><span className="emoji">💡</span>Почему нужно быстро нажимать?</h3>
          <p>Safari блокирует запрос уведомлений, если между нажатием кнопки и запросом проходит больше 5 секунд. Это сделано для защиты от спама.</p>
          <p><small>В отличие от Chrome, где можно запрашивать разрешения в любое время, Safari требует "пользовательского жеста".</small></p>
          {permission === 'denied' && (
            <p><small><strong>🔄 Кнопка остается доступной</strong> - вы можете пробовать сколько угодно раз!</small></p>
          )}
        </div>
      )}

      {/* Инструкции для отклоненных разрешений */}
      {permission === 'denied' && (
        <div className="push-card troubleshooting">
          <h3><span className="emoji">🔧</span>Устранение неполадок</h3>
          <p><strong>Если приложения "3D Shapes" нет в списке уведомлений:</strong></p>
          
          <div className="troubleshooting-section">
            <h4>⚠️ Полная переустановка:</h4>
            <ol>
              <li>Полностью <strong>удалите</strong> приложение с главного экрана (долгое нажатие → удалить)</li>
              <li>Перезагрузите iPhone</li>
              <li>Откройте сайт в <strong>Safari</strong></li>
              <li>Нажмите кнопку <strong>"Поделиться"</strong> (квадрат со стрелкой вверх)</li>
              <li>Выберите <strong>"На экран «Домой»"</strong></li>
              <li>Нажмите <strong>"Добавить"</strong></li>
              <li>Откройте приложение с главного экрана</li>
              <li>Попробуйте запросить уведомления <strong>сразу</strong> после открытия</li>
            </ol>
          </div>
          
          <p><strong>Если приложение есть в списке уведомлений:</strong></p>
          <ol>
            <li>Откройте <strong>Настройки</strong> на iPhone</li>
            <li>Найдите <strong>Уведомления</strong></li>
            <li>Найдите приложение <strong>"3D Shapes"</strong> в списке</li>
            <li>Включите <strong>"Разрешить уведомления"</strong></li>
            <li>Вернитесь в приложение и попробуйте снова</li>
          </ol>
          
          <p><small>💡 Убедитесь также, что в Safari → Настройки → Дополнения → Экспериментальные функции включен "Push API"</small></p>
        </div>
      )}

      {/* Требования PWA режима */}
      {!isPWA && (
        <div className="push-card requirement">
          <h3><span className="emoji">ℹ️</span>Требуется PWA режим</h3>
          <p>Для работы push-уведомлений на мобильных устройствах приложение должно быть добавлено на главный экран.</p>
        </div>
      )}
    </div>
  );
};