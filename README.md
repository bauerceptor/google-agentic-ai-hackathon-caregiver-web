# HealthVault Web Frontend

A modern, responsive Svelte web application for the HealthVault medical chat system.

## Features

- 🔐 **User Authentication** - Register, login, and secure session management
- 💬 **Real-time Chat** - Chat with AI medical assistant about medicines
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- 🎨 **Modern UI** - Beautiful glass-morphism design with Tailwind CSS
- 💾 **Conversation History** - Save and manage chat conversations locally
- ⚡ **Fast Performance** - Built with Vite for lightning-fast development

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure API Key:**
   Edit `src/lib/stores/auth.js` and `src/lib/stores/chat.js` to replace `'your-api-key-here'` with your actual API key from the backend.

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000`

## API Configuration

The application is configured to connect to:
- **Backend URL:** `https://google-hackathon-henna.vercel.app`
- **API Key:** Update in the store files (see Quick Start step 2)

## Tech Stack

- **Frontend:** Svelte 4 + Vite
- **Styling:** Tailwind CSS + Glass-morphism effects
- **Icons:** Lucide Svelte
- **State Management:** Svelte stores
- **Storage:** Browser localStorage
- **Authentication:** JWT tokens

## Architecture

```
src/
├── lib/
│   ├── components/          # Reusable UI components
│   │   ├── AuthForm.svelte  # Login/Register form
│   │   ├── ChatInput.svelte # Message input with send button
│   │   ├── ChatMessage.svelte # Individual chat message bubble
│   │   └── ConversationList.svelte # Sidebar conversation history
│   └── stores/              # Svelte stores for state management
│       ├── auth.js          # Authentication state and API calls
│       └── chat.js          # Chat state and conversation management
├── App.svelte               # Main application component
├── main.js                  # Application entry point
└── app.css                  # Global styles and Tailwind imports
```

## Key Features

### Authentication System
- JWT token-based authentication
- Persistent login sessions
- Form validation with real-time feedback
- Secure password handling

### Chat Interface
- Beautiful message bubbles with gradients
- Click-to-copy functionality
- Auto-scrolling to new messages
- Typing indicators and loading states
- Professional medical assistant responses

### Conversation Management
- Create new conversations
- Browse conversation history
- Delete individual conversations
- Search and filter conversations
- Automatic conversation titles

### Responsive Design
- Mobile-first approach
- Collapsible sidebar on mobile
- Touch-friendly interactions
- Optimized for all screen sizes

## Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

The application can be deployed to any static hosting service:

- **Vercel:** Connect your repository for automatic deployments
- **Netlify:** Drag and drop the `dist` folder after running `npm run build`
- **GitHub Pages:** Use GitHub Actions to build and deploy

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details