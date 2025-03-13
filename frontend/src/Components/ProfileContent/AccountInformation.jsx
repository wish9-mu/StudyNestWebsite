import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import "./AccountInformation.css";

const AccountInformation = () => {
  const [userData, setUserData] = useState({
    profile_picture: "",
    first_name: "",
    last_name: "",
    email: "",
    mobile_number: "",
    student_number: "",
    role: "",
    year: "",
    program: "",
    about_me: "",
    session_history: [],
  });
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error);
      } else {
        setUser(data.user);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);

      // ✅ Get the authenticated user
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      if (userError || !userData?.user?.id) {
        console.error("❌ Error fetching user:", userError || "User not found");
        setLoading(false);
        return;
      }

      const userId = userData.user.id; // ✅ Store user ID safely
      console.log("🔹 Retrieved user ID:", userId);

      // ✅ Now, safely query the profiles table
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("❌ Error fetching user profile:", error);
      } else {
        setUserData(data);
        console.log("✅ User profile loaded:", data);
      }

      setLoading(false);
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);

    const updateData = {
      first_name: userData.first_name,
      last_name: userData.last_name,
      mobile_number: userData.mobile_number,
      year: userData.year,
      program: userData.program,
      about_me: userData.about_me,
    };

    const { error } = await supabase
      .from("profiles")
      .update(updateData)
      .eq("id", user?.id);

    if (error) console.error("Error updating profile:", error);
    else setEditMode(false);

    setLoading(false);
  };

  // Handle Profile Picture Upload
  const handleUpload = async (event) => {
    console.log("📁 Uploading file...");
    setUploading(true);
    const file = event.target.files[0];

    if (!file) {
      console.warn("No file selected.");
      setUploading(false);
      return;
    }

    const fileExt = file.name.split(".").pop();
    const filePath = `avatars/${user?.id}.${fileExt}`;

    console.log("🚀 Uploading file:", filePath);

    // Upload to Supabase Storage (Upsert: Overwrites existing file)
    const { data, error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      console.error("❌ Error uploading file:", uploadError);
      setUploading(false);
      return;
    }

    console.log("✅ File successfully uploaded:", data);

    // Get the public URL of the uploaded file
    const { data: publicData, error: urlError } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    if (urlError) {
      console.error("❌ Error getting file URL:", urlError);
      setUploading(false);
      return;
    }

    const publicURL = publicData.publicUrl;
    console.log("🔗 Public URL of uploaded file:", publicURL);

    // Update profile_picture in Supabase `profiles` table
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ profile_picture: publicURL })
      .eq("id", user?.id);

    if (updateError) {
      console.error(
        "❌ Error updating profile picture in database:",
        updateError
      );
      setUploading(false);
      return;
    }

    console.log("✅ Profile picture updated in database:", publicURL);
    setUserData({ ...userData, profile_picture: publicURL });

    setUploading(false);
  };

  // Handle Profile Picture Removal
  const handleRemovePicture = async () => {
    setUploading(true);

    // Remove the file from Supabase Storage
    if (userData.profile_picture) {
      const fileName = userData.profile_picture.split("/").pop();
      const { error } = await supabase.storage
        .from("avatars")
        .remove([`avatars/${fileName}`]);

      if (error) {
        console.error("Error removing profile picture:", error);
        setUploading(false);
        return;
      }
    }

    // Update the profile picture field to default in Supabase
    const { error } = await supabase
      .from("profiles")
      .update({ profile_picture: "" })
      .eq("id", user?.id);

    if (error) {
      console.error("Error removing profile picture:", error);
      setUploading(false);
      return;
    }

    setUserData({ ...userData, profile_picture: "" });
    setUploading(false);
  };

  return (
    <div className="account-info-container">
      <div className="profile-pic">
        <img
          src={userData.profile_picture || "/default-avatar.png"}
          alt="Profile"
          className="profile-image"
        />
        <div className="profile-buttons">
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading}
            style={{ display: "none" }}
            id="fileInput"
          />
          <button
            onClick={() => document.getElementById("fileInput").click()}
            disabled={uploading}
            className="upload-button"
          >
            {uploading ? "Uploading..." : "Change Picture"}
          </button>
          {userData.profile_picture && (
            <button
              onClick={handleRemovePicture}
              disabled={uploading}
              className="remove-button"
            >
              Remove Picture
            </button>
          )}
        </div>
      </div>

      <div className="account-form">
        <div className="form-group">
          <label>First Name:</label>
          <input
            type="text"
            name="first_name"
            value={userData.first_name}
            disabled={true}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Last Name:</label>
          <input
            type="text"
            name="last_name"
            value={userData.last_name}
            disabled={true}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={userData.email}
            disabled={true}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Mobile Number:</label>
          <input
            type="text"
            name="mobile_number"
            value={userData.mobile_number}
            onChange={handleChange}
            disabled={!editMode}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Student Number:</label>
          <input
            type="text"
            name="student_number"
            value={userData.student_number}
            disabled={true}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Role:</label>
          <input
            type="text"
            name="role"
            value={userData.role}
            disabled={true}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Year:</label>
          <input
            type="text"
            name="year"
            value={userData.year}
            onChange={handleChange}
            disabled={!editMode}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Program:</label>
          <input
            type="text"
            name="program"
            value={userData.program}
            onChange={handleChange}
            disabled={!editMode}
            className="form-control"
          />
        </div>

        <div className="form-group about-me">
          <label>About Me:</label>
          <textarea
            name="about_me"
            value={userData.about_me}
            onChange={handleChange}
            disabled={!editMode}
            className="form-control"
          />
        </div>
      </div>

      <div className="action-buttons">
        {!editMode ? (
          <button onClick={() => setEditMode(true)} className="edit-button">
            Edit Account Information
          </button>
        ) : (
          <>
            <button
              onClick={() => setEditMode(false)}
              className="cancel-button"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="save-button"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AccountInformation;
