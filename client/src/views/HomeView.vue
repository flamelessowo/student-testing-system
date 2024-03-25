<script setup lang="ts">
import { ref } from 'vue';

</script>
<template>
  <div class="landing-page">
    <div class="hero">
      <h1>Сайт для тестування студентів УжНУ</h1>
      <p></p>
    </div>
    <div class="features">
      <div class="feature">
        <img src="/uz1.jpg" alt="Feature 1" />
        <h3>Навіщо?</h3>
        <p>Основою сайту для тестування студентів є його зручний та ефективний інтерфейс, який дозволяє студентам проходити тести в будь-який час та з будь-якого пристрою з Інтернетом.</p>
      </div>
      <div class="feature">
        <img src="/uz2.jpg" alt="Feature 2" />
        <h3>Які проблеми він вирішує?</h3>
        <p>Цей сайт надає можливість створювати різні типи тестів, включаючи однозначний вибір, багато варіантів відповіді що дозволяє гнучко адаптувати тестування до потреб викладачів та освітніх програм.</p>
      </div>
      <div class="feature">
        <img src="/uz3.jpg" alt="Feature 3" />
        <h3>Яка користь?</h3>
        <p>Сайт для тестування студентів забезпечує швидкий фідбек студентам, автоматизує процес тестування, зменшує навантаження на викладачів і забезпечує прозорість в оцінюванні. Він надає студентам миттєвий доступ до результатів тестування, спрощує створення та проведення тестів для викладачів, дозволяє зменшити їх ручну працю, а також створює прозору систему оцінювання. Цей сайт допомагає поліпшити якість навчання та ефективність освітнього процесу.</p>
      </div>
    </div>
  </div>
</template>
<style scoped>
.landing-page {
  text-align: center;
  padding: 50px;
}

.hero {
  margin-bottom: 50px;
}

.cta-button {
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 18px;
  cursor: pointer;
}

.features {
  display: flex;
  justify-content: space-between;
  margin-bottom: 50px;
}

.feature {
  width: 30%;
  text-align: center;
}

.feature img {
  width: 100%;
  max-width: 200px;
  height: auto;
  margin-bottom: 20px;
}

footer {
  background-color: #f5f5f5;
  padding: 20px;
  text-align: center;
  font-size: 14px;
}
</style>
