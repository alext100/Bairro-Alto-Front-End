export default function sideBarAdminMenuItems() {
  return [
    {
      link: `/admin`,
      name: "Dashboard",
      tooltip: "Dashboard",
      icon: "bx-grid-alt",
    },
    {
      link: `/admin/all-groups`,
      name: "Все группы",
      icon: "bx-group",
    },
    {
      link: `/cms`,
      name: "CMS",
      tooltip: "CMS",
      icon: "bx-command",
    },
    {
      link: `/admin`,
      name: "Settings",
      tooltip: "Setting",
      icon: "bx-cog",
    },
  ];
}
