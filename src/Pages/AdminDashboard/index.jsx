
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import API_BASE from '../../api/config';
import "./AdminDashboard.css";
import Visual from '../../assets/Visual.png';

export default function AdminDashboard() {
    const [complaints, setComplaints] = useState([]);
    const [filter, setFilter] = useState("all");
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false); // State for mobile sidebar

    const navigate = useNavigate();

    /* ===============================
     AUTH + LOAD DATA
    =============================== */
    useEffect(() => {
        const load = async () => {
            const loggedIn = localStorage.getItem("adminLoggedIn");
            if (!loggedIn) {
                navigate("/admin-login");
                return;
            }

            try {
                const token = localStorage.getItem('adminToken');
                const res = await fetch(`${API_BASE} /api/complaints`, {
                    headers: token ? { Authorization: `Bearer ${token} ` } : {},
                });

                if (!res.ok) {
                    console.error('Failed to fetch complaints', await res.text());
                    setComplaints([]);
                    return;
                }

                const data = await res.json();
                // Map backend complaint shape to UI-friendly shape
                const mapped = data.map((c) => ({
                    id: c._id,
                    name: c.name || c.fullName || 'N/A',
                    studentId: c.studentId || c.phone || 'N/A',
                    complaint: c.description || c.complaint || c.subject || '',
                    type: c.category ? [c.category] : (c.type || []),
                    timestamp: c.createdAt || c.created_at || Date.now(),
                    status: (c.status || 'pending').toLowerCase(),
                }));

                setComplaints(mapped);
            } catch (err) {
                console.error('Error loading complaints', err);
                setComplaints([]);
            }
        };

        load();
    }, [navigate]);

    /* ===============================
       ACTIONS
    =============================== */
    const handleStatusChange = (id, status) => {
        const updated = complaints.map((c) =>
            c.id === id ? { ...c, status } : c
        );
        setComplaints(updated);
        localStorage.setItem("complaints", JSON.stringify(updated));
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!"
        });

        if (!result.isConfirmed) return;

        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${API_BASE} /api/complaints / ${id} `, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token} ` },
            });

            if (!res.ok) throw new Error("Failed to delete");

            setComplaints(complaints.filter((c) => c.id !== id));

            Swal.fire({
                title: "Deleted!",
                text: "The complaint has been deleted.",
                icon: "success"
            });
        } catch (err) {
            console.error("Error deleting complaint:", err);
            Swal.fire({
                title: "Error!",
                text: "Failed to delete complaint.",
                icon: "error"
            });
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("adminLoggedIn");
        navigate("/admin-login");
    };

    /* ===============================
       FILTERING
    =============================== */
    const filteredComplaints =
        filter === "all"
            ? complaints
            : complaints.filter((c) => c.status === filter);

    /* ===============================
       UI
    =============================== */
    return (
        <div className="admin-layout">

            {/* ===============================
          MOBILE NAVBAR
      =============================== */}
            <header className="mobile-navbar">
                <button
                    className="menu-btn"
                    onClick={() => setSidebarOpen(true)}
                >
                    ☰
                </button>
                <span className="mobile-title">GCTU Admin</span>
            </header>

            {/* ===============================
          SIDEBAR (MODIFIED)
      =============================== */}
            <aside className={`sidebar ${sidebarOpen ? "open" : ""} `}>
                <div className="sidebar-header">
                    <img
                        src={Visual}
                        alt="GCTU Logo"
                        className="sidebar-logo-img"
                    />
                    <h2 className="sidebar-logo-text">GCTU Admin</h2>
                    {/* NEW CLOSE BUTTON (Only visible on mobile when sidebar is open) */}
                    <button
                        className="close-sidebar-btn"
                        onClick={() => setSidebarOpen(false)}
                    >
                        ×
                    </button>
                </div>

                <nav className="sidebar-menu">
                    <button
                        className={filter === "all" ? "active" : ""}
                        onClick={() => {
                            setFilter("all");
                            setSidebarOpen(false); // Close on selection
                        }}
                    >
                        Dashboard
                    </button>

                    <button
                        className={filter === "pending" ? "active" : ""}
                        onClick={() => {
                            setFilter("pending");
                            setSidebarOpen(false); // Close on selection
                        }}
                    >
                        Pending Complaints
                    </button>

                    <button
                        className={filter === "resolved" ? "active" : ""}
                        onClick={() => {
                            setFilter("resolved");
                            setSidebarOpen(false); // Close on selection
                        }}
                    >
                        Resolved Complaints
                    </button>
                </nav>

                <button className="sidebar-logout" onClick={handleLogout}>
                    Logout
                </button>
            </aside>

            {/* The rest of the main content and modal remains the same... */}

            <main className="dashboard-main">
                <header className="dashboard-header">
                    <h1>Admin Dashboard</h1>
                    <p>Manage and review student complaints</p>
                </header>
                {/* ... (STATISTICS SECTION) ... */}
                <section className="stats-grid">
                    <div className="stat-card total">
                        <h3>Total</h3>
                        <span>{complaints.length}</span>
                    </div>

                    <div className="stat-card pending">
                        <h3>Pending</h3>
                        <span>{complaints.filter(c => c.status === "pending").length}</span>
                    </div>

                    <div className="stat-card resolved">
                        <h3>Resolved</h3>
                        <span>{complaints.filter(c => c.status === "resolved").length}</span>
                    </div>
                </section>
                {/* ... (TABLE SECTION) ... */}
                <section className="complaints-table-container">
                    <table className="complaints-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Student ID</th>
                                <th>Issue</th>
                                <th>Type</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredComplaints.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="empty-table">
                                        No complaints found
                                    </td>
                                </tr>
                            ) : (
                                filteredComplaints.map((c) => (
                                    <tr key={c.id}>
                                        <td>{c.name}</td>
                                        <td>{c.studentId}</td>
                                        <td>{c.complaint.slice(0, 35)}...</td>
                                        <td>{c.type.join(", ")}</td>
                                        <td>{new Date(c.timestamp).toLocaleDateString()}</td>

                                        <td>
                                            <select
                                                value={c.status}
                                                onChange={(e) =>
                                                    handleStatusChange(c.id, e.target.value)
                                                }
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="resolved">Resolved</option>
                                            </select>
                                        </td>

                                        <td className="action-buttons">
                                            <button
                                                className="view-btn"
                                                onClick={() => setSelectedComplaint(c)}
                                            >
                                                View
                                            </button>

                                            <button
                                                className="delete-btn"
                                                onClick={() => handleDelete(c.id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </section>
            </main>

            {/* ... (MODAL SECTION) ... */}
            {selectedComplaint && (
                <div
                    className="modal-overlay"
                    onClick={() => setSelectedComplaint(null)}
                >
                    <div
                        className="complaint-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-header">
                            <h2>Complaint Details</h2>
                            <button
                                className="close-x"
                                onClick={() => setSelectedComplaint(null)}
                            >
                                ×
                            </button>
                        </div>

                        <div className="modal-content">
                            <p><strong>Complaint ID:</strong> {selectedComplaint.id}</p>
                            <p><strong>Name:</strong> {selectedComplaint.name}</p>
                            <p><strong>Student ID:</strong> {selectedComplaint.studentId}</p>
                            <p><strong>Email:</strong> {selectedComplaint.email || "N/A"}</p>

                            <p>
                                <strong>Issue Type:</strong>
                                {selectedComplaint.type.map((t, i) => (
                                    <span key={i} className="badge">{t}</span>
                                ))}
                            </p>

                            <p><strong>Status:</strong> {selectedComplaint.status}</p>
                            <p><strong>Date:</strong> {new Date(selectedComplaint.timestamp).toLocaleString()}</p>

                            <div className="complaint-text">
                                <strong>Message:</strong>
                                <p>{selectedComplaint.complaint}</p>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button
                                className="close-modal"
                                onClick={() => setSelectedComplaint(null)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}