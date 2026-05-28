import { useCallback, useEffect, useState } from 'react'
import {
  getUsuarios, setUsuarioEstado, setUsuarioRol, eliminarUsuario, type AdminUsuario,
} from '../../api/admin'
import { useAuthStore } from '../../store/authStore'
import Paginacion from './Paginacion'

export default function AdminUsuarios() {
  const yo = useAuthStore((s) => s.usuario)
  const [items, setItems] = useState<AdminUsuario[]>([])
  const [q, setQ] = useState('')
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  const cargar = useCallback(() => {
    getUsuarios(q, page, 20).then((r) => {
      setItems(r.data.content)
      setTotalPages(r.data.totalPages)
    })
  }, [q, page])

  useEffect(() => { cargar() }, [cargar])

  const toggleActivo = async (u: AdminUsuario) => {
    await setUsuarioEstado(u.id, !u.activo)
    cargar()
  }
  const cambiarRol = async (u: AdminUsuario, rol: string) => {
    await setUsuarioRol(u.id, rol)
    cargar()
  }
  const borrar = async (u: AdminUsuario) => {
    if (!confirm(`¿Eliminar al usuario @${u.nombreUsuario}? Esta acción es irreversible.`)) return
    await eliminarUsuario(u.id)
    cargar()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5 gap-4 flex-wrap">
        <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>Usuarios</h2>
        <input
          value={q}
          onChange={(e) => { setPage(0); setQ(e.target.value) }}
          placeholder="Buscar por nombre, usuario o email…"
          className="input rounded-full px-4 py-2 text-sm w-full sm:w-72"
        />
      </div>

      <div
        className="rounded-2xl overflow-x-auto"
        style={{ border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}
      >
        <table className="w-full min-w-190 text-sm" style={{ color: 'var(--color-text)' }}>
          <thead>
            <tr
              className="text-left text-[0.7rem] uppercase tracking-wide"
              style={{ background: 'var(--color-surface-2)', color: 'var(--color-muted)' }}
            >
              <th className="px-4 py-3 font-semibold">Usuario</th>
              <th className="px-4 py-3 font-semibold">Email</th>
              <th className="px-4 py-3 font-semibold">Rol</th>
              <th className="px-4 py-3 font-semibold">Estado</th>
              <th className="px-4 py-3 font-semibold">Verificado</th>
              <th className="px-4 py-3 font-semibold text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map((u) => (
              <tr key={u.id} style={{ borderTop: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
                <td className="px-4 py-3">
                  <div className="font-semibold">{u.nombreCompleto}</div>
                  <div className="text-xs" style={{ color: 'var(--color-muted)' }}>@{u.nombreUsuario}</div>
                </td>
                <td className="px-4 py-3" style={{ color: 'var(--color-muted)' }}>{u.email}</td>
                <td className="px-4 py-3">
                  <select
                    value={u.rol}
                    disabled={u.id === yo?.id}
                    onChange={(e) => cambiarRol(u, e.target.value)}
                    className="rounded-full px-3 py-1 text-xs font-semibold disabled:opacity-50"
                    style={{ border: '1.5px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text)' }}
                  >
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </td>
                <td className="px-4 py-3">
                  <span
                    className="text-[0.7rem] font-semibold px-2.5 py-1 rounded-full"
                    style={u.activo
                      ? { color: 'var(--color-brand)', background: 'color-mix(in srgb, var(--color-brand) 12%, transparent)' }
                      : { color: 'var(--color-error)', background: 'color-mix(in srgb, var(--color-error) 12%, transparent)' }}
                  >
                    {u.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className="text-[0.7rem] font-semibold px-2.5 py-1 rounded-full"
                    style={u.emailVerificado
                      ? { color: 'var(--color-brand)', background: 'color-mix(in srgb, var(--color-brand) 12%, transparent)' }
                      : { color: 'var(--color-muted)', background: 'var(--color-surface-2)' }}
                  >
                    {u.emailVerificado ? 'Sí' : 'No'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <button
                    onClick={() => toggleActivo(u)}
                    disabled={u.id === yo?.id}
                    className="rounded-full px-3 py-1 text-xs font-semibold mr-2 transition-all disabled:opacity-40"
                    style={{ border: '1.5px solid var(--color-border)', color: 'var(--color-text)' }}
                  >
                    {u.activo ? 'Desactivar' : 'Activar'}
                  </button>
                  <button
                    onClick={() => borrar(u)}
                    disabled={u.id === yo?.id}
                    className="rounded-full px-3 py-1 text-xs font-semibold transition-all disabled:opacity-40"
                    style={{ color: 'var(--color-error)', border: '1.5px solid var(--color-error)' }}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Paginacion page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  )
}
