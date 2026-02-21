import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { loadRemoteConfig } from './utils/config.ts'

// Render'daki env değişkenlerini çek, sonra uygulamayı başlat
loadRemoteConfig().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
