export default {
  name: 'Login',
  template: `
    <div class="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gradient-to-tr from-slate-100 via-slate-50 to-brand-100 relative overflow-hidden">
      <!-- Decorative Blobs -->
      <div class="absolute w-80 h-80 bg-brand-400/20 rounded-full blur-3xl -top-20 -left-20"></div>
      <div class="absolute w-96 h-96 bg-brand-accent/20 rounded-full blur-3xl -bottom-20 -right-20"></div>

      <!-- Glassmorphic Login Card -->
      <div class="relative z-10 w-full max-w-md bg-white/70 backdrop-blur-xl border border-white/50 p-8 sm:p-10 rounded-3xl shadow-xl transition-all duration-300">
        
        <div class="text-center mb-8">
          <div class="inline-flex bg-gradient-to-tr from-brand-600 to-brand-accent p-3 rounded-2xl text-white shadow-neon mb-4">
            <i class="fa-solid fa-key text-2xl"></i>
          </div>
          <h2 class="font-display font-extrabold text-2xl sm:text-3xl text-slate-800 tracking-tight">
            Sign In to Your Account
          </h2>
          <p class="text-slate-500 text-sm mt-2">
            Please log in to rent premium books, read online, or manage library catalogs.
          </p>
        </div>

        <!-- Form fields -->
        <form @submit.prevent="handleLogin" class="space-y-5">
          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5 pl-1">
              Username
            </label>
            <div class="relative">
              <span class="absolute left-3.5 top-3.5 text-slate-400">
                <i class="fa-solid fa-user"></i>
              </span>
              <input type="text" v-model="username" required placeholder="Enter username" 
                class="w-full bg-slate-50/50 border border-slate-200 text-slate-800 placeholder-slate-400 pl-10 pr-4 py-3 rounded-2xl text-sm focus:outline-none focus:border-brand-500 focus:bg-white transition-all duration-200" />
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5 pl-1">
              Password
            </label>
            <div class="relative">
              <span class="absolute left-3.5 top-3.5 text-slate-400">
                <i class="fa-solid fa-lock"></i>
              </span>
              <input type="password" v-model="password" required placeholder="Enter password" 
                class="w-full bg-slate-50/50 border border-slate-200 text-slate-800 placeholder-slate-400 pl-10 pr-4 py-3 rounded-2xl text-sm focus:outline-none focus:border-brand-500 focus:bg-white transition-all duration-200" />
            </div>
          </div>

          <!-- Error Message Banner -->
          <div v-if="errorMessage" class="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl text-xs flex items-start space-x-2">
            <i class="fa-solid fa-circle-exclamation text-rose-500 mt-0.5"></i>
            <span>{{ errorMessage }}</span>
          </div>

          <!-- Submit Button -->
          <button type="submit" :disabled="loading" 
            class="w-full bg-gradient-to-r from-brand-600 to-brand-accent hover:from-brand-700 hover:to-violet-700 disabled:from-slate-400 disabled:to-slate-400 disabled:cursor-not-allowed text-white font-bold py-3.5 px-4 rounded-2xl text-sm shadow-neon transition-all duration-200 flex items-center justify-center">
            <span v-if="loading" class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></span>
            <span v-else><i class="fa-solid fa-arrow-right-to-bracket mr-2"></i></span>
            {{ loading ? 'Authenticating...' : 'Sign In' }}
          </button>
        </form>

        <div class="mt-8 pt-6 border-t border-slate-200/50 flex flex-col items-center space-y-2">
          <p class="text-xs text-slate-500">
            Don't have an account? 
            <router-link to="/register" class="text-brand-600 hover:text-brand-700 font-semibold transition ml-1">
              Register Here
            </router-link>
          </p>
          <router-link to="/" class="text-xs text-slate-500 hover:text-brand-600 transition font-medium">
            <i class="fa-solid fa-arrow-left mr-1"></i> Back to Public Catalog
          </router-link>
        </div>

      </div>
    </div>
  `,
  data() {
    return {
      username: '',
      password: '',
      loading: false,
      errorMessage: ''
    };
  },
  methods: {
    async handleLogin() {
      this.loading = true;
      this.errorMessage = '';
      try {
        const response = await axios.post('api/login', {
          username: this.username,
          password: this.password
        });
        
        const data = response.data;
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Update root state
        this.$root.loggedIn = true;
        this.$root.currentUser = data.user;
        
        this.$root.showToast('Login Successful', 'Welcome back, ' + data.user.username + '!', 'success');
        this.$router.push({ name: 'dashboard' });
      } catch (err) {
        this.errorMessage = err.response?.data?.message || 'Login failed. Please check connection.';
        this.$root.showToast('Login Failed', this.errorMessage, 'error');
      } finally {
        this.loading = false;
      }
    }
  }
};
