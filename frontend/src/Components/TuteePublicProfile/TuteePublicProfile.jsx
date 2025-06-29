import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import TutorNav from "../Nav/TutorNav";
import defaultTuteeImg from "../../assets/default-avatar.png";
import "./TuteePublicProfile.css";

const TuteePublicProfile = () => {
  const { id } = useParams();
  const [tutee, setTutee] = useState(null);
  const [imgSrc, setImgSrc] = useState(defaultTuteeImg);

  useEffect(() => {
    const fetchTutee = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();
      if (!error && data) {
        setTutee(data);
        if (data.profile_picture) setImgSrc(data.profile_picture);
      }
    };
    fetchTutee();
  }, [id]);

  if (!tutee) return <div>Loading...</div>;

  return (
    <>
      <TutorNav />
      <div className="tutee-profile-container">
        <img
          src={imgSrc}
          alt="Tutee"
          className="tutee-profile-image"
        />
        <h1>
          {tutee.first_name} {tutee.last_name}
        </h1>
        <p>
          {tutee.about_me || "No description available."}
        </p>
        <p>
          <strong>Email:</strong> {tutee.email}
        </p>
      </div>
    </>
  );
};

export default TuteePublicProfile;