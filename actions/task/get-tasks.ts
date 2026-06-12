'use server';

import { createClient } from "@/lib/supabase/server";

export interface Task {
    id: string;
    title: string;
    description: string | null;
    status: 'todo' | 'in-progress' | 'review' | 'done';
    priority: 'low' | 'medium' | 'high';
    created_at: string;
    updated_at: string | null;
    image: string | null;
}

export interface GetTasksParams {
    page?: number;
    search?: string;
    status?: string;
    priority?: string;
}

export interface GetTasksResult {
    tasks: Task[];
    hasMore: boolean;
    error: string | null;
}

export const getTasks = async (params: GetTasksParams = {}): Promise<GetTasksResult> => {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return { tasks: [], hasMore: false, error: 'Usuario no autenticado' };
        }

        const page = params.page || 1;
        const limit = 10;
        const offset = (page - 1) * limit;

        let query = supabase
            .from('tasks')
            .select('*', { count: 'exact' })
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        // Apply filters
        if (params.status && params.status !== 'all') {
            query = query.eq('status', params.status);
        }

        if (params.priority && params.priority !== 'all') {
            query = query.eq('priority', params.priority);
        }

        if (params.search && params.search.trim() !== '') {
            const searchTerm = `%${params.search.trim()}%`;
            query = query.or(`title.ilike.${searchTerm},description.ilike.${searchTerm}`);
        }

        const { data: tasks, error, count } = await query;

        if (error) {
            console.error('Error fetching tasks:', error);
            return { tasks: [], hasMore: false, error: error.message };
        }

        const hasMore = count !== null && offset + limit < count;

        return { tasks: tasks || [], hasMore, error: null };
    } catch (error) {
        console.error('Unexpected error fetching tasks:', error);
        return { tasks: [], hasMore: false, error: 'Error inesperado al obtener tareas' };
    }
};
