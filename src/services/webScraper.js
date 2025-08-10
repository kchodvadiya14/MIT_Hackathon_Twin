import axios from 'axios';
import * as cheerio from 'cheerio';

// CORS proxy to bypass CORS issues
const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';

// Known hackathon websites and their selectors
const HACKATHON_SOURCES = {
  'devpost.com': {
    baseUrl: 'https://devpost.com/hackathons',
    selectors: {
      hackathons: '.challenge-listing',
      title: '.challenge-title',
      description: '.challenge-description',
      date: '.submission-period',
      prize: '.prize-amount',
      link: 'a'
    }
  },
  'mlh.io': {
    baseUrl: 'https://mlh.io/seasons/2024/events',
    selectors: {
      hackathons: '.event',
      title: '.event-name',
      description: '.event-description',
      date: '.event-date',
      location: '.event-location',
      link: 'a'
    }
  },
  'hackathon.com': {
    baseUrl: 'https://www.hackathon.com/events',
    selectors: {
      hackathons: '.event-card',
      title: '.event-title',
      description: '.event-description',
      date: '.event-date',
      location: '.event-location',
      link: 'a'
    }
  }
};

class WebScraperService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  // Generic web scraper
  async scrapeWebsite(url, selectors) {
    try {
      // Try direct request first, fallback to proxy if CORS fails
      let response;
      try {
        response = await axios.get(url, {
          timeout: 10000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        });
      } catch (corsError) {
        // If CORS error, try using proxy
        console.log('CORS error, trying proxy for:', url);
        const proxyUrl = `http://localhost:3001/api/proxy?url=${encodeURIComponent(url)}`;
        response = await axios.get(proxyUrl, {
          timeout: 15000
        });
      }

      const $ = cheerio.load(response.data);
      const results = [];

      $(selectors.hackathons).each((index, element) => {
        const $el = $(element);
        const item = {};

        // Extract data using selectors
        Object.keys(selectors).forEach(key => {
          if (key !== 'hackathons') {
            const selector = selectors[key];
            const $found = $el.find(selector);
            
            if (key === 'link') {
              item[key] = $found.attr('href');
              if (item[key] && !item[key].startsWith('http')) {
                item[key] = new URL(item[key], url).href;
              }
            } else {
              item[key] = $found.text().trim();
            }
          }
        });

        if (item.title) {
          results.push(item);
        }
      });

      return results;
    } catch (error) {
      console.error(`Error scraping ${url}:`, error.message);
      return [];
    }
  }

  // Scrape hackathons from multiple sources
  async scrapeHackathons() {
    const allHackathons = [];
    const promises = [];

    for (const [source, config] of Object.entries(HACKATHON_SOURCES)) {
      const cacheKey = `hackathons_${source}`;
      const cached = this.cache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
        allHackathons.push(...cached.data);
        continue;
      }

      promises.push(
        this.scrapeWebsite(config.baseUrl, config.selectors)
          .then(data => {
            const hackathons = data.map(hackathon => ({
              ...hackathon,
              source,
              scrapedAt: new Date().toISOString()
            }));
            
            this.cache.set(cacheKey, {
              data: hackathons,
              timestamp: Date.now()
            });
            
            return hackathons;
          })
          .catch(error => {
            console.error(`Error scraping ${source}:`, error);
            return [];
          })
      );
    }

    const results = await Promise.all(promises);
    results.forEach(hackathons => allHackathons.push(...hackathons));

    return allHackathons;
  }

  // Scrape a specific URL (for custom websites)
  async scrapeCustomUrl(url) {
    try {
      // Try direct request first, fallback to proxy if CORS fails
      let response;
      try {
        response = await axios.get(url, {
          timeout: 10000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        });
      } catch (corsError) {
        // If CORS error, try using proxy
        console.log('CORS error, trying proxy for:', url);
        const proxyUrl = `http://localhost:3001/api/proxy?url=${encodeURIComponent(url)}`;
        response = await axios.get(proxyUrl, {
          timeout: 15000
        });
      }

      const $ = cheerio.load(response.data);
      
      // Try to extract common hackathon information
      const title = $('h1, .title, .event-title, .hackathon-title').first().text().trim();
      const description = $('.description, .event-description, .hackathon-description').first().text().trim();
      const date = $('.date, .event-date, .hackathon-date').first().text().trim();
      const location = $('.location, .event-location, .hackathon-location').first().text().trim();
      const prize = $('.prize, .prize-amount, .hackathon-prize').first().text().trim();

      return {
        title: title || 'Unknown Title',
        description: description || 'No description available',
        date: date || 'Date not specified',
        location: location || 'Location not specified',
        prize: prize || 'Prize information not available',
        source: 'Custom URL',
        url: url,
        scrapedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error(`Error scraping custom URL ${url}:`, error.message);
      throw new Error(`Failed to scrape ${url}: ${error.message}`);
    }
  }

  // Get popular hackathon websites
  getPopularHackathonSites() {
    return [
      {
        name: 'Devpost',
        url: 'https://devpost.com/hackathons',
        description: 'Find hackathons and coding competitions'
      },
      {
        name: 'MLH (Major League Hacking)',
        url: 'https://mlh.io/seasons/2024/events',
        description: 'Official student hackathon league'
      },
      {
        name: 'Hackathon.com',
        url: 'https://www.hackathon.com/events',
        description: 'Global hackathon directory'
      },
      {
        name: 'HackerEarth',
        url: 'https://www.hackerearth.com/challenges/hackathon/',
        description: 'Programming challenges and hackathons'
      },
      {
        name: 'AngelHack',
        url: 'https://angelhack.com/',
        description: 'Global hackathon series'
      }
    ];
  }

  // Clear cache
  clearCache() {
    this.cache.clear();
  }
}

export default new WebScraperService();
