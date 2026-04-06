// src/components/PrefetchLink.jsx
import { useEffect, useRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';

export default function PrefetchLink({ to, children, className, onClick, prefetch = true, ...props }) {
    const prefetchedRef = useRef(false);

    useEffect(() => {
        if (!prefetch || prefetchedRef.current) return;

        const handleMouseEnter = () => {
            if (prefetchedRef.current) return;
            prefetchedRef.current = true;

            if (to.startsWith('/')) {
                const route = to.substring(1);
                if (route) {
                    const chunks = route.split('/');
                    if (chunks[0]) {
                        import(`../pages/${chunks[0].charAt(0).toUpperCase() + chunks[0].slice(1)}Page.jsx`)
                            .catch(() => {});
                    }
                }
            }
        };

        const link = document.querySelector(`a[href="${to}"]`);
        if (link) {
            link.addEventListener('mouseenter', handleMouseEnter, { once: true });
        }

        return () => {
            if (link) {
                link.removeEventListener('mouseenter', handleMouseEnter);
            }
        };
    }, [to, prefetch]);

    return (
        <RouterLink to={to} className={className} onClick={onClick} {...props}>
            {children}
        </RouterLink>
    );
}

export function PrefetchLinkWrapper({ links = [] }) {
    useEffect(() => {
        links.forEach(to => {
            if (to.startsWith('/')) {
                const route = to.substring(1);
                if (route) {
                    const chunks = route.split('/');
                    if (chunks[0]) {
                        const pageName = chunks[0].charAt(0).toUpperCase() + chunks[0].slice(1);
                        import(`../pages/${pageName}Page.jsx`).catch(() => {});
                    }
                }
            }
        });
    }, [links]);

    return null;
}
