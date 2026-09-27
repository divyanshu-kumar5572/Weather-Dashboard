// client/src/components/Navbar.js

// 1. Import `useContext` from React and our custom `AuthContext`.
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Navbar() {
  // 2. Use the useContext hook to get the values from our AuthContext.
  // We destructure `isAuthenticated` to check the login status and `logout`
  // to give our button a function to call.
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // 3. Create a handler function for the logout action.
  // This function will call the logout function from our context and then
  // redirect the user to the homepage.
  const handleLogout = () => {
    logout();
    navigate('/'); // Redirect to homepage after logout for a clean user experience.
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Weather Dashboard</Link>
      </div>
      <div className="navbar-links">
        {/* 4. This is the core of our dynamic UI: Conditional Rendering.
            We use a ternary operator to check the value of `isAuthenticated`.
            - If `true`, we render the links/buttons for a logged-in user.
            - If `false`, we render the links for a guest user.
        */}
        {isAuthenticated ? (
          // Use a React Fragment (<>) to group multiple elements.
          <>
            <Link to="/">Dashboard</Link>
            {/* The user is logged in, so we show a "Logout" button. */}
            <button onClick={handleLogout} className="btn-logout">
              Logout
            </button>
          </>
        ) : (
          // The user is not logged in, so we show Login and Register links.
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
