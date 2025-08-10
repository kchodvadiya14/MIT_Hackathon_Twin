import React, { useState } from 'react';
import aiService from '../services/aiService';

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
  textarea: { border: "1px solid #e5e7eb", borderRadius: 12, padding: "10px 12px", outline: "none", width: "100%", minHeight: "100px", resize: "vertical" },
  select: { border: "1px solid #e5e7eb", borderRadius: 12, padding: "10px 12px", outline: "none", width: "100%" },
  error: { color: "#dc2626", fontSize: 14 },
  info: { color: "#047857", fontSize: 14 },
  loading: { textAlign: "center", padding: "20px", color: "#64748b" },
  formGrid: { display: "grid", gap: 12, gridTemplateColumns: "1fr 1fr" },
  fullWidth: { gridColumn: "1 / -1" },
  contentPreview: { 
    border: "1px solid #e5e7eb", 
    borderRadius: 12, 
    padding: 16, 
    background: "#fafafa",
    whiteSpace: "pre-wrap",
    lineHeight: 1.6,
    fontSize: 14
  },
  copyBtn: { 
    background: "#3b82f6", 
    color: "white", 
    border: "none", 
    borderRadius: 8, 
    padding: "8px 16px", 
    cursor: "pointer",
    fontSize: 14,
    marginTop: 12
  },
  templateCard: { 
    border: "1px solid #e5e7eb", 
    borderRadius: 8, 
    padding: 12, 
    background: "#f9fafb",
    cursor: "pointer",
    transition: "all 0.2s"
  },
  templateCardHover: { 
    border: "1px solid #3b82f6", 
    background: "#eff6ff" 
  },
  templateTitle: { fontWeight: 600, marginBottom: 4 },
  templateDescription: { fontSize: 14, color: "#64748b" }
};

function AIContentGenerator() {
  const [contentType, setContentType] = useState('announcement');
  const [context, setContext] = useState({
    event: '',
    title: '',
    theme: '',
    duration: '',
    prizePool: '',
    location: ''
  });
  const [generatedContent, setGeneratedContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hoveredTemplate, setHoveredTemplate] = useState(null);

  const contentTemplates = [
    {
      type: 'announcement',
      title: 'Hackathon Announcement',
      description: 'Professional announcement for hackathon launch',
      fields: ['event', 'theme', 'duration', 'location']
    },
    {
      type: 'description',
      title: 'Event Description',
      description: 'Engaging description for hackathon promotion',
      fields: ['title', 'theme', 'duration', 'prizePool']
    },
    {
      type: 'rules',
      title: 'Hackathon Rules',
      description: 'Comprehensive rules and guidelines',
      fields: ['event', 'duration']
    }
  ];

  const generateContent = async () => {
    // Validate required fields based on content type
    const template = contentTemplates.find(t => t.type === contentType);
    const missingFields = template.fields.filter(field => !context[field]?.trim());
    
    if (missingFields.length > 0) {
      setError(`Please fill in: ${missingFields.join(', ')}`);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const content = await aiService.generateContent(contentType, context);
      setGeneratedContent(content);
    } catch (err) {
      setError('Failed to generate content: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent).then(() => {
      // You could add a toast notification here
      alert('Content copied to clipboard!');
    });
  };

  const selectTemplate = (template) => {
    setContentType(template.type);
    setGeneratedContent('');
    setError('');
  };

  const updateContext = (field, value) => {
    setContext(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.h1}>✍️ AI Content Generator</h1>
      
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h2 style={styles.h2}>Content Templates</h2>
        </div>
        <div style={styles.cardBody}>
          <p style={styles.textMuted}>
            Choose a content type and let AI generate professional hackathon content for you.
          </p>
          
          <div style={{ display: "grid", gap: 8, gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))" }}>
            {contentTemplates.map((template) => (
              <div
                key={template.type}
                style={{
                  ...styles.templateCard,
                  ...(hoveredTemplate === template.type ? styles.templateCardHover : {}),
                  ...(contentType === template.type ? styles.templateCardHover : {})
                }}
                onClick={() => selectTemplate(template)}
                onMouseEnter={() => setHoveredTemplate(template.type)}
                onMouseLeave={() => setHoveredTemplate(null)}
              >
                <div style={styles.templateTitle}>{template.title}</div>
                <div style={styles.templateDescription}>{template.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h2 style={styles.h2}>Content Details</h2>
        </div>
        <div style={styles.cardBody}>
          <div style={styles.formGrid}>
            {contentType === 'announcement' && (
              <>
                <div>
                  <label style={{ fontSize: 14, marginBottom: 4, display: "block" }}>
                    Event Name *
                  </label>
                  <input
                    style={styles.input}
                    value={context.event}
                    onChange={(e) => updateContext('event', e.target.value)}
                    placeholder="e.g., TechCrunch Disrupt Hackathon"
                  />
                </div>
                <div>
                  <label style={{ fontSize: 14, marginBottom: 4, display: "block" }}>
                    Theme *
                  </label>
                  <input
                    style={styles.input}
                    value={context.theme}
                    onChange={(e) => updateContext('theme', e.target.value)}
                    placeholder="e.g., Sustainable Technology"
                  />
                </div>
                <div>
                  <label style={{ fontSize: 14, marginBottom: 4, display: "block" }}>
                    Duration *
                  </label>
                  <input
                    style={styles.input}
                    value={context.duration}
                    onChange={(e) => updateContext('duration', e.target.value)}
                    placeholder="e.g., 48 hours"
                  />
                </div>
                <div>
                  <label style={{ fontSize: 14, marginBottom: 4, display: "block" }}>
                    Location *
                  </label>
                  <input
                    style={styles.input}
                    value={context.location}
                    onChange={(e) => updateContext('location', e.target.value)}
                    placeholder="e.g., San Francisco, CA"
                  />
                </div>
              </>
            )}

            {contentType === 'description' && (
              <>
                <div>
                  <label style={{ fontSize: 14, marginBottom: 4, display: "block" }}>
                    Event Title *
                  </label>
                  <input
                    style={styles.input}
                    value={context.title}
                    onChange={(e) => updateContext('title', e.target.value)}
                    placeholder="e.g., Innovation Hackathon 2024"
                  />
                </div>
                <div>
                  <label style={{ fontSize: 14, marginBottom: 4, display: "block" }}>
                    Theme *
                  </label>
                  <input
                    style={styles.input}
                    value={context.theme}
                    onChange={(e) => updateContext('theme', e.target.value)}
                    placeholder="e.g., AI for Social Good"
                  />
                </div>
                <div>
                  <label style={{ fontSize: 14, marginBottom: 4, display: "block" }}>
                    Duration *
                  </label>
                  <input
                    style={styles.input}
                    value={context.duration}
                    onChange={(e) => updateContext('duration', e.target.value)}
                    placeholder="e.g., 36 hours"
                  />
                </div>
                <div>
                  <label style={{ fontSize: 14, marginBottom: 4, display: "block" }}>
                    Prize Pool
                  </label>
                  <input
                    style={styles.input}
                    value={context.prizePool}
                    onChange={(e) => updateContext('prizePool', e.target.value)}
                    placeholder="e.g., $50,000 in prizes"
                  />
                </div>
              </>
            )}

            {contentType === 'rules' && (
              <>
                <div>
                  <label style={{ fontSize: 14, marginBottom: 4, display: "block" }}>
                    Event Name *
                  </label>
                  <input
                    style={styles.input}
                    value={context.event}
                    onChange={(e) => updateContext('event', e.target.value)}
                    placeholder="e.g., Annual Tech Hackathon"
                  />
                </div>
                <div>
                  <label style={{ fontSize: 14, marginBottom: 4, display: "block" }}>
                    Duration *
                  </label>
                  <input
                    style={styles.input}
                    value={context.duration}
                    onChange={(e) => updateContext('duration', e.target.value)}
                    placeholder="e.g., 48 hours"
                  />
                </div>
              </>
            )}

            <div style={styles.fullWidth}>
              <button 
                style={styles.btnPrimary} 
                onClick={generateContent}
                disabled={loading}
              >
                {loading ? "Generating..." : "Generate Content"}
              </button>
            </div>
          </div>

          {error && <p style={styles.error}>{error}</p>}
          
          {!aiService.isAIAvailable() && (
            <p style={styles.info}>
              💡 AI features are using mock data. Add VITE_OPENAI_API_KEY to your .env file for real AI-powered content generation.
            </p>
          )}
        </div>
      </div>

      {loading && (
        <div style={styles.loading}>
          <p>🤖 AI is crafting your content...</p>
          <p style={styles.textMuted}>This may take a few moments</p>
        </div>
      )}

      {generatedContent && (
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.h2}>Generated Content</h2>
          </div>
          <div style={styles.cardBody}>
            <div style={styles.contentPreview}>
              {generatedContent}
            </div>
            <button style={styles.copyBtn} onClick={copyToClipboard}>
              📋 Copy to Clipboard
            </button>
          </div>
        </div>
      )}

      {!loading && !generatedContent && (
        <div style={styles.card}>
          <div style={styles.cardBody}>
            <div style={{ textAlign: "center", color: "#64748b" }}>
              <p>No content generated yet.</p>
              <p>Select a template, fill in the details, and click "Generate Content" to get AI-powered content!</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AIContentGenerator;
