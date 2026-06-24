export default {
  name: 'Books',
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 pb-6 border-b border-slate-200">
        <div class="space-y-1">
          <h1 class="font-display font-extrabold text-3xl text-slate-800 tracking-tight">
            Manage Books
          </h1>
          <p class="text-slate-500 text-sm">
            Add, update, and manage catalog books.
          </p>
        </div>
        <div class="mt-4 sm:mt-0">
          <button @click="openCreateModal" class="bg-gradient-to-r from-brand-600 to-brand-accent hover:from-brand-700 hover:to-violet-700 text-white font-bold py-2.5 px-5 rounded-xl text-xs shadow-neon transition duration-200 flex items-center">
            <i class="fa-solid fa-plus mr-2"></i> Add New Book
          </button>
        </div>
      </div>

      <!-- Loading Spinner -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-brand-600 mb-4"></div>
        <p class="text-slate-500 text-sm font-medium">Fetching catalog books...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="books.length === 0" class="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-sm">
        <div class="inline-flex bg-slate-50 p-4 rounded-full text-slate-400 text-4xl mb-4">
          <i class="fa-solid fa-book"></i>
        </div>
        <h3 class="font-display font-bold text-slate-800 text-xl mb-2">No Books in Catalog</h3>
        <p class="text-slate-500 max-w-md mx-auto text-sm mb-6">
          Start building your digital library by clicking the Add New Book button.
        </p>
        <button @click="openCreateModal" class="bg-slate-900 text-white hover:bg-slate-800 py-2.5 px-5 rounded-xl text-xs font-semibold transition">
          <i class="fa-solid fa-plus mr-2"></i> Add Book
        </button>
      </div>

      <!-- Books Table List -->
      <div v-else class="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50 border-b border-slate-200/80 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <th class="py-4 px-6">Cover</th>
                <th class="py-4 px-6">Title</th>
                <th class="py-4 px-6">Author</th>
                <th class="py-4 px-6">Genre</th>
                <th class="py-4 px-6">Access Type</th>
                <th class="py-4 px-6">PDF File</th>
                <th class="py-4 px-6">Status</th>
                <th class="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-sm text-slate-700">
              <tr v-for="book in books" :key="book.id" class="hover:bg-slate-50/50 transition">
                <!-- Cover -->
                <td class="py-4 px-6">
                  <div class="h-12 w-12 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-2xl shadow-sm overflow-hidden relative">
                    <img v-if="book.cover_url && book.cover_url.startsWith('http')" :src="book.cover_url" class="absolute inset-0 w-full h-full object-cover" />
                    <span v-else>{{ book.cover_url && book.cover_url.length <= 4 ? book.cover_url : '📖' }}</span>
                  </div>
                </td>
                <!-- Title -->
                <td class="py-4 px-6 font-semibold text-slate-800 max-w-xs truncate" :title="book.title">
                  {{ book.title }}
                </td>
                <!-- Author -->
                <td class="py-4 px-6 text-slate-600 font-medium">
                  {{ book.author }}
                </td>
                <!-- Genre -->
                <td class="py-4 px-6">
                  <span class="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-semibold">
                    {{ book.genre_name || 'Uncategorized' }}
                  </span>
                </td>
                <!-- Access Type -->
                <td class="py-4 px-6">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
                    :class="Number(book.is_free) === 1 ? 'bg-emerald-50 text-emerald-700' : 'bg-brand-50 text-brand-700'">
                    <i class="fa-solid mr-1" :class="Number(book.is_free) === 1 ? 'fa-gift' : 'fa-key'"></i>
                    {{ Number(book.is_free) === 1 ? 'Free' : 'Premium' }}
                  </span>
                </td>
                <!-- PDF path -->
                <td class="py-4 px-6 font-mono text-xs">
                  <span v-if="book.pdf_path" class="text-slate-600 flex items-center">
                    <i class="fa-solid fa-file-pdf text-rose-500 text-sm mr-2 flex-shrink-0"></i>
                    <span class="truncate max-w-[150px]" :title="book.pdf_path">{{ book.pdf_path.split('/').pop() }}</span>
                  </span>
                  <span v-else class="text-slate-400 italic">No PDF Uploaded</span>
                </td>
                <!-- Status -->
                <td class="py-4 px-6">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border"
                    :class="book.status === 'available' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'">
                    {{ book.status === 'available' ? 'Available' : 'Archived' }}
                  </span>
                </td>
                <!-- Actions -->
                <td class="py-4 px-6 text-right space-x-2">
                  <button @click="openEditModal(book)" class="bg-slate-100 hover:bg-brand-50 hover:text-brand-600 text-slate-600 p-2 rounded-lg text-xs transition" title="Edit">
                    <i class="fa-solid fa-pen-to-square"></i>
                  </button>
                  <button @click="deleteBook(book.id)" class="bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 p-2 rounded-lg text-xs transition" title="Delete">
                    <i class="fa-solid fa-trash-can"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ADD/EDIT BOOK MODAL DIALOG -->
      <transition name="fade">
        <div v-if="showModal" class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div class="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 transition-all duration-300">
            
            <div class="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 class="font-display font-extrabold text-slate-800 text-base">
                {{ isEdit ? 'Edit Book Details' : 'Add New Book' }}
              </h3>
              <button @click="closeModal" class="text-slate-400 hover:text-slate-600">
                <i class="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            <form @submit.prevent="saveBook" class="p-6 space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div class="col-span-2">
                  <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Title <span class="text-red-500">*</span></label>
                  <input type="text" v-model="form.title" required placeholder="Book title"
                    class="w-full bg-slate-50 border border-slate-200 text-slate-800 px-3.5 py-2.5 rounded-xl text-sm focus:outline-none focus:border-brand-500 transition" />
                  <p v-if="errors.title" class="text-rose-600 text-[11px] mt-1">{{ errors.title }}</p>
                </div>

                <div>
                  <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Author <span class="text-red-500">*</span></label>
                  <input type="text" v-model="form.author" required placeholder="Author's name"
                    class="w-full bg-slate-50 border border-slate-200 text-slate-800 px-3.5 py-2.5 rounded-xl text-sm focus:outline-none focus:border-brand-500 transition" />
                  <p v-if="errors.author" class="text-rose-600 text-[11px] mt-1">{{ errors.author }}</p>
                </div>

                <div>
                  <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Genre Category</label>
                  <div class="relative">
                    <select v-model="form.genre_id"
                      class="w-full bg-slate-50 border border-slate-200 text-slate-800 pl-3.5 pr-10 py-2.5 rounded-xl text-sm focus:outline-none focus:border-brand-500 appearance-none transition">
                      <option value="" class="bg-white text-slate-800">Uncategorized</option>
                      <option v-for="g in genres" :key="g.id" :value="g.id" class="bg-white text-slate-800">{{ g.name }}</option>
                    </select>
                    <span class="absolute right-3.5 top-3.5 text-slate-400 pointer-events-none text-xs">
                      <i class="fa-solid fa-chevron-down"></i>
                    </span>
                  </div>
                </div>

                <div>
                  <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Cover (Emoji or Image URL)</label>
                  <input type="text" v-model="form.cover_url" placeholder="e.g. 🏴‍☠️ or http://..."
                    class="w-full bg-slate-50 border border-slate-200 text-slate-800 px-3.5 py-2.5 rounded-xl text-sm focus:outline-none focus:border-brand-500 transition" />
                </div>

                <div>
                  <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Access Type</label>
                  <div class="relative">
                    <select v-model="form.is_free"
                      class="w-full bg-slate-50 border border-slate-200 text-slate-800 pl-3.5 pr-10 py-2.5 rounded-xl text-sm focus:outline-none focus:border-brand-500 appearance-none transition">
                      <option :value="1" class="bg-white text-slate-800">Free to Read (Public)</option>
                      <option :value="0" class="bg-white text-slate-800">Premium Rental (Rent Only)</option>
                    </select>
                    <span class="absolute right-3.5 top-3.5 text-slate-400 pointer-events-none text-xs">
                      <i class="fa-solid fa-chevron-down"></i>
                    </span>
                  </div>
                </div>

                <div class="col-span-2">
                  <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Upload Book PDF File</label>
                  <input type="file" ref="pdfFileInput" accept="application/pdf" @change="handlePdfChange"
                    class="w-full bg-slate-50 border border-slate-200 text-slate-800 px-3.5 py-2.5 rounded-xl text-sm focus:outline-none focus:border-brand-500 file:mr-4 file:py-1 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100 transition" />
                  <p class="text-slate-400 text-[10px] mt-1">Upload a PDF document. Max size 2MB.</p>
                </div>

                <div class="col-span-2">
                  <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Synopsis</label>
                  <textarea v-model="form.synopsis" rows="3" placeholder="Write a short description..."
                    class="w-full bg-slate-50 border border-slate-200 text-slate-800 px-3.5 py-2.5 rounded-xl text-sm focus:outline-none focus:border-brand-500 transition"></textarea>
                </div>

                <div class="col-span-2">
                  <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Book Availability</label>
                  <div class="relative">
                    <select v-model="form.status"
                      class="w-full bg-slate-50 border border-slate-200 text-slate-800 pl-3.5 pr-10 py-2.5 rounded-xl text-sm focus:outline-none focus:border-brand-500 appearance-none transition">
                      <option value="available" class="bg-white text-slate-800">Available for Rent & Reading</option>
                      <option value="archived" class="bg-white text-slate-800">Archived (Hidden from catalog)</option>
                    </select>
                    <span class="absolute right-3.5 top-3.5 text-slate-400 pointer-events-none text-xs">
                      <i class="fa-solid fa-chevron-down"></i>
                    </span>
                  </div>
                </div>
              </div>

              <div class="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button type="button" @click="closeModal" class="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-4 py-2.5 rounded-xl text-xs transition">
                  Cancel
                </button>
                <button type="submit" class="bg-gradient-to-r from-brand-600 to-brand-accent hover:from-brand-700 hover:to-violet-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-neon transition">
                  Save Changes
                </button>
              </div>
            </form>

          </div>
        </div>
      </transition>

    </div>
  `,
  data() {
    return {
      books: [],
      genres: [],
      loading: true,
      showModal: false,
      isEdit: false,
      form: {
        id: null,
        title: '',
        author: '',
        genre_id: '',
        cover_url: '',
        read_url: '',
        is_free: 1,
        synopsis: '',
        status: 'available'
      },
      pdfFile: null,
      errors: {}
    };
  },
  methods: {
    async fetchBooks() {
      try {
        const res = await axios.get('api/books');
        this.books = res.data.data || [];
      } catch (err) {
        console.error('Failed to load books:', err);
      }
    },
    async fetchGenres() {
      try {
        const res = await axios.get('api/genres');
        this.genres = res.data.data || [];
      } catch (err) {
        console.error('Failed to load genres:', err);
      }
    },
    openCreateModal() {
      this.isEdit = false;
      this.errors = {};
      this.pdfFile = null;
      this.form = {
        id: null,
        title: '',
        author: '',
        genre_id: '',
        cover_url: '📖',
        read_url: '',
        is_free: 1,
        synopsis: '',
        status: 'available'
      };
      this.showModal = true;
      // Reset file input if modal opens
      this.$nextTick(() => {
        if (this.$refs.pdfFileInput) this.$refs.pdfFileInput.value = '';
      });
    },
    openEditModal(book) {
      this.isEdit = true;
      this.errors = {};
      this.pdfFile = null;
      this.form = {
        id: book.id,
        title: book.title,
        author: book.author,
        genre_id: book.genre_id || '',
        cover_url: book.cover_url,
        read_url: book.read_url || '',
        is_free: parseInt(book.is_free),
        synopsis: book.synopsis || '',
        status: book.status
      };
      this.showModal = true;
      this.$nextTick(() => {
        if (this.$refs.pdfFileInput) this.$refs.pdfFileInput.value = '';
      });
    },
    closeModal() {
      this.showModal = false;
    },
    handlePdfChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.pdfFile = file;
      }
    },
    async saveBook() {
      this.errors = {};
      try {
        // Create FormData because we are uploading a PDF file
        const formData = new FormData();
        formData.append('title', this.form.title);
        formData.append('author', this.form.author);
        formData.append('genre_id', this.form.genre_id);
        formData.append('cover_url', this.form.cover_url);
        formData.append('read_url', this.form.read_url);
        formData.append('is_free', this.form.is_free);
        formData.append('synopsis', this.form.synopsis);
        formData.append('status', this.form.status);
        
        if (this.pdfFile) {
          formData.append('pdf_file', this.pdfFile);
        }

        const headers = { 'Content-Type': 'multipart/form-data' };

        if (this.isEdit) {
          // Spoofing PUT request for multipart form-data in CodeIgniter 4
          formData.append('_method', 'PUT');
          await axios.post(`api/books/${this.form.id}`, formData, { headers });
          this.$root.showToast('Book Updated', 'Details and PDF file updated.', 'success');
        } else {
          await axios.post('api/books', formData, { headers });
          this.$root.showToast('Book Added', 'New book catalog created.', 'success');
        }
        this.showModal = false;
        await this.fetchBooks();
      } catch (err) {
        if (err.response && err.response.data && err.response.data.messages) {
          this.errors = err.response.data.messages;
        } else {
          this.$root.showToast('Error', err.response?.data?.message || 'Failed to save book data.', 'error');
        }
      }
    },
    async deleteBook(id) {
      if (!confirm('Are you absolutely sure you want to delete this book? This action is irreversible.')) {
        return;
      }
      try {
        await axios.delete(`api/books/${id}`);
        this.$root.showToast('Book Deleted', 'The record was deleted from catalog.', 'success');
        await this.fetchBooks();
      } catch (err) {
        this.$root.showToast('Error', err.response?.data?.message || 'Failed to delete book.', 'error');
      }
    }
  },
  async mounted() {
    this.loading = true;
    await Promise.all([this.fetchBooks(), this.fetchGenres()]);
    this.loading = false;
  }
};
