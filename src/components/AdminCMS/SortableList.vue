<template>
  <div class="backdrop">
    <div class="modal-screen">
      <h4 class="float-start">Manage {{ title }}</h4>
      <button type="button" class="btn-close float-end" aria-label="Close" @click="closeWindow()"></button>
      <div class="clear mt-5"></div>

      <div class="sortable">
        <ul class="list-group">
          <template v-for="(item, i) in items" :key="item">
            <li class="list-group-item text-truncate" :class="{ sorting: sorting == item.id }">
              <div class="row g-0 d-flex">
                <div class="col-1">
                  <div>
                    <i class="fas fa-chevron-up move-icon" @click="moveUp(item.id, i)"></i>
                  </div>
                  <div>
                    <i class="fas fa-chevron-down move-icon" @click="moveDown(item.id, i)"></i>
                  </div>
                </div>
                <div class="col-10 text-truncate justify-content-center align-self-center">
                  {{ item.title }}
                </div>

                <div class="col-1 mt-1 justify-content-center align-self-center">
                  <n-popconfirm
                    @positive-click="handlePositiveClick(item.id)"
                    @negative-click="handleNegativeClick(item.id)"
                    :animated="true"
                    :flip="true"
                  >
                    <template #activator>
                      <i class="fas fa-trash float-end move-icon trash-icon"></i>
                    </template>
                    Уверены?
                  </n-popconfirm>
                </div>
              </div>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { mapActions, mapState } from "vuex";
import { NPopconfirm, useMessage } from "naive-ui";

export default defineComponent({
  name: "SortableList",

  components: {
    NPopconfirm,
  },

  setup() {
    const message = useMessage();

    return {
      async handlePositiveClick(id) {
        message.info("Удаляем!");
        await this.deleteWebPost(id);
        await this.deleteWebCategory(id);
        this.$emit(
          "update:items",
          this.items.filter((item) => item.id !== id)
        );
      },

      handleNegativeClick() {
        message.info("Не удаляем");
      },
    };
  },

  props: ["items", "show", "title"],

  data() {
    return {
      sorting: false,
    };
  },

  computed: {
    ...mapState(["webContent"]),
  },

  methods: {
    ...mapActions(["deleteWebPost", "deleteWebCategory", "updateWebContent"]),

    moveUp(id, i) {
      this.sorting = id;
      const itemIndexInWebContentPosts = this.webContent.posts.findIndex((post) => post.id === id);
      const previousItemIndex = this.webContent.posts.findIndex((post) => post.id === this.items[i - 1].id);
      setTimeout(() => {
        const newIndex = previousItemIndex - 1;
        if (itemIndexInWebContentPosts > 0) {
          this.changeIndexInArray(this.webContent.posts, itemIndexInWebContentPosts, newIndex);
        }
      }, 200);
    },

    moveDown(id, i) {
      this.sorting = id;
      setTimeout(() => {
        const newIndex = i + 1;
        if (this.items.length - 1 !== i) {
          this.changeIndexInArray(this.items, i, newIndex);
        }
      }, 200);
    },

    changeIndexInArray(arr, oldIndex, newIndex) {
      const items = [...arr];
      if (newIndex >= arr.length) {
        let k = newIndex - arr.length + 1;
        // eslint-disable-next-line no-cond-assign
        while ((k -= 1)) {
          arr.push(undefined);
        }
      }
      items.splice(newIndex, 0, items.splice(oldIndex, 1)[0]);
      this.updateWebContent(items);
      return items;
    },

    closeWindow() {
      this.$emit("update:show", false);
    },
  },
});
</script>

<style scoped>
.margin-right {
  margin-right: 15px;
  margin-top: 5px;
}

.list-group-item {
  transition: all 0.4s ease-out;
}

.sorting {
  background-color: #fdf3d1;
}

.move-icon:hover {
  color: #777;
  cursor: pointer;
}

.trash-icon:hover {
  color: #cf5543;
  cursor: pointer;
}

.sortable {
  height: 90%;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
