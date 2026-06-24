export default {
  name: 'Home',
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <!-- Hero Header Section -->
      <div class="relative bg-gradient-to-r from-slate-900 via-slate-800 to-brand-900 rounded-3xl overflow-hidden shadow-2xl mb-12 p-8 sm:p-12 text-white">
        <div class="absolute -right-10 -bottom-10 opacity-10 text-9xl transform rotate-12">
          <i class="fa-solid fa-book-open-reader"></i>
        </div>
        <div class="relative z-10 max-w-2xl">
          <span class="bg-brand-500/20 text-brand-300 font-semibold px-4 py-1.5 rounded-full text-xs tracking-wider uppercase inline-block mb-4 border border-brand-500/30">
            ✨ Welcome to E-Library & Comics
          </span>
          <h1 class="font-display font-extrabold text-4xl sm:text-5xl leading-tight mb-4 tracking-tight">
            Read. Rent. Have <span class="bg-gradient-to-r from-brand-300 to-brand-accent bg-clip-text text-transparent">Fun!</span>
          </h1>
          <p class="text-slate-300 text-lg mb-6 leading-relaxed">
            Discover a limitless selection of novels, sci-fi masterpieces, programming guides, and manga with our fully interactive Web PDF Reader.
          </p>
          <div class="flex flex-wrap gap-4">
            <a href="#catalog" class="bg-gradient-to-r from-brand-600 to-brand-accent hover:from-brand-700 hover:to-violet-700 text-white font-semibold px-6 py-3 rounded-xl shadow-neon transition duration-200 flex items-center">
              Explore Catalog <i class="fa-solid fa-arrow-down ml-2"></i>
            </a>
          </div>
        </div>
      </div>

      <!-- Main Catalog Area -->
      <div id="catalog" class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        <!-- Sidebar Filters -->
        <div class="lg:col-span-1 space-y-6">
          <!-- Search Box -->
          <div class="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
            <h3 class="font-display font-bold text-slate-800 text-base mb-3 flex items-center">
              <i class="fa-solid fa-magnifying-glass text-brand-500 mr-2"></i> Search Book
            </h3>
            <div class="relative">
              <input type="text" v-model="searchQuery" placeholder="Title, author..." 
                class="w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 pl-4 pr-10 py-2.5 rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:bg-white transition-all duration-200" />
              <span class="absolute right-3 top-3 text-slate-400 text-sm">
                <i class="fa-solid fa-search"></i>
              </span>
            </div>
          </div>

          <!-- Genres Filter -->
          <div class="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-display font-bold text-slate-800 text-base flex items-center">
                <i class="fa-solid fa-filter text-brand-500 mr-2"></i> Filter Genre
              </h3>
              <button v-if="selectedGenre" @click="selectedGenre = null" class="text-xs text-brand-600 hover:text-brand-700 font-semibold">
                Clear
              </button>
            </div>
            
            <div class="space-y-1">
              <button @click="selectedGenre = null" 
                class="w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium transition duration-200 flex items-center justify-between"
                :class="!selectedGenre ? 'bg-brand-50 text-brand-600' : 'text-slate-600 hover:bg-slate-50'">
                <span>All Genres</span>
                <span class="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-xs font-semibold">{{ books.length }}</span>
              </button>

              <button v-for="genre in genres" :key="genre.id" @click="selectedGenre = genre.id"
                class="w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium transition duration-200 flex items-center justify-between"
                :class="selectedGenre === genre.id ? 'bg-brand-50 text-brand-600' : 'text-slate-600 hover:bg-slate-50'">
                <span class="truncate pr-2">{{ genre.name }}</span>
                <span class="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-xs font-semibold">
                  {{ countBooksByGenre(genre.id) }}
                </span>
              </button>
            </div>
          </div>
        </div>

        <!-- Catalog Shelf List -->
        <div class="lg:col-span-3 space-y-12">
          
          <!-- Loading State -->
          <div v-if="loading" class="flex flex-col items-center justify-center py-20">
            <div class="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-brand-600 mb-4"></div>
            <p class="text-slate-500 text-sm font-medium">Fetching our awesome catalog...</p>
          </div>

          <!-- Empty State -->
          <div v-else-if="filteredBooks.length === 0" class="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-sm">
            <div class="inline-flex bg-slate-50 p-4 rounded-full text-slate-400 text-4xl mb-4">
              <i class="fa-solid fa-book-open"></i>
            </div>
            <h3 class="font-display font-bold text-slate-800 text-xl mb-2">No Books Found</h3>
            <p class="text-slate-500 max-w-md mx-auto text-sm">
              We couldn't find any books matching your search filters. Try adjusting your query or genre selector!
            </p>
          </div>

          <!-- Catalog Shelf Sections -->
          <template v-else>
            
            <!-- SECTION 1: Free to Read Books -->
            <div class="space-y-6" v-if="freeBooks.length > 0">
              <div class="flex items-center space-x-3 border-b border-slate-200 pb-3">
                <span class="bg-emerald-500 text-white p-2 rounded-xl text-xs"><i class="fa-solid fa-gift"></i></span>
                <h2 class="font-display font-extrabold text-2xl text-slate-850">Free to Read</h2>
                <span class="bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full text-xs font-semibold">{{ freeBooks.length }}</span>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div v-for="book in freeBooks" :key="book.id" 
                  class="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col">
                  
                  <div class="relative bg-gradient-to-tr from-slate-100 to-slate-200 h-48 flex items-center justify-center overflow-hidden border-b border-slate-100">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    <div class="text-6xl select-none transition-transform duration-300 group-hover:scale-110">
                      {{ book.cover_url && book.cover_url.length <= 4 ? book.cover_url : '📖' }}
                    </div>
                    <img v-if="book.cover_url && book.cover_url.startsWith('http')" :src="book.cover_url" class="absolute inset-0 w-full h-full object-cover" />
                    
                    <span class="absolute top-3 left-3 bg-brand-600/90 text-white font-medium text-xs px-2.5 py-1 rounded-full shadow">
                      {{ book.genre_name || 'Uncategorized' }}
                    </span>
                  </div>

                  <div class="p-5 flex-grow flex flex-col justify-between">
                    <div class="space-y-2">
                      <h3 class="font-display font-bold text-slate-800 text-lg group-hover:text-brand-600 transition-colors duration-200 leading-snug line-clamp-1">
                        {{ book.title }}
                      </h3>
                      <p class="text-slate-500 text-xs font-semibold flex items-center">
                        <i class="fa-solid fa-feather-pointed text-brand-400 mr-1.5"></i>{{ book.author }}
                      </p>
                      <p class="text-slate-600 text-xs line-clamp-2 leading-relaxed mt-2 bg-slate-50 p-2.5 rounded-lg">
                        {{ book.synopsis || 'No synopsis available for this title.' }}
                      </p>
                    </div>

                    <div class="mt-5 pt-4 border-t border-slate-100">
                      <button v-if="book.pdf_path || book.read_url" @click="openReader(book)" 
                        class="w-full bg-emerald-600 hover:bg-emerald-700 text-white hover:shadow-md font-bold py-2.5 px-4 rounded-xl text-xs transition duration-200 flex items-center justify-center">
                        <i class="fa-solid fa-book-open mr-2"></i> Read Free Online
                      </button>
                      <button v-else disabled 
                        class="w-full bg-slate-100 text-slate-400 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center cursor-not-allowed">
                        <i class="fa-solid fa-ban mr-2"></i> PDF Not Available
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- SECTION 2: Premium Rented Books -->
            <div class="space-y-6" v-if="rentBooks.length > 0">
              <div class="flex items-center space-x-3 border-b border-slate-200 pb-3">
                <span class="bg-brand-600 text-white p-2 rounded-xl text-xs"><i class="fa-solid fa-key"></i></span>
                <h2 class="font-display font-extrabold text-2xl text-slate-850">Premium Rentals</h2>
                <span class="bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full text-xs font-semibold">{{ rentBooks.length }}</span>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div v-for="book in rentBooks" :key="book.id" 
                  class="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col">
                  
                  <div class="relative bg-gradient-to-tr from-slate-100 to-slate-200 h-48 flex items-center justify-center overflow-hidden border-b border-slate-100">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    <div class="text-6xl select-none transition-transform duration-300 group-hover:scale-110">
                      {{ book.cover_url && book.cover_url.length <= 4 ? book.cover_url : '📖' }}
                    </div>
                    <img v-if="book.cover_url && book.cover_url.startsWith('http')" :src="book.cover_url" class="absolute inset-0 w-full h-full object-cover" />
                    
                    <span class="absolute top-3 left-3 bg-brand-600/90 text-white font-medium text-xs px-2.5 py-1 rounded-full shadow">
                      {{ book.genre_name || 'Uncategorized' }}
                    </span>
                    
                    <!-- Locked / Unlocked Status Badge -->
                    <span class="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-sm text-white font-semibold text-xs px-2.5 py-1 rounded-full flex items-center space-x-1 shadow">
                      <i v-if="isBookRented(book.id)" class="fa-solid fa-lock-open text-emerald-400"></i>
                      <i v-else class="fa-solid fa-lock text-brand-300"></i>
                      <span>{{ isBookRented(book.id) ? 'Rented' : 'Rent Only' }}</span>
                    </span>
                  </div>

                  <div class="p-5 flex-grow flex flex-col justify-between">
                    <div class="space-y-2">
                      <h3 class="font-display font-bold text-slate-800 text-lg group-hover:text-brand-600 transition-colors duration-200 leading-snug line-clamp-1">
                        {{ book.title }}
                      </h3>
                      <p class="text-slate-500 text-xs font-semibold flex items-center">
                        <i class="fa-solid fa-feather-pointed text-brand-400 mr-1.5"></i>{{ book.author }}
                      </p>
                      <p class="text-slate-600 text-xs line-clamp-2 leading-relaxed mt-2 bg-slate-50 p-2.5 rounded-lg">
                        {{ book.synopsis || 'No synopsis available for this title.' }}
                      </p>
                    </div>

                    <div class="mt-5 pt-4 border-t border-slate-100 flex gap-2">
                      <template v-if="isBookRented(book.id)">
                        <button @click="openReader(book)" 
                          class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition duration-200 flex items-center justify-center">
                          <i class="fa-solid fa-book-open mr-2"></i> Read Online
                        </button>
                      </template>
                      <template v-else>
                        <button @click="handleRentBook(book)" 
                          class="w-full bg-slate-900 hover:bg-brand-600 text-white hover:shadow-neon font-bold py-2.5 px-4 rounded-xl text-xs transition duration-200 flex items-center justify-center">
                          <i class="fa-solid fa-key mr-2"></i> Rent Book
                        </button>
                      </template>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </template>
        </div>

      </div>

      <!-- REAL PDF DIGITAL READER MODAL (DARK MODE) -->
      <transition name="fade">
        <div v-if="readerOpen" class="fixed inset-0 z-50 overflow-hidden bg-slate-950/95 backdrop-blur flex flex-col justify-between text-white transition-all duration-300">
          
          <!-- Reader Topbar Header -->
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

            <!-- Close button -->
            <div class="flex items-center space-x-2">
              <button @click="closeReader" class="bg-rose-600 hover:bg-rose-700 text-white font-bold py-1.5 px-3.5 rounded-lg text-xs transition flex items-center">
                Close <i class="fa-solid fa-xmark ml-1.5"></i>
              </button>
            </div>
          </div>

          <!-- Reader PDF Display Canvas -->
          <div class="flex-grow flex items-center justify-center p-4 bg-slate-950 overflow-auto">
            
            <template v-if="readerBook?.pdf_path">
              <!-- Embed actual PDF statically Served -->
              <object :data="pdfUrl" type="application/pdf" class="w-full max-w-5xl h-[80vh] rounded-2xl shadow-2xl border border-slate-800">
                <!-- Backup option if browser doesn't support embedded PDF -->
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
              <!-- Mock visual panels if no PDF was uploaded yet -->
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
                      This book does not have an uploaded PDF file yet. An administrator can upload a real PDF file from the Manage Books dashboard.
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
      searchQuery: '',
      selectedGenre: null,
      readerOpen: false,
      readerBook: null
    };
  },
  computed: {
    freeBooks() {
      return this.filteredBooks.filter(b => Number(b.is_free) === 1);
    },
    rentBooks() {
      return this.filteredBooks.filter(b => Number(b.is_free) === 0);
    },
    filteredBooks() {
      return this.books.filter(book => {
        const matchesQuery = book.title.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
                             book.author.toLowerCase().includes(this.searchQuery.toLowerCase());
        const matchesGenre = !this.selectedGenre || Number(book.genre_id) === Number(this.selectedGenre);
        return matchesQuery && matchesGenre;
      });
    },
    pdfUrl() {
      if (!this.readerBook || !this.readerBook.pdf_path) return '';
      return axios.defaults.baseURL + this.readerBook.pdf_path;
    }
  },
  methods: {
    countBooksByGenre(genreId) {
      return this.books.filter(b => Number(b.genre_id) === Number(genreId)).length;
    },
    isBookRented(bookId) {
      // Checked if user has an active rented record for this book
      return this.rentals.some(r => Number(r.book_id) === Number(bookId) && r.status === 'rented');
    },
    async fetchData() {
      try {
        const [booksRes, genresRes] = await Promise.all([
          axios.get('api/books'),
          axios.get('api/genres')
        ]);
        this.books = booksRes.data.data || [];
        this.genres = genresRes.data.data || [];

        // If user is logged in, fetch their active rentals
        if (this.$root.isLoggedIn) {
          const rentalsRes = await axios.get('api/rentals');
          this.rentals = rentalsRes.data.data || [];
        }
      } catch (err) {
        console.error('Failed to load data:', err);
      } finally {
        this.loading = false;
      }
    },
    async handleRentBook(book) {
      if (!this.$root.isLoggedIn) {
        this.$root.showToast('Authentication Required', 'Please log in to rent premium books.', 'error');
        this.$router.push({ name: 'login' });
        return;
      }

      try {
        await axios.post('api/rentals', { book_id: book.id });
        this.$root.showToast('Book Rented', `"${book.title}" rented successfully! It is now unlocked.`, 'success');
        await this.fetchData();
      } catch (err) {
        this.$root.showToast('Error', err.response?.data?.message || 'Failed to rent book.', 'error');
      }
    },
    openReader(book) {
      // Verify if book is free or is rented
      if (Number(book.is_free) === 0 && !this.isBookRented(book.id)) {
        this.$root.showToast('Access Denied', 'Please rent this book to access online reading.', 'error');
        return;
      }
      this.readerBook = book;
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
