import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { LayoutGrid, FolderKanban, CheckSquare, User, LogOut } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const navItemClass = ({ isActive }) =>
    `workspace-nav-item ${isActive ? 'active' : ''}`;

  return (
    <nav className={`workspace-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="workspace-brand">
        <div className="workspace-logo">TM</div>
        <span>Task Manager</span>
      </div>

      {user && (
        <>
          <button
            className="workspace-mobile-toggle"
            onClick={() => setIsOpen(!isOpen)}
          >
            Menu
          </button>

          <Link to="/profile" className="workspace-user">
            <div className="workspace-user-avatar">
              {user.name?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <p className="workspace-user-name">{user.name}</p>
              <p className="workspace-user-role">{user.role}</p>
            </div>
          </Link>

          <div className="workspace-nav-group">
            <p className="workspace-nav-title">Workspace</p>
            <NavLink to="/dashboard" className={navItemClass}>
              <LayoutGrid size={16} />
              Dashboard
            </NavLink>
            <NavLink to="/projects" className={navItemClass}>
              <FolderKanban size={16} />
              Projects
            </NavLink>
            <NavLink to="/tasks" className={navItemClass}>
              <CheckSquare size={16} />
              Tasks
            </NavLink>
            <NavLink to="/profile" className={navItemClass}>
              <User size={16} />
              Profile
            </NavLink>
          </div>

          <button onClick={handleLogout} className="workspace-logout">
            <LogOut size={16} />
            Logout
          </button>
        </>
      )}
    </nav>
  );
}
