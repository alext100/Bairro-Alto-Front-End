<template>
  <svg viewBox="0 0 18 18">
    <path
      d="M11.5,10.5 C6.4987941,17.5909626 1,3.73719105 11.5,6 C10.4594155,14.5485365 17,13.418278 17,9 C17,4.581722 13.418278,1 9,1 C4.581722,1 1,4.581722 1,9 C1,13.418278 4.581722,17 9,17 C13.418278,17 17,13.42 17,9"
    ></path>
    <polyline points="5 9.25 8 12 13 6"></polyline>
  </svg>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";

export default defineComponent({
  name: "EmailValidationAnimation",

  setup() {
    const regex = new RegExp(
      '^(([^<>()[\\]\\\\.,;:\\s@\\"]+(\\.[^<>()[\\]\\\\.,;:\\s@\\"]+)*)|' +
        '(\\".+\\"))@((\\d{1,3}\\.d{1,3}\\.d{1,3}\\.d{1,3}\\])' +
        "|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{1,5}))$"
    );

    onMounted(() =>
      document.querySelectorAll(".email").forEach((container: Element) => {
        const input: HTMLInputElement | null = container.querySelector("input");

        if (input) {
          input.addEventListener("keyup", () => container.classList.toggle("valid", regex.test(input.value)));
        }
      })
    );
  },
});
</script>

<style lang="scss">
.email {
  --icon: #a6accd;
  --icon-focus: #646b8c;
  --icon-invalid: #f04949;
  --icon-valid: #16bf78;
  svg {
    width: 16px;
    height: 16px;
    top: -60px;
    left: 266px;
    display: block;
    position: relative;
    fill: none;
    stroke: var(--i, var(--icon));
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 1.6;
    transition: stroke 0.3s;
    path {
      stroke-dasharray: 80;
      stroke-dashoffset: var(--path, 170);
      transition: stroke-dashoffset 0.5s ease var(--path-delay, 0.3s);
    }
    polyline {
      stroke-dasharray: 12;
      stroke-dashoffset: var(--tick, 12);
      transition: stroke-dashoffset 0.45s ease var(--tick-delay, 0s);
    }
  }
  .text-input-email {
    &:focus-within {
      --i: var(--icon-focus);
    }
  }
  &:not(.valid) {
    .text-input-email {
      &:not(input:placeholder-shown) {
        &:not(:focus-within) {
          & + svg {
            --i: var(--icon-invalid);
          }
        }
      }
    }
  }
  &.valid {
    --i: var(--icon-valid);
    --path: 132;
    --path-delay: 0s;
    --tick: 0;
    --tick-delay: 0.3s;
  }
}
</style>
