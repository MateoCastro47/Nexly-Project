import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import Login from '../pages/Auth/Login'
import Register from '../pages/Auth/Register'
import OAuth2Callback from '../pages/Auth/OAuth2CallBack'
import AppLayout from '../components/layout/AppLayout'
import FeedPage from '../pages/Feed/FeedPage'
import ProfilePage from '../pages/Profile/ProfilePage'
import NotificacionesPage from '../pages/Notificaciones/NotificacionesPage'
import OnboardingModal from '../components/onboarding/OnboardingModal'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const usuario = useAuthStore((s) => s.usuario)
  return usuario ? <>{children}</> : <Navigate to="/login" replace />
}

const browserRouter = createBrowserRouter([
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  { path: '/auth/callback', element: <OAuth2Callback /> },
  {
    path: '/',
    element: <PrivateRoute><AppLayout /></PrivateRoute>,
    children: [
      { index: true, element: <FeedPage /> },
      { path: 'perfil/:nombreUsuario', element: <ProfilePage /> },
      { path: 'notificaciones', element: <NotificacionesPage /> },
    ],
  },
])

export default function Router() {
  const onboardingPendiente = useAuthStore((s) => s.onboardingPendiente)
  return (
    <>
      <RouterProvider router={browserRouter} />
      {onboardingPendiente && <OnboardingModal />}
    </>
  )
}
