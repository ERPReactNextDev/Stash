// Icons
import { HiOutlineDocumentText, HiOutlineCog, HiOutlineClock } from "react-icons/hi";
import { FaBox, FaClipboardCheck } from 'react-icons/fa';

// Build link with optional user ID
const buildHref = (basePath: string, userId?: string | null) =>
  `${basePath}${userId ? `?id=${encodeURIComponent(userId)}` : ""}`;

// Generate full menu regardless of role
const getMenuItems = (userId: string | null = "") => {
  const menu = [];

  // ASSET section
  menu.push({
    title: "Asset Management",
    icon: FaBox,
    subItems: [
      {
        title: "Assigned Assets",
        description: "See assets currently assigned to you",
        href: buildHref("/Backend/Stash/Asset/AssignedAsset", userId),
      },
      {
        title: "Inventory",
        description: "Browse all available assets in the system",
        href: buildHref("/Backend/Stash/Asset/Inventory", userId),
      },
      {
        title: "Disposal",
        description: "Manage assets marked for disposal",
        href: buildHref("/Backend/Stash/Asset/Disposal", userId),
      },
    ],
  });

  // MAINTENANCE section
  menu.push({
    title: "Maintenance",
    icon: HiOutlineCog,
    subItems: [
      {
        title: "Maintenance Logs",
        description: "Track and view all maintenance activities",
        href: buildHref("/Backend/Stash/Maintenance/Maintenance", userId),
      },
    ],
  });

  // AUDIT section
  menu.push({
    title: "Audit",
    icon: FaClipboardCheck,
    subItems: [
      {
        title: "Audit Logs",
        description: "Review all audit records and compliance checks",
        href: buildHref("/Backend/Stash/Audit/Audit", userId),
      },
    ],
  });

  // HISTORY section
  menu.push({
    title: "History",
    icon: HiOutlineClock,
    subItems: [
      {
        title: "History Logs",
        description: "View historical changes and past records",
        href: buildHref("/Backend/Stash/History/History", userId),
      },
    ],
  });

  return menu;
};

export default getMenuItems;
