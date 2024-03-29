<template>
  <SidebarMenu :menuItems="menuItems" :profileName="profileName" :isExitButton="true" />
  <div class="row g-0">
    <div class="col-2 col1 categories">
      <div class="settings">
        <template v-if="curCat && config.settings.allow_add_category">
          <div class="btn-group">
            <button v-tippy="'Добавить категорию'" @click="showAddCat = true" class="btn btn-outline-light">
              <em class="fa fa-plus"></em>
            </button>
            <button v-tippy="'Управление категориями'" @click="showCatSettings = true" class="btn btn-outline-light">
              <em class="fa fa-cog"></em>
            </button>
          </div>
        </template>
      </div>

      <template v-for="cat in this.webContent.categories" :key="cat.title">
        <a v-if="!isLoading" @click="setCurCat(cat.slug)" :class="{ activeCat: curCat == cat.slug }">
          {{ cat.title }}</a
        >
      </template>
      <n-space vertical>
        <n-skeleton v-if="isLoading" height="40px" width="33%" />
        <n-skeleton v-if="isLoading" height="40px" width="66%" :sharp="false" />
        <n-skeleton v-if="isLoading" height="40px" round />
        <n-skeleton v-if="isLoading" height="40px" circle />
      </n-space>
    </div>
    <div class="col-3 col2 posts-group">
      <div class="posts-group__filter">
        <div class="btn-group">
          <a v-tippy="'Добавить статью'" @click="addItem()" class="btn btn-outline-dark"
            ><em class="fa fa-plus"></em
          ></a>
          <a v-tippy="'Управление статьями'" @click="showPostSettings = true" class="btn btn-outline-dark"
            ><em class="fa fa-cog"></em
          ></a>
        </div>
      </div>
      <n-space vertical>
        <n-skeleton v-if="isLoading" height="40px" width="33%" />
        <n-skeleton v-if="isLoading" height="40px" width="66%" :sharp="false" />
        <n-skeleton v-if="isLoading" height="40px" round />
        <n-skeleton v-if="isLoading" height="40px" circle />
      </n-space>
      <PostList v-if="!isLoading" v-model:posts="catItems" v-model:currentPost="curItem" />
    </div>

    <div class="col-7 p-2 col3 richtext-editor">
      <template v-if="curItem">
        <template v-for="key in Object.keys(config.fields.posts)" :key="key">
          <template v-if="config.fields.posts[key] === 'text' && curItem[key].includes('text-disabled')">
            <label>{{ key }}</label>
            <n-space vertical>
              <n-skeleton v-if="isLoading" height="40px" width="33%" />
              <n-skeleton v-if="isLoading" height="40px" width="66%" :sharp="false" />
              <n-skeleton v-if="isLoading" height="40px" round />
              <n-skeleton v-if="isLoading" height="40px" circle />
            </n-space>
            <input type="text" class="form-control" v-model="curItem[key]" disabled />
          </template>

          <template v-else-if="config.fields.posts[key] === 'text'">
            <label>{{ key }}</label>
            <n-space vertical>
              <n-skeleton v-if="isLoading" height="40px" width="33%" />
              <n-skeleton v-if="isLoading" height="40px" width="66%" :sharp="false" />
              <n-skeleton v-if="isLoading" height="40px" round />
              <n-skeleton v-if="isLoading" height="40px" circle />
            </n-space>
            <input type="text" class="form-control" v-model="curItem[key]" />
          </template>

          <template v-if="config.fields.posts[key] === 'richtext'">
            <label>{{ key }}</label>
            <CkEditor v-model="curItem[key]" />
          </template>

          <template v-if="config.fields.posts[key].includes('dropdown')">
            <label>{{ key }}</label>
            <select
              v-tippy="'Поменять категорию для этой статьи'"
              class="form-select w-25"
              v-model="curItem[key]"
              @change="changeCat(curItem[key])"
            >
              <template v-for="item in webContent.categories" :key="item">
                <option :value="item.slug">{{ item.title }}</option>
              </template>
            </select>
          </template>

          <template v-if="config.fields.posts[key] === 'textarea'">
            <label>{{ key }}</label>
            <textarea class="form-control" v-model="curItem[key]"></textarea>
          </template>

          <template v-if="config.fields.posts[key] === 'text-disabled'">
            <label>{{ key }}</label>
            <input type="text" class="form-control" v-model="curItem[key]" disabled />
          </template>
        </template>

        <button class="btn btn-primary mt-1" @click="save()">
          <template v-if="saving"> <em class="fas fa-spinner fa-spin"></em> &nbsp; </template>
          Сохранить
        </button>

        <template v-if="config.settings.preview_url">
          &nbsp;
          <a class="btn btn-outline-dark mt-1 btn-preview" :href="config.settings.preview_url" target="_blank"
            >View Site</a
          >
        </template>
      </template>
    </div>
  </div>

  <template v-if="showCatSettings">
    <SortableList v-model:items="webContent.categories" v-model:show="showCatSettings" title="Categories" />
  </template>

  <template v-if="showPostSettings">
    <SortableList v-model:items="catItems" v-model:show="showPostSettings" title="Posts" />
  </template>

  <div v-show="showAddCat">
    <AddCategory
      v-model:data="webContent"
      v-model:config="config"
      v-model:currentPost="curItem"
      v-model:show="showAddCat"
    />
  </div>
</template>

<script>
/* eslint-disable prefer-destructuring */
import SortableList from "@/components/AdminCMS/SortableList.vue";
import PostList from "@/components/AdminCMS/PostList.vue";
import AddCategory from "@/components/AdminCMS/AddCategory.vue";
import CkEditor from "@/components/CkEditorCustom.vue";
import SidebarMenu from "@/components/SidebarMenu.vue";
import { mapActions, mapState } from "vuex";
import { NSkeleton, NSpace } from "naive-ui";
import state from "@/store/state";
import sideBarAdminMenuItems from "./sideBarAdminMenuItems";

function getImage(item) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(item, "text/html");
  const image = doc.getElementsByTagName("img")[0];
  return image || undefined;
}

export default {
  name: "CMS",
  components: {
    SortableList,
    PostList,
    AddCategory,
    CkEditor,
    NSkeleton,
    NSpace,
    SidebarMenu,
  },

  data() {
    return {
      menuItems: sideBarAdminMenuItems(),
      profileName: state.currentUser.firstName,
      curCat: false,
      catItems: false,
      curItem: {
        title: "",
        body: "",
        category: "",
        image: "",
        id: "",
      },
      saving: false,
      showAddCat: false,
      showPostSettings: false,
      showCatSettings: false,
      drag: false,
      newWebContentData: {},
      config: {
        settings: {
          allow_add_category: true,
        },
        fields: {
          pages: {
            title: "text",
            description: "textarea",
            slug: "text-disabled",
          },
          posts: {
            title: "text",
            body: "richtext",
            image: "image",
            category: "dropdown_categories",
          },
        },
      },
    };
  },

  async mounted() {
    await this.getWebContent();
    const defaultCat = this.webContent?.categories[0]?.slug;
    this.curCat = defaultCat;
    this.catItems = this.webContent.posts.filter((post) => post.category === defaultCat);
    [this.curItem] = this.catItems;
  },

  computed: {
    ...mapState(["webContent", "isLoading"]),
  },

  methods: {
    ...mapActions(["getWebContent", "updateWebContent", "updatePostById"]),

    setCurCat(cat) {
      this.curCat = cat;
      this.catItems = this.webContent.posts.filter((post) => post.category === cat);
      [this.curItem] = this.catItems;
    },

    async addItem() {
      const fields = this.config.fields.posts;
      const newItem = {};
      Object.keys(fields).forEach((field) => {
        if (field === "title") {
          newItem[field] = "Untitled";
        } else if (field === "body") {
          newItem[field] = "<span>&nbsp;</span>";
        } else {
          newItem[field] = "";
        }
      });
      newItem.category = this.curCat;

      this.newWebContentData = {
        posts: [newItem, ...this.webContent.posts],
        categories: [...this.webContent.categories],
      };
      await this.updateWebContent(this.newWebContentData);
      await this.getWebContent();
      this.catItems = this.webContent?.posts?.filter((x) => x.category === this.curCat);
      [this.curItem] = this.catItems;
    },
    changeCat(cat) {
      this.curCat = cat;
      this.catItems = this.webContent.posts.filter((x) => x.category === cat);
    },
    async save() {
      let image;
      const imageFromCurItemBody = getImage(this.curItem.body);
      if (imageFromCurItemBody !== undefined && imageFromCurItemBody.srcset !== "") {
        image = imageFromCurItemBody.srcset.split(" ")[0];
      } else if (imageFromCurItemBody !== undefined && imageFromCurItemBody.src !== "") {
        image = imageFromCurItemBody.src;
      } else image = "";
      this.curItem = { ...this.curItem, image };
      await this.updatePostById(this.curItem);
    },
  },
};
</script>

<style>
body {
  background-color: #f6f1f1;
}

.categories {
  height: 100%;
  background-color: #333;
  position: fixed;
  left: 40px;
}

.categories a {
  color: white !important;
  display: block;
  padding: 13px 20px;
  text-transform: capitalize;
  text-decoration: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.categories a:hover {
  background-color: #656bf7;
  user-select: none;
  cursor: pointer;
}

.activeCat {
  background-color: #656bf7;
}

.posts-group {
  position: fixed;
  left: 16.67%;
  height: 100%;
  overflow: hidden;
  background-color: white;
  border-right: 1px solid #ddd;
  overflow-x: hidden;
  overflow-y: auto;
}

.posts-group .list-group-item {
  padding: 20px;
  border-radius: 0;
  border-right: 0;
  border-top: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  border-left: 5px solid transparent;
}

.posts-group .list-group-item:hover {
  background-color: #f8f8f8;
  user-select: none;
  cursor: pointer;
}

.posts-group .active2 {
  background-color: #f8f8f8;
  width: 100.5%;
  border-left: 5px solid #656bf7;
}

.form-control,
.form-select {
  margin-bottom: 15px;
}
.form-select {
  height: 35px !important;
}

label {
  text-transform: uppercase;
  font-size: 15px;
  line-height: 20px;
  letter-spacing: 0.05em;
  margin-bottom: 5px;
}

.btn-primary {
  border: 2px solid #666bef;
  background-color: #666bef;
  color: white;
  border-radius: 4px;
  padding-left: 30px;
  padding-right: 30px;
  transition: 0.3s;
}

.btn-primary:hover {
  border: 2px solid #8287f9;
  background-color: #8287f9;
  color: white;
}

.btn-preview {
  padding: 8px 15px;
}

textarea {
  height: 100px;
  resize: none;
}

.btn-outline-dark {
  border: 1px solid #ddd;
}

.btn-outline-dark:hover {
  border: 1px solid #ddd;
  background-color: #eeeeee;
  color: black;
}

.settings {
  padding: 11px 15px 15px 18px;
}

.posts-group__filter {
  padding: 10px 20px;
  border-bottom: 6px solid #333;
  background-color: white;
  position: fixed;
  z-index: 999;
  width: 25%;
  border-right: 1px solid #ddd;
}

.posts-group .list-group:nth-child(2) .list-group-item {
  top: 63px;
}

.richtext-editor {
  position: fixed;
  right: 0;
  height: 95%;
  overflow: hidden;
  overflow-y: auto;
}

.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-screen {
  position: fixed;
  top: 7%;
  left: calc(50% - 300px);
  width: 600px;
  height: auto;
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  max-height: 70%;
}

.clear {
  clear: both;
}
@media (max-width: 599px) {
  .categories {
    left: 0;
  }
}
</style>
