import {
  LayoutDashboard,
  Search,
  Briefcase,
  Clock,
  Building2,
  Users,
  UserCheck,
} from "lucide-react";

export interface SidebarItem {
  key: number;
  title: string;
  link: string;
  allowedRoles?: ("ROLE_CLIENT" | "ROLE_FRANCHISEE" | "ROLE_ADMIN")[];
  icon: React.ComponentType<{ className?: string }>;
}

export const sidebar: SidebarItem[] = [
  {
    key: 1,
    title: "Dashboard",
    link: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    key: 2,
    title: "Explore Projects",
    link: "/admin/projects",
    allowedRoles: ["ROLE_CLIENT", "ROLE_FRANCHISEE"],
    icon: Search,
  },
  {
    key: 3,
    title: "My Portfolio",
    link: "/admin/portfolio",
    allowedRoles: ["ROLE_CLIENT"],
    icon: Briefcase,
  },
  {
    key: 4,
    title: "My Campaigns",
    link: "/admin/my-campaigns",
    allowedRoles: ["ROLE_FRANCHISEE"],
    icon: Clock,
  },
  {
    key: 5,
    title: "Pending Companies",
    link: "/admin/companies/pending",
    allowedRoles: ["ROLE_ADMIN"],
    icon: Building2,
  },
  {
    key: 6,
    title: "Entrepreneurs",
    link: "/admin/entrepreneurs",
    allowedRoles: ["ROLE_ADMIN"],
    icon: UserCheck,
  },
  {
    key: 7,
    title: "Users",
    link: "/admin/users",
    allowedRoles: ["ROLE_ADMIN"],
    icon: Users,
  },
];
