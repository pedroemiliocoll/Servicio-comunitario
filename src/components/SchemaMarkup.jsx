import { useEffect } from 'react';

const SCHOOL_SCHEMA = {
    "@context": "https://schema.org",
    "@type": "School",
    "name": "U.E.N. Pedro Emilio Coll",
    "alternateName": "Liceo Pedro Emilio Coll",
    "description": "Institución educativa de excelencia académica en Caracas, Venezuela.",
    "url": "https://uenpedroemiliocoll.edu.ve",
    "logo": "https://uenpedroemiliocoll.edu.ve/assets/images/logo.png",
    "address": {
        "@type": "PostalAddress",
        "addressLocality": "Caracas",
        "addressCountry": "VE"
    }
};

const FAQ_SCHEMA = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        {
            "@type": "Question",
            "name": "¿Cuáles son los niveles educativos que ofrece el liceo?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "El liceo ofrece Educación Primaria (1er a 6to Grado) y Educación Media General (1er a 5to Año)."
            }
        },
        {
            "@type": "Question",
            "name": "¿Cuál es el horario de clases?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Educación Primaria: Lunes a Viernes de 7:00 AM a 12:00 PM. Educación Media: Lunes a Viernes de 7:00 AM a 1:00 PM."
            }
        }
    ]
};

function SchemaMarkup({ schema, id }) {
    useEffect(() => {
        let existing = document.getElementById(id);
        if (!existing) {
            existing = document.createElement('script');
            existing.id = id;
            existing.type = 'application/ld+json';
            document.head.appendChild(existing);
        }
        existing.textContent = JSON.stringify(schema);
        
        return () => {
            const el = document.getElementById(id);
            if (el) el.remove();
        };
    }, [schema, id]);

    return null;
}

export function SchoolSchema() {
    return <SchemaMarkup schema={SCHOOL_SCHEMA} id="schema-school" />;
}

export function FaqSchema() {
    return <SchemaMarkup schema={FAQ_SCHEMA} id="schema-faq" />;
}

export function NewsArticleSchema({ article }) {
    if (!article) return null;
    
    const schema = {
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        "headline": article.titulo,
        "description": article.extracto,
        "image": article.image_url,
        "datePublished": article.fecha,
        "author": {
            "@type": "Organization",
            "name": "U.E.N. Pedro Emilio Coll"
        },
        "publisher": {
            "@type": "Organization",
            "name": "U.E.N. Pedro Emilio Coll",
            "logo": {
                "@type": "ImageObject",
                "url": "https://uenpedroemiliocoll.edu.ve/assets/images/logo.png"
            }
        }
    };

    return <SchemaMarkup schema={schema} id="schema-news" />;
}

export function BreadcrumbSchema({ items }) {
    if (!items?.length) return null;
    
    const schema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": item.url
        }))
    };

    return <SchemaMarkup schema={schema} id="schema-breadcrumb" />;
}

export function OrganizationSchema() {
    const schema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "U.E.N. Pedro Emilio Coll",
        "url": "https://uenpedroemiliocoll.edu.ve",
        "logo": "https://uenpedroemiliocoll.edu.ve/assets/images/logo.png",
        "sameAs": []
    };

    return <SchemaMarkup schema={schema} id="schema-org" />;
}
