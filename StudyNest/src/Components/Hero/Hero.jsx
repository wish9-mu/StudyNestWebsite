import React from "react";
import "./Hero.css";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="hero container">
      <div className="hero-text">
        <h1>Mapuan kami!</h1>
        <p>Hindi mahalaga ang magwagi; ang mahalaga ikaw ay nakibahagi!</p>
        <p>
          Sa panahong ito, may dalawa kang pagpipilian: ang manalo o ang matuto.
        </p>
        <Link to="/request" className="nav-links">
          <button className="btn">Find a Tutor</button>
        </Link>
      </div>
    </div>
  );
};

export default Hero;

// import React from "react";
// import "./Hero.css";
// import heroVideo from "../../assets/LABHAHA.mp4";

// const Hero = () => {
//   return (
//     <div className="hero-container">
//       <video autoPlay loop muted playsInline className="hero-video">
//         <source src="../../assets/LABHAHA.mp4" type="video/mp4" />
//       </video>
//       <div className="hero-text">
//         <h1>Mapuan kami!</h1>
//         <p>Hindi mahalaga ang magwagi; ang mahalaga ikaw ay nakibahagi!</p>
//         <p>
//           Sa panahong ito, may dalawa kang pagpipilian: ang manalo o ang matuto.
//         </p>
//         <button className="btn">Find a Tutor</button>
//       </div>
//     </div>
//   );
// };

// export default Hero;
