<template>
  <div class="textInput" :class="{ 'has-error': !!errorMessage, success: meta.valid }">
    <label :for="name">{{ label }}</label>
    <input
      :name="name"
      :id="name"
      :type="type"
      :step="step"
      :min="min"
      :max="max"
      :v-model="inputValueVmodel"
      :value="inputValue"
      :placeholder="placeholder"
      @input="handleChange"
      @blur="handleBlur"
    />

    <p class="help-message" v-show="errorMessage || meta.valid">
      {{ errorMessage || successMessage }}
    </p>
  </div>
</template>

<script>
import { useField } from "vee-validate";

export default {
  props: {
    type: {
      type: String,
      default: "text",
    },
    step: {
      type: String,
      default: "100",
      required: false,
    },
    min: {
      type: String,
      default: "0",
      required: false,
    },
    max: {
      type: String,
      default: "100000",
      required: false,
    },
    value: {
      type: String,
      default: "",
    },
    inputValueVmodel: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    successMessage: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "",
    },
  },
  setup(props) {
    const {
      value: inputValue,
      errorMessage,
      handleBlur,
      handleChange,
      meta,
    } = useField(props.name, undefined, {
      initialValue: props.value,
    });

    return {
      handleChange,
      handleBlur,
      errorMessage,
      inputValue,
      meta,
    };
  },
};
</script>

<style scoped>
.textInput {
  position: relative;
  margin-bottom: calc(1em * 1.5);
  width: 100%;
}

label {
  display: block;
  margin-bottom: 4px;
  width: 100%;
}

input {
  border-radius: 5px;
  border: 2px solid transparent;
  padding: 15px 10px;
  outline: none;
  background-color: #f2f5f7;
  width: 100%;
  transition: border-color 0.3s ease-in-out, color 0.3s ease-in-out, background-color 0.3s ease-in-out;
}

input:focus {
  border-color: var(--hover-color);
}

.help-message {
  position: absolute;
  bottom: calc(-1.5 * 1em);
  left: 0;
  margin: 0;
  font-size: 14px;
}

.textInput.has-error input {
  background-color: var(--error-bg-color);
  color: var(--error-color);
}

.textInput.has-error input:focus {
  border-color: var(--error-color);
}

.textInput.has-error .help-message {
  color: var(--error-color);
}

.textInput.success input {
  background-color: var(--success-bg-color);
  color: var(--success-color);
}

.textInput.success input:focus {
  border-color: var(--success-color);
}

.textInput.success .help-message {
  color: var(--success-color);
}
</style>
