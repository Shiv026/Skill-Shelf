import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import { GiBookshelf } from 'react-icons/gi';
import AuthContext from '../context/AuthContext';
import { useContext } from 'react';
const Header = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const authButtonStyle = "px-5 py-2 rounded bg-primary text-white font-semibold hover:bg-accent transition"
  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-3 md:px-8 flex items-center justify-between shadow bg-secondary text-text">
        {/* Logo */}
        <div
          onClick={() => navigate('/')}
          className="cursor-pointer text-2xl font-bold flex items-center gap-2 text-primary font-display"
        >
          <GiBookshelf className="w-7 h-7" />
          <span>Skill Shelf</span>
        </div>

        {/* Centered Links */}
        <div className="hidden md:flex flex-1 justify-center gap-6 font-medium text-base lg:text-lg xl:text-xl items-center">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `transition-colors ${isActive
                ? 'font-semibold text-primary'
                : 'text-muted hover:text-accent hover:scale-105'
              }`
            }
          >
            Overview
          </NavLink>
          <NavLink
            to="/courses"
            className={({ isActive }) =>
              `transition-colors ${isActive
                ? 'font-semibold text-primary'
                : 'text-muted hover:text-accent hover:scale-105'
              }`
            }
          >
            Courses
          </NavLink>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `transition-colors ${isActive
                ? 'font-semibold text-primary'
                : 'text-muted hover:text-accent hover:scale-105'
              }`
            }
          >
            Dashboard
          </NavLink>
        </div>

        {/* Sign In Button */}
        <div className="hidden md:flex items-center">
          {user
            ? <button className={authButtonStyle} onClick={logout}>Sign Out</button>
            : <button className={authButtonStyle} onClick={() => navigate('/signin')}>Sign In</button>
          }
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-primary"
          onClick={() => setSidebarOpen((prev) => !prev)}
        >
          <FaBars size={24} />
        </button>
      </nav>

      {/* Translucent Overlay */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`md:hidden fixed top-0 left-0 z-60 h-full w-64 transform transition-transform duration-300 ease-linear shadow-lg bg-secondary text-text ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <span className="text-xl font-display font-bold text-primary ">
            Menu
          </span>
          <button onClick={() => setSidebarOpen(false)}>
            <FaTimes size={20} className="text-muted" />
          </button>
        </div>

        {/* Sidebar Links */}
        <div className="md:hidden flex flex-col px-6 py-4 gap-6">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `transition-colors ${isActive
                ? 'font-semibold text-primary'
                : 'text-muted hover:text-primary'
              }`
            }
            onClick={() => setSidebarOpen(false)}
          >
            Overview
          </NavLink>
          <NavLink
            to="/courses"
            className={({ isActive }) =>
              `transition-colors ${isActive
                ? 'font-semibold text-primary'
                : 'text-muted hover:text-primary'
              }`
            }
            onClick={() => setSidebarOpen(false)}
          >
            Courses
          </NavLink>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `transition-colors ${isActive
                ? 'font-semibold text-primary'
                : 'text-muted hover:text-primary'
              }`
            }
            onClick={() => setSidebarOpen(false)}
          >
            Dashboard
          </NavLink>
          {user ? (
            <button
              type="button"
              className={authButtonStyle}
              onClick={() => {
                setSidebarOpen(false);
                logout();
              }}
            >
              Sign Out
            </button>
          ) : (
            <button
              type="button"
              className={authButtonStyle}
              onClick={() => {
                setSidebarOpen(false);
                navigate('/signin');
              }}
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;
