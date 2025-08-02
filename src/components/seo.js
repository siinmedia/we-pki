export class SEOManager {
  static updatePageMeta(data) {
    // Update title
    document.title = data.title || 'PKI - Pecinta Kucing Indonesia';
    
    // Update meta description
    this.updateMetaTag('description', data.description || 'Situs resmi PKI - Pecinta Kucing Indonesia. Satu Meong, Satu Suara.');
    
    // Update Open Graph tags
    this.updateMetaTag('og:title', data.title || 'PKI - Pecinta Kucing Indonesia');
    this.updateMetaTag('og:description', data.description || 'Situs resmi PKI - Pecinta Kucing Indonesia. Satu Meong, Satu Suara.');
    this.updateMetaTag('og:image', data.image || '/assets/pki-logo.jpg');
    this.updateMetaTag('og:url', data.url || window.location.href);
    this.updateMetaTag('og:type', data.type || 'website');
    
    // Update Twitter Card tags
    this.updateMetaTag('twitter:card', 'summary_large_image');
    this.updateMetaTag('twitter:title', data.title || 'PKI - Pecinta Kucing Indonesia');
    this.updateMetaTag('twitter:description', data.description || 'Situs resmi PKI - Pecinta Kucing Indonesia. Satu Meong, Satu Suara.');
    this.updateMetaTag('twitter:image', data.image || '/assets/pki-logo.jpg');
    
    // Update canonical URL
    this.updateCanonicalUrl(data.url || window.location.href);
    
    // Add structured data for articles
    if (data.type === 'article') {
      this.addArticleStructuredData(data);
    }
  }
  
  static updateMetaTag(property, content) {
    let meta = document.querySelector(`meta[property="${property}"]`) || 
               document.querySelector(`meta[name="${property}"]`);
    
    if (!meta) {
      meta = document.createElement('meta');
      if (property.startsWith('og:') || property.startsWith('twitter:')) {
        meta.setAttribute('property', property);
      } else {
        meta.setAttribute('name', property);
      }
      document.head.appendChild(meta);
    }
    
    meta.setAttribute('content', content);
  }
  
  static updateCanonicalUrl(url) {
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);
  }
  
  static addArticleStructuredData(data) {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": data.title,
      "description": data.description,
      "image": data.image,
      "author": {
        "@type": "Organization",
        "name": "PKI - Pecinta Kucing Indonesia"
      },
      "publisher": {
        "@type": "Organization",
        "name": "PKI - Pecinta Kucing Indonesia",
        "logo": {
          "@type": "ImageObject",
          "url": "/assets/pki-logo.jpg"
        }
      },
      "datePublished": data.publishedDate,
      "dateModified": data.modifiedDate || data.publishedDate
    };
    
    let script = document.querySelector('script[type="application/ld+json"]');
    if (!script) {
      script = document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      document.head.appendChild(script);
    }
    
    script.textContent = JSON.stringify(structuredData);
  }
}