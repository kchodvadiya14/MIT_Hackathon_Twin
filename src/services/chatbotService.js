import aiService from './aiService';

class ChatbotService {
  constructor() {
    this.conversationHistory = [];
    this.isAvailable = aiService.isAIAvailable();
  }

  // Initialize with welcome message
  getWelcomeMessage() {
    return {
      id: 'welcome',
      type: 'bot',
      content: "👋 Hi! I'm your Hackathon Assistant. I can help you with:",
      timestamp: new Date(),
             suggestions: [
         "How to use the app",
         "Web scraping features", 
         "AI tools and features",
         "Dashboard navigation",
         "Team finding",
         "Hackathon management",
         "User profile"
       ]
    };
  }

  // Get predefined responses for common questions
  getPredefinedResponse(query) {
    const lowerQuery = query.toLowerCase();
    
    // App usage and navigation
    if (lowerQuery.includes('how to use') || lowerQuery.includes('how do i use')) {
      return this.getAppUsageResponse();
    }
    
    if (lowerQuery.includes('dashboard') || lowerQuery.includes('navigate')) {
      return this.getNavigationResponse();
    }
    
    // Web scraping features
    if (lowerQuery.includes('scraper') || lowerQuery.includes('web scraping') || lowerQuery.includes('hackathon discovery')) {
      return this.getScraperResponse();
    }
    
    // AI features
    if (lowerQuery.includes('ai') || lowerQuery.includes('artificial intelligence') || lowerQuery.includes('ai tools')) {
      return this.getAIResponse();
    }
    
    // Team finding
    if (lowerQuery.includes('team') || lowerQuery.includes('teammate') || lowerQuery.includes('find team')) {
      return this.getTeamFindingResponse();
    }
    
    // Hackathon management
    if (lowerQuery.includes('hackathon') && (lowerQuery.includes('create') || lowerQuery.includes('manage') || lowerQuery.includes('organize'))) {
      return this.getHackathonManagementResponse();
    }
    
    // Role-based features
    if (lowerQuery.includes('role') || lowerQuery.includes('student') || lowerQuery.includes('organizer')) {
      return this.getRoleResponse();
    }
    
         // General help
     if (lowerQuery.includes('help') || lowerQuery.includes('support')) {
       return this.getGeneralHelpResponse();
     }
     
     // Profile management
     if (lowerQuery.includes('profile') || lowerQuery.includes('picture') || lowerQuery.includes('avatar') || lowerQuery.includes('photo')) {
       return this.getProfileResponse();
     }
     
     return null;
  }

  getAppUsageResponse() {
    return {
      type: 'bot',
      content: `🎯 **How to Use the Hackathon Management App:**

**1. Getting Started:**
- Sign up with your email and choose your role (Student or Organizer)
- Log in to access your personalized dashboard

**2. Main Features:**
- **Dashboard**: View hackathons, teams, and announcements based on your role
- **Web Scraper**: Discover hackathons from various websites
- **AI Tools**: Generate project ideas, find teammates, and create content

**3. Navigation:**
- Use the top navigation bar to switch between features
- Each role has different access levels and features

**4. Key Actions:**
- Students: Join hackathons, find teams, view announcements
- Organizers: Create hackathons, manage events, send announcements

Need help with a specific feature? Just ask!`,
      timestamp: new Date(),
      suggestions: ["Web scraping features", "AI tools", "Dashboard navigation", "Team finding"]
    };
  }

  getNavigationResponse() {
    return {
      type: 'bot',
      content: `🧭 **Dashboard Navigation Guide:**

**Top Navigation Bar:**
- **Dashboard**: Your main hub with hackathons and activities
- **🌐 Web Scraper**: Discover hackathons from external websites
- **🤖 AI Tools**: Access AI-powered features

**Dashboard Sections:**
- **Hackathons**: View available and your registered hackathons
- **Team Finder**: Find or create teams
- **Announcements**: Important updates and meetings

**Role-Specific Features:**
- **Students**: Join hackathons, find teammates, view announcements
- **Organizers**: Create hackathons, manage events, send announcements

**Quick Tips:**
- Click on any hackathon to see details
- Use the refresh button to update data
- Check announcements regularly for updates`,
      timestamp: new Date(),
      suggestions: ["Web scraping features", "AI tools", "Team finding", "Hackathon management"]
    };
  }

  getScraperResponse() {
    return {
      type: 'bot',
      content: `🌐 **Web Scraper Features:**

**What it does:**
- Automatically discovers hackathons from popular websites
- Extracts key information (title, dates, description, prizes)
- Supports multiple sources for comprehensive results

**How to use:**
1. Go to "🌐 Web Scraper" in the navigation
2. Click "Scrape All Sources" to get hackathons from known websites
3. Or enter a custom URL to scrape a specific site
4. View results with hackathon details and apply links

**Supported Sources:**
- Devpost
- MLH (Major League Hacking)
- Hackathon.com
- And more!

**Features:**
- Real-time data extraction
- Caching for faster results
- Error handling for unavailable sites
- Custom URL support

**Tips:**
- Use "Clear Cache" to get fresh data
- Check the "Last Updated" timestamp
- Click on hackathon titles for more details`,
      timestamp: new Date(),
      suggestions: ["AI tools", "How to use the app", "Dashboard navigation", "Team finding"]
    };
  }

  getAIResponse() {
    return {
      type: 'bot',
      content: `🤖 **AI-Powered Features:**

**Available AI Tools:**

**1. Project Idea Generator (Organizers only):**
- Generate creative project ideas based on hackathon themes
- Specify skills, difficulty level, and get detailed suggestions
- Includes technologies, impact, and time estimates

**2. AI Team Matcher (All users):**
- Create your profile with skills and preferences
- AI finds compatible teammates based on your profile
- Get match scores and reasoning for each suggestion

**3. Content Generator (Organizers only):**
- Generate announcements, descriptions, and rules
- Professional content for hackathon materials
- Multiple templates and customization options

**How to access:**
- Go to "🤖 AI Tools" in the navigation
- Choose your desired feature
- Follow the prompts to get AI-generated content

**Requirements:**
- OpenAI API key for real AI features
- Works with mock data if no API key is available

**Tips:**
- Be specific with your inputs for better results
- Use the copy feature to save generated content
- Experiment with different parameters`,
      timestamp: new Date(),
      suggestions: ["Web scraping features", "How to use the app", "Team finding", "Hackathon management"]
    };
  }

  getTeamFindingResponse() {
    return {
      type: 'bot',
      content: `👥 **Team Finding Guide:**

**For Students:**
1. **Find Existing Teams:**
   - Go to Dashboard → Team Finder
   - Browse available teams for hackathons
   - Send join requests to teams you're interested in

2. **Create Your Own Team:**
   - Use the "Create Team Request" form
   - Specify your skills, preferences, and hackathon
   - Wait for other students to join

3. **AI Team Matching:**
   - Go to AI Tools → Team Matcher
   - Create your profile with skills and preferences
   - Get AI-suggested compatible teammates

**For Organizers:**
- Monitor team formation in your hackathons
- Send announcements about team building
- Help facilitate team matching events

**Tips:**
- Be clear about your skills and availability
- Respond quickly to team requests
- Use the AI matcher for better compatibility
- Check announcements for team-building events`,
      timestamp: new Date(),
      suggestions: ["AI tools", "Dashboard navigation", "How to use the app", "Hackathon management"]
    };
  }

  getHackathonManagementResponse() {
    return {
      type: 'bot',
      content: `🏆 **Hackathon Management (Organizers):**

**Creating Hackathons:**
1. Go to Dashboard → Create Hackathon
2. Fill in details: title, description, dates, prizes
3. Set registration deadlines and team size limits
4. Save to publish your hackathon

**Managing Existing Hackathons:**
- View all your hackathons in "My Hackathons"
- Edit details, update status, or delete hackathons
- Monitor registrations and team formation

**Announcements & Meetings:**
- Create announcements for participants
- Schedule meetings with links and notes
- Send important updates to all participants

**AI Content Generation:**
- Use AI Tools to generate announcements
- Create professional descriptions and rules
- Save time with AI-powered content

**Best Practices:**
- Keep descriptions clear and engaging
- Set realistic deadlines and team sizes
- Regular announcements keep participants engaged
- Use AI tools for professional content`,
      timestamp: new Date(),
      suggestions: ["AI tools", "Team finding", "Dashboard navigation", "How to use the app"]
    };
  }

  getRoleResponse() {
    return {
      type: 'bot',
      content: `👤 **Role-Based Features:**

**Student Role:**
- Join hackathons and find teams
- View announcements and meetings
- Use AI team matching
- Access web scraper for hackathon discovery
- Limited to participant features

**Organizer Role:**
- Create and manage hackathons
- Send announcements and schedule meetings
- Use all AI tools (project ideas, content generation)
- Monitor team formation and registrations
- Full administrative access

**Switching Roles:**
- Roles are set during signup
- Contact support if you need to change roles
- Each role has different dashboard views

**Feature Access:**
- **Students**: Dashboard, Web Scraper, AI Team Matcher
- **Organizers**: All features + Hackathon Management, AI Content Generator

**Tips:**
- Choose your role carefully during signup
- Organizers have access to all student features
- Different dashboards provide role-specific information`,
      timestamp: new Date(),
      suggestions: ["How to use the app", "Dashboard navigation", "AI tools", "Team finding"]
    };
  }

     getProfileResponse() {
     return {
       type: 'bot',
       content: `👤 **User Profile Management:**

**What you can do:**
- Upload and change your profile picture
- Edit your full name and city
- Add a personal bio about yourself
- View your current profile information

**How to access:**
1. Click "👤 Profile" in the top navigation
2. View your current profile information
3. Click "Edit Profile" to make changes

**Profile Picture:**
- Click the camera icon on your avatar to upload a new picture
- Supported formats: JPG, PNG, GIF
- Maximum file size: 5MB
- Your picture will be displayed as a circular avatar

**Profile Information:**
- **Name**: Your full name (required)
- **City**: Your current city or location
- **Bio**: A short description about yourself (max 500 characters)
- **Email**: Your registered email address (read-only)
- **Role**: Your current role (Student/Organizer)

**Tips:**
- Use a clear, professional photo for your profile picture
- Keep your bio concise and relevant to hackathons
- Update your city to help with team matching
- Your profile information helps others get to know you better

**Privacy:**
- Your profile information is visible to other users
- Only your email and role are automatically set`,
       timestamp: new Date(),
       suggestions: ["How to use the app", "Dashboard navigation", "Team finding", "AI tools"]
     };
   }

   getGeneralHelpResponse() {
     return {
       type: 'bot',
       content: `❓ **General Help & Support:**

**Quick Start:**
1. Sign up and choose your role
2. Explore your dashboard
3. Try the web scraper to find hackathons
4. Use AI tools for enhanced features

**Common Questions:**
- **"How do I join a hackathon?"** → Go to Dashboard → Hackathons → Click "Join"
- **"How do I find teammates?"** → Use Team Finder or AI Team Matcher
- **"How do I create a hackathon?"** → Organizers only: Dashboard → Create Hackathon
- **"Where are the AI tools?"** → Navigation → "🤖 AI Tools"

**Troubleshooting:**
- **Can't log in?** → Check your email/password or reset password
- **Feature not working?** → Try refreshing the page
- **AI not responding?** → Check if you have an OpenAI API key set up

**Need More Help?**
- Ask me specific questions about features
- Check the navigation for different sections
- Each feature has its own help documentation

**Pro Tips:**
- Use the web scraper to discover new hackathons
- AI tools can save time on content creation
- Regular dashboard checks keep you updated`,
      timestamp: new Date(),
      suggestions: ["How to use the app", "Web scraping features", "AI tools", "Dashboard navigation"]
    };
  }

  // Process user message and generate response
  async processMessage(message) {
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    this.conversationHistory.push(userMessage);

    // Check for predefined responses first
    const predefinedResponse = this.getPredefinedResponse(message);
    if (predefinedResponse) {
      this.conversationHistory.push(predefinedResponse);
      return predefinedResponse;
    }

    // If AI is available, try to get a more contextual response
    if (this.isAvailable) {
      try {
        const aiResponse = await this.getAIResponse(message);
        this.conversationHistory.push(aiResponse);
        return aiResponse;
      } catch (error) {
        console.error('AI response error:', error);
      }
    }

    // Fallback response
    const fallbackResponse = {
      id: Date.now() + 1,
      type: 'bot',
      content: `I'm not sure about that specific question. Here are some topics I can help with:

• How to use the app and navigate features
• Web scraping for hackathon discovery  
• AI tools and their capabilities
• Team finding and management
• Hackathon creation and management
• Role-based features and access

Try asking about one of these topics, or be more specific with your question!`,
      timestamp: new Date(),
      suggestions: ["How to use the app", "Web scraping features", "AI tools", "Team finding"]
    };

    this.conversationHistory.push(fallbackResponse);
    return fallbackResponse;
  }

  // Get AI-powered response for complex questions
  async getAIResponse(message) {
    const prompt = `You are a helpful assistant for a hackathon management application. A user is asking: "${message}"

The application has these main features:
- User authentication with role-based access (Student/Organizer)
- Dashboard with hackathons, teams, and announcements
- Web scraper to discover hackathons from external websites
- AI tools: project idea generation, team matching, content generation
- Team finding and management
- Hackathon creation and management (organizers only)

Provide a helpful, concise response (max 200 words) that guides the user to the right feature or explains how to accomplish their goal. Be friendly and encouraging.`;

    try {
      const response = await aiService.callOpenAI(prompt);
      return {
        id: Date.now() + 1,
        type: 'bot',
        content: response,
        timestamp: new Date(),
        suggestions: ["How to use the app", "Web scraping features", "AI tools", "Team finding"]
      };
    } catch (error) {
      throw error;
    }
  }

  // Get conversation history
  getConversationHistory() {
    return this.conversationHistory;
  }

  // Clear conversation history
  clearHistory() {
    this.conversationHistory = [this.getWelcomeMessage()];
  }

  // Check if AI is available
  isAIAvailable() {
    return this.isAvailable;
  }
}

export default new ChatbotService();
