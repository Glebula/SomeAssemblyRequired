import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const rootEl = document.getElementById('root')
const loadingEl = document.getElementById('app-loading')

// Ensure fallback loader is removed even if the root element already has children.
if (loadingEl) {
  loadingEl.remove()
}

createRoot(rootEl).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
