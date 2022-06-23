<template>
  <div
    class="card"
    :class="[
      { 'card-lift--hover': hover },
      { shadow: shadow },
      { [`shadow-${shadowSize}`]: shadowSize },
      { [`bg-gradient-${gradient}`]: gradient },
      { [`bg-${type}`]: type },
    ]"
  >
    <div class="card-header" :class="headerClasses" v-if="$slots.header">
      <slot name="header"> </slot>
    </div>
    <div class="card-body" :class="bodyClasses" v-if="!noBody">
      <slot></slot>
    </div>
    <slot v-if="noBody"></slot>
    <div class="card-footer" :class="footerClasses" v-if="$slots.footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

/**
 * Base Card component
 * @example
    <base-card :hover="true" shadow shadowSize="sm" gradient="warning">
      <template v-slot:header>  </template>
      <template v-slot:body>    </template>
      <template v-slot:tags>    </template>
    </base-card>
 */

export default defineComponent({
  name: "card",
  props: {
    type: {
      type: String as PropType<
        | "primary"
        | "secondary"
        | "success"
        | "danger"
        | "warning"
        | "info"
        | "light"
        | "dark"
        | "body"
        | "white"
        | "transparent"
      >,
      description: "Card type",
    },
    gradient: {
      type: String as PropType<"primary" | "secondary" | "success" | "danger" | "warning" | "info" | "light" | "dark">,
      description: "Card background gradient type (works for bootstrap 4.6, not 5.0+)",
    },
    hover: {
      type: Boolean,
      description: "Whether card should move on hover",
    },
    shadow: {
      type: Boolean,
      description: "Whether card has shadow",
    },
    shadowSize: {
      type: String as PropType<"sm" | "lg" | "none">,
      description: "Card shadow size",
    },
    noBody: {
      type: Boolean,
      default: false,
      description: "Whether card should have wrapper body class",
    },
    bodyClasses: {
      type: [String, Object, Array],
      description: "Card body css classes",
    },
    headerClasses: {
      type: [String, Object, Array],
      description: "Card header css classes",
    },
    footerClasses: {
      type: [String, Object, Array],
      description: "Card footer css classes",
    },
  },
});
</script>
<style lang="scss">
.card-lift--hover {
  &:hover {
    transform: translateY(-10px);
    transition: all 0.15s ease;
  }
}
</style>
