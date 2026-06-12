'use server';

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface CreateTaskResult {
    success: boolean;
    error: string | null;
}

export const createTask = async (formData: FormData): Promise<CreateTaskResult> => {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return { success: false, error: 'Usuario no autenticado' };
        }

        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const status = formData.get('status') as string;
        const priority = formData.get('priority') as string;
        const imageFile = formData.get('image') as File | null;

        if (!title) {
            return { success: false, error: 'El título es requerido' };
        }

        let imageUrl: string | null = null;

        // Upload image if provided
        if (imageFile && imageFile.size > 0) {
            const fileExt = imageFile.name.split('.').pop();
            const fileName = `${user.id}/${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('task-images')
                .upload(filePath, await imageFile.arrayBuffer(), {
                    contentType: imageFile.type,
                    upsert: false
                });

            if (uploadError) {
                console.error('Error uploading image:', uploadError);
                return { success: false, error: 'Error al subir la imagen' };
            }

            const { data: { publicUrl } } = supabase.storage
                .from('task-images')
                .getPublicUrl(filePath);

            imageUrl = publicUrl;
        }

        // Insert task
        const { error: insertError } = await supabase.from('tasks').insert({
            title,
            description: description || null,
            status: status || 'todo',
            priority: priority || 'medium',
            user_id: user.id,
            image: imageUrl,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        });

        if (insertError) {
            console.error('Error inserting task:', insertError);
            
            // Clean up uploaded image if insert failed
            if (imageUrl) {
                const filePath = imageUrl.split('/').slice(-2).join('/');
                await supabase.storage.from('task-images').remove([filePath]);
            }
            
            return { success: false, error: insertError.message };
        }

        revalidatePath('/dashboard');
        return { success: true, error: null };
    } catch (error) {
        console.error('Unexpected error creating task:', error);
        return { success: false, error: 'Error inesperado al crear la tarea' };
    }
};
