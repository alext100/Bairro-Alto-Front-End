import state from "../../store/state";

export default function sideBarStudentMenuItems() {
  return [
    {
      link: `/student/${state.currentUser.id}`,
      name: "Мой кабинет",
      tooltip: "Dashboard",
      icon: "bx-grid-alt",
    },
    {
      link: `/student/lessons/${state.currentUser.id}`,
      name: "Уроки",
      tooltip: "Уроки",
      icon: "bx-book-content",
    },
    {
      link: `/student/homework`,
      name: "Домашние задания",
      tooltip: "Домашние задания",
      icon: "bx-home-heart",
    },
    {
      link: `/student/errors/${state.currentUser.id}`,
      name: "Замечания",
      icon: "bx-message-error",
    },
    {
      link: `/student/chat/${state.currentUser.id}`,
      name: "Чат",
      tooltip: "Чат",
      icon: "bx-chat",
    },
    {
      link: `/student/${state.currentUser.id}`,
      name: "Настройки",
      tooltip: "Setting",
      icon: "bx-cog",
    },
  ];
}
