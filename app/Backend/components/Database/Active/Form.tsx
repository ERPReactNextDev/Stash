"use client";

import React from "react";
import { toast } from "react-toastify";

import FormFields from "./FormFields";

interface FormProps {
  showForm: boolean;
  isEditMode: boolean;
  postData: any;
  initialFormState: any;
  setPostData: (data: any) => void;
  setShowForm: (val: boolean) => void;
  setIsEditMode: (val: boolean) => void;
  editingPostId: string | null;
  setEditingPostId: (val: string | null) => void;
  userDetails: any;
  fetchPosts: (refId: string) => void;
}

const Form: React.FC<FormProps> = ({
  showForm,
  isEditMode,
  postData,
  initialFormState,
  setPostData,
  setShowForm,
  setIsEditMode,
  editingPostId,
  setEditingPostId,
  userDetails,
  fetchPosts,
}) => {
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setPostData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...postData,
      ReferenceID: userDetails.ReferenceID,
      createdBy: userDetails.UserId,
    };

    const url = isEditMode
      ? `/api/Backend/Database/edit?id=${editingPostId}`
      : "/api/Backend/Database/create";

    const method = isEditMode ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success(isEditMode ? "Data Updated!" : "Data added!");
        setShowForm(false);
        setIsEditMode(false);
        setEditingPostId(null);
        setPostData(initialFormState);
        fetchPosts(userDetails.ReferenceID);
      } else {
        toast.error(result.message || "Error occurred.");
      }
    } catch (error) {
      toast.error("Failed to save data.");
    }
  };

  if (!showForm) return null;

  return (
    <FormFields
      postData={postData}
      handleChange={handleChange}
      setPostData={setPostData}
      setShowForm={setShowForm}
      setIsEditMode={setIsEditMode}
      handleSubmit={handleSubmit}
      isEditMode={isEditMode}
      initialFormState={initialFormState}
    />
  );
};

export default Form;