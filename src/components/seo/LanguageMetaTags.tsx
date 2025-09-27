import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '@/contexts/LanguageContext';

interface LanguageMetaTagsProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
}

/**
 * LanguageMetaTags Component
 * 
 * Adds language-specific meta tags for SEO including:
 * - Language attribute on HTML element
 * - hreflang attributes for alternate languages
 * - Proper meta tags for translated content
 */
const LanguageMetaTags: React.FC<LanguageMetaTagsProps> = ({
  title,
  description,
  canonicalUrl
}) => {
  const { currentLanguage, availableLanguages } = useLanguage();

  // Generate hreflang links for all available languages
  const hreflangLinks = availableLanguages.map((lang) => {
    const url = canonicalUrl ? 
      (lang.code === 'en' ? canonicalUrl : `${canonicalUrl}?lang=${lang.code}`) :
      (lang.code === 'en' ? window.location.origin + window.location.pathname : 
       `${window.location.origin}${window.location.pathname}?lang=${lang.code}`);
    
    return (
      <link
        key={lang.code}
        rel="alternate"
        hrefLang={lang.code}
        href={url}
      />
    );
  });

  return (
    <Helmet>
      {/* Set the language attribute on the html element */}
      <html lang={currentLanguage} />
      
      {/* Add language-specific meta tags */}
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      
      {/* Content language meta tag */}
      <meta httpEquiv="content-language" content={currentLanguage} />
      
      {/* hreflang links for all available languages */}
      {hreflangLinks}
      
      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Additional language-specific meta tags */}
      <meta property="og:locale" content={currentLanguage === 'en' ? 'en_US' : `${currentLanguage}_${currentLanguage.toUpperCase()}`} />
      
      {/* Alternate language og:locale tags */}
      {availableLanguages
        .filter(lang => lang.code !== currentLanguage)
        .map(lang => (
          <meta
            key={`og-locale-${lang.code}`}
            property="og:locale:alternate"
            content={lang.code === 'en' ? 'en_US' : `${lang.code}_${lang.code.toUpperCase()}`}
          />
        ))}
    </Helmet>
  );
};

export default LanguageMetaTags;