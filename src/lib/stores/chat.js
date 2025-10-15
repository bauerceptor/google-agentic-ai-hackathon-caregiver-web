import { writable } from 'svelte/store';

// Browser detection for localStorage
const browser = typeof window !== 'undefined';

// Chat store
function createChatStore() {
  const { subscribe, set, update } = writable({
    conversations: [],
    currentConversation: null,
    isLoading: false,
    error: null
  });

  return {
    subscribe,
    
    loadConversations: () => {
      if (browser) {
        const stored = localStorage.getItem('healthvault_conversations');
        if (stored) {
          try {
            const conversations = JSON.parse(stored);
            update(state => ({ 
              ...state, 
              conversations: conversations.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated))
            }));
            
            // Set current conversation to the most recent one if none selected
            if (conversations.length > 0) {
              update(state => ({
                ...state,
                currentConversation: state.currentConversation || conversations[0]
              }));
            }
          } catch (error) {
            console.error('Error loading conversations:', error);
          }
        }
      }
    },

    startNewConversation: () => {
      const newConversation = {
        id: Date.now().toString(),
        title: 'New Conversation',
        messages: [],
        lastUpdated: new Date().toISOString()
      };

      update(state => ({
        ...state,
        currentConversation: newConversation
      }));
    },

    selectConversation: (conversation) => {
      update(state => ({
        ...state,
        currentConversation: conversation
      }));
    },

    sendMessage: async (message, token) => {
      update(state => ({ ...state, isLoading: true, error: null }));

      try {
        // Add user message immediately
        const userMessage = {
          id: Date.now().toString(),
          text: message,
          isUser: true,
          timestamp: new Date().toISOString()
        };

        let currentConv = null;
        update(state => {
          if (!state.currentConversation) {
            state.currentConversation = {
              id: Date.now().toString(),
              title: message.length > 30 ? message.substring(0, 30) + '...' : message,
              messages: [],
              lastUpdated: new Date().toISOString()
            };
          }

          state.currentConversation.messages = [...state.currentConversation.messages, userMessage];
          state.currentConversation.lastUpdated = new Date().toISOString();
          
          // Update title if this is the first message
          if (state.currentConversation.messages.length === 1) {
            state.currentConversation.title = message.length > 30 ? message.substring(0, 30) + '...' : message;
          }

          currentConv = state.currentConversation;
          return state;
        });

        // Send to API
        const response = await fetch('https://google-hackathon-henna.vercel.app/chat/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'your-api-key-here', // Replace with actual API key
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ user_input: message })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.detail || 'Failed to send message');
        }

        // Add AI response
        const aiMessage = {
          id: (Date.now() + 1).toString(),
          text: data.assistant_response || 'Sorry, I couldn\'t process your request.',
          isUser: false,
          timestamp: new Date().toISOString()
        };

        update(state => {
          if (state.currentConversation) {
            state.currentConversation.messages = [...state.currentConversation.messages, aiMessage];
            state.currentConversation.lastUpdated = new Date().toISOString();

            // Update conversations list
            const existingIndex = state.conversations.findIndex(c => c.id === state.currentConversation.id);
            if (existingIndex !== -1) {
              state.conversations[existingIndex] = state.currentConversation;
            } else {
              state.conversations = [state.currentConversation, ...state.conversations];
            }

            // Sort conversations by last updated
            state.conversations.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));

            // Save to localStorage
            if (browser) {
              localStorage.setItem('healthvault_conversations', JSON.stringify(state.conversations));
            }
          }

          return {
            ...state,
            isLoading: false,
            error: null
          };
        });

      } catch (error) {
        // Remove user message on error
        update(state => {
          if (state.currentConversation && state.currentConversation.messages.length > 0) {
            state.currentConversation.messages = state.currentConversation.messages.slice(0, -1);
          }
          return {
            ...state,
            isLoading: false,
            error: error.message
          };
        });
        throw error;
      }
    },

    deleteConversation: (conversationId) => {
      update(state => {
        state.conversations = state.conversations.filter(c => c.id !== conversationId);
        
        if (state.currentConversation?.id === conversationId) {
          state.currentConversation = state.conversations.length > 0 ? state.conversations[0] : null;
        }

        // Save to localStorage
        if (browser) {
          localStorage.setItem('healthvault_conversations', JSON.stringify(state.conversations));
        }

        return state;
      });
    },

    clearAllConversations: () => {
      update(state => ({
        ...state,
        conversations: [],
        currentConversation: null
      }));

      if (browser) {
        localStorage.removeItem('healthvault_conversations');
      }
    },

    clearError: () => {
      update(state => ({ ...state, error: null }));
    }
  };
}

export const chat = createChatStore();