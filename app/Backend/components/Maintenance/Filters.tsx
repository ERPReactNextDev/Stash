import React from "react";
import { FiSearch, FiX, FiPlus } from "react-icons/fi";

interface FiltersProps {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    startDate: string;
    setStartDate: (date: string) => void;
    endDate: string;
    setEndDate: (date: string) => void;
    onAddClick: () => void;
}

export default function Filters({
    searchTerm,
    setSearchTerm,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    onAddClick,
}: FiltersProps) {
    return (
        <div className="flex flex-col gap-4 mb-6">
            <div className="flex items-center justify-between gap-4 w-full">
                {/* Add New Customer Button */}
                <button
                    className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    onClick={onAddClick}
                >
                    <FiPlus className="text-base" />
                    <span>Add Maintenance</span>
                </button>

                {/* Search and Date Filters */}
                <div className="flex items-center gap-3 flex-1">
                    {/* Search Bar */}
                    <div className="relative flex-1 max-w-md">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiSearch className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search for Brand, Type, Model, Serial, etc."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full pl-10 pr-5 py-2 border border-gray-200 rounded-md text-xs shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        />

                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <FiX className="text-sm" />
                            </button>
                        )}
                    </div>

                    {/* Date Filters */}
                    <div className="flex items-center gap-2">
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="border px-3 py-2 rounded text-xs w-36"
                        />
                        <span className="text-gray-400 text-xs">to</span>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="border px-3 py-2 rounded text-xs w-36"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}