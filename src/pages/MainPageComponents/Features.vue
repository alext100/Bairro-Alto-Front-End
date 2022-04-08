<template>
  <section class="main-page__features ck-content">
    <div class="features">
      <router-link to="/methodic" class="features-item">
        <div v-motion-slide-visible-once-left :delay="300">
          <h2 class="features-title">Методика</h2>
          <div v-if="methodic[0]?.body" class="features-text" v-html="methodicBody?.body"></div>
          <div v-else class="features-text">
            Преподаём по лексическому подходу — то есть делаем акцент на запоминании и использовании не отдельных слов,
            а фраз и словосочетаний — так легче запоминать слова и легче научиться разговаривать.
          </div>
          <span>Подробнее...</span>
        </div>
      </router-link>
      <router-link to="/atmosphere" class="features-item">
        <div v-motion-slide-visible-once-right :delay="300">
          <h2 class="features-title">Атмосфера</h2>
          <div v-if="atmosphere[0]?.body" class="features-text" v-html="atmosphereBody?.body"></div>
          <div v-else class="features-text">
            Школа небольшая и уютная. Аудитории школы находятся в мансарде. В перерывах пьём чай (иногда вино), едим
            печенье и листаем книги на итальянском.
          </div>
          <span>Подробнее...</span>
        </div>
      </router-link>
    </div>
  </section>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "Features",

  props: {
    methodic: { type: Object, required: true },
    methodicBody: { type: Object, required: true },
    atmosphere: { type: Object, required: true },
    atmosphereBody: { type: Object, required: true },
  },
});
</script>

<style scoped>
.features {
  display: flex;
  flex-direction: column;
}

.features-item {
  color: var(--hover-color);
  -webkit-transition: color 0.2s;
  transition: color 0.2s;
  text-decoration: none;
  margin-bottom: 30px;
}
.features-text {
  color: #000;
  text-align: justify;
  text-justify: inter-word;
  z-index: 1;
}
.main-page__features {
  padding-top: 3rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--hover-color);
  z-index: 2;
}
@media (min-width: 900px) {
  .main-page__features {
    padding-bottom: 4rem;
  }
  .features {
    flex-direction: row;
    justify-content: space-around;
  }
  .features-item {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 30%;
    flex: 0 0 45%;
    margin-bottom: -30px;
  }
}
@media (min-width: 1199px) {
  .features {
    flex-direction: row;
    justify-content: space-between;
  }
}
</style>
