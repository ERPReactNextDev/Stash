"use client";

import React, { useState, useEffect } from "react";
import ParentLayout from "../../../components/Layouts/ParentLayout";
import SessionChecker from "../../../components/Session/SessionChecker";
import { ToastContainer, toast } from "react-toastify";
import Form from "../../../components/Maintenance/Form";
import Table from "../../../components/Maintenance/Table";
import Filters from "../../../components/Maintenance/Filters";
import Pagination from "../../../components/Database/Active/Pagination";
import { FiX } from "react-icons/fi";
import "react-toastify/dist/ReactToastify.css";

export default function AssignedAssetPage() {
    const [userDetails, setUserDetails] = useState<any>({
        UserId: "",
        ReferenceID: "",
        Firstname: "",
        Lastname: "",
        Email: "",
        Role: "",
    });

    const [posts, setPosts] = useState<any[]>([]);
    const [filteredPosts, setFilteredPosts] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingPostId, setEditingPostId] = useState<string | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // delete modal state
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteStep, setDeleteStep] = useState<1 | 2>(1);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const initialFormState = {
        AssetNumber: "",
        MaintenanceDate: "",
        Remarks: "",
        ScheduledDate: "",
        PerformedBy: "",
        status: "",
    };

    const [postData, setPostData] = useState(initialFormState);
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 10;

    const fetchPosts = async (refId: string) => {
        if (!refId) return;
        try {
            const res = await fetch(`/api/Backend/Maintenance/fetch?id=${encodeURIComponent(refId)}`);
            const json = await res.json();
            setPosts(json.data || []);
        } catch (err) {
            console.error("❌ Fetch posts error:", err);
            toast.error("Failed to fetch assigned assets.");
        }
    };

    // Fetch user details
    useEffect(() => {
        const userId = new URLSearchParams(window.location.search).get("id");
        if (!userId) return;

        (async () => {
            try {
                const res = await fetch(`/api/Backend/user?id=${encodeURIComponent(userId)}`);
                const data = await res.json();
                if (!res.ok || !data) {
                    toast.error("Failed to fetch user data.");
                    return;
                }

                setUserDetails({
                    UserId: data._id ?? "",
                    ReferenceID: data.ReferenceID ?? "",
                    Firstname: data.Firstname ?? "",
                    Lastname: data.Lastname ?? "",
                    Email: data.Email ?? "",
                    Role: data.Role ?? "",
                });

                if (data.ReferenceID) fetchPosts(data.ReferenceID);
            } catch (err) {
                console.error("❌ Fetch user error:", err);
                toast.error("Failed to fetch user data.");
            }
        })();
    }, []);

    // Search & filter
    useEffect(() => {
        let filtered = posts;

        // 🔍 Search across multiple fields
        if (searchTerm) {
            filtered = filtered.filter((post) => {
                const text = `
        ${post.Brand || ""} 
        ${post.AssetType || ""} 
        ${post.Model || ""} 
        ${post.Processor || ""} 
        ${post.Ram || ""} 
        ${post.Storage || ""} 
        ${post.SerialNumber || ""} 
        ${post.ReferenceID || ""} 
        ${post.Firstname || ""} 
        ${post.Lastname || ""} 
        ${post.Department || ""} 
        ${post.Position || ""} 
        ${post.Location || ""}
      `.toLowerCase();
                return text.includes(searchTerm.toLowerCase());
            });
        }

        // 📅 Date filter based on PurchaseDate
        if (startDate || endDate) {
            filtered = filtered.filter((post) => {
                const postDate = post?.PurchaseDate ? new Date(post.PurchaseDate) : null;
                if (!postDate) return false;

                const meetsStartDate = !startDate || postDate >= new Date(startDate);
                const meetsEndDate =
                    !endDate || postDate <= new Date(`${endDate}T23:59:59`);
                return meetsStartDate && meetsEndDate;
            });
        }

        setFilteredPosts(filtered);
        setCurrentPage(1);
    }, [posts, searchTerm, startDate, endDate]);


    // Pagination
    const indexOfLastPost = currentPage * postsPerPage;
    const currentPosts = filteredPosts.slice(indexOfLastPost - postsPerPage, indexOfLastPost);
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

    const handleEdit = (post: any) => {
        setPostData(post);
        setEditingPostId(post._id);
        setIsEditMode(true);
        setShowForm(true);
        setIsExpanded(true);
    };

    const confirmDelete = (id: string) => {
        setDeleteId(id);
        setDeleteStep(1);
        setDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            const res = await fetch(
                `/api/Backend/Asset/Inventory/delete?id=${encodeURIComponent(deleteId)}`,
                { method: "DELETE" }
            );
            const result = await res.json();
            if (res.ok) {
                toast.success("Record deleted");
                fetchPosts(userDetails.ReferenceID);
            } else {
                toast.error(result.message || "Delete failed");
            }
        } catch (err) {
            console.error("❌ Delete error:", err);
            toast.error("Error deleting record");
        } finally {
            setDeleteModalOpen(false);
            setDeleteId(null);
        }
    };

    const closeModal = () => {
        setShowForm(false);
        setIsEditMode(false);
        setEditingPostId(null);
        setIsExpanded(false);
        setPostData(initialFormState);
    };

    return (
        <SessionChecker>
            <ParentLayout>
                <div className="container mx-auto p-4 text-gray-900">
                    <h1 className="text-2xl font-bold mb-6">Maintenance Logs</h1>

                    <div className="mb-4 p-10 bg-white shadow-md rounded-lg text-gray-900">
                        {showForm ? (
                            <>
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-lg font-semibold">
                                        {isEditMode ? "Edit Assigned Asset" : "Assign Asset"}
                                    </h2>
                                    <button
                                        onClick={closeModal}
                                        className="text-gray-500 hover:text-gray-700 transition-colors"
                                    >
                                        <FiX className="text-xl" />
                                    </button>
                                </div>

                                <Form
                                    showForm={showForm}
                                    isEditMode={isEditMode}
                                    postData={postData}
                                    initialFormState={initialFormState}
                                    setPostData={setPostData}
                                    setShowForm={setShowForm}
                                    setIsEditMode={setIsEditMode}
                                    editingPostId={editingPostId}
                                    setEditingPostId={setEditingPostId}
                                    fetchPosts={fetchPosts}
                                    userDetails={userDetails}
                                />
                            </>
                        ) : (
                            <>
                                <Filters
                                    searchTerm={searchTerm}
                                    setSearchTerm={setSearchTerm}
                                    startDate={startDate}
                                    setStartDate={setStartDate}
                                    endDate={endDate}
                                    setEndDate={setEndDate}
                                    onAddClick={() => {
                                        setShowForm(true);
                                        setIsExpanded(true);
                                    }}
                                />

                                <Table
                                    currentPosts={currentPosts}
                                    handleEdit={handleEdit}
                                    handleDelete={confirmDelete} // 🔹 Use confirmDelete
                                />

                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={(page) => setCurrentPage(page)}
                                />
                            </>
                        )}
                    </div>
                </div>

                {/* Delete Modal */}
                {deleteModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-[999]">
                        <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                            {deleteStep === 1 ? (
                                <>
                                    <h3 className="text-lg font-semibold mb-4">Process Delete</h3>
                                    <p className="text-sm text-gray-600 mb-6">
                                        Are you sure you want to process this delete request?
                                    </p>
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => setDeleteModalOpen(false)}
                                            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 text-xs"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => setDeleteStep(2)}
                                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
                                        >
                                            Process
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <h3 className="text-lg font-semibold mb-4">Delete Permanently</h3>
                                    <p className="text-sm text-red-600 mb-6">
                                        This action cannot be undone. Do you really want to delete this record?
                                    </p>
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => setDeleteModalOpen(false)}
                                            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 text-xs"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleDelete}
                                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
                                        >
                                            Delete Permanently
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}

                <ToastContainer className="text-xs" autoClose={1000} />
            </ParentLayout>
        </SessionChecker>
    );
}
