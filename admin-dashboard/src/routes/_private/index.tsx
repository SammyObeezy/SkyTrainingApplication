import { createFileRoute, Link } from '@tanstack/react-router';
import { UsersIcon, SubjectsIcon, TasksIcon } from '../../components/Icons/Icons';
import './dashboard.css';

export const Route = createFileRoute('/_private/')({
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Dashboard</h1>
      <p className="dashboard-subtitle">Overview of your application data.</p>
      
      <div className="dashboard-grid">
        <Link 
          to="/users" 
          // Provide a search object that matches the route's expectation
          search={{ page: 1, filters: {}, sorters: {} }} 
          className="dashboard-card"
        >
          <div className="card-icon"><UsersIcon width={28} height={28} /></div>
          <h2 className="card-title">Manage Users</h2>
          <p className="card-description">View, edit, and manage user accounts and permissions.</p>
        </Link>
        
        <Link 
          to="/subjects" 
          // Add an empty search prop for consistency, assuming we'll add it there later
          search={{ page: 1, filters: {}, sorters: {} }}
          className="dashboard-card"
        >
          <div className="card-icon"><SubjectsIcon width={28} height={28} /></div>
          <h2 className="card-title">Manage Subjects</h2>
          <p className="card-description">Create, update, and organize training subjects.</p>
        </Link>

        <Link 
          to="/tasks" 
          // Add an empty search prop for consistency
          search={{ page: 1, filters: {}, sorters: {} }}
          className="dashboard-card"
        >
          <div className="card-icon"><TasksIcon width={28} height={28} /></div>
          <h2 className="card-title">Manage Tasks</h2>
          <p className="card-description">Assign and manage tasks within each subject.</p>
        </Link>
      </div>
    </div>
  );
}