<script>
  import { Heart, User, Copy, Check } from 'lucide-svelte';
  
  export let message;
  
  let showCopied = false;
  
  function formatTime(timestamp) {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - messageTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  }
  
  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(message.text);
      showCopied = true;
      setTimeout(() => {
        showCopied = false;
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  }
</script>

<div class="flex mb-6 animate-slide-up {message.isUser ? 'justify-end' : 'justify-start'}">
  <div class="flex max-w-xs lg:max-w-md {message.isUser ? 'flex-row-reverse' : 'flex-row'} items-end space-x-2">
    <!-- Avatar -->
    <div class="flex-shrink-0 w-8 h-8 rounded-full {message.isUser ? 'ml-2' : 'mr-2'} flex items-center justify-center {message.isUser ? 'bg-gradient-to-br from-medical-500 to-medical-600' : 'bg-gradient-to-br from-primary-500 to-primary-600'}">
      {#if message.isUser}
        <User class="w-4 h-4 text-white" />
      {:else}
        <Heart class="w-4 h-4 text-white" />
      {/if}
    </div>
    
    <!-- Message Bubble -->
    <div class="relative group">
      <div 
        class="px-4 py-3 rounded-2xl shadow-lg relative {message.isUser ? 'chat-bubble-user rounded-br-md' : 'chat-bubble-ai rounded-bl-md'}"
        role="button"
        tabindex="0"
        on:click={copyToClipboard}
        on:keydown={(e) => e.key === 'Enter' && copyToClipboard()}
      >
        <p class="text-sm leading-relaxed whitespace-pre-wrap break-words">
          {message.text}
        </p>
        
        <!-- Timestamp -->
        <div class="flex items-center justify-between mt-2 pt-1">
          <span class="text-xs {message.isUser ? 'text-white/70' : 'text-gray-500'}">
            {formatTime(message.timestamp)}
          </span>
          
          <!-- Copy indicator -->
          <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-2">
            {#if showCopied}
              <Check class="w-3 h-3 {message.isUser ? 'text-white/70' : 'text-gray-500'}" />
            {:else}
              <Copy class="w-3 h-3 {message.isUser ? 'text-white/70' : 'text-gray-500'}" />
            {/if}
          </div>
        </div>
      </div>
      
      <!-- Copy tooltip -->
      <div class="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
        {showCopied ? 'Copied!' : 'Click to copy'}
      </div>
    </div>
  </div>
</div>