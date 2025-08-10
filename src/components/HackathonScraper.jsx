import React, { useState, useEffect } from 'react';
import webScraper from '../services/webScraper';

const styles = {
  container: { display: "grid", gap: 16 },
  card: { background: "white", border: "1px solid #e5e7eb", borderRadius: 16, boxShadow: "0 1px 2px rgba(0,0,0,0.03)", overflow: "hidden" },
  cardHeader: { padding: "12px 16px", borderBottom: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "space-between" },
  cardBody: { padding: 16, display: "grid", gap: 12 },
  h1: { fontSize: 24, fontWeight: 600, margin: 0 },
  h2: { fontSize: 16, fontWeight: 600, margin: 0 },
  textMuted: { color: "#64748b" },
  btn: { borderRadius: 12, border: "1px solid #e5e7eb", padding: "8px 12px", background: "white", cursor: "pointer" },
  btnPrimary: { borderRadius: 12, border: "1px solid #111827", padding: "8px 12px", background: "#111827", color: "white", cursor: "pointer" },
  input: { border: "1px solid #e5e7eb", borderRadius: 12, padding: "10px 12px", outline: "none", width: "100%" },
  error: { color: "#dc2626", fontSize: 14 },
  info: { color: "#047857", fontSize: 14 },
  loading: { textAlign: "center", padding: "20px", color: "#64748b" },
  hackathonGrid: { display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" },
  hackathonCard: { border: "1px solid #e5e7eb", borderRadius: 12, padding: 16, background: "#fafafa" },
  hackathonTitle: { fontSize: 18, fontWeight: 600, marginBottom: 8, color: "#111827" },
  hackathonMeta: { fontSize: 14, color: "#64748b", marginBottom: 8 },
  hackathonDescription: { fontSize: 14, lineHeight: 1.5, marginBottom: 12 },
  hackathonLink: { color: "#3b82f6", textDecoration: "none", fontSize: 14 },
  sourceTag: { display: "inline-block", background: "#e0e7ff", color: "#3730a3", padding: "2px 8px", borderRadius: 6, fontSize: 12, marginTop: 8 },
  popularSites: { display: "grid", gap: 8 },
  siteCard: { border: "1px solid #e5e7eb", borderRadius: 8, padding: 12, background: "#f9fafb" },
  siteName: { fontWeight: 600, marginBottom: 4 },
  siteDescription: { fontSize: 14, color: "#64748b", marginBottom: 8 },
  siteUrl: { fontSize: 12, color: "#3b82f6", wordBreak: "break-all" }
};

function HackathonScraper() {
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [customUrl, setCustomUrl] = useState("");
  const [popularSites] = useState(webScraper.getPopularHackathonSites());

  const scrapeAllHackathons = async () => {
    setLoading(true);
    setError("");
    try {
      const results = await webScraper.scrapeHackathons();
      setHackathons(results);
    } catch (err) {
      setError("Failed to scrape hackathons: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const scrapeCustomUrl = async () => {
    if (!customUrl.trim()) {
      setError("Please enter a URL");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const result = await webScraper.scrapeCustomUrl(customUrl);
      setHackathons([result]);
      setCustomUrl("");
    } catch (err) {
      setError("Failed to scrape URL: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const clearCache = () => {
    webScraper.clearCache();
    setHackathons([]);
    setError("");
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.h1}>🌐 Hackathon Web Scraper</h1>
      
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h2 style={styles.h2}>Scrape Hackathons</h2>
        </div>
        <div style={styles.cardBody}>
          <p style={styles.textMuted}>
            Discover hackathons from popular websites or scrape custom URLs to find opportunities.
          </p>
          
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button 
              style={styles.btnPrimary} 
              onClick={scrapeAllHackathons}
              disabled={loading}
            >
              {loading ? "Scraping..." : "Scrape All Sources"}
            </button>
            <button 
              style={styles.btn} 
              onClick={clearCache}
              disabled={loading}
            >
              Clear Cache
            </button>
          </div>

          {error && <p style={styles.error}>{error}</p>}
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h2 style={styles.h2}>Custom URL Scraper</h2>
        </div>
        <div style={styles.cardBody}>
          <p style={styles.textMuted}>
            Enter a specific URL to scrape hackathon information from any website.
          </p>
          
          <div style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 14, marginBottom: 4, display: "block" }}>
                Website URL
              </label>
              <input
                style={styles.input}
                type="url"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="https://example.com/hackathon"
              />
            </div>
            <button 
              style={styles.btnPrimary} 
              onClick={scrapeCustomUrl}
              disabled={loading || !customUrl.trim()}
            >
              {loading ? "Scraping..." : "Scrape URL"}
            </button>
          </div>
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h2 style={styles.h2}>Popular Hackathon Websites</h2>
        </div>
        <div style={styles.cardBody}>
          <div style={styles.popularSites}>
            {popularSites.map((site, index) => (
              <div key={index} style={styles.siteCard}>
                <div style={styles.siteName}>{site.name}</div>
                <div style={styles.siteDescription}>{site.description}</div>
                <a 
                  href={site.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={styles.siteUrl}
                >
                  {site.url}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {loading && (
        <div style={styles.loading}>
          <p>🔄 Scraping hackathons from the web...</p>
          <p style={styles.textMuted}>This may take a few moments</p>
        </div>
      )}

      {hackathons.length > 0 && (
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.h2}>
              Found {hackathons.length} Hackathon{hackathons.length !== 1 ? 's' : ''}
            </h2>
          </div>
          <div style={styles.cardBody}>
            <div style={styles.hackathonGrid}>
              {hackathons.map((hackathon, index) => (
                <div key={index} style={styles.hackathonCard}>
                  <div style={styles.hackathonTitle}>{hackathon.title}</div>
                  
                  {hackathon.date && (
                    <div style={styles.hackathonMeta}>
                      📅 {hackathon.date}
                    </div>
                  )}
                  
                  {hackathon.location && (
                    <div style={styles.hackathonMeta}>
                      📍 {hackathon.location}
                    </div>
                  )}
                  
                  {hackathon.prize && (
                    <div style={styles.hackathonMeta}>
                      💰 {hackathon.prize}
                    </div>
                  )}
                  
                  {hackathon.description && (
                    <div style={styles.hackathonDescription}>
                      {hackathon.description.length > 150 
                        ? hackathon.description.substring(0, 150) + '...'
                        : hackathon.description
                      }
                    </div>
                  )}
                  
                  {hackathon.link && (
                    <a 
                      href={hackathon.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={styles.hackathonLink}
                    >
                      🔗 View Details
                    </a>
                  )}
                  
                  <div style={styles.sourceTag}>
                    Source: {hackathon.source}
                  </div>
                  
                  {hackathon.scrapedAt && (
                    <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}>
                      Scraped: {formatDate(hackathon.scrapedAt)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {!loading && hackathons.length === 0 && (
        <div style={styles.card}>
          <div style={styles.cardBody}>
            <div style={{ textAlign: "center", color: "#64748b" }}>
              <p>No hackathons found yet.</p>
              <p>Click "Scrape All Sources" to discover hackathons from popular websites.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HackathonScraper;
