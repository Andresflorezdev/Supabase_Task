'use server';

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface DeleteTaskResult {
    success: boolean;
    error: string | null;
}

export const deleteTask = async (taskId: string): Promise<DeleteTaskResult> => {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return { success: false, error: 'Usuario no autenticado' };
        }

        if (!taskId) {
            return { success: false, error: 'ID de tarea requerido' };
        }

        // Get task to verify ownership and get image URL
        const { data: task, error: fetchError } = await supabase
            .from('tasks')
            .select('*')
            .eq('id', taskId)
            .eq('user_id', user.id)
            .single();

        if (fetchError || !task) {
            return { success: false, error: 'Tarea no encontrada o no autorizado' };
        }

        // Delete image from storage if exists
        if (task.image) {
            const filePath = task.image.split('/').slice(-2).join('/');
            const { error: deleteImageError } = await supabase.storage
                .from('task-images')
                .remove([filePath]);

            if (deleteImageError) {
                console.error('Error deleting image:', deleteImageError);
                // Continue with task deletion even if image deletion fails
            }
        }

        // Delete task from database
        const { error: deleteError } = await supabase
            .from('tasks')
            .delete()
            .eq('id', taskId)
            .eq('user_id', user.id);

        if (deleteError) {
            console.error('Error deleting task:', deleteError);
            return { success: false, error: deleteError.message };
        }

        revalidatePath('/dashboard');
        return { success: true, error: null };
    } catch (error) {
        console.error('Unexpected error deleting task:', error);
        return { success: false, error: 'Error inesperado al eliminar la tarea' };
    }
};
