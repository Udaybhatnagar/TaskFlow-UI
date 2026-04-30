import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Apply dark mode class on load
const uiState = localStorage.getItem('ttm-ui');
if (uiState) {
  try {
    const parsed = JSON.parse(uiState);
    if (parsed.state?.darkMode !== false) {
      document.documentElement.classList.add('dark');
    }
  } catch { document.documentElement.classList.add('dark'); }
} else {
  document.documentElement.classList.add('dark');
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
