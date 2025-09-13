"use client";

import React from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

interface Product {
    _id: string;
    ReferenceID: string;
    profilePicture: string;
    Firstname: string;
    Lastname: string;
    Position: string;
    Department: string;
    Location: string;
    Status: string;
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
    createdAt: string;
}

interface TableProps {
    currentPosts: Product[];
    handleEdit: (product: Product) => void;
    handleDelete: (id: string) => void;
}

const Table: React.FC<TableProps> = ({ currentPosts, handleEdit, handleDelete }) => {
    const handleExport = async () => {
        const workbook = new ExcelJS.Workbook();
        workbook.creator = "Your App Name";
        workbook.created = new Date();

        const worksheet = workbook.addWorksheet("Assigned Assets");

        // Columns definition
        worksheet.columns = [
            { header: "Employee Info", key: "employeeInfo", width: 40 },
            { header: "Status", key: "status", width: 15 },
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
            { header: "Created At", key: "createdAt", width: 25 },
        ];

        // Header style
        worksheet.getRow(1).eachCell((cell) => {
            cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF4472C4" } };
            cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
            cell.border = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" }
            };
            cell.alignment = { vertical: "middle", horizontal: "center" };
        });

        // Add rows
        currentPosts.forEach((post) => {
            worksheet.addRow({
                employeeInfo: `${post.ReferenceID} | ${post.Firstname} ${post.Lastname} | ${post.Position} | ${post.Department} | ${post.Location}`,
                status: post.Status,
                brand: post.Brand,
                assetType: post.AssetType,
                model: post.Model,
                processor: post.Processor,
                ram: post.Ram,
                storage: post.Storage,
                serialNumber: post.SerialNumber,
                purchaseDate: post.PurchaseDate,
                assetAge: post.AssetAge,
                amount: post.Amount,
                remarks: post.Remarks,
                createdAt: new Date(post.createdAt).toLocaleString("en-PH"),
            });
        });

        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer]), `AssignedAssets_${new Date().toISOString().slice(0, 10)}.xlsx`);
    };

    return (
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-800">Assigned Assets</h2>
                <button
                    onClick={handleExport}
                    disabled={currentPosts.length === 0}
                    className={`ml-auto flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-md transition-all
            ${currentPosts.length === 0
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md"}
          `}
                >
                    Export to Excel
                </button>
            </div>

            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 tracking-wider">Employee Info</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 tracking-wider">Brand</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 tracking-wider">Asset Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 tracking-wider">Model</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 tracking-wider">Serial Number</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 tracking-wider">Remarks</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {currentPosts.length > 0 ? (
                        currentPosts.map((post) => (
                            <tr key={post._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-xs text-gray-900">
                                    <div className="flex items-center gap-3">
                                        {/* Profile picture */}
                                        {post.profilePicture && (
                                            <img
                                                src={post.profilePicture}
                                                alt={`${post.Firstname} ${post.Lastname}`}
                                                className="w-8 h-8 rounded-full border"
                                            />
                                        )}

                                        {/* User info */}
                                        <div className="whitespace-pre-line">
                                            <span className="font-semibold">{post.ReferenceID}</span> - <span className="capitalize">{post.Lastname}, {post.Firstname}</span>
                                            <br />
                                            {post.Position}, {post.Department}, {post.Location}
                                        </div>
                                    </div>
                                </td>

                                <td className="px-6 py-4 text-xs text-gray-700">{post.Status}</td>
                                <td className="px-6 py-4 text-xs text-gray-700">{post.Brand}</td>
                                <td className="px-6 py-4 text-xs text-gray-700">{post.AssetType}</td>
                                <td className="px-6 py-4 text-xs text-gray-700">{post.Model}</td>
                                <td className="px-6 py-4 text-xs text-gray-700 uppercase">{post.SerialNumber}</td>
                                <td className="px-6 py-4 text-xs text-gray-700 capitalize">{post.Remarks}</td>
                                <td className="px-6 py-4 text-xs font-medium">
                                    <div className="flex space-x-2">
                                        <button onClick={() => handleEdit(post)} className="text-indigo-600 hover:underline">Edit</button>
                                        <button onClick={() => handleDelete(post._id)} className="text-red-600 hover:underline">Delete</button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                                No records found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
