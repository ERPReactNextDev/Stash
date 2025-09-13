"use client";

import React, { useState, useEffect, useRef } from "react";
import { CiDark, CiSun } from "react-icons/ci";
import { IoMenu } from "react-icons/io5";

interface NavbarProps {
  onToggleSidebar: () => void;
  onToggleTheme: () => void;
  isDarkMode: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, onToggleTheme, isDarkMode }) => {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userReferenceId, setUserReferenceId] = useState("");
  const [TargetQuota, setUserTargetQuota] = useState("");
  const [Role, setUserRole] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  useEffect(() => {
    const fetchUserData = async () => {
      const params = new URLSearchParams(window.location.search);
      const userId = params.get("id");

      if (userId) {
        try {
          const response = await fetch(`/api/Backend/user?id=${encodeURIComponent(userId)}`);
          if (!response.ok) throw new Error("Failed to fetch user data");

          const data = await response.json();
          setUserName(data.Firstname);
          setUserEmail(data.Email);
          setUserReferenceId(data.ReferenceID || "");
          setUserTargetQuota(data.TargetQuota || "");
          setUserRole(data.Role || "");
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, []);

  return (
    <div
      className={`sticky top-0 z-[999] flex justify-between items-center p-4 transition-all duration-300 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      <div className="flex items-center space-x-4">
        <button onClick={onToggleSidebar} title="Show Sidebar" className="block sm:hidden">
          <IoMenu size={20} />
        </button>
      </div>

      <div
        className="relative flex items-center text-center text-xs gap-2 z-[1000]"
        ref={dropdownRef}
      >
        <button
          onClick={onToggleTheme}
          className="relative flex items-center bg-gray-200 dark:bg-gray-700 parallelogram-shape w-20 h-4 p-3 transition-all duration-300"
        >
          <div
            className={`w-4 h-4 bg-white dark:bg-yellow-400 rounded-full shadow-md flex justify-center items-center transform transition-transform duration-300 ${
              isDarkMode ? "translate-x-8" : "translate-x-0"
            }`}
          >
            {isDarkMode ? (
              <CiDark size={10} className="text-gray-900 dark:text-gray-300" />
            ) : (
              <CiSun size={10} className="text-yellow-500" />
            )}
          </div>
        </button>
      </div>
    </div>
  );
};

export default Navbar;
