<template>
  <section class="main-page__features ck-content">
    <div class="main-page__features-container">
      <router-link to="/methodic" class="main-page__features-container__item" data-test="features-item-methodic">
        <div v-motion-slide-visible-once-left :delay="500">
          <h2 class="main-page__features-container__title">Методика</h2>
          <div class="main-page__features-container__card">
            <div v-if="methodic[0]?.body" class="main-page__features-container__text" v-html="methodicBody?.body"></div>
            <div v-else class="main-page__features-container__text">
              Преподаём по лексическому подходу — то есть делаем акцент на запоминании и использовании не отдельных
              слов, а фраз и словосочетаний — так легче запоминать слова и легче научиться разговаривать.
            </div>
            <span class="main-page__features-container__more-details">Подробнее...</span>
          </div>
        </div>
      </router-link>
      <router-link to="/atmosphere" class="main-page__features-container__item" data-test="features-item-atmosphere">
        <div v-motion-slide-visible-once-right :delay="500">
          <h2 class="main-page__features-container__title">Атмосфера</h2>
          <div class="main-page__features-container__card">
            <div
              v-if="atmosphere[0]?.body"
              class="main-page__features-container__text"
              v-html="atmosphereBody?.body"
            ></div>
            <div v-else class="main-page__features-container__text">
              Школа небольшая и уютная. Аудитории школы находятся в мансарде. В перерывах пьём чай (иногда вино), едим
              печенье и листаем книги на итальянском.
            </div>
            <span class="main-page__features-container__more-details">Подробнее...</span>
          </div>
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

<style scoped lang="scss">
.main-page__features {
  padding-top: 3rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--hover-color);
  z-index: 2;
}
.main-page__features-container {
  display: flex;
  flex-direction: column;
  &__item {
    -webkit-transition: color 0.2s;
    transition: color 0.2s;
    text-decoration: none;
    margin-bottom: 30px;
  }
  &__more-details {
    color: var(--bairro-alto-logo-color);
    &:hover {
      color: var(--hover-color);
    }
  }
  &__title {
    color: var(--bairro-alto-logo-color);
  }
  &__text {
    color: #000;
    text-align: justify;
    text-justify: inter-word;
    z-index: 1;
  }
  &__card {
    min-height: 180px !important;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
}
@media (min-width: 900px) {
  .main-page__features {
    padding-bottom: 4rem;
  }
  .main-page__features-container {
    flex-direction: row;
    justify-content: space-around;
    &__item {
      -webkit-box-flex: 0;
      -ms-flex: 0 0 30%;
      flex: 0 0 45%;
      margin-bottom: -30px;
    }
  }
}
@media (min-width: 1199px) {
  .main-page__features-container {
    flex-direction: row;
    justify-content: space-between;
  }
}
</style>
