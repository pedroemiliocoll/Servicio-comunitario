// src/controllers/useDocumentTitle.js — Fix #16: SEO document title per page
import { useEffect } from 'react';

const SITE_NAME = 'U.E.N. Pedro Emilio Coll';

/**
 * Sets the document title with the site name appended.
 * @param {string} title — Page-specific title (empty string = home)
 */
export function useDocumentTitle(title = '') {
    useEffect(() => {
        document.title = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
        return () => { document.title = SITE_NAME; };
    }, [title]);
}
