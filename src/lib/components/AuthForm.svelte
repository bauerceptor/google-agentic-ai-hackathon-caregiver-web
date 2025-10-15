<script>
  import { createEventDispatcher } from 'svelte';
  import { Eye, EyeOff, User, Mail, Lock, Heart } from 'lucide-svelte';
  
  export let mode = 'login'; // 'login' or 'register'
  export let isLoading = false;
  export let error = null;

  const dispatch = createEventDispatcher();

  let formData = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  let showPassword = false;
  let showConfirmPassword = false;
  let errors = {};

  function validateForm() {
    errors = {};

    if (mode === 'register' && !formData.name.trim()) {
      errors.name = 'Name is required';
    } else if (mode === 'register' && formData.name.length < 3) {
      errors.name = 'Name must be at least 3 characters';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (mode === 'register' && formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    return Object.keys(errors).length === 0;
  }

  function handleSubmit() {
    if (validateForm()) {
      dispatch('submit', {
        name: formData.name,
        email: formData.email.toLowerCase().trim(),
        password: formData.password
      });
    }
  }

  function toggleMode() {
    mode = mode === 'login' ? 'register' : 'login';
    formData = { name: '', email: '', password: '', confirmPassword: '' };
    errors = {};
    dispatch('modeChange', mode);
  }
</script>

<div class="w-full max-w-md mx-auto">
  <div class="card p-8">
    <!-- Header -->
    <div class="text-center mb-8">
      <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-medical-500 to-medical-600 rounded-2xl mb-4">
        <Heart class="w-8 h-8 text-white" />
      </div>
      <h1 class="text-2xl font-bold text-gray-900 mb-2">
        {mode === 'login' ? 'Welcome Back!' : 'Create Account'}
      </h1>
      <p class="text-gray-600">
        {mode === 'login' 
          ? 'Sign in to continue to HealthVault' 
          : 'Join HealthVault today'}
      </p>
    </div>

    <!-- Error Message -->
    {#if error}
      <div class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
        <p class="text-red-700 text-sm">{error}</p>
      </div>
    {/if}

    <!-- Form -->
    <form on:submit|preventDefault={handleSubmit} class="space-y-6">
      {#if mode === 'register'}
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User class="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="name"
              type="text"
              bind:value={formData.name}
              class="input-field pl-10 {errors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}"
              placeholder="Enter your full name"
              disabled={isLoading}
            />
          </div>
          {#if errors.name}
            <p class="mt-1 text-sm text-red-600">{errors.name}</p>
          {/if}
        </div>
      {/if}

      <div>
        <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
          Email Address
        </label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail class="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="email"
            type="email"
            bind:value={formData.email}
            class="input-field pl-10 {errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}"
            placeholder="Enter your email"
            disabled={isLoading}
          />
        </div>
        {#if errors.email}
          <p class="mt-1 text-sm text-red-600">{errors.email}</p>
        {/if}
      </div>

      <div>
        <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
          Password
        </label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock class="h-5 w-5 text-gray-400" />
          </div>
          {#if showPassword}
            <input
              id="password"
              type="text"
              bind:value={formData.password}
              class="input-field pl-10 pr-10 {errors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}"
              placeholder="Enter your password"
              disabled={isLoading}
            />
          {:else}
            <input
              id="password"
              type="password"
              bind:value={formData.password}
              class="input-field pl-10 pr-10 {errors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}"
              placeholder="Enter your password"
              disabled={isLoading}
            />
          {/if}
          <button
            type="button"
            class="absolute inset-y-0 right-0 pr-3 flex items-center"
            on:click={() => showPassword = !showPassword}
            disabled={isLoading}
          >
            {#if showPassword}
              <EyeOff class="h-5 w-5 text-gray-400 hover:text-gray-600" />
            {:else}
              <Eye class="h-5 w-5 text-gray-400 hover:text-gray-600" />
            {/if}
          </button>
        </div>
        {#if errors.password}
          <p class="mt-1 text-sm text-red-600">{errors.password}</p>
        {/if}
      </div>

      {#if mode === 'register'}
        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock class="h-5 w-5 text-gray-400" />
            </div>
            {#if showConfirmPassword}
              <input
                id="confirmPassword"
                type="text"
                bind:value={formData.confirmPassword}
                class="input-field pl-10 pr-10 {errors.confirmPassword ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}"
                placeholder="Confirm your password"
                disabled={isLoading}
              />
            {:else}
              <input
                id="confirmPassword"
                type="password"
                bind:value={formData.confirmPassword}
                class="input-field pl-10 pr-10 {errors.confirmPassword ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}"
                placeholder="Confirm your password"
                disabled={isLoading}
              />
            {/if}
            <button
              type="button"
              class="absolute inset-y-0 right-0 pr-3 flex items-center"
              on:click={() => showConfirmPassword = !showConfirmPassword}
              disabled={isLoading}
            >
              {#if showConfirmPassword}
                <EyeOff class="h-5 w-5 text-gray-400 hover:text-gray-600" />
              {:else}
                <Eye class="h-5 w-5 text-gray-400 hover:text-gray-600" />
              {/if}
            </button>
          </div>
          {#if errors.confirmPassword}
            <p class="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
          {/if}
        </div>
      {/if}

      <button
        type="submit"
        class="button-primary w-full flex justify-center items-center"
        disabled={isLoading}
      >
        {#if isLoading}
          <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
          {mode === 'login' ? 'Signing In...' : 'Creating Account...'}
        {:else}
          {mode === 'login' ? 'Sign In' : 'Create Account'}
        {/if}
      </button>
    </form>

    <!-- Toggle Mode -->
    <div class="mt-6 text-center">
      <p class="text-gray-600">
        {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
        <button
          type="button"
          class="text-medical-600 hover:text-medical-700 font-medium ml-1 focus:outline-none focus:underline"
          on:click={toggleMode}
          disabled={isLoading}
        >
          {mode === 'login' ? 'Sign Up' : 'Sign In'}
        </button>
      </p>
    </div>
  </div>
</div>