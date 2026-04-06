import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

if ('serviceWorker' in navigator) {
  void window.addEventListener('load', () => {
    void navigator.serviceWorker.register(
      new URL('./sw.ts', import.meta.url),
      { type: 'module' },
    )
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
