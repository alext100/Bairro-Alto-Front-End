import state from "../../store/state";

export default function sideBarStudentMenuItems() {
  return [
    {
      link: `/student/${state.currentUser.id}`,
      name: "Dashboard",
      tooltip: "Dashboard",
      icon: "bx-grid-alt",
    },
    {
      link: `/student/errors/${state.currentUser.id}`,
      name: "Замечания",
      icon: "bx-message-error",
    },
    {
      link: `/student/lessons/${state.currentUser.id}`,
      name: "Уроки",
      tooltip: "Уроки",
      icon: "bx-book-content",
    },
    {
      link: `/student/chat/${state.currentUser.id}`,
      name: "Чат",
      tooltip: "Чат",
      icon: "bx-chat",
    },
    {
      link: `/student/${state.currentUser.id}`,
      name: "Settings",
      tooltip: "Setting",
      icon: "bx-cog",
    },
  ];
}
