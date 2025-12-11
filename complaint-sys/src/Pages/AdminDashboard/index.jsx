// src/Pages/AdminDashboard/index.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';   // ← your beautiful CSS

export default function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('adminLoggedIn')) {
      navigate('/admin-login');
      return;
    }

    const stored = JSON.parse(localStorage.getItem('complaints') || '[]');
    setComplaints(stored);
  }, [navigate]);

  const handleStatusChange = (id, newStatus) => {
    const updated = complaints.map(c =>
      c.id === id ? { ...c, status: newStatus } : c
    );
    setComplaints(updated);
    localStorage.setItem('complaints', JSON.stringify(updated));
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this complaint permanently?')) return;
    const updated = complaints.filter(c => c.id !== id);
    setComplaints(updated);
    localStorage.setItem('complaints', JSON.stringify(updated));
  };

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    navigate('/admin-login');
  };

  const filtered = filter === 'all'
    ? complaints
    : complaints.filter(c => c.status === filter);

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Admin Dashboard</h1>
          <p>Welcome back! Manage student complaints below.</p>
        </div>
        <button onClick={handleLogout} className="logout-button">
          <span>Logout</span>
        </button>
      </header>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card total">
          <h3>Total</h3>
          <span className="stat-number">{complaints.length}</span>
        </div>
        <div className="stat-card pending">
          <h3>Pending</h3>
          <span className="stat-number">{complaints.filter(c => c.status === 'pending').length}</span>
        </div>
        <div className="stat-card resolved">
          <h3>Resolved</h3>
          <span className="stat-number">{complaints.filter(c => c.status === 'resolved').length}</span>
        </div>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <button
          className={filter === 'all' ? 'filter-active' : ''}
          onClick={() => setFilter('all')}
        >
          All Complaints
        </button>
        <button
          className={filter === 'pending' ? 'filter-active' : ''}
          onClick={() => setFilter('pending')}
        >
          Pending
        </button>
        <button
          className={filter === 'resolved' ? 'filter-active' : ''}
          onClick={() => setFilter('resolved')}
        >
          Resolved
        </button>
      </div>

      {/* Complaints List */}
      <div className="complaints-grid">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"></div>
            <h3>No complaints found</h3>
            <p>Everything is peaceful for now.</p>
          </div>
        ) : (
          filtered.map(complaint => (
            <div key={complaint.id} className="complaint-card">
              <div className="card-header">
                <h3>{complaint.name || 'Anonymous'}</h3>
                <span className={`status-badge ${complaint.status}`}>
                  {complaint.status === 'pending' ? 'Pending' : 'Resolved'}
                </span>
              </div>

              <div className="card-body">
                <p><strong>Student ID:</strong> {complaint.index || complaint.studentId}</p>
                <p><strong>Department:</strong> {complaint.department || 'Not specified'}</p>
                <p><strong>Issue:</strong> {complaint.complaint}</p>
                <p className="timestamp">
                  {new Date(complaint.timestamp).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>

              <div className="card-actions">
                <select
                  value={complaint.status}
                  onChange={(e) => handleStatusChange(complaint.id, e.target.value)}
                  className="status-dropdown"
                >
                  <option value="pending">Mark as Pending</option>
                  <option value="resolved">Mark as Resolved</option>
                </select>
                <button
                  onClick={() => handleDelete(complaint.id)}
                  className="delete-button"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}