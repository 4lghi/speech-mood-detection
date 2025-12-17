import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
// import MainPage from './ui/MainPage.jsx'
import MicStreamer from '../micStreamer.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MicStreamer />
  </StrictMode>,
)
