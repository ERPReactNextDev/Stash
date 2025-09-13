import React, { useState } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiDownload, FiTrash2 } from "react-icons/fi";

interface Product {
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

interface TableProps {
    currentPosts: Product[];
    handleEdit: (product: Product) => void;
    handleDelete: (id: string) => void;
    fetchPosts?: () => void; // add this
}

// 📌 Format purchase date
const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? dateString : date.toISOString().split("T")[0];
};

// 📌 Calculate asset age in years
const calculateAssetAge = (purchaseDate: string) => {
    if (!purchaseDate) return 0;
    const start = new Date(purchaseDate);
    const now = new Date();
    let years = now.getFullYear() - start.getFullYear();
    let months = now.getMonth() - start.getMonth();
    let days = now.getDate() - start.getDate();

    if (days < 0) {
        months--;
        const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
        days += prevMonth;
    }
    if (months < 0) {
        years--;
        months += 12;
    }
    return years;
};

const Table: React.FC<TableProps> = ({ currentPosts, handleEdit, handleDelete, fetchPosts }) => {
    const [showDisposal, setShowDisposal] = useState(false);
    const [selectedAssets, setSelectedAssets] = useState<string[]>([]);

    const handleExport = async () => {
        const workbook = new ExcelJS.Workbook();
        workbook.creator = "Stash IT";
        workbook.created = new Date();
        const worksheet = workbook.addWorksheet("Inventory");

        worksheet.columns = [
            { header: "Brand", key: "brand", width: 20 },
            { header: "Asset Type", key: "assetType", width: 20 },
            { header: "Model", key: "model", width: 20 },
            { header: "Processor", key: "processor", width: 20 },
            { header: "RAM", key: "ram", width: 15 },
            { header: "Storage", key: "storage", width: 15 },
            { header: "Serial Number", key: "serialNumber", width: 25 },
            { header: "Purchase Date", key: "purchaseDate", width: 20 },
            { header: "Asset Age", key: "assetAge", width: 20 },
            { header: "Amount", key: "amount", width: 15 },
            { header: "Remarks", key: "remarks", width: 30 },
        ];

        worksheet.getRow(1).eachCell((cell) => {
            cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF4472C4" } };
            cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
            cell.alignment = { vertical: "middle", horizontal: "center" };
            cell.border = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" },
            };
        });

        currentPosts.forEach((post) => {
            worksheet.addRow({
                brand: post.Brand,
                assetType: post.AssetType,
                model: post.Model,
                processor: post.Processor,
                ram: post.Ram,
                storage: post.Storage,
                serialNumber: post.SerialNumber,
                purchaseDate: formatDate(post.PurchaseDate),
                assetAge: `${calculateAssetAge(post.PurchaseDate)}y`,
                amount: post.Amount,
                remarks: post.Remarks,
            });
        });

        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer]), `Inventory_${new Date().toISOString().split("T")[0]}.xlsx`);
    };

    const disposalAssets = currentPosts.filter((post) => calculateAssetAge(post.PurchaseDate) > 5);

    const toggleDisposal = (id: string) => {
        setSelectedAssets((prev) =>
            prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
        );
    };

    const handleDisposal = async () => {
        if (selectedAssets.length === 0) {
            toast.warning("Select assets first");
            return;
        }

        try {
            const res = await fetch("/api/Backend/Asset/Inventory/disposal", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ids: selectedAssets }),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success(`Marked ${data.modifiedCount || selectedAssets.length} asset(s) for disposal`);
                setSelectedAssets([]);
                setShowDisposal(false);
                // 🔹 Refresh table if you have fetchPosts or similar function
                fetchPosts?.(); // call your fetchPosts() function to reload data
            } else {
                toast.error(data.error || "Failed to update disposal status");
            }
        } catch (err) {
            console.error("Disposal request error:", err);
            toast.error("Error sending disposal request");
        }
    };


    return (
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center p-4 border-b gap-2">
                <h2 className="text-lg font-semibold text-gray-800">Inventory</h2>

                <div className="flex gap-2">
                    <button
                        onClick={handleExport}
                        disabled={currentPosts.length === 0}
                        className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-md transition-all
            ${currentPosts.length === 0
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md"
                            }`}
                    >
                        <FiDownload className="text-sm" /> {/* icon */}
                        Export to Excel
                    </button>

                    <button
                        onClick={() => setShowDisposal(!showDisposal)}
                        disabled={disposalAssets.length === 0}
                        className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-md transition-all
            ${disposalAssets.length === 0
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow-md"
                            }`}
                    >
                        <FiTrash2 className="text-sm" /> {/* icon */}
                        View Disposal
                    </button>
                </div>
            </div>

            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr className="whitespace-nowrap">
                        {showDisposal && <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Select</th>}
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">Actions</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">#</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">Brand</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">Asset Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">Model</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">Processor</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">RAM</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">Storage</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">Serial Number</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">Purchase Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">Asset Age</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">Remarks</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {(showDisposal ? disposalAssets : currentPosts).map((post) => {
                        const isSelected = selectedAssets.includes(post._id);

                        return (
                            <tr
                                key={post._id}
                                onClick={() => toggleDisposal(post._id)}
                                className={`hover:bg-gray-50 whitespace-nowrap cursor-pointer ${isSelected ? "bg-red-100" : ""
                                    }`}
                            >
                                {showDisposal && (
                                    <td className="px-4 py-2 text-xs text-gray-700">
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            readOnly
                                        />
                                    </td>
                                )}
                                <td className="px-6 py-4 text-xs font-medium flex gap-2">
                                    <button onClick={() => handleEdit(post)} className="text-indigo-600 hover:underline">
                                        Edit
                                    </button>
                                    <button onClick={() => handleDelete(post._id)} className="text-red-600 hover:underline">
                                        Delete
                                    </button>
                                </td>
                                <td className="px-6 py-4 text-xs text-gray-700">{post.AssetNumber}</td>
                                <td className="px-6 py-4 text-xs text-gray-700">{post.Brand}</td>
                                <td className="px-6 py-4 text-xs text-gray-700">{post.AssetType}</td>
                                <td className="px-6 py-4 text-xs text-gray-700">{post.Model}</td>
                                <td className="px-6 py-4 text-xs text-gray-700">{post.Processor}</td>
                                <td className="px-6 py-4 text-xs text-gray-700">{post.Ram}</td>
                                <td className="px-6 py-4 text-xs text-gray-700">{post.Storage}</td>
                                <td className="px-6 py-4 text-xs text-gray-700">{post.SerialNumber}</td>
                                <td className="px-6 py-4 text-xs text-gray-700">{formatDate(post.PurchaseDate)}</td>
                                <td className="px-6 py-4 text-xs text-gray-700">{calculateAssetAge(post.PurchaseDate)}y</td>
                                <td className="px-6 py-4 text-xs text-gray-700">{post.Amount}</td>
                                <td className="px-6 py-4 text-xs text-gray-700">{post.Remarks}</td>
                            </tr>
                        );
                    })}
                </tbody>

            </table>

            {showDisposal && (
                <div className="flex justify-end p-4 border-t">
                    <button
                        onClick={handleDisposal}
                        disabled={selectedAssets.length === 0}
                        className={`px-4 py-2 text-xs font-medium rounded-md transition-all ${selectedAssets.length === 0
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow-md"
                            }`}
                    >
                        Mark for Disposal
                    </button>
                </div>
            )}
        </div>
    );
};

export default Table;
