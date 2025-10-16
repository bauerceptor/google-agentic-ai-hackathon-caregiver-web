<script>
  import './app.css';
  import { onMount } from 'svelte';
  import { auth } from './lib/stores/auth.js';
  import { chat } from './lib/stores/chat.js';
  import AuthForm from './lib/components/AuthForm.svelte';
  import ChatMessage from './lib/components/ChatMessage.svelte';
  import ChatInput from './lib/components/ChatInput.svelte';
  import ConversationList from './lib/components/ConversationList.svelte';
  import { LogOut, Menu, X, Heart, MessageCircle, ChevronDown } from 'lucide-svelte';
  
  let authMode = 'login';
  let showSidebar = false;
  let chatContainer;
  let isUserScrolling = false;
  let lastMessageCount = 0;

  $: user = $auth.user;
  $: isAuthenticated = $auth.isAuthenticated;
  $: authLoading = $auth.isLoading;
  $: authError = $auth.error;
  $: chatLoading = $chat.isLoading;
  $: conversations = $chat.conversations;
  $: currentConversation = $chat.currentConversation;
  $: messages = currentConversation?.messages || [];

  onMount(() => {
    auth.loadFromStorage();
    chat.loadConversations();
  });

  async function handleAuth(event) {
    try {
      const { name, email, password } = event.detail;
      
      if (authMode === 'login') {
        await auth.login(email, password);
      } else {
        await auth.register(name, email, password);
      }
      
      // Load conversations after successful auth
      chat.loadConversations();
    } catch (error) {
      console.error('Auth error:', error);
    }
  }

  function handleAuthModeChange(event) {
    authMode = event.detail;
    auth.clearError();
  }

  async function handleSendMessage(event) {
    const message = event.detail;
    try {
      await chat.sendMessage(message, $auth.token);
      scrollToBottom(true); // Force scroll when sending message
    } catch (error) {
      console.error('Send message error:', error);
    }
  }

  function handleSelectConversation(event) {
    chat.selectConversation(event.detail);
    showSidebar = false;
    isUserScrolling = false; // Reset scrolling state
    setTimeout(() => scrollToBottom(true), 100); // Force scroll when switching conversations
  }

  function handleNewConversation() {
    chat.startNewConversation();
    showSidebar = false;
  }

  function handleDeleteConversation(event) {
    if (confirm('Are you sure you want to delete this conversation?')) {
      chat.deleteConversation(event.detail);
    }
  }

  function handleClearAllConversations() {
    if (confirm('Are you sure you want to delete all conversations? This action cannot be undone.')) {
      chat.clearAllConversations();
    }
  }

  function handleLogout() {
    if (confirm('Are you sure you want to log out?')) {
      auth.logout();
      showSidebar = false;
    }
  }

  function scrollToBottom(force = false) {
    if (!chatContainer) return;
    
    // Only auto-scroll if user isn't manually scrolling or if forced
    if (force || !isUserScrolling) {
      setTimeout(() => {
        if (chatContainer) {
          chatContainer.scrollTop = chatContainer.scrollHeight;
        }
      }, 100);
    }
  }

  function handleScroll() {
    if (!chatContainer) return;
    
    const { scrollTop, scrollHeight, clientHeight } = chatContainer;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 50; // 50px threshold
    
    // If user scrolls away from bottom, they're manually scrolling
    isUserScrolling = !isAtBottom;
  }

  function toggleSidebar() {
    showSidebar = !showSidebar;
  }

  // Smart auto-scroll: only scroll when new messages are added
  $: if (messages && messages.length > lastMessageCount) {
    lastMessageCount = messages.length;
    scrollToBottom();
  }
</script>

<svelte:head>
  <title>MediHelp - Your Medical Assistant</title>
  <meta name="description" content="Get reliable medical information and chat with our AI medical assistant" />
</svelte:head>

{#if !isAuthenticated}
  <!-- Authentication Screen -->
  <div class="min-h-screen flex items-center justify-center p-4">
    <AuthForm 
      mode={authMode}
      isLoading={authLoading}
      error={authError}
      on:submit={handleAuth}
      on:modeChange={handleAuthModeChange}
    />
  </div>
{:else}
  <!-- Main Chat Interface -->
  <div class="h-screen flex bg-gradient-to-br from-medical-50 to-primary-50">
    <!-- Mobile Sidebar Overlay -->
    {#if showSidebar}
      <div 
        class="fixed inset-0 bg-black/50 z-40 lg:hidden"
        on:click={toggleSidebar}
        on:keydown={(e) => e.key === 'Escape' && toggleSidebar()}
        role="button"
        tabindex="0"
      ></div>
    {/if}

    <!-- Sidebar -->
    <div class="
      {showSidebar ? 'translate-x-0' : '-translate-x-full'}
      lg:translate-x-0 lg:static
      fixed inset-y-0 left-0 z-50
      w-80 transition-transform duration-300 ease-in-out
    ">
      <ConversationList 
        {conversations}
        {currentConversation}
        on:select={handleSelectConversation}
        on:new={handleNewConversation}
        on:delete={handleDeleteConversation}
        on:clearAll={handleClearAllConversations}
      />
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col min-w-0 relative">
      <!-- Header -->
      <header class="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-4 py-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <!-- Mobile Menu Button -->
            <button
              on:click={toggleSidebar}
              class="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              {#if showSidebar}
                <X class="w-5 h-5" />
              {:else}
                <Menu class="w-5 h-5" />
              {/if}
            </button>

            <div class="flex items-center space-x-2">
              <div class="w-8 h-8 bg-gradient-to-br from-medical-500 to-medical-600 rounded-lg flex items-center justify-center">
                <Heart class="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 class="font-semibold text-gray-900">
                  {currentConversation?.title || 'MediHelp Chat'}
                </h1>
                {#if currentConversation}
                  <p class="text-xs text-gray-500">
                    {currentConversation.messages.length} message{currentConversation.messages.length !== 1 ? 's' : ''}
                  </p>
                {/if}
              </div>
            </div>
          </div>

          <div class="flex items-center space-x-3">
            <span class="hidden sm:block text-sm text-gray-600">
              Welcome, {user?.name || 'User'}
            </span>
            <button
              on:click={handleLogout}
              class="p-2 rounded-lg text-gray-600 hover:text-red-600 hover:bg-red-50 
                     transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              title="Logout"
            >
              <LogOut class="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <!-- Chat Messages -->
      <div 
        bind:this={chatContainer}
        on:scroll={handleScroll}
        class="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {#if messages.length === 0}
          <!-- Welcome Message -->
          <div class="flex justify-center items-center h-full">
            <div class="text-center max-w-lg">
              <div class="w-16 h-16 bg-gradient-to-br from-medical-500 to-medical-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <Heart class="w-8 h-8 text-white" />
              </div>
              <h2 class="text-2xl font-bold text-gray-900 mb-3">
                Welcome to MediHelp!
              </h2>
              <p class="text-gray-600 mb-6">
                Ask me about any medicine and I'll help you with detailed information about composition, uses, side effects, and user reviews.
              </p>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div class="p-3 bg-white/50 rounded-lg border border-gray-200">
                  <MessageCircle class="w-5 h-5 text-medical-500 mb-2" />
                  <p class="font-medium text-gray-900">Ask about medicines</p>
                  <p class="text-gray-600">Get detailed information</p>
                </div>
                <div class="p-3 bg-white/50 rounded-lg border border-gray-200">
                  <Heart class="w-5 h-5 text-medical-500 mb-2" />
                  <p class="font-medium text-gray-900">Professional advice</p>
                  <p class="text-gray-600">Reliable medical information</p>
                </div>
              </div>
            </div>
          </div>
        {:else}
          {#each messages as message (message.id)}
            <ChatMessage {message} />
          {/each}
          
          {#if chatLoading}
            <div class="flex justify-start">
              <div class="chat-bubble-ai">
                <div class="flex items-center space-x-2">
                  <div class="animate-pulse-soft">Thinking</div>
                  <div class="loading-dots"></div>
                </div>
              </div>
            </div>
          {/if}
        {/if}
      </div>

      <!-- Scroll to Bottom Button -->
      {#if isUserScrolling && messages.length > 0}
        <div class="absolute bottom-20 right-6">
          <button
            on:click={() => scrollToBottom(true)}
            class="bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-all duration-200 border border-gray-200"
            title="Scroll to bottom"
          >
            <ChevronDown class="w-5 h-5 text-gray-600" />
          </button>
        </div>
      {/if}

      <!-- Chat Input -->
      <ChatInput 
        isLoading={chatLoading}
        on:send={handleSendMessage}
      />
    </div>
  </div>
{/if}