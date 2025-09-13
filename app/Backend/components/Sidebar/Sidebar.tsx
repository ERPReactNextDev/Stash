"use client";

import React, { useState, useEffect } from "react";
import Link from 'next/link';
// Route
import SidebarMenu from "./SidebarMenu";
import getMenuItems from "./SidebarMenuItems";
import SidebarUserInfo from "./SidebarUserInfo";

const Sidebar: React.FC<{ isOpen: boolean; onClose: () => void; }> = ({ isOpen, onClose }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [userId, setUserId] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState({ Firstname: "", Lastname: "", Location: "", Role: "", Position: "", Company: "", Status: "", profilePicture: "", ReferenceID: "", Department: "" });
  const [agentMode, setAgentMode] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setUserId(params.get("id"));
  }, []);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!userId) return;

      try {
        const response = await fetch(`/api/Backend/user?id=${encodeURIComponent(userId)}`);
        if (!response.ok) throw new Error("Failed to fetch user details");

        const data = await response.json();
        setUserDetails({
          Firstname: data.Firstname || "Leroux ",
          Lastname: data.Lastname || "Xchire",
          Location: data.Location || "Philippines",
          Role: data.Role || "Admin",
          Position: data.Position || "Guest",
          Company: data.Company || "Fluxx",
          Department: data.Department || "",
          Status: data.Status || "None",
          ReferenceID: data.ReferenceID,
          profilePicture: data.profilePicture,
        });
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, [userId]);

  const handleToggle = (section: string) => {
    setOpenSections((prevSections: any) => ({
      ...prevSections,
      [section]: !prevSections[section],
    }));
  };

  const menuItems = getMenuItems(userId);

  const filteredMenuItems = menuItems.filter(item =>
    ["Asset Management", "Maintenance", "Audit", "History"].includes(item.title)
  );

  return (
    <>
      {/* Overlay Background (Closes Sidebar on Click) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar Container */}
      <div
        className={`fixed inset-y-0 left-0 z-50 h-screen transition-all duration-300 flex flex-col
        bg-gray-900 text-white 
        ${collapsed ? "w-16" : "w-64"} 
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between p-5 bg-gray-900">
          <div className="flex items-center">
            <img
              src="/stash-logo.png"
              alt="Logo"
              className="h-20 w-200 object-cover object-center"
            />
            <Link
              href={`/Backend/Stash/Dashboard${userId ? `?id=${encodeURIComponent(userId)}` : ''}`}
            >
            </Link>
          </div>
        </div>

        {/* Menu Section */}
        <SidebarMenu
          collapsed={collapsed}
          openSections={openSections}
          handleToggle={handleToggle}
          menuItems={filteredMenuItems}
          userId={userId}
        />

        {/* User Details Section */}
        {!collapsed && (
          <div className="text-xs text-left">
            <SidebarUserInfo
              collapsed={collapsed}
              userDetails={userDetails}
              agentMode={agentMode}
              setAgentMode={setAgentMode}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;
