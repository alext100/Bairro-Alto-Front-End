export default function sideBarAdminMenuItems() {
  return [
    {
      link: `/cms`,
      name: "CMS",
      tooltip: "CMS",
      icon: "bx-command",
    },
    {
      link: `/admin/all-users`,
      name: "Роли пользователей",
      icon: "bx-user",
    },
    {
      link: `/admin/all-groups`,
      name: "Все группы",
      icon: "bx-group",
    },
    {
      link: `/admin`,
      name: "Админ",
      tooltip: "Dashboard",
      icon: "bx-grid-alt",
    },
    {
      link: `/admin/settings`,
      name: "Настройки",
      tooltip: "Setting",
      icon: "bx-cog",
    },
  ];
}
