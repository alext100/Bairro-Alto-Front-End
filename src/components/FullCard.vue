<template>
  <card class="card-stats" :show-footer-line="true">
    <div class="row">
      <div class="col">
        <slot name="header"> </slot>
        <slot>
          <h5 class="card-title text-uppercase text-muted mb-0" v-if="title">
            {{ title }}
          </h5>
          <span class="h2 font-weight-bold mb-0" v-if="subTitle">{{ subTitle }}</span>
        </slot>
      </div>

      <div class="col-auto" v-if="$slots.icon || icon">
        <slot name="icon">
          <div class="icon icon-shape rounded-circle shadow" :class="[`bg-${type}`, iconClasses]">
            <em :class="icon"></em>
          </div>
        </slot>
      </div>
    </div>

    <p class="mt-3 mb-0 text-sm">
      <slot name="footer"> </slot>
    </p>
  </card>
</template>
<script>
import Card from "@/components/BaseCard.vue";

export default {
  name: "FullCard",
  components: {
    Card,
  },
  props: {
    type: {
      type: String,
      default: "primary",
    },
    icon: String,
    title: String,
    subTitle: String,
    iconClasses: [String, Array],
  },
};
</script>
