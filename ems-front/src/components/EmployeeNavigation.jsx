import { Link } from 'react-router-dom';
import { isLoggedIn, logout } from "../auth";
import "../index.css";

const Navigation = () => {
  return (
    <nav className="ems-navigation">
        <ul>
     
            <li><Link to="/listpage">Home</Link></li>
            <li><Link to="/admin">Admin</Link></li>
            <li><Link to="/create">Add Employee</Link></li>
            <li><Link to="/community">Community</Link></li>
            <li className="nav">
              <Link to="/recreation">Recreation Page <span className="down">&#9660;</span> </Link>
              <ul className="nav-menu">
                <li><Link to="/recreation">Overview</Link></li>
                <li><Link to="/recreation/boardgames">Board Games</Link></li>
              </ul>
            </li>
            {isLoggedIn() && (
              <li>
                <button className="nav-button" onClick={() => { logout(); window.location.href = "/login"; }}>
                  Logout
                </button>
              </li>
            )}
        </ul>
    </nav>
  );
};

export default Navigation;
