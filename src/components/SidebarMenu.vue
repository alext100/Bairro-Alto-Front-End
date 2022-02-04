<template>
  <div class="sidebar" :class="isOpened ? 'open' : ''" :style="cssVars">
    <div class="sidebar__logo-details">
      <img v-if="menuLogo" :src="menuLogo" alt="menu-logo" class="menu-logo icon" />
      <!-- <i v-else class="bx icon" :class="menuIcon" /> -->
      <div class="logo_name">
        {{ menuTitle }}
      </div>
      <i class="bx" :class="isOpened ? 'bx-menu-alt-right' : 'bx-menu'" id="btn" @click="isOpened = !isOpened" />
    </div>

    <div class="sidebar__body-profile_open">
      <div class="sidebar__body_open">
        <ul class="sidebar__nav-list">
          <li v-if="isSearch" @click="isOpened = true">
            <i class="bx bx-search" />
            <input
              type="text"
              :placeholder="searchPlaceholder"
              @input="$emit('search-input-emit', $event.target.value)"
            />
            <span class="tooltip">{{ searchTooltip }}</span>
          </li>

          <span v-for="(menuItem, index) in menuItems" :key="index">
            <li>
              <router-link :to="menuItem.link">
                <i class="bx" :class="menuItem.icon || 'bx-square-rounded'" />
                <span class="sidebar__nav-list_links">{{ menuItem.name }}</span>
              </router-link>

              <span class="tooltip">{{ menuItem.tooltip || menuItem.name }}</span>
            </li>
          </span>
        </ul>
      </div>

      <div class="profile">
        <div class="profile__details">
          <img v-if="profileImg" :src="profileImg" alt="Profile image" />
          <i v-else class="bx bxs-user-rectangle" />
          <div class="profile__job">
            <div class="profile__name">
              {{ profileName }}
            </div>
            <div class="profile__job">
              {{ profileRole }}
            </div>
          </div>
        </div>
        <i v-if="isExitButton" class="bx bx-log-out profile__log_out" @click="handleClick" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SidebarMenu",
  props: {
    //! Menu settings
    isMenuOpen: {
      type: Boolean,
      default: false,
    },
    menuTitle: {
      type: String,
      default: "",
    },
    menuLogo: {
      type: String,
      default: "",
    },
    menuIcon: {
      type: String,
      default: "bxl-c-plus-plus",
    },
    isPaddingLeft: {
      type: Boolean,
      default: true,
    },
    menuOpenedPaddingLeftBody: {
      type: String,
      default: "250px",
    },
    menuClosedPaddingLeftBody: {
      type: String,
      default: "40px",
    },

    //! Menu items
    menuItems: {
      type: Array,
      default: () => [
        {
          link: "#",
          name: "Dashboard",
          tooltip: "Dashboard",
          icon: "bx-grid-alt",
        },
        {
          link: "#",
          name: "User",
          tooltip: "User",
          icon: "bx-user",
        },
        {
          link: "#",
          name: "Messages",
          tooltip: "Messages",
          icon: "bx-chat",
        },
        {
          link: "#",
          name: "Analytics",
          tooltip: "Analytics",
          icon: "bx-pie-chart-alt-2",
        },
        {
          link: "#",
          name: "File Manager",
          tooltip: "Files",
          icon: "bx-folder",
        },
        {
          link: "#",
          name: "Order",
          tooltip: "Order",
          icon: "bx-cart-alt",
        },
        {
          link: "#",
          name: "Saved",
          tooltip: "Saved",
          icon: "bx-heart",
        },
        {
          link: "#",
          name: "Setting",
          tooltip: "Setting",
          icon: "bx-cog",
        },
      ],
    },

    //! Search
    isSearch: {
      type: Boolean,
      default: false,
    },
    searchPlaceholder: {
      type: String,
      default: "Search...",
    },
    searchTooltip: {
      type: String,
      default: "Search",
    },

    //! Profile details
    profileImg: {
      type: String,
      /*  default: require("../assets/img/photo.jpg"), */
    },
    profileName: {
      type: String,
      default: "",
    },
    profileRole: {
      type: String,
      default: "",
    },
    isExitButton: {
      type: Boolean,
      default: true,
    },

    //! Styles
    bgColor: {
      type: String,
      default: "#11101d",
    },
    secondaryColor: {
      type: String,
      default: "#1d1b31",
    },
    homeSectionColor: {
      type: String,
      default: "#e4e9f7",
    },
    logoTitleColor: {
      type: String,
      default: "#fff",
    },
    iconsColor: {
      type: String,
      default: "#fff",
    },
    itemsTooltipColor: {
      type: String,
      default: "#e4e9f7",
    },
    searchInputTextColor: {
      type: String,
      default: "#fff",
    },
    menuItemsHoverColor: {
      type: String,
      default: "#fff",
    },
    menuItemsTextColor: {
      type: String,
      default: "#fff",
    },
    menuFooterTextColor: {
      type: String,
      default: "#fff",
    },
  },
  data() {
    return {
      isOpened: false,
    };
  },
  mounted() {
    this.isOpened = this.isMenuOpen;
  },
  computed: {
    cssVars() {
      return {
        "--bg-color": this.bgColor,
        "--secondary-color": this.secondaryColor,
        "--home-section-color": this.homeSectionColor,
        "--logo-title-color": this.logoTitleColor,
        "--icons-color": this.iconsColor,
        "--items-tooltip-color": this.itemsTooltipColor,
        "--search-input-text-color": this.searchInputTextColor,
        "--menu-items-hover-color": this.menuItemsHoverColor,
        "--menu-items-text-color": this.menuItemsTextColor,
        "--menu-footer-text-color": this.menuFooterTextColor,
      };
    },
  },
  methods: {
    handleClick(event) {
      this.$emit("click", event);
    },
  },
  /*   watch: {
    isOpened() {
      window.document.body.style.paddingLeft =
        this.isOpened && this.isPaddingLeft ? this.menuOpenedPaddingLeftBody : this.menuClosedPaddingLeftBody;
    },
  }, */
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700&display=swap");

* {
  font-family: "Poppins", sans-serif;
}
body {
  transition: all 0.5s ease;
}
.menu-logo {
  width: 30px;
  margin: 0 10px 0 10px;
}
.sidebar {
  position: relative;
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  height: 100%;
  min-height: min-content;
  width: 40px;
  background: var(--bg-color);
  z-index: 99;
  transition: all 0.5s ease;
}
.sidebar.open {
  width: 200px;
  opacity: 0.8;
}
.sidebar__logo-details {
  margin: 6px 0 0 0;
}
.sidebar .sidebar__logo-details {
  height: 60px;
  display: flex;
  align-items: center;
  position: relative;
}
.sidebar .sidebar__logo-details .icon {
  opacity: 0;
  transition: all 0.5s ease;
}
.sidebar .sidebar__logo-details .logo_name {
  color: var(--logo-title-color);
  font-size: 20px;
  font-weight: 600;
  opacity: 0;
  transition: all 0.5s ease;
}
.sidebar.open .sidebar__logo-details .icon,
.sidebar.open .sidebar__logo-details .logo_name {
  opacity: 1;
}
.sidebar .sidebar__logo-details #btn {
  position: absolute;
  top: 50%;
  right: -2px;
  transform: translateY(-50%);
  font-size: 22px;
  transition: all 0.4s ease;
  font-size: 23px;
  text-align: center;
  cursor: pointer;
  transition: all 0.5s ease;
}
.sidebar.open .sidebar__logo-details #btn {
  text-align: left;
}
.sidebar i {
  color: var(--icons-color);
  height: 60px;
  min-width: 50px;
  font-size: 28px;
  text-align: center;
  line-height: 60px;
}
.sidebar__nav-list {
  overflow: visible;
}

.sidebar li {
  position: relative;
  margin: 8px 0;
  list-style: none;
}
.sidebar li .tooltip {
  position: absolute;
  top: -20px;
  left: calc(100% + 15px);
  z-index: 3;
  background: var(--items-tooltip-color);
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 15px;
  font-weight: 400;
  opacity: 0;
  white-space: nowrap;
  pointer-events: none;
  transition: 0s;
}
.sidebar li:hover .tooltip {
  opacity: 1;
  pointer-events: auto;
  transition: all 0.4s ease;
  top: 50%;
  transform: translateY(-50%);
}
.sidebar.open li .tooltip {
  display: none;
}
.sidebar input {
  font-size: 15px;
  color: var(--search-input-text-color);
  font-weight: 400;
  outline: none;
  height: 50px;
  width: 100%;
  width: 50px;
  border: none;
  border-radius: 12px;
  transition: all 0.5s ease;
  background: var(--secondary-color);
}
.sidebar.open input {
  padding: 0 20px 0 50px;
  width: 100%;
}
.sidebar .bx-search {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  font-size: 22px;
  background: var(--secondary-color);
  color: var(--icons-color);
}
.sidebar.open .bx-search:hover {
  background: var(--secondary-color);
  color: var(--icons-color);
}
.sidebar .bx-search:hover {
  background: var(--menu-items-hover-color);
  color: var(--bg-color);
}
.sidebar li a {
  display: flex;
  height: 100%;
  width: 100%;
  border-radius: 12px;
  align-items: center;
  text-decoration: none;
  transition: all 0.4s ease;
  background: var(--bg-color);
}
.sidebar li a:hover {
  background: var(--menu-items-hover-color);
}
.sidebar li a .sidebar__nav-list_links {
  color: var(--menu-items-text-color);
  font-size: 15px;
  font-weight: 400;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: 0.4s;
}
.sidebar.open li a .sidebar__nav-list_links {
  opacity: 1;
  pointer-events: auto;
}
.sidebar li a:hover .sidebar__nav-list_links,
.sidebar li a:hover i {
  transition: all 0.5s ease;
  color: var(--bg-color);
}
.sidebar li i {
  height: 50px;
  line-height: 50px;
  font-size: 18px;
  border-radius: 12px;
}
.sidebar div.profile {
  position: relative;
  height: 60px;
  width: 40px;
  /* left: 0;
    bottom: 0; */
  padding: 10px 14px;
  background: var(--secondary-color);
  transition: all 0.5s ease;
  overflow: hidden;
}
.sidebar.open div.profile {
  width: 200px;
}
.sidebar div .profile__details {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
}
.sidebar div img {
  height: 45px;
  width: 45px;
  object-fit: cover;
  border-radius: 6px;
  margin-right: 10px;
}
.sidebar div.profile .name,
.sidebar div.profile .job {
  font-size: 15px;
  font-weight: 400;
  color: var(--menu-footer-text-color);
  white-space: nowrap;
}
.sidebar div.profile .job {
  font-size: 12px;
}
.sidebar .profile .profile__log_out {
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  background: var(--secondary-color);
  width: 100%;
  height: 60px;
  line-height: 60px;
  border-radius: 0px;
  transition: all 0.5s ease;
}
.sidebar.open .profile .profile__log_out {
  width: 50px;
  background: var(--secondary-color);
  opacity: 0;
}
.sidebar.open .profile:hover .profile__log_out {
  opacity: 1;
}
.sidebar.open .profile .profile__log_out:hover {
  opacity: 1;
  color: red;
}
.sidebar .profile .profile__log_out:hover {
  color: red;
}
.sidebar__body-profile_open {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;
  max-height: calc(100% - 60px);
}
.home-section {
  position: relative;
  background: var(--home-section-color);
  min-height: 100vh;
  top: 0;
  left: 78px;
  width: calc(100% - 78px);
  transition: all 0.5s ease;
  z-index: 2;
}
.sidebar.open ~ .home-section {
  left: 250px;
  width: calc(100% - 250px);
}
.home-section .text {
  display: inline-block;
  color: var(--bg-color);
  font-size: 25px;
  font-weight: 500;
  margin: 18px;
}
.sidebar__body_open-active {
  overflow-y: auto;
}
.sidebar__body_open {
  overflow-y: auto;
  height: calc(100% - 60px);
  margin: 6px 0 0 -40px;
}
.sidebar__body_open::-webkit-scrollbar {
  display: none;
}
.profile__name {
  color: #d2e3f4;
}
@media (max-width: 420px) {
  .sidebar li .tooltip {
    display: none;
  }
}
</style>
