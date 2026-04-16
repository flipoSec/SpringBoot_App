import {Link} from 'react-router-dom';




export default function Footer() {
  return (
    <>
      <footer className="footer-root">
        <div className="footer-inner">
          <div>
            <div className="footer-brand">Shoppi<em>fy</em></div>
            <p className="footer-tagline">
              A full-stack e-commerce project built with Spring Boot, React & MySQL.
            </p>
          </div>

          <div>
            <div className="footer-col-title">Navigation</div>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/products">Products</Link></li>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </ul>
          </div>

          <div>
            <div className="footer-col-title">Account</div>
            <ul className="footer-links">
              <li><Link to="/profile">My profile</Link></li>
              <li><Link to="/admin">Admin panel</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span className="footer-copy">
            © 2026 · Kafka · M . Flipo
          </span>
          <div className="footer-stack">
            <span>Spring Boot</span>
            <span>React</span>
            <span>MySQL</span>
            <span>JWT</span>
          </div>
        </div>
      </footer>
    </>
  );
}
