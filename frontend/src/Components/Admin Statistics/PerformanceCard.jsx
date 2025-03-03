import React, {useEffect, useState} from "react";
import "./AdminStat.css";


const PerformanceCard = ({tutorList}) => {

    return (
        <>
        {tutorList.length > 0 ? (
            tutorList.map((tutor) => (
                //should have hover animations
                <div key={tutor.id} className="tutor-card"
                /*onClick={redirect to perf stat}*/>
                    <div className="profile-img"></div>
                    <h3>{tutor.last_name}</h3>
                    <h3>{tutor.first_name}</h3>
                    <p>{tutor.student_number}</p>
                </div>
            ))
        ) : (
            <p>No tutors available.</p>
        )
        }
        </>
    );
};

export default PerformanceCard;
