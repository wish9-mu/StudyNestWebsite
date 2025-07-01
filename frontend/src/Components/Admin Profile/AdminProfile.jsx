import "./AdminProfile.css";
import AvailableCourses from "./AvailableCourses";
import AdminNav from "../Nav/AdminNav";
const AdminProfile = () => {

  return (
    <div className="admin-profile-page">
      <AdminNav />
      {/* Main Content */}
      <main className="main-content">
        <div className="admin-header">
          <h1 className="admin-title">StudyNest Admin</h1>
          <p className="admin-subtitle">
            This is an admin view exclusive for Admins under StudyNest.
          </p>
        </div>

        <section className="courses-section">
          <h2 className="section-title">Tutoring Courses</h2>
          <div className="courses-container">
            <AvailableCourses />
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminProfile;
