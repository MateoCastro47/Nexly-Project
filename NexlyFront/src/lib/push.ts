import { eliminarSuscripcion, enviarSuscripcion, getVapidPublicKey } from '../api/push'

export type EstadoPush = 'activa' | 'inactiva' | 'no-soportado' | 'denegado'

/** ¿El navegador soporta service workers + push + notificaciones? */
export function pushSoportado(): boolean {
  return (
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  )
}

/** ¿Estamos en iOS sin instalar como PWA? (push solo funciona instalada) */
export function esIOSNoInstalada(): boolean {
  const ua = navigator.userAgent
  const esIOS = /iphone|ipad|ipod/i.test(ua)
  const instalada = window.matchMedia('(display-mode: standalone)').matches ||
    // @ts-expect-error standalone solo existe en Safari iOS
    window.navigator.standalone === true
  return esIOS && !instalada
}

/** Convierte la clave VAPID pública (base64 url-safe) al formato que pide PushManager. */
function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const raw = atob(base64)
  const buffer = new ArrayBuffer(raw.length)
  const arr = new Uint8Array(buffer)
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i)
  return arr
}

function arrayBufferToBase64(buffer: ArrayBuffer | null): string {
  if (!buffer) return ''
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i])
  return btoa(binary)
}

function extraerClaves(sub: PushSubscription) {
  return {
    endpoint: sub.endpoint,
    p256dh: arrayBufferToBase64(sub.getKey('p256dh')),
    auth: arrayBufferToBase64(sub.getKey('auth')),
  }
}

export async function estadoPush(): Promise<EstadoPush> {
  if (!pushSoportado()) return 'no-soportado'
  if (Notification.permission === 'denied') return 'denegado'
  const reg = await navigator.serviceWorker.ready
  const sub = await reg.pushManager.getSubscription()
  return sub ? 'activa' : 'inactiva'
}

/** Pide permiso, se suscribe en el navegador y registra la suscripción en el back. */
export async function activarPush(): Promise<void> {
  if (!pushSoportado()) throw new Error('Tu navegador no soporta notificaciones push.')

  const permiso = await Notification.requestPermission()
  if (permiso !== 'granted') throw new Error('Permiso de notificaciones denegado.')

  const reg = await navigator.serviceWorker.ready
  const publicKey = await getVapidPublicKey()

  const sub = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicKey),
  })

  await enviarSuscripcion(extraerClaves(sub))
}

/** Cancela la suscripción local y la borra del back. */
export async function desactivarPush(): Promise<void> {
  const reg = await navigator.serviceWorker.ready
  const sub = await reg.pushManager.getSubscription()
  if (!sub) return
  await eliminarSuscripcion(sub.endpoint).catch(() => {})
  await sub.unsubscribe()
}
