import { DialogProvider } from '@/contexts/Dialog.context'
import fetcher from '@/lib/fetcher'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { SWRConfig } from 'swr'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SWRConfig value={{ fetcher }}>
      <DialogProvider>
        <App />
      </DialogProvider>
    </SWRConfig>
  </React.StrictMode>
)
