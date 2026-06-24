export default {
  name: 'Dashboard',
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <!-- Welcome Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-8 pb-6 border-b border-slate-200">
        <div>
          <h1 class="font-display font-extrabold text-3xl text-slate-800 tracking-tight flex items-center">
            <i class="fa-solid text-brand-600 mr-3" :class="isAdmin ? 'fa-chart-line' : 'fa-book-open-reader'"></i> 
            {{ isAdmin ? 'Admin Dashboard' : 'My Rentals' }}
          </h1>
          <p class="text-slate-500 text-sm mt-1">
            {{ isAdmin ? 'Overview of catalog metrics, stats, and active rentals.' : 'Manage your active rented books and history.' }}
          </p>
        </div>
        <div class="mt-4 md:mt-0 flex items-center space-x-3">
          <router-link to="/" class="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold px-4 py-2.5 rounded-xl text-xs transition duration-200 flex items-center">
            <i class="fa-solid fa-eye mr-2"></i> View Catalog
          </router-link>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-brand-600 mb-4"></div>
        <p class="text-slate-500 text-sm font-medium">Fetching details...</p>
      </div>

      <div v-else class="space-y-10">
        
        <!-- ==================== ADMIN VIEW ==================== -->
        <template v-if="isAdmin">
          <!-- Stats Cards -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between hover:shadow-md transition">
              <div class="space-y-1">
                <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Total Books</span>
                <span class="text-3xl font-display font-extrabold text-slate-800">{{ books.length }}</span>
              </div>
              <div class="bg-brand-50 text-brand-600 p-4 rounded-2xl text-xl shadow-neon">
                <i class="fa-solid fa-book"></i>
              </div>
            </div>

            <div class="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between hover:shadow-md transition">
              <div class="space-y-1">
                <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Total Genres</span>
                <span class="text-3xl font-display font-extrabold text-slate-800">{{ genres.length }}</span>
              </div>
              <div class="bg-violet-50 text-violet-600 p-4 rounded-2xl text-xl shadow-neon-violet">
                <i class="fa-solid fa-tags"></i>
              </div>
            </div>

            <div class="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between hover:shadow-md transition">
              <div class="space-y-1">
                <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Active Rentals</span>
                <span class="text-3xl font-display font-extrabold text-slate-800">{{ activeRentalsCount }}</span>
              </div>
              <div class="bg-amber-50 text-amber-600 p-4 rounded-2xl text-xl">
                <i class="fa-solid fa-key"></i>
              </div>
            </div>
          </div>

          <!-- Rentals Tracking Panel -->
          <div class="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            <div class="px-6 py-5 bg-slate-50/50 border-b border-slate-200/60 flex items-center justify-between">
              <h2 class="font-display font-bold text-slate-800 text-lg flex items-center">
                <i class="fa-solid fa-receipt text-brand-500 mr-2.5"></i> Rental Transactions Tracking
              </h2>
            </div>
            
            <div v-if="rentals.length === 0" class="p-12 text-center text-slate-400">
              <i class="fa-solid fa-box-open text-3xl mb-2"></i>
              <p class="text-sm font-medium">No rental transactions registered yet.</p>
            </div>
            
            <div v-else class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="bg-slate-50 border-b border-slate-200/80 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    <th class="py-4 px-6">User</th>
                    <th class="py-4 px-6">Book Title</th>
                    <th class="py-4 px-6">Rent Date</th>
                    <th class="py-4 px-6">Return Date</th>
                    <th class="py-4 px-6">Status</th>
                    <th class="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 text-sm text-slate-700">
                  <tr v-for="rent in rentals" :key="rent.id" class="hover:bg-slate-50/50 transition">
                    <td class="py-4 px-6">
                      <div class="font-semibold text-slate-800">{{ rent.user_name }}</div>
                      <div class="text-xs text-slate-400">{{ rent.user_email }}</div>
                    </td>
                    <td class="py-4 px-6 font-medium text-slate-750">{{ rent.book_title }}</td>
                    <td class="py-4 px-6 text-slate-500 text-xs">{{ formatDate(rent.rent_date) }}</td>
                    <td class="py-4 px-6 text-slate-500 text-xs">
                      {{ rent.return_date ? formatDate(rent.return_date) : '-' }}
                    </td>
                    <td class="py-4 px-6">
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border"
                        :class="rent.status === 'rented' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'">
                        {{ rent.status === 'rented' ? 'Active' : 'Returned' }}
                      </span>
                    </td>
                    <td class="py-4 px-6 text-right">
                      <button v-if="rent.status === 'rented'" @click="handleReturnBook(rent.id)" 
                        class="bg-brand-600 hover:bg-brand-700 text-white font-bold py-1.5 px-3.5 rounded-xl text-xs transition duration-200 flex items-center ml-auto">
                        <i class="fa-solid fa-circle-check mr-1.5"></i> Mark Returned
                      </button>
                      <span v-else class="text-slate-400 text-xs italic"><i class="fa-solid fa-check mr-1"></i> Completed</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </template>

        <!-- ==================== MEMBER VIEW ==================== -->
        <template v-else>
          <!-- Member Welcome Panel -->
          <div class="bg-gradient-to-r from-brand-600 to-brand-accent p-6 rounded-3xl text-white shadow-lg flex items-center justify-between">
            <div>
              <h2 class="font-display font-extrabold text-xl">Hello, {{ user?.username }}!</h2>
              <p class="text-xs text-brand-100 mt-1">Email: {{ user?.email }} | Role: Library Member</p>
            </div>
            <div class="text-3xl opacity-30"><i class="fa-solid fa-graduation-cap"></i></div>
          </div>

          <!-- My Active Rentals List -->
          <div class="space-y-6">
            <h2 class="font-display font-extrabold text-xl text-slate-800 flex items-center">
              <i class="fa-solid fa-book-bookmark text-brand-500 mr-2.5"></i> My Active Rentals
            </h2>

            <div v-if="memberActiveRentals.length === 0" class="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-sm">
              <div class="inline-flex bg-slate-50 p-4 rounded-full text-slate-400 text-3xl mb-3">
                <i class="fa-solid fa-book-open"></i>
              </div>
              <h3 class="font-display font-bold text-slate-800 text-base mb-1">No Active Rentals</h3>
              <p class="text-slate-500 text-xs max-w-sm mx-auto mb-4">
                You do not have any rented books currently. Explore the catalog to rent premium comics or books.
              </p>
              <router-link to="/" class="bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2 px-4 rounded-xl text-xs inline-block transition">
                Browse Books
              </router-link>
            </div>

            <!-- Active Cards Grid -->
            <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div v-for="rent in memberActiveRentals" :key="rent.id" 
                class="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition flex space-x-4">
                <!-- Cover -->
                <div class="h-20 w-16 bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center text-3xl shadow-sm relative overflow-hidden flex-shrink-0">
                  <img v-if="rent.book_cover && rent.book_cover.startsWith('http')" :src="rent.book_cover" class="absolute inset-0 w-full h-full object-cover" />
                  <span v-else>{{ rent.book_cover && rent.book_cover.length <= 4 ? rent.book_cover : '📖' }}</span>
                </div>
                
                <!-- Details -->
                <div class="flex-grow flex flex-col justify-between">
                  <div>
                    <h3 class="font-display font-bold text-slate-800 text-base line-clamp-1">{{ rent.book_title }}</h3>
                    <p class="text-slate-500 text-xs">by {{ rent.book_author }}</p>
                    <p class="text-[11px] text-slate-400 mt-1">Rented: {{ formatDate(rent.rent_date) }}</p>
                  </div>
                  
                  <div class="flex items-center gap-2 mt-4">
                    <button @click="openReader(rent)" 
                      class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1.5 px-3.5 rounded-lg text-xs transition duration-200 flex items-center">
                      <i class="fa-solid fa-glasses mr-1.5"></i> Read
                    </button>
                    <button @click="handleReturnBook(rent.id)" 
                      class="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-1.5 px-3.5 rounded-lg text-xs transition duration-200">
                      Return Book
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Rental History -->
          <div class="space-y-4">
            <h3 class="font-display font-bold text-slate-800 text-lg flex items-center">
              <i class="fa-solid fa-clock-rotate-left text-slate-400 mr-2"></i> Rental History
            </h3>

            <div v-if="memberHistoryRentals.length === 0" class="bg-white border border-slate-200 rounded-2xl p-6 text-center text-slate-400 text-xs">
              No previous transactions history.
            </div>

            <div v-else class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <table class="w-full text-left border-collapse text-xs">
                <thead>
                  <tr class="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase">
                    <th class="py-3 px-5">Book Title</th>
                    <th class="py-3 px-5">Rented Date</th>
                    <th class="py-3 px-5">Returned Date</th>
                    <th class="py-3 px-5">Status</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 text-slate-650">
                  <tr v-for="rent in memberHistoryRentals" :key="rent.id">
                    <td class="py-3 px-5 font-semibold text-slate-750">{{ rent.book_title }}</td>
                    <td class="py-3 px-5 text-slate-400">{{ formatDate(rent.rent_date) }}</td>
                    <td class="py-3 px-5 text-slate-400">{{ formatDate(rent.return_date) }}</td>
                    <td class="py-3 px-5">
                      <span class="text-slate-400"><i class="fa-solid fa-circle-check text-emerald-500 mr-1"></i> Returned</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </template>

      </div>

      <!-- READ ACTIVE RENTAL PDF DIALOG -->
      <transition name="fade">
        <div v-if="readerOpen" class="fixed inset-0 z-50 overflow-hidden bg-slate-950/95 backdrop-blur flex flex-col justify-between text-white transition-all duration-300">
          
          <div class="border-b border-slate-800/80 px-6 py-4 flex items-center justify-between bg-slate-900/90 backdrop-blur sticky top-0 z-10">
            <div class="flex items-center space-x-3">
              <span class="bg-brand-600 text-white p-2 rounded-xl text-xs">
                <i class="fa-solid fa-book-open"></i>
              </span>
              <div>
                <h2 class="font-display font-extrabold text-sm sm:text-base text-white tracking-tight line-clamp-1">
                  {{ readerBook?.title }}
                </h2>
                <p class="text-xs text-slate-400">by {{ readerBook?.author }}</p>
              </div>
            </div>

            <div class="flex items-center space-x-2">
              <button @click="closeReader" class="bg-rose-600 hover:bg-rose-700 text-white font-bold py-1.5 px-3.5 rounded-lg text-xs transition flex items-center">
                Close <i class="fa-solid fa-xmark ml-1.5"></i>
              </button>
            </div>
          </div>

          <div class="flex-grow flex items-center justify-center p-4 bg-slate-950 overflow-auto">
            <template v-if="readerBook?.pdf_path">
              <object :data="pdfUrl" type="application/pdf" class="w-full max-w-5xl h-[80vh] rounded-2xl shadow-2xl border border-slate-800">
                <div class="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full text-center space-y-4 shadow-2xl">
                  <div class="inline-flex bg-slate-800 text-amber-400 p-4 rounded-full text-4xl">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                  </div>
                  <h3 class="font-display font-bold text-lg text-white">Browser PDF View Unsupported</h3>
                  <p class="text-slate-400 text-xs leading-relaxed">
                    Your current browser does not support direct PDF viewing. Click the link below to download the book and read it in your local reader.
                  </p>
                  <a :href="pdfUrl" target="_blank" class="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition duration-200 inline-block">
                    <i class="fa-solid fa-download mr-2"></i> Download PDF
                  </a>
                </div>
              </object>
            </template>
            <template v-else>
              <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-12 shadow-2xl relative max-w-2xl w-full text-center select-none">
                <div class="min-h-[300px] flex flex-col justify-between space-y-6">
                  <div class="border-b border-slate-800 pb-3 flex items-center justify-between text-xs text-slate-400 font-mono">
                    <span>MOCK DIGITAL PREVIEW</span>
                    <span>PAGE 1 OF 3</span>
                  </div>
                  <div class="flex-grow flex flex-col items-center justify-center py-6">
                    <div class="text-6xl text-brand-400 mb-4">📖</div>
                    <h3 class="font-display font-bold text-lg text-white mb-2">{{ readerBook?.title }}</h3>
                    <p class="text-slate-400 text-xs max-w-sm mx-auto leading-relaxed">
                      This book does not have an uploaded PDF file yet.
                    </p>
                  </div>
                  <div class="border-t border-slate-800 pt-4 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span>Read Rent Fun E-Library Preview</span>
                    <span>Copyright (c) 2026</span>
                  </div>
                </div>
              </div>
            </template>
          </div>

        </div>
      </transition>

    </div>
  `,
  data() {
    return {
      books: [],
      genres: [],
      rentals: [],
      loading: true,
      user: null,
      readerOpen: false,
      readerBook: null
    };
  },
  computed: {
    isAdmin() {
      return this.user && this.user.role === 'admin';
    },
    activeRentalsCount() {
      return this.rentals.filter(r => r.status === 'rented').length;
    },
    memberActiveRentals() {
      return this.rentals.filter(r => r.status === 'rented');
    },
    memberHistoryRentals() {
      return this.rentals.filter(r => r.status === 'returned');
    },
    pdfUrl() {
      if (!this.readerBook || !this.readerBook.pdf_path) return '';
      return axios.defaults.baseURL + this.readerBook.pdf_path;
    }
  },
  methods: {
    formatDate(dateStr) {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    async fetchData() {
      try {
        const userStr = localStorage.getItem('user');
        if (userStr) this.user = JSON.parse(userStr);

        const [booksRes, genresRes, rentalsRes] = await Promise.all([
          axios.get('api/books'),
          axios.get('api/genres'),
          axios.get('api/rentals')
        ]);
        
        this.books = booksRes.data.data || [];
        this.genres = genresRes.data.data || [];
        this.rentals = rentalsRes.data.data || [];
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        this.loading = false;
      }
    },
    async handleReturnBook(id) {
      if (!confirm('Confirm returning this book to the library?')) {
        return;
      }
      try {
        await axios.put(`api/rentals/${id}/return`);
        this.$root.showToast('Book Returned', 'Return has been successfully processed.', 'success');
        await this.fetchData();
      } catch (err) {
        this.$root.showToast('Error', err.response?.data?.message || 'Failed to process return.', 'error');
      }
    },
    openReader(rent) {
      this.readerBook = {
        title: rent.book_title,
        author: rent.book_author,
        pdf_path: rent.book_pdf
      };
      this.readerOpen = true;
    },
    closeReader() {
      this.readerOpen = false;
      this.readerBook = null;
    }
  },
  mounted() {
    this.fetchData();
  }
};
