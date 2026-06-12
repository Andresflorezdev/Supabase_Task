'use client';

import { AvatarBadge } from '@/components/AvatarBadge'
import { useAuth } from '@/context/AuthContext';
import { LayoutGridIcon, Plus } from 'lucide-react'
import Link from 'next/link'
import React, { useState, useEffect, useRef, useCallback, startTransition } from 'react'
import { TaskFilters } from './components/TaskFilters';
import { TaskCard, Task } from './components/TaskCard';
import { TaskForm } from './components/TaskForm';
import { getTasks, Task as TaskType } from '@/actions/task/get-tasks';
import { deleteTask } from '@/actions/task/delete-task';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  
  const {user} = useAuth();
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    priority: 'all'
  });
  
  const observerRef = useRef<HTMLDivElement>(null);
  const isMountedRef = useRef(false);
  const isLoadingRef = useRef(false);
  const filtersRef = useRef(filters);

  // Update filters ref when filters change
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  const loadTasks = async (pageNum: number, reset: boolean = false) => {
    if (isLoadingRef.current) return;

    isLoadingRef.current = true;
    setLoading(true);
    try {
      const result = await getTasks({
        page: pageNum,
        search: filtersRef.current.search,
        status: filtersRef.current.status,
        priority: filtersRef.current.priority
      });

      if (result.error) {
        toast.error(result.error);
        return;
      }

      if (reset) {
        setTasks(result.tasks);
        setHasMore(result.hasMore);
      } else {
        setTasks(prev => [...prev, ...result.tasks]);
        setHasMore(result.hasMore);
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
      toast.error('Error al cargar tareas');
    } finally {
      isLoadingRef.current = false;
      setLoading(false);
    }
  };

  // Initial load only
  useEffect(() => {
    loadTasks(1, true);
  }, []);

  useEffect(() => {
    if (!observerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage(prev => {
            const nextPage = prev + 1;
            loadTasks(nextPage, false);
            return nextPage;
          });
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [hasMore, loading, loadTasks]);

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleDelete = async (task: Task) => {
    try {
      const result = await deleteTask(task.id);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Tarea eliminada correctamente');
        setTasks(prev => prev.filter(t => t.id !== task.id));
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Error al eliminar la tarea');
    }
  };

  const handleFormSuccess = () => {
    setEditingTask(null);
    setPage(1);
    setHasMore(true);
    loadTasks(1, true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingTask(null);
  };
  
  return (
    <>
    <nav className='border-b bg-background h-16 flex items-center px-4 justify-between'>
      <div className='flex items-center gap-2'>
        <LayoutGridIcon size={24} />
        <h1 className='text-lg font-semibold'>Gestor de Tareas</h1>
      </div>

      <div className='flex items-center gap-4'>
        <Button 
          onClick={() => setIsFormOpen(true)}
          className='gap-2 h-10'
        >
          <Plus size={18} />
          Nueva Tarea
        </Button>
        <Link href="/profile" className='flex items-center'>
          {user && 
            <AvatarBadge
              name={user?.name}
              avatar_url={user?.avatar_url}
            />
          }
        </Link>
      </div>

    </nav>

    <main className='container mx-auto px-6 py-8 max-w-7xl'>
      <div className='mb-8'>
        <h2 className='text-2xl font-bold mb-2'>Mis Tareas</h2>
        <p className='text-muted-foreground'>Gestiona y organiza tus tareas de manera eficiente</p>
      </div>

      <TaskFilters
        onSearchChange={(value) => {
          setFilters(prev => ({ ...prev, search: value }));
          requestAnimationFrame(() => {
            setPage(1);
            setHasMore(true);
            loadTasks(1, true);
          });
        }}
        onStatusChange={(value) => {
          setFilters(prev => ({ ...prev, status: value }));
          requestAnimationFrame(() => {
            setPage(1);
            setHasMore(true);
            loadTasks(1, true);
          });
        }}
        onPriorityChange={(value) => {
          setFilters(prev => ({ ...prev, priority: value }));
          requestAnimationFrame(() => {
            setPage(1);
            setHasMore(true);
            loadTasks(1, true);
          });
        }}
        currentFilters={filters}
      />

      {tasks.length === 0 && !loading ? (
        <div className='bg-muted rounded-lg p-8 flex flex-col items-center justify-center min-h-[400px]'>
          <div className='w-16 h-16 rounded-full bg-background flex items-center justify-center mb-4'>
            <LayoutGridIcon size={32} className='text-muted-foreground' />
          </div>
          <p className='text-muted-foreground text-lg mb-2'>No se encontraron tareas</p>
          <p className='text-muted-foreground text-sm mb-6'>Comienza creando tu primera tarea hoy mismo.</p>
          <Button 
            onClick={() => setIsFormOpen(true)}
            className='gap-2'
          >
            <Plus size={18} />
            Crear Tarea
          </Button>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
          {tasks.map(task => (
            <TaskCard
              key={task.id}
              task={{
                id: task.id,
                title: task.title,
                description: task.description || '',
                status: task.status,
                priority: task.priority,
                created_at: new Date(task.created_at).getTime(),
                image: task.image
              }}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {loading && tasks.length > 0 && (
        <div className='flex justify-center py-8'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
        </div>
      )}

      <div ref={observerRef} className='h-10' />

      {!hasMore && tasks.length > 0 && (
        <div className='text-center py-8 text-muted-foreground text-sm'>
          No hay más tareas para cargar
        </div>
      )}
    </main>

    <TaskForm
      isOpen={isFormOpen}
      onClose={handleFormClose}
      task={editingTask}
      onSuccess={handleFormSuccess}
    />
    </>
  )
}
