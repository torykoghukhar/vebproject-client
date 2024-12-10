<template>
  <div class="book-details-page">
    <div class="book-details-container">
      <img :src="require('@/assets/bookcovers/' + book.pictureUrl)" :alt="book.title" class="book-cover" />
      <div class="book-info">
        <h1>{{ book.title }}</h1>
        <p><strong>Author:</strong> {{ book.author }}</p>
        <p><strong>Genre:</strong> {{ book.genre }}</p>
        <p><strong>Description:</strong> {{ book.description }}</p>
        <p><strong>Price:</strong> {{ book.price }} USD</p>
        <p><strong>Condition:</strong> {{ book.condition }}</p>
        <p v-if="book.user && book.user !== 'unknown'"><strong>Publisher/User:</strong> {{ book.user }}</p>
        <p v-else-if="book.publisher && book.publisher !== 'unknown'"><strong>Publisher:</strong> {{ book.publisher }}</p>
        <p v-else><strong>Publisher/User:</strong> unknown</p>

        <button v-if="!isAdmin" @click="addToCart(book)" class="add-to-cart-button">Add to Cart</button>
        <button v-if="!isAdmin" @click="showReviewForm = !showReviewForm" class="add-review-button">
          Add Review
        </button>

        <button 
          v-if="isAdmin" 
          @click="showUpdateForm = !showUpdateForm" 
          class="update-book-button"
        >
          Update Book
        </button>

        <!-- Форма для обновления книги -->
        <div v-if="showUpdateForm" class="update-form">
          <h2>Update Book</h2>
          <label for="title">Title:</label>
          <input type="text" id="title" v-model="updatedBook.title" />

          <label for="author">Author:</label>
          <input type="text" id="author" v-model="updatedBook.author" />

          <label for="genre">Genre:</label>
          <input type="text" id="genre" v-model="updatedBook.genre" />

          <label for="description">Description:</label>
          <textarea id="description" v-model="updatedBook.description" rows="4"></textarea>

          <label for="price">Price:</label>
          <input type="number" id="price" v-model="updatedBook.price" />

          <label for="condition">Condition:</label>
          <input type="text" id="condition" v-model="updatedBook.condition" />

          <button @click="submitUpdate" class="submit-update-button">Save Changes</button>
        </div>

        <div v-if="showReviewForm" class="review-form">
          <h2>Add Your Review</h2>
          <label for="rating">Rating:</label>
          <select id="rating" v-model="review.rating">
            <option disabled value="">Select rating</option>
            <option value="5">5 - Excellent</option>
            <option value="4">4 - Good</option>
            <option value="3">3 - Average</option>
            <option value="2">2 - Poor</option>
            <option value="1">1 - Terrible</option>
          </select>

          <label for="comment">Comment:</label>
          <textarea 
            id="comment" 
            v-model="review.comment" 
            placeholder="Write your review here..." 
            rows="4">
          </textarea>

          <button @click="submitReview" class="submit-review-button">Submit Review</button>
        </div>

        <div class="reviews-section" v-if="reviewList.length">
          <h2>Reviews</h2>
            <div v-for="review in reviewList" :key="review.id" class="review-item">
            <p><strong>Rating:</strong> {{ review.rating }} / 5</p>
            <p><strong>Comment:</strong> {{ review.comment }}</p>
              <button 
              v-if="review.username === currentUserName || isAdmin" 
              @click="deleteReview(review.id)" 
              class="delete-review-button">
              Delete
            </button>
          <hr />
        </div>
      </div>
      <p v-else>No reviews yet. Be the first to leave a review!</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import backendApi from '@/backendApi/backendApi';
import { useRoute } from 'vue-router';
import { useCartStore } from '@/stores/cart';
import { jwtDecode } from "jwt-decode";

export default {
  name: 'BookDetailsPage',
  setup() {
    const isAdmin = ref(false);
    const book = ref({});
    const reviewList = ref([]);
    const updatedBook = ref({});
    const showReviewForm = ref(false);
    const showUpdateForm = ref(false);
    const review = ref({
      bookId: null,
      rating: 1,
      comment: ''
    });
    const route = useRoute();
    const currentUserName = ref('');
    const fetchBookDetails = async () => {
  const bookId = route.params.bookId;
  try {
    const response = await backendApi.get(`/books/` + bookId);
    book.value = response.data;
    if(isAdmin){
      updatedBook.value = { ...response.data };
    }
    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    currentUserName.value = decodedToken.sub;
  } catch (error) {
    console.error('Error fetching book details:', error);
    alert('Failed to fetch book details. Please try again later.');
  }
};

const submitUpdate = async () => {
      try {
        const response = await backendApi.put(`/updatebook/${book.value.id}`, updatedBook.value);
        book.value = response.data;
        showUpdateForm.value = false;
        alert('Book updated successfully!');
      } catch (error) {
        console.error('Error updating book:', error);
        alert('Failed to update book. Please try again later.');
      }
    };

const fetchBookReviews = async () => {
  const bookId = route.params.bookId;
  try {
    const response = await backendApi.get(`/allreviewsforbook/` + bookId);
    if (response.data && response.data.length) {
      reviewList.value = response.data;
    }
  } catch (error) {
    if (error.status != 404){
        console.error('Error fetching book reviews:', error);
    alert('Failed to fetch book reviews. Please try again later.');}
  }
};

    const addToCart = (book) => {
      const cartStore = useCartStore();
      cartStore.addToCart(book);
      console.log('Added to cart:', book);
    };

    const submitReview = async() => {
      if (!review.value.rating || !review.value.comment) {
        alert('Please fill out both the rating and comment.');
        return;
      }
      review.value.bookId = book.value.id;
      await backendApi.post('/addreview', review.value);
      fetchBookReviews();
      review.value.rating = 1;
      review.value.comment = '';
      showReviewForm.value = false;
    };

    const deleteReview = async (reviewId) => {
  try {
    await backendApi.delete(`/deletereviews/${reviewId}`);
    
    reviewList.value = reviewList.value.filter(review => review.id !== reviewId);
    
    alert('Review deleted successfully.');
  } catch (error) {
    console.error('Error deleting review:', error);
    alert('Failed to delete review. Please try again later.');
  }
};

const checkIsAdmin = () => {
  const token = localStorage.getItem('token');
  const decodedToken = jwtDecode(token);
  const role = decodedToken.role;
  if (role && role.includes('ROLE_ADMIN')){
    isAdmin.value = true;
  }
};


onMounted(() => {
  fetchBookDetails();
  checkIsAdmin();
  fetchBookReviews();
});


    return {
      book,
      showReviewForm,
      review,
      fetchBookDetails,
      addToCart,
      submitReview,
      reviewList,
      currentUserName,
      deleteReview,
      isAdmin,
      checkIsAdmin,
      fetchBookReviews,
      showUpdateForm,
      submitUpdate,
      updatedBook,
    };
  }
};
</script>

  <style scoped>
  .book-details-page {
    padding: 20px;
    font-family: Arial, sans-serif;
    max-width: 800px;
    margin: 0 auto;
  }
  
  .book-details-container {
    display: flex;
    gap: 20px;
    align-items: flex-start;
  }
  
  .book-cover {
    width: 250px;
    height: auto;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .book-info {
    flex: 1;
  }
  
  .book-details-page h1 {
    font-size: 32px;
    color: #120046;
    margin-bottom: 10px;
  }
  
  .book-info p {
    font-size: 16px;
    color: #333;
    margin: 5px 0;
  }
  
  .add-to-cart-button,
  .add-review-button,
  .submit-review-button {
    background-color: #3c008b;
    color: white;
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 10px;
  }
  
  .add-review-button {
    margin-left: 10px;
  }
  
  .add-to-cart-button:hover,
  .add-review-button:hover,
  .submit-review-button:hover {
    background-color: #5d28b5;
  }
  
  .review-form {
    margin-top: 20px;
    padding: 15px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .review-form h2 {
    font-size: 24px;
    color: #120046;
    margin-bottom: 10px;
  }
  
  .review-form label {
    display: block;
    font-weight: bold;
    margin-top: 10px;
  }
  
  .review-form select,
  .review-form textarea {
    width: 90%;
    padding: 8px;
    font-size: 14px;
    margin-top: 5px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  .reviews-section {
  margin-top: 30px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.reviews-section h2 {
  font-size: 24px;
  color: #120046;
  margin-bottom: 15px;
}

.review-item {
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 10px;
  background: #e3f2f7;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}


.review-item:last-child {
  border-bottom: none;
}

.review-item p {
  font-size: 16px;
  color: #444;
}

.delete-review-button {
  background-color: #ff4d4f;
  color: white;
  padding: 8px 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}

.delete-review-button:hover {
  background-color: #ff7875;
}
.update-book-button {
  background-color: #007bff;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}

.update-book-button:hover {
  background-color: #0056b3;
}

.update-form {
  margin-top: 20px;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.update-form h2 {
  font-size: 24px;
  color: #120046;
  margin-bottom: 10px;
}

.update-form label {
  display: block;
  font-weight: bold;
  margin-top: 10px;
}

.update-form input,
.update-form textarea {
  width: 90%;
  padding: 8px;
  font-size: 14px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.submit-update-button {
  background-color: #28a745;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}

.submit-update-button:hover {
  background-color: #218838;
}
  </style>
