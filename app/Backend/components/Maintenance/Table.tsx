import React, { useState } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import "react-toastify/dist/ReactToastify.css";
import { FiDownload } from "react-icons/fi";

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
    MaintenanceDate: string;
    ScheduledDate?: string;
    PerformedBy?: string;
    MaintenanceReferenceNumber?: string;
    Status?: string;
}

interface TableProps {
    currentPosts: Product[];
    handleEdit: (product: Product) => void;
    handleDelete: (id: string) => void;
}

const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? dateString : date.toISOString().split("T")[0];
};

const Table: React.FC<TableProps> = ({ currentPosts, handleEdit, handleDelete }) => {
    const handleExport = async () => {
        const workbook = new ExcelJS.Workbook();
        workbook.creator = "Stash IT";
        workbook.created = new Date();
        const worksheet = workbook.addWorksheet("MaintenanceLogs");

        worksheet.columns = [
            { header: "Asset Number", key: "assetNumber", width: 20 },
            { header: "MaintenanceReferenceNumber", key: "reference", width: 25 },
            { header: "Status", key: "status", width: 15 },
            { header: "Maintenance Date", key: "maintenanceDate", width: 20 },
            { header: "Brand", key: "brand", width: 20 },
            { header: "Asset Type", key: "assetType", width: 20 },
            { header: "Model", key: "model", width: 20 },
            { header: "Processor", key: "processor", width: 20 },
            { header: "RAM", key: "ram", width: 15 },
            { header: "Storage", key: "storage", width: 15 },
            { header: "Serial Number", key: "serialNumber", width: 25 },
            { header: "Purchase Date", key: "purchaseDate", width: 20 },
            { header: "Asset Age", key: "assetAge", width: 15 },
            { header: "Amount", key: "amount", width: 15 },
            { header: "Remarks", key: "remarks", width: 30 },
        ];

        currentPosts.forEach((post) => {
            worksheet.addRow({
                assetNumber: post.AssetNumber,
                reference: post.MaintenanceReferenceNumber,
                Status: post.Status,
                maintenanceDate: formatDate(post.MaintenanceDate),
                brand: post.Brand,
                assetType: post.AssetType,
                model: post.Model,
                processor: post.Processor,
                ram: post.Ram,
                storage: post.Storage,
                serialNumber: post.SerialNumber,
                purchaseDate: formatDate(post.PurchaseDate),
                assetAge: post.AssetAge,
                amount: post.Amount,
                remarks: post.Remarks,
            });
        });

        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer]), `MaintenanceLogs_${new Date().toISOString().split("T")[0]}.xlsx`);
    };

    return (
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center p-4 border-b gap-2">
                <h2 className="text-lg font-semibold text-gray-800">Maintenance Logs</h2>
                <button
                    onClick={handleExport}
                    disabled={currentPosts.length === 0}
                    className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-md transition-all ${currentPosts.length === 0
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md"
                        }`}
                >
                    <FiDownload className="text-sm" />
                    Export to Excel
                </button>
            </div>

            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr className="whitespace-nowrap text-xs text-gray-700">
                        <th className="px-6 py-3 text-left">Actions</th>
                        <th className="px-6 py-3 text-left">#</th>
                        <th>Status</th>
                        <th>Remarks</th>
                        <th>Brand</th>
                        <th>Asset Type</th>
                        <th>Model</th>
                        <th>Processor</th>
                        <th>RAM</th>
                        <th>Storage</th>
                        <th>Serial Number</th>
                        <th>Purchase Date</th>
                        <th>Asset Age</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {currentPosts.map((post) => (
                        <tr
                            key={post._id}
                            className="hover:bg-gray-50 whitespace-nowrap cursor-pointer"
                        >
                            <td className="px-6 py-4 text-xs font-medium flex gap-2">
                                <button onClick={() => handleEdit(post)} className="text-indigo-600 hover:underline">
                                    Edit
                                </button>
                                <button onClick={() => handleDelete(post._id)} className="text-red-600 hover:underline">
                                    Delete
                                </button>
                            </td>
                            <td className="px-6 py-4 text-xs text-gray-900">
                                <div className="flex items-center gap-3">
                                    {/* Maintenance info */}
                                    <div className="whitespace">
                                        <span className="font-semibold">{post.MaintenanceReferenceNumber}</span> - <span>{post.PerformedBy || "-"}</span>
                                        <br />
                                        {formatDate(post.MaintenanceDate) || "-"}
                                    </div>
                                </div>
                            </td>


                            <td className="px-6 py-4 text-[10px] text-gray-700"><span className="bg-yellow-500 p-2 rounded-full">{post.Status || "N/A"}</span></td>
                            <td className="px-6 py-4 text-xs text-gray-700">{post.Remarks}</td>
                            <td className="px-6 py-4 text-xs text-gray-700">{post.Brand}</td>
                            <td className="px-6 py-4 text-xs text-gray-700">{post.AssetType}</td>
                            <td className="px-6 py-4 text-xs text-gray-700">{post.Model}</td>
                            <td className="px-6 py-4 text-xs text-gray-700">{post.Processor}</td>
                            <td className="px-6 py-4 text-xs text-gray-700">{post.Ram}</td>
                            <td className="px-6 py-4 text-xs text-gray-700">{post.Storage}</td>
                            <td className="px-6 py-4 text-xs text-gray-700">{post.SerialNumber}</td>
                            <td className="px-6 py-4 text-xs text-gray-700">{formatDate(post.PurchaseDate)}</td>
                            <td className="px-6 py-4 text-xs text-gray-700">{post.AssetAge}</td>
                            <td className="px-6 py-4 text-xs text-gray-700">{post.Amount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
