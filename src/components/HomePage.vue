<template>
  <div class="home-page">
    <!-- Welcome message -->
    <div class="welcome-message">
      <h1>Welcome to the Bookstore!</h1>
      <p>Explore our catalog, manage your books, and enjoy your shopping experience!</p>
      <router-link to="/catalog">
        <button class="catalog-button">Go to Catalog</button>
      </router-link>
    </div>

    <!-- News and images section -->
    <div class="news-section">
      <h2 class="news-title">Latest News in the World of Books</h2>
      <div class="news-items">
        <div class="news-item" data-fade="fade-up">
          <img :src="require('@/assets/new.jpg')" alt="Book News 1" />
          <div class="news-text">
            <h3>New Book Releases This Month</h3>
            <p>Get ready for exciting new titles from top authors in every genre. Don’t miss out!</p>
          </div>
        </div>
        <div class="news-item" data-fade="fade-up">
          <img :src="require('@/assets/club.jpg')" alt="Book News 2" />
          <div class="news-text">
            <h3>Book Club Events Near You</h3>
            <p>Join a <router-link to="/book-club" class="book-club-link">book club</router-link> to meet fellow readers and dive into deep discussions about your favorite books.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- About section -->
    <div class="about-section">
      <h2>Why Choose Us?</h2>
      <p>
        Our bookstore offers a unique opportunity to not only buy new books from leading publishers
        but also purchase books from other users. By doing so, we help preserve cultural and literary heritage,
        while supporting eco-friendly practices. Reuse books, save the environment, and contribute to a 
        community of passionate readers!
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  mounted() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
        }
      });
    });

    document.querySelectorAll('[data-fade]').forEach((el) => {
      observer.observe(el);
    });
  },
};
</script>

<style scoped>
/* Центрирование welcome message */
.welcome-message {
  text-align: center;
  margin: 50px auto;
}

.welcome-message h1 {
  font-size: 32px;
  margin-bottom: 10px;
}

.welcome-message p {
  font-size: 18px;
  color: #333;
}

/* Стиль для кнопки каталога */
.catalog-button {
  background-color: #3d84ff;
  color: white;
  border: none;
  padding: 12px 30px;
  font-size: 18px;
  font-weight: bold;
  border-radius: 5px;
  cursor: pointer;
  text-decoration: none;
  margin-top: 20px;
  width: 300px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Стандартная тень */
  transition: box-shadow 0.3s ease, background-color 0.3s ease; /* Анимация для тени и фона */
}

.catalog-button:hover {
  background-color: #3c6c9e; /* Темнее фон */
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2); /* Глубокая тень */
}

.catalog-button:active {
  background-color: #00005b;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Возвращаем стандартную тень */
}

/* Эффект выплывания для фото и текста */
[data-fade] {
  opacity: 0;
  transform: translateY(30px); /* Смещение вниз */
  transition: opacity 0.8s ease, transform 0.8s ease;
}

.fade-in {
  opacity: 1;
  transform: translateY(0);
}

/* News Section Styling */
.news-section {
  padding: 40px;
  background-color: #e2f8f7;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.news-title {
  font-size: 24px;
  text-align: center;
  margin-bottom: 20px;
}

.news-items {
  display: flex;
  justify-content: center;
  gap: 80px;
}

.news-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 300px;
}

.news-item img {
  width: 300px;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.news-text {
  margin-top: 10px;
  text-align: center;
}

.news-text h3 {
  font-size: 20px;
  margin-bottom: 5px;
}

.news-text p {
  font-size: 16px;
  color: #555;
}

.book-club-link {
  color: #3c008b;
  text-decoration: none;
}

.book-club-link:hover {
  text-decoration: underline;
}

/* About Section Styling */
.about-section {
  margin-top: 50px;
  padding: 30px;
  background-color: #e2f8f7;
  text-align: center;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.about-section h2 {
  font-size: 26px;
  margin-bottom: 15px;
  color: #1f074d;
}

.about-section p {
  font-size: 18px;
  line-height: 1.6;
  color: #555;
  max-width: 800px;
  margin: 0 auto;
}
</style>