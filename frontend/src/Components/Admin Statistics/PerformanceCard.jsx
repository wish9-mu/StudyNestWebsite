import React, {useEffect, useState} from "react";
import "./AdminStat.css";


const PerformanceCard = ( {tutorList}) => {

    return (
        <>
        {tutorList.length > 0 ? (
            tutorList.map((tutor) => (
                //should have hover animations
                <div key={tutor.id} className="tutor-card"
                /*onClick={redirect to perf stat}*/>
                    <div className="profile-img"></div>
                    <h3>{tutor.lName}</h3>
                    <h3>{tutor.fName}</h3>
                    <p>{tutor.studNum}</p>
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
