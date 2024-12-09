<template>
  <div class="book-club-page">
    <!-- Заголовок -->
    <h1 class="main-title">Welcome to the Book Club!</h1>
    <p class="intro-text">
      Are you a book lover looking to connect with fellow readers? Join our vibrant Book Club 
      and embark on a literary journey filled with discussions, events, and unforgettable stories.
    </p>

    <!-- Раздел о клубе -->
    <div class="about-section fade-in">
      <img :src="require('@/assets/clubtitle.jpg')" alt="Book Club Meeting" class="about-image" />
      <div class="about-text">
        <h2>About Our Club</h2>
        <p>
          Our Book Club is a community of passionate readers who come together to explore a diverse range 
          of books. From fiction and non-fiction to sci-fi and fantasy, we cover it all. We believe in the power 
          of stories to inspire, connect, and transform lives.
        </p>
      </div>
    </div>

    <!-- Раздел мероприятий -->
    <div class="events-section fade-in">
      <h2>Upcoming Events</h2>
      <div class="event">
        <img :src="require('@/assets/clubpage.jpg')" alt="Book Discussion" class="event-image" />
        <div class="event-details">
          <h3>Monthly Book Discussion</h3>
          <p>
            Join us on <b>November 25th</b> to discuss our book of the month, "The Great Gatsby" by F. Scott Fitzgerald.
          </p>
        </div>
      </div>
      <div class="event">
        <img :src="require('@/assets/autorclub.jpg')" alt="Author Talk" class="event-image" />
        <div class="event-details">
          <h3>Author Talk: Jane Doe</h3>
          <p>
            Don't miss our exclusive session with acclaimed author Jane Doe on <b>December 10th</b>, 
            where she'll share insights on her latest novel.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BookClubPage',
};
</script>

<style scoped>
/* Основные стили страницы */
.book-club-page {
  font-family: Arial, sans-serif;
  color: #333;
  line-height: 1.6;
  padding: 20px;
}

.main-title {
  font-size: 36px;
  color: #120046;
  text-align: center;
  margin-bottom: 20px;
}

.intro-text {
  text-align: center;
  margin-bottom: 40px;
  font-size: 18px;
  color: #555;
}

/* Секция "Про клуб" */
.about-section {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 40px;
}

/* Подсветка при наведении на секции */
.about-section:hover,
.event:hover {
  background-color: #a0bcf8; /* Лёгкий фон при наведении */
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15); /* Тень при наведении */
  transition: all 0.3s ease-in-out; /* Анимация эффекта */
  border-radius: 10px;
}

/* Подсветка текста и изображения внутри контейнеров */
.about-section:hover .about-text h2,
.event:hover .event-details h3 {
  color: #4826e4; /* Изменение цвета текста */
  transition: color 0.3s ease-in-out;
}

.about-section:hover .about-image,
.event:hover .event-image {
  transition: none;
}

/* Эффект для текста */
.about-section:hover .about-text p,
.event:hover .event-details p {
  color: #333; /* Немного насыщеннее */
}

.about-image,
.event-image {
  width: 100%;
  max-width: 300px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  object-fit: cover;
}

.event-image {
  max-width: 200px;
}

.about-text h2,
.events-section h2 {
  font-size: 28px;
  color: #120046;
  margin-bottom: 10px;
  text-align: center;
}

.about-text p,
.event-details p {
  font-size: 16px;
  color: #555;
}

.events-section {
  margin-top: 40px;
}

.event {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
}

.event-details h3 {
  font-size: 20px;
  color: #333;
  margin-bottom: 10px;
}

/* Анимации */
.fade-in {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInEffect 1.2s ease-out forwards;
}

@keyframes fadeInEffect {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Адаптивность */
@media (max-width: 768px) {
  .about-section,
  .event {
    flex-direction: column;
    text-align: center;
  }

  .about-image,
  .event-image {
    max-width: 100%;
  }
}
</style>

  
  