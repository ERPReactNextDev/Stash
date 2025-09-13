"use client";

import React, { useEffect, useState } from "react";
import Select from "react-select";

interface InventoryItem {
    AssetNumber: string;
    Brand: string;
    AssetType: string;
    Model: string;
    Processor: string;
    Ram: string;
    Storage: string;
    SerialNumber: string;
    PurchaseDate: string;
    AssetAge: string;
    Amount: number;
}

interface User {
    id: string; // ReferenceID
    firstname: string;
    lastname: string;
    department: string;
    position: string;
    location: string;
    profilePicture: string;
}

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
    const [users, setUsers] = useState<User[]>([]);
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [showExtra, setShowExtra] = useState(false);

    // Fetch users
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch("/api/users");
                const data = await res.json();
                setUsers(data.data || []);
            } catch (err) {
                console.error("❌ Failed to fetch users:", err);
            }
        };
        fetchUsers();
    }, []);

    // Fetch inventory
    useEffect(() => {
        const fetchInventory = async () => {
            try {
                const res = await fetch("/api/Backend/Asset/Inventory/fetch");
                const data = await res.json();
                setInventory(data.data || []);
            } catch (err) {
                console.error("❌ Failed to fetch inventory:", err);
            }
        };
        fetchInventory();
    }, []);

    // Auto-calculate AssetAge from PurchaseDate
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
            setPostData((prev: any) => ({ ...prev, AssetAge: ageString }));
        }
    }, [postData.PurchaseDate, setPostData]);

    // Options for React Select
    const userOptions = users.map((u) => ({
        value: u.id,
        label: `${u.firstname} ${u.lastname}`,
        user: u,
    }));

    const assetOptions = inventory.map((item) => ({
        value: item.AssetNumber,
        label: item.AssetNumber,
        inventory: item,
    }));

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Hidden fields */}
            <input type="hidden" name="ReferenceID" value={postData.ReferenceID || ""} />

            {/* User selection */}
            <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                <div className="col-span-2">
                    <label className="block text-xs font-bold mb-1">User</label>
                    {/* User selection */}
                    <Select
                        options={userOptions}
                        value={
                            postData.ReferenceID
                                ? { value: postData.ReferenceID, label: `${postData.Firstname} ${postData.Lastname}` }
                                : null
                        }
                        onChange={(selectedOption: any) => {
                            if (selectedOption) {
                                const selectedUser = selectedOption.user as User;
                                setPostData((prev: any) => ({
                                    ...prev,
                                    ReferenceID: selectedUser.id,
                                    Firstname: selectedUser.firstname,
                                    Lastname: selectedUser.lastname,
                                    Position: selectedUser.position,
                                    Department: selectedUser.department,
                                    profilePicture: selectedUser.profilePicture,
                                }));
                            } else {
                                // Clear selection
                                setPostData((prev: any) => ({
                                    ...prev,
                                    ReferenceID: "",
                                    Firstname: "",
                                    Lastname: "",
                                    Position: "",
                                    Department: "",
                                    profilePicture: "",
                                }));
                            }
                        }}
                        placeholder="Select user..."
                        className="text-xs capitalize"
                        isClearable
                    />

                </div>

                {/* Toggle extra info */}
                <div className="col-span-2">
                    <button
                        type="button"
                        onClick={() => setShowExtra((prev) => !prev)}
                        className="text-blue-600 text-xs underline"
                    >
                        {showExtra ? "Hide other employee information" : "Show other employee information"}
                    </button>
                </div>

                {showExtra && postData.profilePicture && (
                    <div className="col-span-2 flex items-center gap-3">
                        <img
                            src={postData.profilePicture}
                            alt="Profile"
                            className="w-12 h-12 rounded-full border"
                        />
                        <span className="text-xs text-gray-600">{postData.Firstname} {postData.Lastname}</span>
                    </div>
                )}

                {showExtra && (
                    <>
                        <div>
                            <label className="block text-xs font-bold mb-1">Position</label>
                            <input
                                name="Position"
                                value={postData.Position || ""}
                                readOnly
                                className="border rounded p-2 text-xs w-full bg-gray-100"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold mb-1">Department</label>
                            <input
                                name="Department"
                                value={postData.Department || ""}
                                readOnly
                                className="border rounded p-2 text-xs w-full bg-gray-100"
                            />
                        </div>
                    </>
                )}

                {/* Asset selection */}
                <div>
                    <label className="block text-xs font-bold mb-1">Asset Number</label>
                    {/* Asset selection */}
                    <Select
                        options={assetOptions}
                        value={
                            postData.AssetNumber
                                ? { value: postData.AssetNumber, label: postData.AssetNumber }
                                : null
                        }
                        onChange={(selectedOption: any) => {
                            if (selectedOption) {
                                const asset = selectedOption.inventory as InventoryItem;
                                setPostData((prev: any) => ({
                                    ...prev,
                                    AssetNumber: asset.AssetNumber,
                                    Brand: asset.Brand,
                                    AssetType: asset.AssetType,
                                    Model: asset.Model,
                                    Processor: asset.Processor,
                                    Ram: asset.Ram,
                                    Storage: asset.Storage,
                                    SerialNumber: asset.SerialNumber,
                                    PurchaseDate: asset.PurchaseDate,
                                    AssetAge: asset.AssetAge,
                                    Amount: asset.Amount,
                                }));
                            } else {
                                // Clear selection
                                setPostData((prev: any) => ({
                                    ...prev,
                                    AssetNumber: "",
                                    Brand: "",
                                    AssetType: "",
                                    Model: "",
                                    Processor: "",
                                    Ram: "",
                                    Storage: "",
                                    SerialNumber: "",
                                    PurchaseDate: "",
                                    AssetAge: "",
                                    Amount: 0,
                                }));
                            }
                        }}
                        placeholder="Select Asset Number..."
                        className="text-xs"
                        isClearable
                    />

                </div>

                {/* Asset info fields (auto-filled) */}
                {[
                    "Brand",
                    "AssetType",
                    "Model",
                    "Processor",
                    "Ram",
                    "Storage",
                    "SerialNumber",
                    "PurchaseDate",
                    "AssetAge",
                    "Amount",
                ].map((field) => (
                    <div key={field}>
                        <label className="block text-xs font-bold mb-1">{field}</label>
                        <input
                            type={field === "Amount" ? "number" : field === "PurchaseDate" ? "date" : "text"}
                            name={field}
                            value={postData[field] || ""}
                            onChange={handleChange}
                            className={`border rounded p-2 text-xs w-full ${field === "AssetAge" ? "bg-gray-100 cursor-not-allowed" : ""}`}
                            readOnly={field === "AssetAge"}
                        />
                    </div>
                ))}

                {/* Remarks */}
                <div className="col-span-2">
                    <label className="block text-xs font-bold mb-1">Remarks</label>
                    <textarea
                        name="Remarks"
                        value={postData.Remarks || ""}
                        onChange={handleChange}
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
