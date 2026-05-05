import client from './client'

export const uploadImagen = async (file: File, carpeta = 'publicaciones'): Promise<string> => {
  const form = new FormData()
  form.append('archivo', file)
  form.append('carpeta', carpeta)
  const { data } = await client.post<{ url: string }>('/imagenes/upload', form)
  return data.url
}
