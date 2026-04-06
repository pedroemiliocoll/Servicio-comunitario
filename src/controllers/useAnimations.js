// useAnimations.js — Controller: Animaciones y scroll
import { useEffect, useRef } from 'react';

export function useScrollAnimation() {
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );

        const el = ref.current;
        if (el) {
            const animatedElements = el.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');
            animatedElements.forEach(child => observer.observe(child));
        }

        return () => observer.disconnect();
    }, []);

    return ref;
}

export function useCounter(target, duration = 2000, trigger = false) {
    const ref = useRef(null);

    useEffect(() => {
        if (!trigger || !ref.current) return;
        const element = ref.current;
        const suffix = element.getAttribute('data-suffix') || '';
        const start = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            element.textContent = Math.round(target * eased).toLocaleString() + suffix;
            if (progress < 1) requestAnimationFrame(update);
        }

        requestAnimationFrame(update);
    }, [target, duration, trigger]);

    return ref;
}
