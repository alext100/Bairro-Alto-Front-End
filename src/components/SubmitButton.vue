<template>
  <button class="submit-btn" :type="buttonType" :disabled="buttonDisabled">
    <slot></slot>
  </button>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "SubmitButton",
  props: {
    buttonType: {
      validator(value) {
        return ["submit", "button", "reset", undefined].includes(value);
      },
    },
    buttonDisabled: {
      type: Boolean,
      default: false,
    },
  },
});
</script>

<style lang="scss" scoped>
.submit-btn {
  display: inline-block;
  outline: none;
  font-size: 18px;
  font-weight: 600;
  width: 100%;
  cursor: pointer;
  text-decoration: none;
  justify-content: center;
  padding: 1rem 1.6rem 1rem 2.5rem;
  color: var(--hover-color);
  border: 1px solid var(--hover-color);
  border-radius: 1.2rem;
  -webkit-transition: border-color 0.2s;
  transition: border-color 0.2s;
  line-height: normal;
  background: transparent;
  margin-top: 10px;
  text-transform: uppercase;
  &:hover {
    transform: scale(1.1);
  }
  &.invalid {
    animation: shake 0.5s;
    animation-iteration-count: infinite;
  }
  &:disabled {
    font-size: 17px;
    letter-spacing: 0.3em;
    width: -webkit-fill-available;
    cursor: inherit;
    &:hover {
      transform: scale(1);
    }
  }
}

@keyframes shake {
  0% {
    transform: translate(1px, 1px);
  }
  10% {
    transform: translate(-1px, -2px);
  }
  20% {
    transform: translate(-3px, 0px);
  }
  30% {
    transform: translate(3px, 2px);
  }
  40% {
    transform: translate(1px, -1px);
  }
  50% {
    transform: translate(-1px, 2px);
  }
  60% {
    transform: translate(-3px, 1px);
  }
  70% {
    transform: translate(3px, 1px);
  }
  80% {
    transform: translate(-1px, -1px);
  }
  90% {
    transform: translate(1px, 2px);
  }
  100% {
    transform: translate(1px, -2px);
  }
}
</style>
