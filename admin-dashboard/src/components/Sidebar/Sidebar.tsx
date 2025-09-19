import { Link } from '@tanstack/react-router';
import { useAuth } from '../../context/ApiProvider';
// Import the new DashboardIcon
import { DashboardIcon, UsersIcon, SubjectsIcon, TasksIcon, LogoutIcon } from '../Icons/Icons';
import './Sidebar.css';

export const Sidebar = () => {
  const { logout } = useAuth();

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {/* Add the new Dashboard link here */}
        <Link to="/" className="nav-link" activeProps={{ className: 'active' }}>
          <DashboardIcon /> Dashboard
        </Link>
        <Link 
          to="/users" 
          className="nav-link" 
          activeProps={{ className: 'active' }}
          search={{ page: 1, filters: {}, sorters: {} }}
        >
          <UsersIcon /> Users
        </Link>
        <Link 
          to="/subjects" 
          className="nav-link" 
          activeProps={{ className: 'active' }}
          search={{ page: 1, filters: {}, sorters: {} }}
        >
          <SubjectsIcon /> Subjects
        </Link>
        <Link 
          to="/tasks" 
          className="nav-link" 
          activeProps={{ className: 'active' }}
          search={{ page: 1, filters: {}, sorters: {} }}
        >
          <TasksIcon /> Tasks
        </Link>
      </nav>
      <div className="sidebar-footer">
        <button onClick={logout} className="nav-link logout-button">
          <LogoutIcon /> Logout
        </button>
      </div>
    </aside>
  );
};