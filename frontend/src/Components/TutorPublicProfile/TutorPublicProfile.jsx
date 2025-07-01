import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import TuteeNav from "../Nav/TuteeNav";
import defaultTutorImg from "../../assets/user.png";
import "./TutorPublicProfile.css";

const TutorPublicProfile = () => {
  const { id } = useParams();
  const [tutor, setTutor] = useState(null);
  const [courses, setCourses] = useState([]);
  const [imgSrc, setImgSrc] = useState(defaultTutorImg);

  useEffect(() => {
    const fetchTutor = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();
      if (!error && data) {
        setTutor(data);
        // Always reset to default first
        setImgSrc(data.profile_picture ? data.profile_picture : defaultTutorImg);
      }
    };

    const fetchCourses = async () => {
      const { data, error } = await supabase
        .from("tutor_courses")
        .select("course_code, courses(course_name)")
        .eq("tutor_id", id);

      if (!error && data) setCourses(data);
    };

    fetchTutor();
    fetchCourses();
  }, [id]);

  if (!tutor) return <div>Loading...</div>;

  return (
    <>
      <TuteeNav />
      <div className="tutor-profile-container" >
        <img
          src={imgSrc}
          alt="Tutor"
          className="tutor-profile-image"
        />
        <h1>
          {tutor.first_name} {tutor.last_name}
        </h1>
        <p>
            {tutor.about_me || "No description available."}
        </p>
        <h3>Courses Taught:</h3>
        <ul>
          {courses.length > 0 ? (
            courses.map((course) => (
              <li key={course.course_code}>
                <strong>{course.course_code}</strong>
                {course.courses && ` - ${course.courses.course_name}`}
              </li>
            ))
          ) : (
            <li></li>
          )}
        </ul>
      </div>
    </>
  );
};

export default TutorPublicProfile;