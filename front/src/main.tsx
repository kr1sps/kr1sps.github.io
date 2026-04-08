import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConfigProvider, theme } from 'antd'
import ruRU from 'antd/locale/ru_RU'
import App from './App'
import './index.css'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5,
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
})

const antdTheme = {
    algorithm: theme.defaultAlgorithm,
    token: {
        colorPrimary: '#aa3bff',
        colorInfo: '#aa3bff',
        borderRadius: 16,
        fontFamily: "'Inter', system-ui, 'Segoe UI', Roboto, sans-serif",
        boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
    },
    components: {
        Card: {
            borderRadiusLG: 24,
            boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
        },
        Button: {
            borderRadius: 40,
            controlHeight: 40,
        },
        Input: {
            borderRadius: 12,
        },
        Select: {
            borderRadius: 12,
        },
        Table: {
            borderRadius: 20,
        },
    },
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <BrowserRouter>
          <QueryClientProvider client={queryClient}>
              <ConfigProvider locale={ruRU} theme={antdTheme}>
                  <App />
              </ConfigProvider>
          </QueryClientProvider>
      </BrowserRouter>
  </React.StrictMode>,
)