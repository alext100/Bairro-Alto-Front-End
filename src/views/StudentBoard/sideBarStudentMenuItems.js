import state from "../../store/state";

export default function menuItems() {
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
      link: `/student/${state.currentUser.id}`,
      name: "User",
      tooltip: "User",
      icon: "bx-user",
    },
    {
      link: `/student/${state.currentUser.id}`,
      name: "Settings",
      tooltip: "Setting",
      icon: "bx-cog",
    },
  ];
}
