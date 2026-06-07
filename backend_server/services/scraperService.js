import axios from 'axios';
import * as cheerio from 'cheerio';

export async function scrapeUrl(url) {
  console.log("Starting scraper service for:", url);
  
  try {
    const startTime = Date.now();
    
    // Fetch the page with Axios
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      timeout: 30000,
      maxRedirects: 5
    });
    
    const loadTime = Date.now() - startTime;
    const html = response.data;
    const $ = cheerio.load(html);
    const statusCode = response.status;
    
    // Get current host for link detection
    const currentHost = new URL(url).hostname;
    
    // Helper function to get meta content 
    const getMeta = (name) => {
      const meta = $(`meta[name="${name}"], meta[property="${name}"]`).first();
      return meta.attr('content') || '';
    };
    
    // Extract all SEO data
    const scrapedData = {
      metaData: {
        title: $('title').text().trim() || '',
        description: getMeta('description'),
        canonical: $('link[rel="canonical"]').attr('href') || '',
        robots: getMeta('robots'),
        ogTitle: getMeta('og:title'),
        ogDescription: getMeta('og:description'),
        ogImage: getMeta('og:image'),
        twitterCard: getMeta('twitter:card'),
        viewport: getMeta('viewport'),
        charset: $('meta[charset]').attr('charset') || '',
      },
      
      headings: {
        h1: $('h1').length,
        h2: $('h2').length,
        h3: $('h3').length,
        h4: $('h4').length,
        h5: $('h5').length,
        h6: $('h6').length,
        h1Texts: $('h1').map((i, el) => $(el).text().trim()).get().slice(0, 5),
      },
      
      links: {
        internal: 0,
        external: 0,
        total: 0,
      },
      
      images: {
        total: 0,
        missingAlt: 0,
        withAlt: 0,
      },
      
      wordCount: 0,
      pageSize: html.length,
      bodyText: '',
    };
    
    // Process links
    const allLinks = $('a[href]');
    let internalLinks = 0;
    let externalLinks = 0;
    
    allLinks.each((i, link) => {
      const href = $(link).attr('href');
      if (!href) return;
      
      if (href.startsWith('mailto:') || href.startsWith('tel:')) return;
      
      try {
        const linkUrl = new URL(href, url);
        if (linkUrl.hostname === currentHost) {
          internalLinks++;
        } else if (linkUrl.href.startsWith('http')) {
          externalLinks++;
        }
      } catch(e) {}
    });
    
    scrapedData.links = {
      internal: internalLinks,
      external: externalLinks,
      total: allLinks.length,
    };
    
    // Process images
    const allImages = $('img');
    const missingAlt = allImages.filter((i, img) => {
      const alt = $(img).attr('alt');
      return !alt || alt.trim() === '';
    }).length;
    
    scrapedData.images = {
      total: allImages.length,
      missingAlt: missingAlt,
      withAlt: allImages.length - missingAlt,
    };
    
    // Word count
    const bodyText = $('body').text();
    const wordCount = bodyText.split(/\s+/).filter(w => w.length > 0).length;
    scrapedData.wordCount = wordCount;
    scrapedData.bodyText = bodyText.substring(0, 3000);
    
    console.log(`✅ Scraping completed for ${url} in ${loadTime}ms`);
    
    return {
      success: true,
      data: {
        ...scrapedData,
        loadTime,
        statusCode,
        url,
      },
    };
    
  } catch (error) {
    console.error("[SCRAPER] Axios request failed:", error.message);
    
    return {
      success: false,
      error: error.message,
    };
  }
}
