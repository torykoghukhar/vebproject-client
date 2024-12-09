<template>
  <div class="my-books">
    <h1 class="my-books-title">My Books</h1>

    <div class="add-book-bar">
      <button @click="showModal = true" class="add-book-button">Add Book</button>
    </div>

    <div class="book-grid">
      <div v-for="book in myBooks" :key="book.id" class="book-card">
        <img 
          :src=" 'http://localhost:8080' + book.pictureUrl" 
          :alt="book.title" 
          class="book-image" 
        />
        <div class="book-details">
          <h3 class="book-title">{{ book.title }}</h3>
          <p class="book-author">{{ book.author }}</p>
        </div>
        <button @click="removeBook(book.id)" class="remove-book-button">Remove</button>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <h2>Add New Book</h2>
        <form @submit.prevent="submitBook">
          <label>
            Title:
            <input v-model="newBook.title" type="text" required />
          </label>
          <label>
            Author:
            <input v-model="newBook.author" type="text" required />
          </label>
          <label>
            Genre:
            <input v-model="newBook.genre" type="text" required />
          </label>
          <label>
            Description:
            <textarea v-model="newBook.description" rows="3" required></textarea>
          </label>
          <label>
            Price:
            <input v-model="newBook.price" type="number" step="0.01" required />
          </label>
          <div class="file-upload">
            <label>Upload Book Image:</label>
            <input type="file" accept="image/*" @change="saveFile" />
            <img v-if="newBook.imagePreview" :src="newBook.imagePreview" alt="Preview" class="preview-image" />
          </div>
          <div class="modal-actions">
            <button type="submit" class="modal-submit">Add Book</button>
            <button type="button" @click="showModal = false" class="modal-cancel">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import backendApi from '@/backendApi/backendApi';

export default {
  name: 'MyBooksPage',
  data() {
    return {
      showModal: false,
      myBooks: [],
      newBook: {
        title: '',
        author: '',
        genre: '',
        description: '',
        price: null,
        image: null,
        imagePreview: null,
      },
    };
  },
  mounted(){this.created()},
  methods: {
    removeBook(id) {
      backendApi
        .delete(`/booksuser/${id}`)
        .then(() => {
          this.myBooks = this.myBooks.filter(book => book.id !== id);
        })
        .catch(error => {
          console.error('Error removing book:', error);
          alert('Failed to remove book. Please try again.');
        });
    },

    saveFile(event){
      const file = event.target.files[0];
      if (file) {
      this.newBook.image = file;
      }
    },


    handleFileUpload( bookid) {
      const file = this.newBook.image;
        if (file) {
        const formData = new FormData();
        formData.append('file', file);
        backendApi
          .post(`/books/upload-photo/${bookid}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          })
          .then(response => {
            alert('Image uploaded successfully!');
            this.created();
          })
          .catch(error => {
            console.error('Error uploading image:', error);
            alert('Failed to upload image. Please try again.');
          });
        }
    },

    submitBook() {
      backendApi
        .post('/booksuser', this.newBook)
        .then(response => {
         
          this.showModal = false;
          this.handleFileUpload( response.data);
          this.resetForm();
          alert('Book added to website!');})
        .catch(error => {
          console.error('Error adding book:', error);
          alert('Failed to add book. Please try again.');
        });
    },
    resetForm() {
      this.newBook = {
        title: '',
        author: '',
        genre: '',
        description: '',
        price: null,
        image: '',
      };
    },
    created() {
    
    backendApi
      .get('/booksuser')
      .then(response => {
        this.myBooks = response.data;

      })
      .catch(error => {
        console.error('Error fetching books:', error);
      });
    },
  }
};
</script>

<style>
.my-books {
  padding: 20px;
  font-family: Arial, sans-serif;
}

.my-books-title {
  text-align: center;
  font-size: 32px;
  color: #120046;
  margin-bottom: 20px;
}

.add-book-bar {
  text-align: center;
  margin-bottom: 20px;
}

.add-book-button {
  background-color: #3c008b;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.add-book-button:hover {
  background-color: #5d28b5;
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

.book-author {
  font-size: 14px;
  color: #555;
  margin-bottom: 10px;
}

.remove-book-button {
  background-color: #ff4d4f;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
}

.remove-book-button:hover {
  background-color: #ff6b6d;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 90%;
  max-width: 400px;
  max-height: 90%;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Заголовок модального окна */
.modal-content h2 {
  margin-top: 0;
  font-size: 20px;
  color: #3c008b;
}

/* Формы в модальном окне */
.modal-content form label {
  display: block;
  margin-bottom: 10px;
  font-weight: bold;
  color: #555;
}

.modal-content form input,
.modal-content form textarea {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  box-sizing: border-box;
}

/* Действия (кнопки) в модальном окне */
.modal-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}

.modal-submit {
  background-color: #3c008b;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  flex-grow: 1;
  margin-right: 10px;
}

.modal-submit:hover {
  background-color: #5d28b5;
}

.modal-cancel {
  background-color: #ff4d4f;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  flex-grow: 1;
}

.modal-cancel:hover {
  background-color: #ff6b6d;
}

.preview-image {
  margin-top: 10px;
  max-width: 100%;
  height: auto;
  border: 1px solid #ddd;
  border-radius: 5px;
}
</style>