<script>
  import { createEventDispatcher } from 'svelte';
  import { Send, Loader2 } from 'lucide-svelte';
  
  export let isLoading = false;
  export let placeholder = 'Ask about a medicine...';
  
  const dispatch = createEventDispatcher();
  
  let message = '';
  let textareaElement;
  
  function handleSubmit() {
    const trimmedMessage = message.trim();
    if (trimmedMessage && !isLoading) {
      dispatch('send', trimmedMessage);
      message = '';
      resetTextareaHeight();
    }
  }
  
  function handleKeydown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  }
  
  function autoResize() {
    if (textareaElement) {
      textareaElement.style.height = 'auto';
      textareaElement.style.height = Math.min(textareaElement.scrollHeight, 120) + 'px';
    }
  }
  
  function resetTextareaHeight() {
    if (textareaElement) {
      textareaElement.style.height = 'auto';
    }
  }
  
  $: if (message === '') {
    resetTextareaHeight();
  }
</script>

<div class="border-t border-gray-200 bg-white/80 backdrop-blur-sm p-4">
  <div class="max-w-4xl mx-auto">
    <form on:submit|preventDefault={handleSubmit} class="flex items-end space-x-3">
      <div class="flex-1 relative">
        <textarea
          bind:this={textareaElement}
          bind:value={message}
          on:input={autoResize}
          on:keydown={handleKeydown}
          {placeholder}
          rows="1"
          disabled={isLoading}
          class="block w-full resize-none border border-gray-300 rounded-2xl px-4 py-3 pr-12 
                 bg-white/50 backdrop-blur-sm placeholder-gray-500 
                 focus:ring-2 focus:ring-medical-500 focus:border-medical-500
                 transition-all duration-200 overflow-hidden"
          style="max-height: 120px;"
        ></textarea>
        
        <!-- Character count (optional) -->
        {#if message.length > 200}
          <div class="absolute bottom-1 left-3 text-xs text-gray-400">
            {message.length}/500
          </div>
        {/if}
      </div>
      
      <button
        type="submit"
        disabled={!message.trim() || isLoading}
        class="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-r from-medical-500 to-medical-600 
               text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5
               disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
               transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:ring-offset-2
               flex items-center justify-center"
      >
        {#if isLoading}
          <Loader2 class="w-5 h-5 animate-spin" />
        {:else}
          <Send class="w-5 h-5" />
        {/if}
      </button>
    </form>
    
    <!-- Disclaimer -->
    <p class="text-xs text-gray-500 text-center mt-2">
      MediHelp provides medicine information only. Always consult healthcare professionals for medical advice.
    </p>
  </div>
</div>