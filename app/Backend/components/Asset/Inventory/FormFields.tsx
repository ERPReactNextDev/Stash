"use client";

import React, { useEffect, useState } from "react";

interface FormFieldsProps {
    postData: any;
    handleChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => void;
    setPostData: React.Dispatch<React.SetStateAction<any>>;
    setShowForm: (show: boolean) => void;
    setIsEditMode: (edit: boolean) => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    isEditMode: boolean;
    initialFormState: any;
}

const FormFields: React.FC<FormFieldsProps> = ({
    postData,
    handleChange,
    setPostData,
    setShowForm,
    setIsEditMode,
    handleSubmit,
    isEditMode,
    initialFormState,
}) => {
    // Format date string to YYYY-MM-DD for <input type="date">
    const formatDateForInput = (dateStr?: string) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const dd = String(date.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
    };

    // Auto-calculate AssetAge when PurchaseDate changes
    useEffect(() => {
        if (postData.PurchaseDate) {
            const purchaseDate = new Date(postData.PurchaseDate);
            const today = new Date();

            let years = today.getFullYear() - purchaseDate.getFullYear();
            let months = today.getMonth() - purchaseDate.getMonth();
            let days = today.getDate() - purchaseDate.getDate();

            if (days < 0) {
                months--;
                const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
                days += prevMonth;
            }

            if (months < 0) {
                years--;
                months += 12;
            }

            const ageString = `${years} years, ${months} months, ${days} days`;

            setPostData((prev: any) => ({
                ...prev,
                AssetAge: ageString,
            }));
        }
    }, [postData.PurchaseDate, setPostData]);

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                {/* Brand */}
                <div>
                    <label className="block text-xs font-bold mb-1">Brand</label>
                    <input
                        name="Brand"
                        value={postData.Brand || ""}
                        onChange={handleChange}
                        placeholder="Brand"
                        className="border rounded p-2 text-xs w-full"
                        required
                    />
                </div>

                {/* Asset Type */}
                <div>
                    <label className="block text-xs font-bold mb-1">Asset Type</label>
                    <select
                        name="AssetType"
                        value={postData.AssetType || ""}
                        onChange={handleChange}
                        className="border rounded p-2 text-xs w-full"
                    >
                        <option value="">Select Type</option>
                        <option value="Laptop">Laptop</option>
                        <option value="Desktop">Desktop</option>
                        <option value="Printer">Printer</option>
                        <option value="Monitor">Monitor</option>
                    </select>
                </div>

                {/* Model */}
                <div>
                    <label className="block text-xs font-bold mb-1">Model</label>
                    <input
                        name="Model"
                        value={postData.Model || ""}
                        onChange={handleChange}
                        placeholder="Model"
                        className="border rounded p-2 text-xs w-full"
                    />
                </div>

                {/* Processor */}
                <div>
                    <label className="block text-xs font-bold mb-1">Processor</label>
                    <input
                        name="Processor"
                        value={postData.Processor || ""}
                        onChange={handleChange}
                        placeholder="Processor"
                        className="border rounded p-2 text-xs w-full"
                    />
                </div>

                {/* RAM */}
                <div>
                    <label className="block text-xs font-bold mb-1">RAM</label>
                    <input
                        name="Ram"
                        value={postData.Ram || ""}
                        onChange={handleChange}
                        placeholder="RAM"
                        className="border rounded p-2 text-xs w-full"
                    />
                </div>

                {/* Storage */}
                <div>
                    <label className="block text-xs font-bold mb-1">Storage</label>
                    <input
                        name="Storage"
                        value={postData.Storage || ""}
                        onChange={handleChange}
                        placeholder="Storage"
                        className="border rounded p-2 text-xs w-full"
                    />
                </div>

                {/* Serial Number */}
                <div>
                    <label className="block text-xs font-bold mb-1">Serial Number</label>
                    <input
                        name="SerialNumber"
                        value={postData.SerialNumber || ""}
                        onChange={handleChange}
                        placeholder="Serial Number"
                        className="border rounded p-2 text-xs w-full"
                    />
                </div>

                {/* Purchase Date */}
                <div>
                    <label className="block text-xs font-bold mb-1">Purchase Date</label>
                    <input
                        type="date"
                        name="PurchaseDate"
                        value={formatDateForInput(postData.PurchaseDate)}
                        onChange={handleChange}
                        className="border rounded p-2 text-xs w-full"
                    />
                </div>

                {/* Asset Age */}
                <div>
                    <label className="block text-xs font-bold mb-1">Asset Age (years)</label>
                    <input
                        type="text"
                        name="AssetAge"
                        value={postData.AssetAge || ""}
                        onChange={handleChange}
                        placeholder="e.g. 2 years, 3 months"
                        className="border rounded p-2 text-xs w-full"
                        readOnly
                    />
                </div>

                {/* Amount */}
                <div>
                    <label className="block text-xs font-bold mb-1">Amount</label>
                    <input
                        type="number"
                        name="Amount"
                        value={postData.Amount || ""}
                        onChange={handleChange}
                        placeholder="e.g. 50000"
                        className="border rounded p-2 text-xs w-full"
                    />
                </div>

                {/* Remarks */}
                <div className="col-span-2">
                    <label className="block text-xs font-bold mb-1">Remarks</label>
                    <textarea
                        name="Remarks"
                        value={postData.Remarks || ""}
                        onChange={handleChange}
                        placeholder="Remarks"
                        className="border rounded p-2 text-xs w-full"
                        rows={3}
                    />
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-6">
                <button
                    type="submit"
                    className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-green-700 text-xs"
                >
                    {isEditMode ? "Update" : "Save"}
                </button>
                <button
                    type="button"
                    className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-600 text-xs"
                    onClick={() => {
                        setShowForm(false);
                        setIsEditMode(false);
                        setPostData(initialFormState);
                    }}
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default FormFields;
