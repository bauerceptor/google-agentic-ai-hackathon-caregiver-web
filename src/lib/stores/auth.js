import { writable } from 'svelte/store';

// Browser detection for localStorage
const browser = typeof window !== 'undefined';

// Auth store
function createAuthStore() {
  const { subscribe, set, update } = writable({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null
  });

  return {
    subscribe,
    login: async (email, password) => {
      update(state => ({ ...state, isLoading: true, error: null }));
      
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': import.meta.env.VITE_API_KEY
          },
          body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.detail || 'Login failed');
        }

        if (data.status === 'success') {
          const userData = {
            user: data.data,
            token: data.data.token,
            isAuthenticated: true,
            isLoading: false,
            error: null
          };

          set(userData);

          // Store in localStorage
          if (browser) {
            localStorage.setItem('healthvault_auth', JSON.stringify(userData));
          }

          return userData;
        } else {
          throw new Error(data.message || 'Login failed');
        }
      } catch (error) {
        const errorState = {
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: error.message
        };
        set(errorState);
        throw error;
      }
    },

    register: async (name, email, password) => {
      update(state => ({ ...state, isLoading: true, error: null }));
      
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': import.meta.env.VITE_API_KEY
          },
          body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.detail || 'Registration failed');
        }

        if (data.status === 'success') {
          const userData = {
            user: data.data,
            token: data.data.token,
            isAuthenticated: true,
            isLoading: false,
            error: null
          };

          set(userData);

          // Store in localStorage
          if (browser) {
            localStorage.setItem('healthvault_auth', JSON.stringify(userData));
          }

          return userData;
        } else {
          throw new Error(data.message || 'Registration failed');
        }
      } catch (error) {
        const errorState = {
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: error.message
        };
        set(errorState);
        throw error;
      }
    },

    logout: () => {
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      });

      if (browser) {
        localStorage.removeItem('healthvault_auth');
        localStorage.removeItem('healthvault_conversations');
      }
    },

    loadFromStorage: () => {
      if (browser) {
        const stored = localStorage.getItem('healthvault_auth');
        if (stored) {
          try {
            const authData = JSON.parse(stored);
            if (authData.token && authData.user) {
              set(authData);
            }
          } catch (error) {
            console.error('Error loading auth from storage:', error);
            localStorage.removeItem('healthvault_auth');
          }
        }
      }
    },

    clearError: () => {
      update(state => ({ ...state, error: null }));
    }
  };
}

export const auth = createAuthStore();