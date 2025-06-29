import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import TuteeNav from "../Nav/TuteeNav";
import "./CourseInfo.css";
import defaultCourseImg from "../../assets/HP1.png";

const CourseInfo = () => {
  const { course_code } = useParams();
  const [course, setCourse] = useState(null);
  const navigate = useNavigate();
  const [imgSrc, setImgSrc] = useState(defaultCourseImg);

  useEffect(() => {
    const fetchCourse = async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("course_code", course_code)
        .single();
      if (!error) setCourse(data);
    };
    fetchCourse();
  }, [course_code]);

  // Dynamically set image source based on course code
  useEffect(() => {
    if (!course_code) return;
    // Try to use the image with the course code as filename
    const imagePath = `/src/assets/${course_code}.png`;
    // Try to fetch the image to check if it exists
    fetch(imagePath)
      .then((res) => {
        if (res.ok) setImgSrc(imagePath);
        else setImgSrc(defaultCourseImg);
      })
      .catch(() => setImgSrc(defaultCourseImg));
  }, [course_code]);

  useEffect(() => {
    document.body.classList.add("course-info-bg");
    return () => {
      document.body.classList.remove("course-info-bg");
    };
  }, []);

  if (!course) return <div>Loading...</div>;

  return (
    <>
      <TuteeNav />
      <div className="course-info-container">
        <h1 className="course-info-title">
          {course.course_code} - {course.course_name}
        </h1>
        <img
          src={imgSrc}
          alt="Course"
          className="course-info-image"
          onError={() => setImgSrc(defaultCourseImg)}
        />
        <div className="course-info-details">
          <strong>Description:</strong>
          <p>{course.description || "No description available."}</p>
          <strong>Credit Units:</strong>
          <p>{course.credit_units || "N/A"}</p>
          <strong>Pre-requisite:</strong>
          <p>{course.pre_requisite || "None"}</p>
        </div>
        <button
          className="request-tutor-button"
          onClick={() =>
            navigate(`/request?course=${encodeURIComponent(course.course_code)}`)
          }
        >
          Request a Tutor for this Course
        </button>
      </div>
    </>
  );
};

export default CourseInfo;