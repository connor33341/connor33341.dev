import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    type?: string;
    url?: string;
    tags?: string[];
    themeColor?: string;
}

export function SEO({
    title = 'Connor W - Everything Developer',
    description = 'Everything Developer specializing in backend, frontend, mobile and embedded applications. View my portfolio of projects and skills.',
    keywords = 'portfolio, developer, backend, frontend, mobile, embedded, applications, projects, skills',
    image,
    type = 'website',
    url,
    tags = [],
    themeColor = '#5865F2',
}: SEOProps) {
    // Use the current URL if none provided (client-side only)
    const pageUrl = url || (typeof window !== 'undefined' ? window.location.href : 'https://connor33341.dev');

    // Generate comma-separated tags for the og-image query string
    const tagsParam = tags.length > 0 ? `&tags=${encodeURIComponent(tags.join(','))}` : '';

    // Extract path for OG image
    const path = typeof window !== 'undefined' 
        ? window.location.pathname 
        : url 
            ? new URL(url).pathname 
            : '';

    // Use dynamic OG image if not explicitly provided
    const ogImage =
        image ||
        `https://api.connor33341.dev/og-image?title=${encodeURIComponent(title.split(' | ')[0])}&path=${encodeURIComponent(path)}${tagsParam}`;

    return (
        <Helmet>
            <title>{title}</title>

            {/* SEO META TAGS */}
            <meta name="title" content={title} />
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={pageUrl} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={ogImage} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={pageUrl} />
            <meta property="twitter:title" content={title} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={ogImage} />

            {/* Discord */}
            <meta name="theme-color" content={themeColor} />

            <link rel="canonical" href={pageUrl} />
        </Helmet>
    );
}