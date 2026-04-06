export default function EmptyState({ 
    icon = 'inbox',
    title = 'No hay contenido',
    description = 'Aquí no hay nada todavía',
    actionLabel = null,
    onAction = null,
    className = ''
}) {
    const icons = {
        inbox: 'inbox',
        search: 'search_off',
        image: 'image_not_supported',
        news: 'newspaper',
        gallery: 'photo_library',
        event: 'event_busy',
        contact: 'contact_mail',
        users: 'group_off',
        error: 'error_outline'
    };

    const iconName = icons[icon] || icon;

    return (
        <div className={`flex flex-col items-center justify-center py-16 px-8 text-center ${className}`}>
            <div className="w-20 h-20 rounded-full bg-surface-container-low flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-5xl text-on-surface-variant" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {iconName}
                </span>
            </div>
            
            <h3 className="text-lg font-headline font-black text-on-surface mb-2">
                {title}
            </h3>
            
            <p className="text-sm text-on-surface-variant max-w-sm mb-6">
                {description}
            </p>

            {actionLabel && onAction && (
                <button
                    onClick={onAction}
                    className="px-6 py-3 bg-primary text-white font-bold text-sm rounded-full hover:bg-primary/90 transition-colors flex items-center gap-2"
                >
                    <span className="material-symbols-outlined text-lg">{icon === 'inbox' ? 'add' : 'refresh'}</span>
                    {actionLabel}
                </button>
            )}
        </div>
    );
}

export function EmptyStateInline({ icon, children, className = '' }) {
    return (
        <div className={`flex items-center gap-3 py-6 px-4 text-on-surface-variant ${className}`}>
            <span className="material-symbols-outlined text-2xl text-on-surface-variant/50">{icon || 'info'}</span>
            {children}
        </div>
    );
}
