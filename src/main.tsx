import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./app.css"
import { RouterProvider } from 'react-router'
import { router } from './routes/router'
import { Provider } from 'react-redux'
import { store } from './store/store'
import AppInitializer from './AppInit'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <AppInitializer />
      <RouterProvider router={router}></RouterProvider>
    </Provider>
  </StrictMode>,
)
