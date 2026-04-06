const Skeleton = ({ className = '', variant = 'text' }) => {
    const baseClasses = 'animate-pulse bg-gradient-to-r from-surface-container via-surface-container-high to-surface-container bg-[length:200%_100%]';
    
    const variants = {
        text: 'h-4 rounded',
        title: 'h-8 rounded-lg',
        avatar: 'w-12 h-12 rounded-full',
        thumbnail: 'w-full h-48 rounded-2xl',
        card: 'w-full h-64 rounded-3xl',
        button: 'h-10 w-24 rounded-full',
        paragraph: 'h-4 w-full rounded mb-2',
    };

    return (
        <div className={`${baseClasses} ${variants[variant]} ${className}`} />
    );
};

export const NewsCardSkeleton = () => (
    <div className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm">
        <Skeleton variant="thumbnail" className="h-52" />
        <div className="p-6 space-y-3">
            <Skeleton variant="text" className="w-20 h-5" />
            <Skeleton variant="title" className="w-3/4" />
            <Skeleton variant="paragraph" />
            <Skeleton variant="paragraph" className="w-2/3" />
        </div>
    </div>
);

export const NewsGridSkeleton = ({ count = 6 }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: count }).map((_, i) => (
            <NewsCardSkeleton key={i} />
        ))}
    </div>
);

export const GalleryCardSkeleton = () => (
    <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm">
        <Skeleton variant="thumbnail" className="h-56" />
        <div className="p-4 space-y-2">
            <Skeleton variant="title" className="w-2/3" />
            <Skeleton variant="text" className="w-1/2" />
        </div>
    </div>
);

export const GalleryGridSkeleton = ({ count = 9 }) => (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Array.from({ length: count }).map((_, i) => (
            <GalleryCardSkeleton key={i} />
        ))}
    </div>
);

export const EventCardSkeleton = () => (
    <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm">
        <div className="flex gap-4">
            <div className="text-center">
                <Skeleton variant="text" className="w-10 h-8 mb-1" />
                <Skeleton variant="text" className="w-8 h-6" />
            </div>
            <div className="flex-1 space-y-2">
                <Skeleton variant="title" className="w-3/4" />
                <Skeleton variant="text" className="w-1/2" />
                <Skeleton variant="text" className="w-1/3" />
            </div>
        </div>
    </div>
);

export const EventListSkeleton = ({ count = 5 }) => (
    <div className="space-y-4">
        {Array.from({ length: count }).map((_, i) => (
            <EventCardSkeleton key={i} />
        ))}
    </div>
);

export const ContactCardSkeleton = () => (
    <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm">
        <div className="flex items-start gap-4">
            <Skeleton variant="avatar" />
            <div className="flex-1 space-y-2">
                <Skeleton variant="title" className="w-1/3" />
                <Skeleton variant="text" className="w-1/2" />
                <Skeleton variant="paragraph" />
                <Skeleton variant="paragraph" className="w-2/3" />
            </div>
        </div>
    </div>
);

export const StatCardSkeleton = () => (
    <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
            <Skeleton variant="avatar" className="w-10 h-10" />
            <Skeleton variant="text" className="w-8 h-8" />
        </div>
        <Skeleton variant="title" className="w-1/2 mb-2" />
        <Skeleton variant="text" className="w-2/3" />
    </div>
);

export const TableRowSkeleton = ({ cols = 4 }) => (
    <div className="flex items-center gap-4 p-4 border-b border-outline-variant">
        {Array.from({ length: cols }).map((_, i) => (
            <Skeleton key={i} variant="text" className={i === 0 ? 'w-1/2' : 'w-24'} />
        ))}
    </div>
);

export const ChartSkeleton = () => (
    <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
            <Skeleton variant="title" className="w-40" />
            <Skeleton variant="button" />
        </div>
        <div className="h-64 flex items-end gap-2">
            {Array.from({ length: 12 }).map((_, i) => (
                <Skeleton 
                    key={i} 
                    className="flex-1" 
                    style={{ height: `${Math.random() * 60 + 20}%` }}
                />
            ))}
        </div>
    </div>
);

export default Skeleton;
