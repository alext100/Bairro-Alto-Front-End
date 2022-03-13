<template>
  <ul class="list-group">
    <template v-for="item in posts" :key="item">
      <li class="list-group-item" @click="setCurrentItem(item.id)" :class="{ active2: currentPost.id === item.id }">
        <strong>{{ item.title }}</strong
        ><br />
        <span v-html="setShortDescription(item.body, 60)"></span>
      </li>
    </template>
  </ul>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Post } from "@/types/interfaces";

export default defineComponent({
  name: "PostList",

  props: ["posts", "currentPost"],

  methods: {
    setCurrentItem(id: string) {
      const currentPost = this.$props.posts.filter((post: Post) => post.id === id)[0];
      this.$emit("update:currentPost", currentPost);
    },

    setShortDescription(text: string, max: number) {
      if (text && text.length > max) {
        text.slice(0, max);
      }
      const regex = /(<([^>]+)>)/gi;
      return text.replace(regex, "");
    },
  },
});
</script>
