import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/main.scss'
import App from './App.jsx'
import DeckProvider from './context/DeckContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DeckProvider>
      <App />
    </DeckProvider>
  </StrictMode>,
)