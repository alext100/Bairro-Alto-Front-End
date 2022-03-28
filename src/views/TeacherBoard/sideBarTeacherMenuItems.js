export default function sideBarTeacherMenuItems() {
  return [
    {
      link: `/teacher`,
      name: "Мои группы",
      icon: "bx-grid-alt",
    },
    {
      link: `/teacher/create-group`,
      name: "Создать группу",
      icon: "bx-add-to-queue",
    },
    {
      link: `/teacher/create-lesson`,
      name: "Создать урок",
      icon: "bx-laptop",
    },
    {
      link: `/teacher/chat/`,
      name: "Чат",
      tooltip: "Чат",
      icon: "bx-chat",
    },
    {
      link: `/teacher/settings`,
      name: "Настройки",
      icon: "bx-cog",
    },
  ];
}
