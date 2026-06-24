export default {
  name: 'Genres',
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 pb-6 border-b border-slate-200">
        <div class="space-y-1">
          <h1 class="font-display font-extrabold text-3xl text-slate-800 tracking-tight">
            Book Genres
          </h1>
          <p class="text-slate-500 text-sm">
            Add, update, and manage catalog genres/categories.
          </p>
        </div>
        <div class="mt-4 sm:mt-0">
          <button @click="openCreateModal" class="bg-gradient-to-r from-brand-600 to-brand-accent hover:from-brand-700 hover:to-violet-700 text-white font-bold py-2.5 px-5 rounded-xl text-xs shadow-neon transition duration-200 flex items-center">
            <i class="fa-solid fa-plus mr-2"></i> Add New Genre
          </button>
        </div>
      </div>

      <!-- Loading Spinner -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-brand-600 mb-4"></div>
        <p class="text-slate-500 text-sm font-medium">Fetching catalog genres...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="genres.length === 0" class="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-sm">
        <div class="inline-flex bg-slate-50 p-4 rounded-full text-slate-400 text-4xl mb-4">
          <i class="fa-solid fa-tags"></i>
        </div>
        <h3 class="font-display font-bold text-slate-800 text-xl mb-2">No Genres Found</h3>
        <p class="text-slate-500 max-w-md mx-auto text-sm mb-6">
          Start dividing your library collection by creating a new category/genre.
        </p>
        <button @click="openCreateModal" class="bg-slate-900 text-white hover:bg-slate-800 py-2.5 px-5 rounded-xl text-xs font-semibold transition">
          <i class="fa-solid fa-plus mr-2"></i> Add Genre
        </button>
      </div>

      <!-- Genres Table List -->
      <div v-else class="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50 border-b border-slate-200/80 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <th class="py-4 px-6">Genre ID</th>
                <th class="py-4 px-6">Genre Name</th>
                <th class="py-4 px-6">Description</th>
                <th class="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-sm text-slate-700">
              <tr v-for="genre in genres" :key="genre.id" class="hover:bg-slate-50/50 transition">
                <!-- Genre ID -->
                <td class="py-4 px-6 font-mono text-slate-400 text-xs">
                  #{{ genre.id }}
                </td>
                <!-- Genre Name -->
                <td class="py-4 px-6 font-semibold text-slate-850">
                  {{ genre.name }}
                </td>
                <!-- Description -->
                <td class="py-4 px-6 text-slate-500 max-w-sm truncate" :title="genre.description">
                  {{ genre.description || 'No description available.' }}
                </td>
                <!-- Actions -->
                <td class="py-4 px-6 text-right space-x-2">
                  <button @click="openEditModal(genre)" class="bg-slate-100 hover:bg-brand-50 hover:text-brand-600 text-slate-600 p-2 rounded-lg text-xs transition" title="Edit">
                    <i class="fa-solid fa-pen-to-square"></i>
                  </button>
                  <button @click="deleteGenre(genre.id)" class="bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 p-2 rounded-lg text-xs transition" title="Delete">
                    <i class="fa-solid fa-trash-can"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ADD/EDIT GENRE MODAL DIALOG -->
      <transition name="fade">
        <div v-if="showModal" class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div class="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 transition-all duration-300">
            
            <div class="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 class="font-display font-extrabold text-slate-800 text-base">
                {{ isEdit ? 'Edit Genre Info' : 'Create New Genre' }}
              </h3>
              <button @click="closeModal" class="text-slate-400 hover:text-slate-600">
                <i class="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            <form @submit.prevent="saveGenre" class="p-6 space-y-4">
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Genre Name <span class="text-red-500">*</span></label>
                <input type="text" v-model="form.name" required placeholder="Genre category name"
                  class="w-full bg-slate-50 border border-slate-200 text-slate-800 px-3.5 py-2.5 rounded-xl text-sm focus:outline-none focus:border-brand-500 transition" />
                <p v-if="errors.name" class="text-rose-600 text-[11px] mt-1">{{ errors.name }}</p>
              </div>

              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Description</label>
                <textarea v-model="form.description" rows="3" placeholder="Write a short summary..."
                  class="w-full bg-slate-50 border border-slate-200 text-slate-800 px-3.5 py-2.5 rounded-xl text-sm focus:outline-none focus:border-brand-500 transition"></textarea>
                <p v-if="errors.description" class="text-rose-600 text-[11px] mt-1">{{ errors.description }}</p>
              </div>

              <div class="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button type="button" @click="closeModal" class="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-4 py-2.5 rounded-xl text-xs transition">
                  Cancel
                </button>
                <button type="submit" class="bg-gradient-to-r from-brand-600 to-brand-accent hover:from-brand-700 hover:to-violet-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-neon transition">
                  Save Genre
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
      genres: [],
      loading: true,
      showModal: false,
      isEdit: false,
      form: {
        id: null,
        name: '',
        description: ''
      },
      errors: {}
    };
  },
  methods: {
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
      this.form = {
        id: null,
        name: '',
        description: ''
      };
      this.showModal = true;
    },
    openEditModal(genre) {
      this.isEdit = true;
      this.errors = {};
      this.form = {
        id: genre.id,
        name: genre.name,
        description: genre.description || ''
      };
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    async saveGenre() {
      this.errors = {};
      try {
        const payload = { ...this.form };

        if (this.isEdit) {
          await axios.put(`api/genres/${this.form.id}`, payload);
          this.$root.showToast('Genre Updated', 'Category details updated successfully.', 'success');
        } else {
          await axios.post('api/genres', payload);
          this.$root.showToast('Genre Created', 'New genre category added.', 'success');
        }
        this.showModal = false;
        await this.fetchGenres();
      } catch (err) {
        if (err.response && err.response.data && err.response.data.messages) {
          this.errors = err.response.data.messages;
        } else {
          this.$root.showToast('Error', err.response?.data?.message || 'Failed to save genre category.', 'error');
        }
      }
    },
    async deleteGenre(id) {
      if (!confirm('Are you sure you want to delete this genre? Any books associated with it will be uncategorized.')) {
        return;
      }
      try {
        await axios.delete(`api/genres/${id}`);
        this.$root.showToast('Genre Deleted', 'The category was removed.', 'success');
        await this.fetchGenres();
      } catch (err) {
        this.$root.showToast('Error', err.response?.data?.message || 'Failed to delete genre.', 'error');
      }
    }
  },
  async mounted() {
    this.loading = true;
    await this.fetchGenres();
    this.loading = false;
  }
};
