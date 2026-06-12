'use server'

import { createClient } from "@/lib/supabase/server"

export async function updateProfile(values: {
    id: string
    name: string
    phone?: string | null
    country_code?: string | null
}) {
    const supabase = await createClient()

    const { error } = await supabase.from('profiles')
        .update({
            name: values.name,
            phone: values.phone,
            country_code: values.country_code,
            updated_at: new Date().toISOString(),
        })
        .eq('id', values.id)

    if (error) {
        console.error('Supabase error updating profile:', error)
        throw new Error('Hubo un error al actualizar el perfil.')
    }

    return { success: true }
}