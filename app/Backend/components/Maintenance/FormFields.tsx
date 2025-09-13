"use client";

import React, { useEffect, useState } from "react";
import Select from "react-select";

interface InventoryItem {
    _id: string;
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
    Amount: string;
    Remarks: string;
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
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [showAssetDetails, setShowAssetDetails] = useState(false);

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

    const assetOptions = inventory.map((item) => ({
        value: item.AssetNumber,
        label: item.AssetNumber,
        inventory: item,
    }));

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

    // Helper: format ISO date to YYYY-MM-DD for <input type="date">
    const formatForDateInput = (dateString?: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "";
        return date.toISOString().split("T")[0];
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Asset Number Select */}
            <div>
                <label className="block text-xs font-bold mb-1">Asset Number</label>
                <Select
                    options={assetOptions}
                    value={
                        postData.AssetNumber
                            ? { value: postData.AssetNumber, label: postData.AssetNumber }
                            : null
                    }
                    onChange={(selectedOption: any) => {
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
                    }}
                    placeholder="Select Asset Number..."
                    className="text-xs"
                />
            </div>

            {postData.AssetNumber && (
                <div className="mt-2">
                    <button
                        type="button"
                        onClick={() => setShowAssetDetails(!showAssetDetails)}
                        className="text-xs text-blue-600 hover:underline mb-2"
                    >
                        {showAssetDetails ? "Hide Asset Details" : "Show Asset Details"}
                    </button>

                    {showAssetDetails && (
                        <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mt-2">
                            {[
                                { label: "Brand", value: postData.Brand },
                                { label: "Asset Type", value: postData.AssetType },
                                { label: "Model", value: postData.Model },
                                { label: "Processor", value: postData.Processor },
                                { label: "RAM", value: postData.Ram },
                                { label: "Storage", value: postData.Storage },
                                { label: "Serial Number", value: postData.SerialNumber },
                                { label: "Purchase Date", value: formatForDateInput(postData.PurchaseDate) },
                                { label: "Asset Age", value: postData.AssetAge },
                                { label: "Amount", value: postData.Amount },
                            ].map((field) => (
                                <div key={field.label}>
                                    <label className="block text-xs font-bold mb-1">{field.label}</label>
                                    <input
                                        type="text"
                                        value={field.value || ""}
                                        readOnly
                                        className="border rounded p-2 text-xs w-full bg-gray-100 cursor-not-allowed"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Other form fields */}
            <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mt-4">
                <div>
                    <label className="block text-xs font-bold mb-1">Maintenance Date</label>
                    <input
                        type="date"
                        name="MaintenanceDate"
                        value={formatForDateInput(postData.MaintenanceDate)}
                        onChange={handleChange}
                        className="border rounded p-2 text-xs w-full"
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold mb-1">Remarks</label>
                    <textarea
                        name="Remarks"
                        value={postData.Remarks || ""}
                        onChange={handleChange}
                        className="border rounded p-2 text-xs w-full"
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold mb-1">Scheduled Date (Optional)</label>
                    <input
                        type="date"
                        name="ScheduledDate"
                        value={formatForDateInput(postData.ScheduledDate)}
                        onChange={handleChange}
                        className="border rounded p-2 text-xs w-full"
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold mb-1">Status</label>
                    <select
                        name="Status"
                        value={postData.Status || ""}
                        onChange={handleChange}
                        className="border rounded p-2 text-xs w-full"
                    >
                        <option value="">Select Status</option>
                        <option value="Ongoing">Ongoing</option>
                        <option value="For Repairing">Lend</option>
                        <option value="Disposal">Disposal</option>
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-bold mb-1">Performed By</label>
                    <input
                        name="PerformedBy"
                        value={postData.PerformedBy || ""}
                        onChange={handleChange}
                        className="border rounded p-2 text-xs w-full"
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
