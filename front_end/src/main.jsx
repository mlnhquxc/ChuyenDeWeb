import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './assets/styles/index.css'
import './assets/styles/harmonious-colors.css'
import './assets/styles/darkmode.css'
import './assets/styles/logo.css'
import 'react-toastify/dist/ReactToastify.css'
import App from './Pages/App.jsx'
import './i18n'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <App />
    </StrictMode>,
)