<template>
  <div class="catalog">
    <h1 class="catalog-title">Book Catalog</h1>
    <div class="filter-bar">
      <input 
        type="text" 
        v-model="searchQuery" 
        placeholder="Search books..." 
        class="search-input" 
        @input="filterBooks"
      />
      <button @click="toggleFilterPanel" class="filter-button">Apply Filter</button>
    </div>

    <!-- Sidebar Filter Panel -->
    <div class="filter-panel" v-if="showFilterPanel">
      <h2>Filters</h2>
      <button @click="toggleFilterPanel" class="close-button">X</button>
      
      <!-- Publisher Filter -->
      <div class="filter-group">
        <label for="publisher">Publisher:</label>
        <select id="publisher" v-model="selectedPublisher">
          <option value="">All</option>
          <option v-for="publisher in publishers" :key="publisher.id" :value="publisher.name">
            {{ publisher.name }}
          </option>
        </select>
      </div>

      <div class="filter-group"> 
        <label for="genre">Genre:</label> 
        <select id="genre" v-model="selectedGenre"> 
          <option value="">All</option> 
          <option v-for="genre in genres" :key="genre" :value="genre"> 
            {{ genre }} 
          </option> 
        </select> 
      </div>

      <div class="filter-group">
        <label for="author">Author:</label>
        <select id="author" v-model="selectedAuthor">
          <option value="">All</option>
          <option v-for="author in authors" :key="author" :value="author">
            {{ author }}
          </option>
        </select>
      </div>
      
      <!-- Condition Filter -->
      <div class="filter-group">
        <label>Condition:</label>
        <div>
          <label><input type="radio" value="new" v-model="selectedCondition" /> New</label>
          <label><input type="radio" value="used" v-model="selectedCondition" /> Used</label>
        </div>
      </div>
      
      <!-- Price Range Filter -->
      <div class="filter-group">
        <label>Price Range:</label>
        <div>
          <input 
            type="number" 
            v-model.number="minPrice" 
            placeholder="Min price" 
            class="price-input"
          />
          <input 
            type="number" 
            v-model.number="maxPrice" 
            placeholder="Max price" 
            class="price-input"
          />
        </div>
      </div>
      
      <button @click="applyFilters" class="apply-filters-button">Apply</button>
      <button @click="resetFilters" class="reset-filters-button">Reset Filters</button>
    </div>

    <div class="book-grid">
      <div 
        v-for="book in filteredBooks" 
        :key="book.id" 
        class="book-card" 
        @click="goToBookDetails(book.id)"
      >
      <img :src="require('@/assets/bookcovers/' + book.pictureUrl)" :alt="book.title" class="book-image" />
        <div class="book-details">
          <h3 class="book-title">{{ book.title }}</h3>
          <p class="book-author">{{ book.author }}</p>
          <p class="book-price">{{ book.price }} USD</p>
        </div>
        <button v-if="!isAdmin" @click.stop="addToCart(book)" class="add-to-cart-button">Add to Cart</button>
      </div>
    </div>
  </div>
</template>

<script>
import backendApi from '@/backendApi/backendApi';
import { useCartStore } from '@/stores/cart';
import { jwtDecode } from "jwt-decode";

export default {
  name: 'CatalogPage',
  data() {
    return {
      books: [], 
      filteredBooks: [], 
      publishers: [], 
      genres: [], 
      authors: [], 
      searchQuery: '', 
      showFilterPanel: false, 
      selectedPublisher: '', 
      selectedCondition: '', 
      selectedGenre: '', 
      selectedAuthor: '', 
      minPrice: null, 
      maxPrice: null, 
      isAdmin: false,
    };
  },
  mounted() {
    this.fetchBooks();
    this.fetchPublishers();
    this.fetchGenres();
    this.fetchAuthors();
    this.checkIsAdmin();
  },
  methods: {
    fetchBooks() {
      backendApi
        .get('/getallbooks')
        .then(response => {
          this.books = response.data;
          this.filteredBooks = this.books;
          console.log(this.books);
        })
        .catch(error => console.error('Error fetching books:', error));
    },
    fetchPublishers() {
      backendApi
        .get('/getallpublishers')
        .then(response => {
          this.publishers = response.data;
        })
        .catch(error => console.error('Error fetching publishers:', error));
    },
    fetchGenres() {
      backendApi
        .get('/getallgenres')
        .then(response => {
          this.genres = response.data;
        })
        .catch(error => console.error('Error fetching genres:', error));
    },
    fetchAuthors() {
      backendApi
        .get('/getallauthors')
        .then(response => {
          this.authors = response.data;
        })
        .catch(error => console.error('Error fetching authors:', error));
    },
    filterBooks() {
      this.filteredBooks = this.books.filter(book => {
        return book.title.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
               book.author.toLowerCase().includes(this.searchQuery.toLowerCase());
      });
    },
    applyFilters() {
      const filterData = {
        publisher: this.selectedPublisher || null,
        condition: this.selectedCondition || null,
        genre: this.selectedGenre || null,
        author: this.selectedAuthor || null,
        minPrice: this.minPrice || null,
        maxPrice: this.maxPrice || null,
        search: this.searchQuery || null,
      };

      backendApi
    .post('/applyfilters', filterData)
    .then(response => { 
      this.filteredBooks = response.data; 
      this.toggleFilterPanel(); 
    }) 
    .catch(error => console.error('Error applying filters:', error));
    },
    resetFilters() {
      this.selectedPublisher = '';
      this.selectedCondition = '';
      this.selectedGenre = '';
      this.selectedAuthor = '';
      this.minPrice = null;
      this.maxPrice = null;
      this.searchQuery = '';
      this.filteredBooks = this.books;
    },
    toggleFilterPanel() {
      this.showFilterPanel = !this.showFilterPanel;
    },
    addToCart(book) {
      const cartStore = useCartStore();
      cartStore.addToCart(book);
      console.log('Added to cart:', book);
      alert('Book added to cart!');
    },
    goToBookDetails(bookId) {
      this.$router.push(`/book-details/${bookId}`);
    },
    checkIsAdmin() {
      const token = localStorage.getItem('token');
      if (!token) {
        this.isAdmin = false;
        return;
      }

      try {
        const decodedToken = jwtDecode(token);

        this.isAdmin = decodedToken.role && decodedToken.role.includes('ROLE_ADMIN');
      } catch (error) {
        console.error('Invalid token:', error);
        this.isAdmin = false;
      }
    }
  },
};
</script>

<style scoped>
.catalog {
  padding: 20px;
  font-family: Arial, sans-serif;
}

.catalog-title {
  text-align: center;
  font-size: 32px;
  color: #120046;
  margin-bottom: 20px;
}

.filter-bar {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}

.search-input {
  width: 300px;
  padding: 10px;
  font-size: 16px;
  border: 2px solid #3c008b;
  border-radius: 5px;
}

.filter-button {
  background-color: #3c008b;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.filter-button:hover {
  background-color: #5d28b5;
}

/* Sidebar filter panel */
.filter-panel {
  position: fixed;
  top: 0;
  right: 0;
  width: 300px;
  height: 100%;
  background-color: #f9f9f9;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  padding: 20px;
  z-index: 1000;
}

.filter-panel h2 {
  font-size: 24px;
  color: #3c008b;
  margin-bottom: 20px;
}

.filter-panel .close-button {
  background-color: #ff4d4f;
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 16px;
  cursor: pointer;
  padding: 5px 10px;
  position: absolute;
  top: 10px;
  right: 10px;
}

.filter-group {
  margin-bottom: 15px;
}

.filter-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.apply-filters-button {
  background-color: #3c008b;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
}

.apply-filters-button:hover {
  background-color: #5d28b5;
}

.reset-filters-button {
  background-color: #ff4d4f;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
}

.reset-filters-button:hover {
  background-color: #ff7875;
}

.book-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.book-card {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 10px;
  overflow: hidden;
  padding: 10px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
}

.book-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
  border-color: #3c008b;
}

.book-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  margin-bottom: 10px;
  border-radius: 5px;
}

.book-title {
  font-size: 18px;
  font-weight: bold;
  color: #3c008b;
}

.book-price {
  color: #3c008b;
  font-weight: bold;
}

.add-to-cart-button {
  background-color: #3c008b;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>

