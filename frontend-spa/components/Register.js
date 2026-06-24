export default {
  name: 'Register',
  template: `
    <div class="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gradient-to-tr from-slate-100 via-slate-50 to-brand-100 relative overflow-hidden">
      <!-- Decorative Blobs -->
      <div class="absolute w-80 h-80 bg-brand-400/20 rounded-full blur-3xl -top-20 -left-20"></div>
      <div class="absolute w-96 h-96 bg-brand-accent/20 rounded-full blur-3xl -bottom-20 -right-20"></div>

      <!-- Glassmorphic Card -->
      <div class="relative z-10 w-full max-w-md bg-white/70 backdrop-blur-xl border border-white/50 p-8 sm:p-10 rounded-3xl shadow-xl transition-all duration-300">
        
        <div class="text-center mb-8">
          <div class="inline-flex bg-gradient-to-tr from-brand-600 to-brand-accent p-3 rounded-2xl text-white shadow-neon mb-4">
            <i class="fa-solid fa-user-plus text-2xl"></i>
          </div>
          <h2 class="font-display font-extrabold text-2xl sm:text-3xl text-slate-800 tracking-tight">
            Create Account
          </h2>
          <p class="text-slate-500 text-sm mt-2">
            Join Read Rent Fun to read free books and manage your online book rentals.
          </p>
        </div>

        <form @submit.prevent="handleRegister" class="space-y-5">
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
            <p v-if="errors.username" class="text-rose-600 text-xs mt-1 pl-1">{{ errors.username }}</p>
          </div>

          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5 pl-1">
              Email Address
            </label>
            <div class="relative">
              <span class="absolute left-3.5 top-3.5 text-slate-400">
                <i class="fa-solid fa-envelope"></i>
              </span>
              <input type="email" v-model="email" required placeholder="Enter email" 
                class="w-full bg-slate-50/50 border border-slate-200 text-slate-800 placeholder-slate-400 pl-10 pr-4 py-3 rounded-2xl text-sm focus:outline-none focus:border-brand-500 focus:bg-white transition-all duration-200" />
            </div>
            <p v-if="errors.email" class="text-rose-600 text-xs mt-1 pl-1">{{ errors.email }}</p>
          </div>

          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5 pl-1">
              Password
            </label>
            <div class="relative">
              <span class="absolute left-3.5 top-3.5 text-slate-400">
                <i class="fa-solid fa-lock"></i>
              </span>
              <input type="password" v-model="password" required placeholder="Minimum 6 characters" 
                class="w-full bg-slate-50/50 border border-slate-200 text-slate-800 placeholder-slate-400 pl-10 pr-4 py-3 rounded-2xl text-sm focus:outline-none focus:border-brand-500 focus:bg-white transition-all duration-200" />
            </div>
            <p v-if="errors.password" class="text-rose-600 text-xs mt-1 pl-1">{{ errors.password }}</p>
          </div>

          <div v-if="errorMessage" class="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl text-xs flex items-start space-x-2">
            <i class="fa-solid fa-circle-exclamation text-rose-500 mt-0.5"></i>
            <span>{{ errorMessage }}</span>
          </div>

          <!-- Submit Button -->
          <button type="submit" :disabled="loading" 
            class="w-full bg-gradient-to-r from-brand-600 to-brand-accent hover:from-brand-700 hover:to-violet-700 disabled:from-slate-400 disabled:to-slate-400 disabled:cursor-not-allowed text-white font-bold py-3.5 px-4 rounded-2xl text-sm shadow-neon transition-all duration-200 flex items-center justify-center">
            <span v-if="loading" class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></span>
            <span v-else><i class="fa-solid fa-user-check mr-2"></i></span>
            {{ loading ? 'Creating Account...' : 'Sign Up' }}
          </button>
        </form>

        <div class="mt-8 pt-6 border-t border-slate-200/50 text-center">
          <p class="text-slate-500 text-xs font-medium">
            Already have an account? 
            <router-link to="/login" class="text-brand-600 hover:text-brand-750 font-bold ml-1 transition">
              Sign In
            </router-link>
          </p>
        </div>

      </div>
    </div>
  `,
  data() {
    return {
      username: '',
      email: '',
      password: '',
      loading: false,
      errorMessage: '',
      errors: {}
    };
  },
  methods: {
    async handleRegister() {
      this.loading = true;
      this.errorMessage = '';
      this.errors = {};
      try {
        await axios.post('api/register', {
          username: this.username,
          email: this.email,
          password: this.password
        });
        
        this.$root.showToast('Register Successful', 'Your account has been created! Please log in.', 'success');
        this.$router.push({ name: 'login' });
      } catch (err) {
        if (err.response && err.response.data && err.response.data.messages) {
          this.errors = err.response.data.messages;
        } else {
          this.errorMessage = err.response?.data?.message || 'Registration failed. Please check connection.';
          this.$root.showToast('Register Failed', this.errorMessage, 'error');
        }
      } finally {
        this.loading = false;
      }
    }
  }
};
