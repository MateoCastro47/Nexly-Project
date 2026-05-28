export const esMismoDia = (a: string, b: string) => 
    new Date(a).toDateString() === new Date(b).toDateString()

export function etiquetaDia(iso: string): string {
    const f = new Date(iso)
    const hoy = new Date()
    const ayer = new Date(); ayer.setDate(hoy.getDate() - 1)
    if(f.toDateString() === hoy.toDateString()) return 'Hoy'
    if(f.toDateString() === ayer.toDateString()) return 'Ayer'
    return f.toLocaleDateString('es', {
        day: 'numeric', month: 'long',
        year: f.getFullYear() === hoy.getFullYear() ? undefined : 'numeric'
    })
}