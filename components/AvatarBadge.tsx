import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

interface AvatarBadgeProps {
    name: string | null;
    avatar_url?: string | null;
    className?: string;
}

export const AvatarBadge = ({ name, avatar_url, className }: AvatarBadgeProps) => {

    const getInitials = (name: string | null) => {
        if (!name) return '?';
        return name
            .split(' ')
            .map(part => part[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (

        <Badge className={`gap-2 h-10 px-4 py-2 text-sm ${className || ''}`}>
            <Avatar className='h-7 w-7'>
                <AvatarImage src={avatar_url || ''} />
                <AvatarFallback className='text-neutral-500 text-xs'>{getInitials(name)}</AvatarFallback>
            </Avatar>
            {name}
        </Badge>

    )
}
