'use server';

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface UpdateTaskResult {
    success: boolean;
    error: string | null;
}

export const updateTask = async (formData: FormData): Promise<UpdateTaskResult> => {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return { success: false, error: 'Usuario no autenticado' };
        }

        const taskId = formData.get('id') as string;
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const status = formData.get('status') as string;
        const priority = formData.get('priority') as string;
        const imageFile = formData.get('image') as File | null;
        const existingImage = formData.get('existingImage') as string;
        const removeImage = formData.get('removeImage') === 'true';

        if (!taskId) {
            return { success: false, error: 'ID de tarea requerido' };
        }

        if (!title) {
            return { success: false, error: 'El título es requerido' };
        }

        // Get current task to verify ownership and get current image
        const { data: currentTask, error: fetchError } = await supabase
            .from('tasks')
            .select('*')
            .eq('id', taskId)
            .eq('user_id', user.id)
            .single();

        if (fetchError || !currentTask) {
            return { success: false, error: 'Tarea no encontrada o no autorizado' };
        }

        let imageUrl = currentTask.image;

        // Handle image removal
        if (removeImage && imageUrl) {
            const filePath = imageUrl.split('/').slice(-2).join('/');
            await supabase.storage.from('task-images').remove([filePath]);
            imageUrl = null;
        }

        // Handle new image upload
        if (imageFile && imageFile.size > 0) {
            // Remove old image if exists
            if (imageUrl) {
                const filePath = imageUrl.split('/').slice(-2).join('/');
                await supabase.storage.from('task-images').remove([filePath]);
            }

            const fileExt = imageFile.name.split('.').pop();
            const fileName = `${user.id}/${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
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

        // Update task
        const { error: updateError } = await supabase
            .from('tasks')
            .update({
                title,
                description: description || null,
                status: status || 'todo',
                priority: priority || 'medium',
                image: imageUrl,
                updated_at: new Date().toISOString(),
            })
            .eq('id', taskId)
            .eq('user_id', user.id);

        if (updateError) {
            console.error('Error updating task:', updateError);
            return { success: false, error: updateError.message };
        }

        revalidatePath('/dashboard');
        return { success: true, error: null };
    } catch (error) {
        console.error('Unexpected error updating task:', error);
        return { success: false, error: 'Error inesperado al actualizar la tarea' };
    }
};
