import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Funcion para obtener la URL de la imagen con timestamp para evitar cache
export const getImageUrl = (url: string) => {
  if (!url) return ''
  // Agregar timestamp para evitar cache
  return `${url}?t=${new Date().getTime()}`
}