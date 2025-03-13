import React, { useState, useEffect } from "react";
import "../Modal/Modal.css";
import ActiveBookings from "./ActiveBookings";

const FeedbackForm = ({ userRole, onClose }) => {
  const [responses, setResponses] = useState({});
  const [comments, setComments] = useState("");
  const [pageNum, setPageNum] = useState(1);
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    console.log("Current responses:", responses);
  }, [responses]);

  const handleResponseChange = (questionId, value) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }));
    if (validationError) {
      setValidationError("");
    }
  };

  const handleCommentChange = (e) => {
    setComments(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validatePage("webapp")) {
      return;
    }

    const feedbackData = { responses, comments, userRole };

    console.log("Feedback Submitted:", feedbackData);

    onClose();

    //no backend yet
  };

  const tuteeQuestions = [
    {
      id: "knowledge",
      text: "1. The tutor demonstrated strong knowledge of the subject matter.",
    },
    {
      id: "explanations",
      text: "2. The tutor explained concepts in a way that was easy to understand.",
    },
    {
      id: "patience",
      text: "3. The tutor was patient with my questions and learning pace.",
    },
    {
      id: "examples",
      text: "4. The tutor provided relevant examples that enhanced my understanding.",
    },
    {
      id: "environment",
      text: "5. The tutor created a positive learning environment.",
    },
    {
      id: "needs",
      text: "6. My specific learning needs and questions were addressed.",
    },
    {
      id: "satisfaction",
      text: "7. Overall, I am satisfied with this tutoring session.",
    },
  ];

  const tutorQuestions = [
    {
      id: "punctuality",
      text: "1. The student arrived on time for the scheduled session.",
    },
    {
      id: "engagement",
      text: "2. The student actively participated throughout the session.",
    },
    {
      id: "progress",
      text: "3. We made meaningful progress on the subject material during this session.",
    },
    {
      id: "timeManagement",
      text: "4. We used our session time effectively.",
    },
    {
      id: "sessionSatisfaction",
      text: "5. Overall, I am satisfied with how this tutoring session went.",
    },
  ];

  const questions = userRole === "Tutee" ? tuteeQuestions : tutorQuestions;

  const webAppQuestions = [
    {
      id: "webapp1",
      text: "1. The scheduling application was intuitive and easy to navigate.",
    },
    {
      id: "webapp2",
      text: "2. Booking/scheduling a tutoring session was straightforward.",
    },
    {
      id: "webapp3",
      text: "3. The calendar feature effectively displayed availability and scheduled sessions.",
    },
    {
      id: "webapp4",
      text: "4. I received timely reminders and notifications about my sessions.",
    },
    {
      id: "webapp5",
      text: "5. The process for rescheduling or canceling sessions was convenient.",
    },
  ];

  const ratingLabels = [
    "Strongly Disagree",
    "Disagree",
    "Neutral",
    "Agree",
    "Strongly Agree",
  ];

  const validatePage = (questionType) => {
    let currentQuestions = webAppQuestions;
    if (questionType === "user") {
      currentQuestions = questions;
    } else {
      currentQuestions = webAppQuestions;
    }

    const unansweredQuestions = currentQuestions.filter(
      (q) => !responses[q.id]
    );
    if (unansweredQuestions.length > 0) {
      setValidationError("Please answer all questions before submitting.");
      return false;
    }

    setValidationError("");
    return true;
  };

  const handleNextClick = () => {
    if (validatePage("user")) {
      setPageNum(pageNum + 1);
    }
  };

  return (
    <>
      <div className="modal-overlay">
        <div className="modal-content feedbackform">
          <div className="feedback-container">
            <h1>Session Evaluation</h1>
            <p>Please rate the following aspects of the tutoring session:</p>
            <form onSubmit={handleSubmit}>
              {pageNum === 1 && (
                <div className="form-group">
                  {questions.map((q) => (
                    <div key={q.id} className="form-group">
                      <h3>{q.text}</h3>
                      <div className="rating-options">
                        {ratingLabels.map((label, index) => (
                          <label key={index}>
                            <input
                              type="radio"
                              name={q.id}
                              value={index + 1}
                              checked={responses[q.id] === index + 1}
                              onChange={() =>
                                handleResponseChange(q.id, index + 1)
                              }
                            />
                            {label}
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                  {validationError && (
                    <div className="error-message">{validationError}</div>
                  )}
                  <button type="button" onClick={handleNextClick}>
                    Next
                  </button>
                </div>
              )}

              {pageNum === 2 && (
                <div className="form-group">
                  {webAppQuestions.map((q) => (
                    <div key={q.id} className="form-group">
                      <h3>{q.text}</h3>
                      <div className="rating-options">
                        {ratingLabels.map((label, index) => (
                          <label key={index}>
                            <input
                              type="radio"
                              name={q.id}
                              value={index + 1}
                              checked={responses[q.id] === index + 1}
                              onChange={() =>
                                handleResponseChange(q.id, index + 1)
                              }
                            />
                            {label}
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

                  {validationError && (
                    <div className="error-message">{validationError}</div>
                  )}

                  <div className="button-group">
                    <button
                      type="button"
                      onClick={() => setPageNum(pageNum - 1)}
                    >
                      Previous
                    </button>
                    <button type="submit">Submit</button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default FeedbackForm;
