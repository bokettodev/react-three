import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// PWA Service Worker Registration
import { registerSW } from 'virtual:pwa-register'

// Проверяем, что мы не в iOS Safari в приватном режиме
const isIOSPrivate = () => {
  try {
    return (
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
      !window.indexedDB
    )
  } catch {
    return false
  }
}

if (!isIOSPrivate()) {
  const updateSW = registerSW({
    onNeedRefresh() {
      if (confirm('Доступно обновление приложения. Обновить сейчас?')) {
        updateSW(true)
      }
    },
    onOfflineReady() {
      console.log('Приложение готово для работы в офлайн режиме')
    },
    onRegisterError(error) {
      console.log('Ошибка регистрации SW:', error)
    }
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
