import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './style/global.css'
import App from './App.tsx'
import { validateEnv } from './shared/config/env'

// Validate environment variables before starting the app
validateEnv()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
