import "./index.css";
import logo from "./assets/logo.png";
import maintenanceVideo from "./assets/maintenance.mp4";

function App() {
  return (
    <div className="container">
      <img src={logo} alt="Kytalist Logo" className="logo" />

      <h1>
        kytalist.xyz
        <br />
        Under Maintenance
      </h1>

      <video className="illustration" autoPlay loop muted playsInline>
        <source src={maintenanceVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="footer-links">
        <span>Discover</span>
        <span>Explore</span>
        <span>Learn</span>
      </div>
      
    </div>

  
  );
}

export default App;
