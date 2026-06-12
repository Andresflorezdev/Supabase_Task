'use server'

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateAvatar(formData: FormData) {
    const supabase = await createClient()
    
    const file = formData.get('file') as File
    const userId = formData.get('userId') as string

    //1. subir imagen al bucket 'avatars'
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}-${Date.now()}.${fileExt}`
    const filePath = `${fileName}`

    // IMPORTANT: Next.js File objects must be converted to ArrayBuffer for Supabase Storage
    const fileBuffer = await file.arrayBuffer()

    const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, fileBuffer, {
            upsert: true, // si existe una imagen previa, la reemplaza
            contentType: file.type
        })

    if (uploadError) {
        throw new Error('Error al subir la imagen: ' + uploadError.message)
    }

    //2. obtener la url publica de la imagen subida
    const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

    if (!publicUrlData.publicUrl) {
        console.error('No se pudo obtener la url publica de la imagen')
        throw new Error('No se pudo obtener la url publica de la imagen')
    }

    // 3. actualizar el perfil con la nueva url de la imagen
    const { error: updateError } = await supabase
        .from('profiles')
        .update({
            avatar_url: publicUrlData.publicUrl,
            updated_at: new Date().toISOString()
        })
        .eq('id', userId)

    if (updateError) {
        throw new Error('Error al actualizar el perfil: ' + updateError.message)
    }

    revalidatePath('/dashboard')
    revalidatePath('/settings')

    return { publicUrl: publicUrlData.publicUrl }

}