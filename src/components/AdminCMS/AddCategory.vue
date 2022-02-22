<template>
  <div class="backdrop">
    <div class="modal-screen">
      <h3 class="float-start">Добавить категорию</h3>
      <button type="button" class="btn-close float-end" aria-label="Close" @click="closeWindow()"></button>
      <div class="clear mt-5"></div>
      <label>Название</label>
      <input type="text" class="form-control" v-model="newTitle" /><button
        class="btn btn-primary"
        @click="addCategory()"
      >
        Добавить
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapActions, mapState } from "vuex";
import { WebContent } from "@/types/interfaces";

export default defineComponent({
  name: "AddCategory",

  data() {
    return {
      newTitle: "",
    };
  },
  props: ["data", "config", "currentPost"],

  computed: {
    ...mapState(["webContent"]),
  },

  methods: {
    ...mapActions(["updateWebContent"]),

    async addCategory() {
      const newItem = {
        title: this.slugify(this.newTitle),
        description: "",
      };

      const newWebContentData: WebContent = {
        posts: [...this.webContent.posts],
        categories: [...this.webContent.categories, newItem],
      };
      await this.updateWebContent(newWebContentData);

      this.$emit("update:data", newWebContentData);
      this.$emit("update:currentPost", newItem);
      this.$emit("update:show", false);
    },

    closeWindow() {
      this.$emit("update:show", false);
    },

    slugify(text: string) {
      return text
        .toString()
        .toLowerCase()
        .replace(/\s+/g, "-") // Replace spaces with -
        .replace(/[^\w-]+/g, "") // Remove all non-word chars
        .replace(/--+/g, "-") // Replace multiple - with single -
        .replace(/^-+/, "") // Trim - from start of text
        .replace(/-+$/, ""); // Trim - from end of text
    },
  },
});
</script>

<style scoped>
.modal-screen {
  width: 500px;
  left: calc(50% - 250px);
}
</style>
