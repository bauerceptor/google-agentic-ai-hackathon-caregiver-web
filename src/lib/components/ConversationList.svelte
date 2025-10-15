<script>
  import { createEventDispatcher } from 'svelte';
  import { MessageCircle, Trash2, Plus } from 'lucide-svelte';
  
  export let conversations = [];
  export let currentConversation = null;
  
  const dispatch = createEventDispatcher();
  
  function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    
    // For older conversations, show the date
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
  
  function getPreview(conversation) {
    if (conversation.messages.length === 0) return 'New conversation';
    const lastMessage = conversation.messages[conversation.messages.length - 1];
    return lastMessage.text.length > 60 
      ? lastMessage.text.substring(0, 60) + '...'
      : lastMessage.text;
  }
  
  function handleSelect(conversation) {
    dispatch('select', conversation);
  }
  
  function handleDelete(event, conversationId) {
    event.stopPropagation();
    dispatch('delete', conversationId);
  }
  
  function handleNewConversation() {
    dispatch('new');
  }
</script>

<div class="h-full flex flex-col bg-white/50 backdrop-blur-sm border-r border-gray-200">
  <!-- Header -->
  <div class="p-4 border-b border-gray-200">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-semibold text-gray-900">Conversations</h2>
      <button
        on:click={handleNewConversation}
        class="p-2 rounded-lg bg-medical-500 text-white hover:bg-medical-600 
               transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:ring-offset-2"
        title="Start new conversation"
      >
        <Plus class="w-4 h-4" />
      </button>
    </div>
  </div>
  
  <!-- Conversation List -->
  <div class="flex-1 overflow-y-auto">
    {#if conversations.length === 0}
      <div class="p-6 text-center">
        <MessageCircle class="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p class="text-gray-600 text-sm">No conversations yet</p>
        <p class="text-gray-500 text-xs mt-1">Start chatting to see conversations here</p>
      </div>
    {:else}
      <div class="p-2 space-y-1">
        {#each conversations as conversation (conversation.id)}
          <div
            class="group relative p-3 rounded-lg cursor-pointer transition-all duration-200
                   {currentConversation?.id === conversation.id 
                     ? 'bg-medical-50 border border-medical-200' 
                     : 'hover:bg-gray-50 border border-transparent'}"
            on:click={() => handleSelect(conversation)}
            on:keydown={(e) => e.key === 'Enter' && handleSelect(conversation)}
            role="button"
            tabindex="0"
          >
            <!-- Conversation Icon -->
            <div class="flex items-start space-x-3">
              <div class="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-medical-500 to-medical-600 
                          flex items-center justify-center">
                <MessageCircle class="w-5 h-5 text-white" />
              </div>
              
              <div class="flex-1 min-w-0">
                <!-- Title -->
                <h3 class="font-medium text-gray-900 truncate text-sm">
                  {conversation.title}
                </h3>
                
                <!-- Preview -->
                <p class="text-xs text-gray-600 mt-1 line-clamp-2 leading-relaxed">
                  {getPreview(conversation)}
                </p>
                
                <!-- Date -->
                <p class="text-xs text-gray-500 mt-2">
                  {formatDate(conversation.lastUpdated)}
                </p>
              </div>
              
              <!-- Delete Button -->
              <button
                on:click={(e) => handleDelete(e, conversation.id)}
                class="opacity-0 group-hover:opacity-100 p-1 rounded text-gray-400 hover:text-red-600 hover:bg-red-50
                       transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                title="Delete conversation"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
            
            <!-- Active indicator -->
            {#if currentConversation?.id === conversation.id}
              <div class="absolute left-0 top-3 bottom-3 w-1 bg-medical-500 rounded-r"></div>
            {/if}
          </div>
        {/each}
      </div>
    {/if}
  </div>
  
  <!-- Footer Actions -->
  {#if conversations.length > 0}
    <div class="p-4 border-t border-gray-200">
      <button
        on:click={() => dispatch('clearAll')}
        class="w-full text-sm text-gray-600 hover:text-red-600 py-2 px-3 rounded-lg
               hover:bg-red-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
      >
        Clear All Conversations
      </button>
    </div>
  {/if}
</div>

<style>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>