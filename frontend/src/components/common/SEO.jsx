import { Helmet } from 'react-helmet-async';
import { useSettings } from '@contexts/SiteSettingsContext';

const SEO = ({ page = '', title: titleOverride, description: descOverride, image: imageOverride, url, type = 'website', article = null }) => {
  const { settings } = useSettings();
  const pageSeo  = (page && settings.seo?.[page]) || {};
  const siteName = settings.siteName || 'Portfolio';
  const title    = titleOverride || pageSeo.title || siteName;
  const description = descOverride || pageSeo.description || `${settings.tagline || 'Full-Stack Developer'} — ${siteName}`;
  const image    = imageOverride || pageSeo.ogImage || '';
  const canonicalUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const fullTitle = title === siteName ? title : `${title} | ${siteName}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      {image && <meta property="og:image" content={image} />}
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}
      {article?.publishedAt && <meta property="article:published_time" content={article.publishedAt} />}
      {article?.author && <meta property="article:author" content={article.author} />}
      {(article?.tags || []).map(tag => <meta key={tag} property="article:tag" content={tag} />)}
    </Helmet>
  );
};

export default SEO;
