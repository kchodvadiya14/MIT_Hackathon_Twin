import React, { useState } from 'react';
import AIProjectGenerator from './AIProjectGenerator';
import AITeamMatcher from './AITeamMatcher';
import AIContentGenerator from './AIContentGenerator';

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
  featureGrid: { display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" },
  featureCard: { 
    border: "1px solid #e5e7eb", 
    borderRadius: 12, 
    padding: 20, 
    background: "#fafafa",
    cursor: "pointer",
    transition: "all 0.2s",
    textAlign: "center"
  },
  featureCardHover: { 
    border: "1px solid #3b82f6", 
    background: "#eff6ff",
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(59, 130, 246, 0.15)"
  },
  featureIcon: { fontSize: 48, marginBottom: 12 },
  featureTitle: { fontSize: 18, fontWeight: 600, marginBottom: 8, color: "#111827" },
  featureDescription: { fontSize: 14, color: "#64748b", lineHeight: 1.5 },
  backBtn: { 
    background: "none", 
    border: "none", 
    color: "#3b82f6", 
    cursor: "pointer", 
    fontSize: 14,
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: 0
  },
  statsGrid: { display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" },
  statCard: { 
    border: "1px solid #e5e7eb", 
    borderRadius: 8, 
    padding: 16, 
    background: "#f9fafb",
    textAlign: "center"
  },
  statNumber: { fontSize: 24, fontWeight: 600, color: "#111827", marginBottom: 4 },
  statLabel: { fontSize: 14, color: "#64748b" }
};

function AIDashboard() {
  const [activeFeature, setActiveFeature] = useState(null);

  const aiFeatures = [
    {
      id: 'project-generator',
      title: 'Project Idea Generator',
      description: 'Generate innovative project ideas based on hackathon themes and your skills',
      icon: '🤖',
      component: AIProjectGenerator
    },
    {
      id: 'team-matcher',
      title: 'AI Team Matcher',
      description: 'Find perfect teammates using AI-powered skill and preference matching',
      icon: '🤝',
      component: AITeamMatcher
    },
    {
      id: 'content-generator',
      title: 'Content Generator',
      description: 'Create professional hackathon announcements, descriptions, and rules',
      icon: '✍️',
      component: AIContentGenerator
    }
  ];

  const stats = [
    { number: '50+', label: 'Project Ideas Generated' },
    { number: '25', label: 'Teams Matched' },
    { number: '15', label: 'Content Pieces Created' },
    { number: '95%', label: 'User Satisfaction' }
  ];

  const handleFeatureClick = (feature) => {
    setActiveFeature(feature);
  };

  const handleBack = () => {
    setActiveFeature(null);
  };

  if (activeFeature) {
    const FeatureComponent = activeFeature.component;
    return (
      <div style={styles.container}>
        <button style={styles.backBtn} onClick={handleBack}>
          ← Back to AI Dashboard
        </button>
        <FeatureComponent />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.h1}>🤖 AI-Powered Hackathon Tools</h1>
      
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h2 style={styles.h2}>AI Features Overview</h2>
        </div>
        <div style={styles.cardBody}>
          <p style={styles.textMuted}>
            Leverage artificial intelligence to enhance your hackathon experience. Choose from our suite of AI-powered tools designed to help you succeed.
          </p>
          
          <div style={styles.statsGrid}>
            {stats.map((stat, index) => (
              <div key={index} style={styles.statCard}>
                <div style={styles.statNumber}>{stat.number}</div>
                <div style={styles.statLabel}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h2 style={styles.h2}>Available AI Tools</h2>
        </div>
        <div style={styles.cardBody}>
          <div style={styles.featureGrid}>
            {aiFeatures.map((feature) => (
              <div
                key={feature.id}
                style={styles.featureCard}
                onClick={() => handleFeatureClick(feature)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.border = "1px solid #3b82f6";
                  e.currentTarget.style.background = "#eff6ff";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(59, 130, 246, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.border = "1px solid #e5e7eb";
                  e.currentTarget.style.background = "#fafafa";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={styles.featureIcon}>{feature.icon}</div>
                <div style={styles.featureTitle}>{feature.title}</div>
                <div style={styles.featureDescription}>{feature.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h2 style={styles.h2}>How AI Enhances Your Hackathon</h2>
        </div>
        <div style={styles.cardBody}>
          <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))" }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>🎯 Smart Project Ideas</h3>
              <p style={styles.textMuted}>
                Get personalized project suggestions based on your skills and the hackathon theme. AI analyzes trends and generates innovative ideas.
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>👥 Perfect Team Matching</h3>
              <p style={styles.textMuted}>
                Find teammates with complementary skills and similar interests. AI evaluates compatibility for optimal team formation.
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>📝 Professional Content</h3>
              <p style={styles.textMuted}>
                Generate engaging announcements, descriptions, and rules. Save time while maintaining professional quality.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.cardBody}>
          <div style={{ textAlign: "center", color: "#64748b" }}>
            <p style={{ fontSize: 16, marginBottom: 8 }}>
              💡 <strong>Pro Tip:</strong> Add your OpenAI API key to enable real AI features
            </p>
            <p style={{ fontSize: 14 }}>
              Create a .env file with VITE_OPENAI_API_KEY=your_api_key for enhanced AI capabilities
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIDashboard;
