import React, { useState, useEffect } from 'react';
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
  matchGrid: { display: "grid", gap: 12 },
  matchCard: { border: "1px solid #e5e7eb", borderRadius: 12, padding: 16, background: "#fafafa" },
  matchHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  matchName: { fontSize: 18, fontWeight: 600, color: "#111827" },
  matchScore: { background: "#e0e7ff", color: "#3730a3", padding: "4px 12px", borderRadius: 20, fontSize: 14, fontWeight: 600 },
  matchSkills: { display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 },
  skillTag: { background: "#e0e7ff", color: "#3730a3", padding: "4px 8px", borderRadius: 6, fontSize: 12 },
  matchReason: { fontSize: 14, color: "#64748b", fontStyle: "italic" },
  formGrid: { display: "grid", gap: 12, gridTemplateColumns: "1fr 1fr" },
  fullWidth: { gridColumn: "1 / -1" },
  skillInput: { display: "flex", gap: 8, alignItems: "center" },
  skillTag: { background: "#e0e7ff", color: "#3730a3", padding: "4px 8px", borderRadius: 6, fontSize: 12, display: "flex", alignItems: "center", gap: 4 },
  removeBtn: { background: "none", border: "none", color: "#dc2626", cursor: "pointer", fontSize: 16, padding: 0 },
  preferenceInput: { display: "flex", gap: 8, alignItems: "center" },
  preferenceTag: { background: "#fef3c7", color: "#92400e", padding: "4px 8px", borderRadius: 6, fontSize: 12, display: "flex", alignItems: "center", gap: 4 }
};

function AITeamMatcher() {
  const [userProfile, setUserProfile] = useState({
    name: '',
    skills: [],
    preferences: [],
    experience: 'intermediate'
  });
  const [newSkill, setNewSkill] = useState('');
  const [newPreference, setNewPreference] = useState('');
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Mock available users for demonstration
  const [availableUsers] = useState([
    {
      id: 1,
      name: 'Alex Chen',
      skills: ['React', 'Node.js', 'MongoDB'],
      experience: 'advanced',
      email: 'alex@example.com'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      skills: ['Python', 'Machine Learning', 'Data Analysis'],
      experience: 'intermediate',
      email: 'sarah@example.com'
    },
    {
      id: 3,
      name: 'Mike Rodriguez',
      skills: ['UI/UX Design', 'Figma', 'Frontend Development'],
      experience: 'intermediate',
      email: 'mike@example.com'
    },
    {
      id: 4,
      name: 'Emily Wang',
      skills: ['Backend Development', 'Java', 'Spring Boot'],
      experience: 'advanced',
      email: 'emily@example.com'
    },
    {
      id: 5,
      name: 'David Kim',
      skills: ['Mobile Development', 'React Native', 'Firebase'],
      experience: 'beginner',
      email: 'david@example.com'
    }
  ]);

  const addSkill = () => {
    if (newSkill.trim() && !userProfile.skills.includes(newSkill.trim())) {
      setUserProfile({
        ...userProfile,
        skills: [...userProfile.skills, newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setUserProfile({
      ...userProfile,
      skills: userProfile.skills.filter(skill => skill !== skillToRemove)
    });
  };

  const addPreference = () => {
    if (newPreference.trim() && !userProfile.preferences.includes(newPreference.trim())) {
      setUserProfile({
        ...userProfile,
        preferences: [...userProfile.preferences, newPreference.trim()]
      });
      setNewPreference('');
    }
  };

  const removePreference = (preferenceToRemove) => {
    setUserProfile({
      ...userProfile,
      preferences: userProfile.preferences.filter(pref => pref !== preferenceToRemove)
    });
  };

  const findMatches = async () => {
    if (!userProfile.name.trim()) {
      setError('Please enter your name');
      return;
    }

    if (userProfile.skills.length === 0) {
      setError('Please add at least one skill');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const aiMatches = await aiService.matchTeammates(userProfile, availableUsers);
      
      // Combine AI scores with user data
      const enrichedMatches = aiMatches.map(match => {
        const user = availableUsers.find(u => u.id === match.userId);
        return {
          ...user,
          matchScore: match.matchScore,
          reason: match.reason
        };
      }).sort((a, b) => b.matchScore - a.matchScore);

      setMatches(enrichedMatches);
    } catch (err) {
      setError('Failed to find matches: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSkillKeyPress = (e) => {
    if (e.key === 'Enter') {
      addSkill();
    }
  };

  const handlePreferenceKeyPress = (e) => {
    if (e.key === 'Enter') {
      addPreference();
    }
  };

  const getScoreColor = (score) => {
    if (score >= 4) return { background: "#dcfce7", color: "#166534" };
    if (score >= 3) return { background: "#e0e7ff", color: "#3730a3" };
    return { background: "#fef3c7", color: "#92400e" };
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.h1}>🤝 AI Team Matcher</h1>
      
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h2 style={styles.h2}>Your Profile</h2>
        </div>
        <div style={styles.cardBody}>
          <p style={styles.textMuted}>
            Let AI help you find the perfect teammates based on your skills and preferences.
          </p>
          
          <div style={styles.formGrid}>
            <div>
              <label style={{ fontSize: 14, marginBottom: 4, display: "block" }}>
                Your Name *
              </label>
              <input
                style={styles.input}
                value={userProfile.name}
                onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label style={{ fontSize: 14, marginBottom: 4, display: "block" }}>
                Experience Level
              </label>
              <select 
                style={styles.select} 
                value={userProfile.experience} 
                onChange={(e) => setUserProfile({...userProfile, experience: e.target.value})}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
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
                  onKeyPress={handleSkillKeyPress}
                  placeholder="e.g., React, Python, Machine Learning"
                />
                <button style={styles.btn} onClick={addSkill}>
                  Add
                </button>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
                {userProfile.skills.map((skill, index) => (
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

            <div style={styles.fullWidth}>
              <label style={{ fontSize: 14, marginBottom: 4, display: "block" }}>
                Preferences (Optional)
              </label>
              <div style={styles.preferenceInput}>
                <input
                  style={{ ...styles.input, flex: 1 }}
                  value={newPreference}
                  onChange={(e) => setNewPreference(e.target.value)}
                  onKeyPress={handlePreferenceKeyPress}
                  placeholder="e.g., Remote work, Frontend focus, AI/ML projects"
                />
                <button style={styles.btn} onClick={addPreference}>
                  Add
                </button>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
                {userProfile.preferences.map((pref, index) => (
                  <div key={index} style={styles.preferenceTag}>
                    {pref}
                    <button 
                      style={styles.removeBtn}
                      onClick={() => removePreference(pref)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div style={styles.fullWidth}>
              <button 
                style={styles.btnPrimary} 
                onClick={findMatches}
                disabled={loading}
              >
                {loading ? "Finding Matches..." : "Find Teammates"}
              </button>
            </div>
          </div>

          {error && <p style={styles.error}>{error}</p>}
          
          {!aiService.isAIAvailable() && (
            <p style={styles.info}>
              💡 AI features are using mock data. Add VITE_OPENAI_API_KEY to your .env file for real AI-powered matching.
            </p>
          )}
        </div>
      </div>

      {loading && (
        <div style={styles.loading}>
          <p>🤖 AI is analyzing potential teammates...</p>
          <p style={styles.textMuted}>This may take a few moments</p>
        </div>
      )}

      {matches.length > 0 && (
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.h2}>
              Top {matches.length} Match{matches.length !== 1 ? 'es' : ''}
            </h2>
          </div>
          <div style={styles.cardBody}>
            <div style={styles.matchGrid}>
              {matches.map((match, index) => (
                <div key={match.id} style={styles.matchCard}>
                  <div style={styles.matchHeader}>
                    <div style={styles.matchName}>{match.name}</div>
                    <div style={{...styles.matchScore, ...getScoreColor(match.matchScore)}}>
                      {match.matchScore}/5
                    </div>
                  </div>
                  
                  <div style={styles.matchSkills}>
                    {match.skills.map((skill, skillIndex) => (
                      <span key={skillIndex} style={styles.skillTag}>
                        {skill}
                      </span>
                    ))}
                  </div>
                  
                  <div style={{ fontSize: 14, color: "#64748b", marginBottom: 8 }}>
                    Experience: {match.experience}
                  </div>
                  
                  <div style={styles.matchReason}>
                    💡 {match.reason}
                  </div>
                  
                  <div style={{ marginTop: 12 }}>
                    <button style={styles.btn}>
                      📧 Contact {match.name}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {!loading && matches.length === 0 && (
        <div style={styles.card}>
          <div style={styles.cardBody}>
            <div style={{ textAlign: "center", color: "#64748b" }}>
              <p>No matches found yet.</p>
              <p>Fill in your profile and click "Find Teammates" to get AI-powered recommendations!</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AITeamMatcher;
