"use client";

import React, { useState, useEffect } from "react";

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

    return (
        <form onSubmit={handleSubmit} className="text-xs space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <div>
                    <label className="block text-xs font-bold mb-1">Company Name</label>
                    <input
                        name="CompanyName"
                        value={postData.CompanyName || ""}
                        onChange={handleChange}
                        placeholder="Company Name"
                        className="border rounded p-2 text-xs w-full"
                        required
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold mb-1">Email</label>
                    <input
                        name="Email"
                        value={postData.Email || ""}
                        onChange={handleChange}
                        placeholder="Email"
                        className="border rounded p-2 text-xs w-full"
                        required
                    />
                </div>
                
                <div>
                    <label className="block text-xs font-bold mb-1">Contact Person</label>
                    <input
                        name="ContactPerson"
                        value={postData.ContactPerson || ""}
                        onChange={handleChange}
                        placeholder="Contact Person"
                        className="border rounded p-2 text-xs w-full"
                    />
                </div>

                {/*
                <div>
                    <label className="block text-xs font-bold mb-1">Product</label>
                    <select
                        name="Product"
                        value={postData.Product || ""}
                        onChange={handleChange}
                        className="border rounded p-2 text-xs w-full"
                        required
                     > 
                        <option value= "" disabled hidden>
                            Select Type
                         </option>
                         <option value="SI 97"> Buildchem(r) SI 97 </option>
                         <option value="SI 98"> Buildchem(r) SI 98 </option>
                         <option value="SI 99"> Buildchem(r) SI 99 </option>
                         <option value="SI 100"> Buildchem(r) SI 100 </option>
                         <option value="SI 101"> Buildchem(r) SI 101 </option>
                         <option value="SI 102"> Buildchem(r) SI 102 </option>
                        </select>
                </div>*/}

                 <div>
                    <label className="block text-xs font-bold mb-1">Complete Address</label>
                    <input
                        name="Address"
                        value={postData.Address || ""}
                        onChange={handleChange}
                        placeholder="Address"
                        className="border rounded p-2 text-xs w-full"
                    />
                </div>

                 <div>
                    <label className="block text-xs font-bold mb-1">Contact Number</label>
                    <input
                        name="ContactNumber"
                        value={postData.ContactNumber || ""}
                        onChange={handleChange}
                        placeholder="Contact Number"
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
                    {isEditMode ? "Update" : "Saved"}
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