# Hackathon Management Platform

A comprehensive hackathon management platform built with React, Supabase, and web scraping capabilities.

## Features

### Core Features
- ✅ Email + Password authentication with Supabase
- ✅ Role-based dashboards (Student / Organizer)
- ✅ Protected routes via React Router
- ✅ Plain CSS (no Tailwind)
- ✅ Web scraping for hackathon discovery
- ✅ AI-powered project idea generation
- ✅ AI team matching and recommendations
- ✅ AI content generation for organizers
- ✅ Interactive chatbot for help and guidance
- ✅ User profile management with photo upload

### Web Scraping Features
- 🌐 **Multi-source scraping**: Scrape hackathons from popular websites
- 🔍 **Custom URL scraping**: Scrape any website for hackathon information
- 📊 **Structured data extraction**: Automatically parse titles, dates, locations, prizes
- ⚡ **Caching system**: Cache results to improve performance
- 🔄 **Real-time updates**: Get fresh data with cache clearing

### AI-Powered Features
- 🤖 **Project Idea Generator**: Generate innovative project ideas based on themes and skills
- 🤝 **AI Team Matcher**: Find perfect teammates using skill and preference matching
- ✍️ **Content Generator**: Create professional announcements, descriptions, and rules
- 📈 **Success Prediction**: Predict hackathon success metrics
- 🎯 **Learning Path Recommendations**: Personalized learning recommendations
- 📊 **Project Analysis**: AI-powered project feedback and analysis

### Chatbot Features
- 💬 **Interactive Help**: Get instant help with app features and navigation
- 🎯 **Contextual Responses**: Smart responses based on user questions and app context
- 🔗 **Quick Suggestions**: Clickable suggestion buttons for common questions
- 🤖 **AI-Powered**: Enhanced responses using OpenAI when available
- 📱 **Floating Interface**: Always accessible chat button in bottom-right corner
- 🎨 **Modern UI**: Clean, responsive chat interface with typing indicators

### User Profile Features
- 👤 **Profile Management**: Edit personal information and upload profile pictures
- 📸 **Photo Upload**: Upload and change profile pictures with validation
- 📝 **Bio & Details**: Add personal bio, city, and other profile information
- 🎨 **Modern Interface**: Clean, responsive profile editing interface
- ✅ **Form Validation**: Real-time validation for file types and sizes
- 🔄 **Preview System**: Instant preview of uploaded profile pictures

### Supported Hackathon Sources
- **Devpost**: Find hackathons and coding competitions
- **MLH (Major League Hacking)**: Official student hackathon league
- **Hackathon.com**: Global hackathon directory
- **HackerEarth**: Programming challenges and hackathons
- **AngelHack**: Global hackathon series
- **Custom URLs**: Any website with hackathon information

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Supabase account (for authentication and database)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd hackathon-platform
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OPENAI_API_KEY=your_openai_api_key
```

4. Start the development server:
```bash
npm run dev
```

5. For production with web scraping proxy:
```bash
npm run start
```

## Usage

### Web Scraper

1. **Navigate to Web Scraper**: Click on "🌐 Web Scraper" in the navigation menu
2. **Scrape All Sources**: Click "Scrape All Sources" to get hackathons from all supported websites
3. **Custom URL Scraping**: Enter any URL to scrape hackathon information from that specific website
4. **View Results**: Browse scraped hackathons with details like dates, locations, prizes, and descriptions
5. **Clear Cache**: Use "Clear Cache" to get fresh data

### AI Tools

1. **Navigate to AI Tools**: Click on "🤖 AI Tools" in the navigation menu
2. **Project Idea Generator**: Enter hackathon theme and skills to get AI-generated project ideas
3. **Team Matcher**: Create your profile and find compatible teammates
4. **Content Generator**: Generate professional hackathon content (announcements, descriptions, rules)
5. **Real AI Features**: Add your OpenAI API key to enable real AI-powered suggestions

### Chatbot

1. **Access Chatbot**: Click the 💬 chat button in the bottom-right corner of any page
2. **Ask Questions**: Type your questions about app features, navigation, or usage
3. **Use Suggestions**: Click on suggestion buttons for quick access to common topics
4. **Get Help**: Receive contextual help for:
   - How to use the app and navigate features
   - Web scraping capabilities and usage
   - AI tools and their functions
   - Team finding and management
   - Hackathon creation and management
   - Role-based features and access
   - User profile management
5. **AI Enhancement**: With OpenAI API key, get more detailed and contextual responses

### User Profile

1. **Access Profile**: Click "👤 Profile" in the top navigation menu
2. **View Information**: See your current profile details including name, email, city, bio, and role
3. **Edit Profile**: Click "Edit Profile" to modify your information
4. **Upload Photo**: Click the camera icon on your avatar to upload a new profile picture
5. **Save Changes**: Click "Save Changes" to update your profile
6. **Profile Features**:
   - **Profile Picture**: Upload JPG, PNG, or GIF files (max 5MB)
   - **Name**: Your full name (required field)
   - **City**: Your current city or location
   - **Bio**: Personal description (max 500 characters)
   - **Email**: Your registered email (read-only)
   - **Role**: Your current role (Student/Organizer)

### Features for Students
- Browse ongoing and upcoming hackathons
- Find teammates through the team finder
- View announcements and meeting links
- Access scraped hackathon opportunities

### Features for Organizers
- Create and manage hackathons
- Schedule meetings and announcements
- Monitor hackathon status
- Access web scraping for inspiration

## Technical Details

### Web Scraping Architecture
- **Frontend**: React component with real-time UI updates
- **Backend**: Express.js proxy server to handle CORS issues
- **Parsing**: Cheerio for HTML parsing and data extraction
- **Caching**: In-memory cache with 5-minute timeout
- **Error Handling**: Graceful fallbacks and user-friendly error messages

### AI Architecture
- **Service Layer**: Centralized AI service with OpenAI integration
- **Mock Data**: Fallback responses when OpenAI API is unavailable
- **Role-based Access**: Different AI features for different user roles
- **Context Awareness**: AI responses tailored to hackathon management context

### Chatbot Architecture
- **Service Layer**: ChatbotService with predefined responses and AI integration
- **UI Component**: Floating chat interface with modern design
- **Context Management**: Conversation history and suggestion system
- **AI Enhancement**: OpenAI integration for complex queries
- **Responsive Design**: Mobile-friendly chat interface

### Profile Architecture
- **Component**: UserProfile with edit/view modes
- **File Upload**: Image validation and preview system
- **Form Management**: Controlled inputs with validation
- **State Management**: Local state for form data and UI states
- **User Metadata**: Integration with Supabase user metadata

### API Endpoints
- `GET /api/proxy?url=<target_url>`: Proxy endpoint for web scraping
- `GET /api/health`: Health check endpoint

### Dependencies
- **Frontend**: React, React Router, Supabase Client
- **Web Scraping**: Axios, Cheerio
- **Backend**: Express, CORS
- **Build Tool**: Vite

## Development

### Project Structure
```
src/
├── components/
│   ├── HackathonScraper.jsx    # Web scraping UI component
│   ├── AIDashboard.jsx         # AI tools dashboard
│   ├── AIProjectGenerator.jsx  # AI project idea generator
│   ├── AITeamMatcher.jsx       # AI team matching
│   ├── AIContentGenerator.jsx  # AI content generation
│   ├── Chatbot.jsx             # Interactive chatbot
│   └── UserProfile.jsx         # User profile management
├── services/
│   ├── webScraper.js          # Web scraping service
│   ├── aiService.js           # AI service with OpenAI integration
│   └── chatbotService.js      # Chatbot service with help responses
├── App.jsx                     # Main application
└── main.jsx                    # Entry point

server.js                       # Express proxy server
```

### Adding New Scraping Sources
1. Add the source configuration to `HACKATHON_SOURCES` in `webScraper.js`
2. Define CSS selectors for data extraction
3. Test the scraping functionality
4. Update the popular sites list in the UI

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.#   M I T _ H a c k a t h o n _ T w i n  
 