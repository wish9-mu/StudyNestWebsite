import React, {useState} from "react";
import "../Modal/Modal.css";
import ActiveBookings from "./ActiveBookings";

const FeedbackForm = ({userRole, onClose}) => {
    const [responses, setResponses] = useState({});
    const [comments, setComments] = useState("");
    const [showFeedbackForm, setShowFeedbackForm] = useState(false);

    const handleResponseChange = (questionId, value) => {
        setResponses(prev => ({ ...prev, [questionId]: value }));
    };

    const handleCommentChange = (e) => {
        setComments(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const feedbackData = { responses, comments, userRole };

        console.log("Feedback Submitted:", feedbackData);
        
        onClose();

        //no backend yet
    };

    const questions = userRole === "Tutee" ? [
        { id: "knowledge", text: "The tutor demonstrated strong knowledge of the subject matter." },
        { id: "explanations", text: "The tutor explained concepts in a way that was easy to understand." },
        { id: "patience", text: "The tutor was patient with my questions and learning pace." },
        { id: "examples", text: "The tutor provided relevant examples that enhanced my understanding." },
        { id: "environment", text: "The tutor created a positive learning environment." },
        { id: "needs", text: "My specific learning needs and questions were addressed." },
        { id: "satisfaction", text: "Overall, I am satisfied with this tutoring session." }
    ] : [
        { id: "punctuality", text: "The student arrived on time for the scheduled session." },
        { id: "engagement", text: "The student actively participated throughout the session." },
        { id: "progress", text: "We made meaningful progress on the subject material during this session." },
        { id: "timeManagement", text: "We used our session time effectively." },
        { id: "sessionSatisfaction", text: "Overall, I am satisfied with how this tutoring session went." }
    ];


    return (
        <>
        <div className="modal-overlay">
            <div className="modal-content feedbackform">
                <div className="feedback-container">
                    <h1>Session Evaluation</h1>
                    <p>Please rate the following aspects of the tutoring session:</p>
                    <form onSubmit={handleSubmit}>
                        {questions.map((q) => (
                            <div key={q.id} className="form-group">
                                <h3>{q.text}</h3>
                                <div className="rating-options">
                                    {[1, 2, 3, 4, 5].map((value) => (
                                        <label key={value}>
                                            <input
                                                type="radio"
                                                name={q.id}
                                                value={value}
                                                onChange={() => handleResponseChange(q.id, value)}
                                                required
                                            />
                                            {["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"][value - 1]}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}

                        <div className="form-group">
                            <label>Comments</label>
                            <textarea
                                name="comments"
                                value={comments}
                                onChange={handleCommentChange}
                                className="form-textarea"
                                placeholder="Tell us more about your experience!"
                            />
                        </div>

                        <button type="submit">Submit</button>
                    </form>
                </div>
            </div>
        </div>
        </>
    )
};

export default FeedbackForm;