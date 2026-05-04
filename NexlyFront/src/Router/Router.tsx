import { createBrowserRouter, Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import Login from '../pages/Auth/Login'
import Register from '../pages/Auth/Register'
import OAuth2Callback from '../pages/Auth/OAuth2CallBack'
import AppLayout from '../components/layout/AppLayout'
import FeedPage from '../pages/Feed/FeedPage'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const usuario = useAuthStore((s) => s.usuario)
  return usuario ? <>{children}</> : <Navigate to="/login" replace />
}

export const router = createBrowserRouter([
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  { path: '/oauth2/callback', element: <OAuth2Callback /> },
  {
    path: '/',
    element: <PrivateRoute><AppLayout /></PrivateRoute>,
    children: [
      { index: true, element: <FeedPage /> },
    ],
  },
])
