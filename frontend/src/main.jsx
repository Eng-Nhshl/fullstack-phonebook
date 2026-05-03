import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { LanguageProvider } from './contexts/LanguageContext.jsx'
import './index.css'
import './i18n'

createRoot(document.getElementById('root')).render(
    <LanguageProvider>
        <App />
    </LanguageProvider>
)
