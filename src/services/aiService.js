// AI Service for Hackathon Management System
// This service provides AI-powered features using OpenAI API or similar services

class AIService {
  constructor() {
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    this.baseUrl = 'https://api.openai.com/v1';
    this.isAvailable = !!this.apiKey;
  }

  // Check if AI features are available
  isAIAvailable() {
    return this.isAvailable;
  }

  // Generate project ideas based on hackathon theme and user skills
  async generateProjectIdeas(theme, skills, difficulty = 'intermediate') {
    if (!this.isAvailable) {
      return this.getMockProjectIdeas(theme, skills, difficulty);
    }

    try {
      const prompt = `Generate 5 innovative project ideas for a hackathon with theme "${theme}". 
      Consider these skills: ${skills.join(', ')}. 
      Difficulty level: ${difficulty}.
      For each idea, provide:
      - Project name
      - Brief description (2-3 sentences)
      - Required technologies
      - Potential impact
      - Estimated development time
      
      Format as JSON array with fields: name, description, technologies, impact, timeEstimate`;

      const response = await this.callOpenAI(prompt);
      return JSON.parse(response);
    } catch (error) {
      console.error('Error generating project ideas:', error);
      return this.getMockProjectIdeas(theme, skills, difficulty);
    }
  }

  // Match users based on skills and preferences
  async matchTeammates(userProfile, availableUsers) {
    if (!this.isAvailable) {
      return this.getMockTeamMatches(userProfile, availableUsers);
    }

    try {
      const prompt = `Given a user profile with skills: ${userProfile.skills.join(', ')}, 
      preferences: ${userProfile.preferences}, and experience: ${userProfile.experience},
      
      Rank the following available users for team matching (1-5, 5 being best match):
      ${availableUsers.map(u => `- ${u.name}: Skills: ${u.skills.join(', ')}, Experience: ${u.experience}`).join('\n')}
      
      Return JSON array with userId and matchScore (1-5) for each user.`;

      const response = await this.callOpenAI(prompt);
      return JSON.parse(response);
    } catch (error) {
      console.error('Error matching teammates:', error);
      return this.getMockTeamMatches(userProfile, availableUsers);
    }
  }

  // Generate hackathon announcements and content
  async generateContent(contentType, context) {
    if (!this.isAvailable) {
      return this.getMockContent(contentType, context);
    }

    try {
      let prompt = '';
      switch (contentType) {
        case 'announcement':
          prompt = `Write a professional hackathon announcement for: ${context.event}. 
          Include: welcome message, key details, next steps, and encouraging tone.`;
          break;
        case 'description':
          prompt = `Write an engaging hackathon description for: ${context.title}. 
          Theme: ${context.theme}. Duration: ${context.duration}. 
          Make it exciting and informative.`;
          break;
        case 'rules':
          prompt = `Generate comprehensive hackathon rules for: ${context.event}. 
          Include: eligibility, submission guidelines, judging criteria, and code of conduct.`;
          break;
        default:
          prompt = `Generate ${contentType} content for: ${context}`;
      }

      const response = await this.callOpenAI(prompt);
      return response;
    } catch (error) {
      console.error('Error generating content:', error);
      return this.getMockContent(contentType, context);
    }
  }

  // Analyze project submissions and provide feedback
  async analyzeProject(projectData) {
    if (!this.isAvailable) {
      return this.getMockProjectAnalysis(projectData);
    }

    try {
      const prompt = `Analyze this hackathon project and provide constructive feedback:
      Project: ${projectData.name}
      Description: ${projectData.description}
      Technologies: ${projectData.technologies.join(', ')}
      
      Provide feedback on:
      - Innovation and creativity
      - Technical implementation
      - User experience
      - Potential impact
      - Areas for improvement
      
      Format as JSON with fields: innovation, technical, ux, impact, improvements`;

      const response = await this.callOpenAI(prompt);
      return JSON.parse(response);
    } catch (error) {
      console.error('Error analyzing project:', error);
      return this.getMockProjectAnalysis(projectData);
    }
  }

  // Generate personalized learning recommendations
  async generateLearningPath(userSkills, hackathonTheme) {
    if (!this.isAvailable) {
      return this.getMockLearningPath(userSkills, hackathonTheme);
    }

    try {
      const prompt = `Create a personalized learning path for a developer with skills: ${userSkills.join(', ')}
      preparing for a hackathon with theme: ${hackathonTheme}.
      
      Include:
      - Recommended technologies to learn
      - Learning resources (courses, tutorials, docs)
      - Practice projects
      - Timeline (1-4 weeks)
      
      Format as JSON with fields: technologies, resources, projects, timeline`;

      const response = await this.callOpenAI(prompt);
      return JSON.parse(response);
    } catch (error) {
      console.error('Error generating learning path:', error);
      return this.getMockLearningPath(userSkills, hackathonTheme);
    }
  }

  // Predict hackathon success metrics
  async predictSuccessMetrics(hackathonData) {
    if (!this.isAvailable) {
      return this.getMockSuccessPrediction(hackathonData);
    }

    try {
      const prompt = `Based on this hackathon data, predict success metrics:
      Theme: ${hackathonData.theme}
      Duration: ${hackathonData.duration}
      Expected participants: ${hackathonData.expectedParticipants}
      Prize pool: ${hackathonData.prizePool}
      
      Predict:
      - Participant engagement rate
      - Project completion rate
      - Quality of submissions
      - Community feedback score
      
      Format as JSON with fields: engagement, completion, quality, feedback`;

      const response = await this.callOpenAI(prompt);
      return JSON.parse(response);
    } catch (error) {
      console.error('Error predicting success:', error);
      return this.getMockSuccessPrediction(hackathonData);
    }
  }

  // Helper method to call OpenAI API
  async callOpenAI(prompt) {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  // Mock data for when AI is not available
  getMockProjectIdeas(theme, skills, difficulty) {
    const ideas = [
      {
        name: `AI-Powered ${theme} Assistant`,
        description: `An intelligent assistant that helps users navigate and interact with ${theme} related content using natural language processing.`,
        technologies: ['Python', 'React', 'OpenAI API', 'FastAPI'],
        impact: 'Improves user experience and accessibility',
        timeEstimate: '24-48 hours'
      },
      {
        name: `${theme} Analytics Dashboard`,
        description: `A comprehensive dashboard that visualizes ${theme} data and provides actionable insights.`,
        technologies: ['JavaScript', 'D3.js', 'Node.js', 'MongoDB'],
        impact: 'Data-driven decision making',
        timeEstimate: '36-48 hours'
      },
      {
        name: `${theme} Community Platform`,
        description: `A social platform for ${theme} enthusiasts to connect, share, and collaborate.`,
        technologies: ['React', 'Firebase', 'Tailwind CSS', 'Socket.io'],
        impact: 'Builds community engagement',
        timeEstimate: '48-72 hours'
      }
    ];
    return ideas;
  }

  getMockTeamMatches(userProfile, availableUsers) {
    return availableUsers.slice(0, 5).map((user, index) => ({
      userId: user.id,
      matchScore: 5 - index,
      reason: `Strong ${userProfile.skills[0]} skills and similar interests`
    }));
  }

  getMockContent(contentType, context) {
    const templates = {
      announcement: `🎉 Welcome to ${context.event}! We're excited to have you join us for this incredible hackathon experience. Get ready to innovate, collaborate, and build something amazing!`,
      description: `${context.title} is an exciting hackathon focused on ${context.theme}. Join us for ${context.duration} of intense coding, learning, and innovation!`,
      rules: `Hackathon Rules: 1) Be respectful and inclusive 2) Original work only 3) Submit on time 4) Have fun!`
    };
    return templates[contentType] || 'Generated content here...';
  }

  getMockProjectAnalysis(projectData) {
    return {
      innovation: 4.2,
      technical: 3.8,
      ux: 4.0,
      impact: 4.5,
      improvements: 'Consider adding more user testing and performance optimization.'
    };
  }

  getMockLearningPath(userSkills, hackathonTheme) {
    return {
      technologies: ['React', 'Node.js', 'MongoDB'],
      resources: ['React docs', 'Node.js tutorials', 'MongoDB university'],
      projects: ['Todo app', 'API development', 'Database design'],
      timeline: '2-3 weeks'
    };
  }

  getMockSuccessPrediction(hackathonData) {
    return {
      engagement: 85,
      completion: 78,
      quality: 4.2,
      feedback: 4.5
    };
  }
}

export default new AIService();
