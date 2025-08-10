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
  select: { border: "1px solid #e5e7eb", borderRadius: 12, padding: "10px 12px", outline: "none", width: "100%" },
  error: { color: "#dc2626", fontSize: 14 },
  info: { color: "#047857", fontSize: 14 },
  loading: { textAlign: "center", padding: "20px", color: "#64748b" },
  ideaGrid: { display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))" },
  ideaCard: { border: "1px solid #e5e7eb", borderRadius: 12, padding: 16, background: "#fafafa" },
  ideaTitle: { fontSize: 18, fontWeight: 600, marginBottom: 8, color: "#111827" },
  ideaDescription: { fontSize: 14, lineHeight: 1.5, marginBottom: 12, color: "#374151" },
  ideaMeta: { fontSize: 14, color: "#64748b", marginBottom: 8 },
  techTags: { display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 },
  techTag: { background: "#e0e7ff", color: "#3730a3", padding: "4px 8px", borderRadius: 6, fontSize: 12 },
  impactBadge: { display: "inline-block", background: "#dcfce7", color: "#166534", padding: "4px 8px", borderRadius: 6, fontSize: 12, marginBottom: 8 },
  timeBadge: { display: "inline-block", background: "#fef3c7", color: "#92400e", padding: "4px 8px", borderRadius: 6, fontSize: 12 },
  formGrid: { display: "grid", gap: 12, gridTemplateColumns: "1fr 1fr" },
  fullWidth: { gridColumn: "1 / -1" },
  skillInput: { display: "flex", gap: 8, alignItems: "center" },
  skillTag: { background: "#e0e7ff", color: "#3730a3", padding: "4px 8px", borderRadius: 6, fontSize: 12, display: "flex", alignItems: "center", gap: 4 },
  removeBtn: { background: "none", border: "none", color: "#dc2626", cursor: "pointer", fontSize: 16, padding: 0 }
};

function AIProjectGenerator() {
  const [theme, setTheme] = useState('');
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [difficulty, setDifficulty] = useState('intermediate');
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const generateIdeas = async () => {
    if (!theme.trim()) {
      setError('Please enter a hackathon theme');
      return;
    }

    if (skills.length === 0) {
      setError('Please add at least one skill');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const generatedIdeas = await aiService.generateProjectIdeas(theme, skills, difficulty);
      setIdeas(generatedIdeas);
    } catch (err) {
      setError('Failed to generate ideas: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addSkill();
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.h1}>🤖 AI Project Idea Generator</h1>
      
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h2 style={styles.h2}>Generate Project Ideas</h2>
        </div>
        <div style={styles.cardBody}>
          <p style={styles.textMuted}>
            Let AI help you brainstorm innovative project ideas based on your hackathon theme and skills.
          </p>
          
          <div style={styles.formGrid}>
            <div style={styles.fullWidth}>
              <label style={{ fontSize: 14, marginBottom: 4, display: "block" }}>
                Hackathon Theme *
              </label>
              <input
                style={styles.input}
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                placeholder="e.g., Sustainability, Healthcare, Education, AI/ML"
              />
            </div>

            <div style={styles.fullWidth}>
              <label style={{ fontSize: 14, marginBottom: 4, display: "block" }}>
                Your Skills *
              </label>
              <div style={styles.skillInput}>
                <input
                  style={{ ...styles.input, flex: 1 }}
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="e.g., React, Python, Machine Learning"
                />
                <button style={styles.btn} onClick={addSkill}>
                  Add
                </button>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
                {skills.map((skill, index) => (
                  <div key={index} style={styles.skillTag}>
                    {skill}
                    <button 
                      style={styles.removeBtn}
                      onClick={() => removeSkill(skill)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label style={{ fontSize: 14, marginBottom: 4, display: "block" }}>
                Difficulty Level
              </label>
              <select style={styles.select} value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div style={{ display: "flex", alignItems: "end" }}>
              <button 
                style={styles.btnPrimary} 
                onClick={generateIdeas}
                disabled={loading}
              >
                {loading ? "Generating..." : "Generate Ideas"}
              </button>
            </div>
          </div>

          {error && <p style={styles.error}>{error}</p>}
          
          {!aiService.isAIAvailable() && (
            <p style={styles.info}>
              💡 AI features are using mock data. Add VITE_OPENAI_API_KEY to your .env file for real AI-powered suggestions.
            </p>
          )}
        </div>
      </div>

      {loading && (
        <div style={styles.loading}>
          <p>🤖 AI is brainstorming project ideas...</p>
          <p style={styles.textMuted}>This may take a few moments</p>
        </div>
      )}

      {ideas.length > 0 && (
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.h2}>
              Generated {ideas.length} Project Idea{ideas.length !== 1 ? 's' : ''}
            </h2>
          </div>
          <div style={styles.cardBody}>
            <div style={styles.ideaGrid}>
              {ideas.map((idea, index) => (
                <div key={index} style={styles.ideaCard}>
                  <div style={styles.ideaTitle}>{idea.name}</div>
                  <div style={styles.ideaDescription}>{idea.description}</div>
                  
                  <div style={styles.techTags}>
                    {idea.technologies.map((tech, techIndex) => (
                      <span key={techIndex} style={styles.techTag}>
                        {tech}
                      </span>
                    ))}
                  </div>
                  
                  <div style={styles.impactBadge}>
                    💡 {idea.impact}
                  </div>
                  
                  <div style={styles.timeBadge}>
                    ⏱️ {idea.timeEstimate}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {!loading && ideas.length === 0 && (
        <div style={styles.card}>
          <div style={styles.cardBody}>
            <div style={{ textAlign: "center", color: "#64748b" }}>
              <p>No project ideas generated yet.</p>
              <p>Enter a theme and your skills to get AI-powered project suggestions!</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AIProjectGenerator;
