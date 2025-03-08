import React, { useState } from "react";
import "./TuteeWaitlist.css";
import TuteeNav from "../Nav/TuteeNav";

const TuteeWaitlist = () => {
  // Example data - in a real app this would come from an API
  const [waitlistedCourses, setWaitlistedCourses] = useState([
    {
      id: 1,
      name: "Introduction to Computer Science",
      instructor: "Dr. Sarah Johnson",
      date: "February 14, 2025",
      day: "Friday",
      time: "10:30-12:00",
      position: 3,
    },
    {
      id: 2,
      name: "Advanced Data Structures",
      instructor: "Prof. Michael Chen",
      date: "February 17, 2025",
      day: "Monday",
      time: "14:00-15:30",
      position: 1,
    },
  ]);

  return (
    <>
      <TuteeNav />
      {/* This div wraps all content except footer */}
      <div className="content-wrapper">
        <div className="tutee-waitlist">
          <div className="header">
            <div className="header-text">
              <h1>Course Waitlist</h1>
            </div>
            <div className="header-info">
              <p>
                Here in Waitlist, you can find your courses that are in wait
                list.
              </p>
            </div>
          </div>

          <div className="waitlist-content">
            {waitlistedCourses.length === 0 ? (
              <div className="empty-waitlist">
                <h3>You don't have any courses in the waitlist</h3>
                <p>
                  When you join a waitlist for a course, it will appear here.
                </p>
              </div>
            ) : (
              waitlistedCourses.map((course) => (
                <div className="card-1" key={course.id}>
                  <div className="align-left-content">
                    <h2>{course.name}</h2>
                    <p>{course.instructor}</p>
                    <p>
                      Waitlist Position:
                      <span className="waitlist-position">
                        #{course.position}
                      </span>
                    </p>
                  </div>
                  <div className="align-right-content">
                    <p>
                      {course.date} | {course.day}
                    </p>
                    <p>{course.time}</p>
                    <button className="leave-waitlist-btn">
                      Leave Waitlist
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Footer - assuming you have a separate Footer component */}
      {/* If you're using a separate Footer component, it should be rendered here */}
      {/* <Footer /> */}

      {/* If you're not using a separate component but need this code to work, 
          uncomment the following: */}
      {/* 
      <div className="footer">
        © StudyNest 2025. All Rights Reserved.
      </div>
      */}
    </>
  );
};

export default TuteeWaitlist;
