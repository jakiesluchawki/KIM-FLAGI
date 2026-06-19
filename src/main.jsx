import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './PowerApp.jsx'
import './styles.css'

createRoot(document.getElementById('root')).render(
  <StrictMode><App /></StrictMode>,
)
