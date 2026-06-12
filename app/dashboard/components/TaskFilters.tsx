import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { Filter } from 'lucide-react';
import { Searchbar } from '@/components/Searchbar';

export type Status = 'todo' | 'in-progress' | 'review' | 'done';

interface TaskFiltersProps {
    onSearchChange: (value: string) => void;
    onStatusChange: (value: string) => void;
    onPriorityChange: (value: string) => void;
    currentFilters: {
        search: string;
        status: string;
        priority: string;
    };
}

function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}


export function TaskFilters({
    onSearchChange,
    onStatusChange,
    onPriorityChange,
    currentFilters,
}: TaskFiltersProps) {
    const [searchTerm, setSearchTerm] = useState(currentFilters.search);
    const debouncedSearch = useDebounce(searchTerm, 1000);

    // Sync local state with currentFilters.search if it changes externally
    useEffect(() => {
        setSearchTerm(currentFilters.search);
    }, [currentFilters.search]);

    // Trigger onSearchChange when debounced value changes
    useEffect(() => {
        if (debouncedSearch !== currentFilters.search) {
            onSearchChange(debouncedSearch);
        }
    }, [debouncedSearch, onSearchChange, currentFilters.search]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pb-8">
            <div className="col-span-12 md:col-span-8 space-y-2 h-full">
                <label className="text-sm font-medium font-sans">
                    Buscar por título o descripción
                </label>
                <Searchbar
                    placeholder="Escribe para buscar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full h-10"
                />
            </div>

            <div className='col-span-12 md:col-span-4 h-full'>
                <div className="grid grid-cols-2 gap-4 h-full items-start -mt-1">
                    <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2 font-sans">
                            <Filter size={16} /> Estado
                        </label>
                        <Select value={currentFilters.status} onValueChange={onStatusChange}>
                            <SelectTrigger className="w-full h-10 border border-input" style={{ height: '2.5rem' }}>
                                <SelectValue placeholder="Todos" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos</SelectItem>
                                <SelectItem value="todo">Pendiente</SelectItem>
                                <SelectItem value="in-progress">En curso</SelectItem>
                                <SelectItem value="review">En revisión</SelectItem>
                                <SelectItem value="done">Completada</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2 font-sans">
                            Prioridad
                        </label>
                        <Select value={currentFilters.priority} onValueChange={onPriorityChange}>
                            <SelectTrigger className="w-full h-10 border border-input" style={{ height: '2.5rem' }}>
                                <SelectValue placeholder="Todas" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas</SelectItem>
                                <SelectItem value="low">Baja</SelectItem>
                                <SelectItem value="medium">Media</SelectItem>
                                <SelectItem value="high">Alta</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

        </div>
    );
}

