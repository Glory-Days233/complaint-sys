// src/Pages/ComplaintForm.jsx
import { useState } from 'react';
import '../css/ComplaintForm.css';

export default function ComplaintForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    studentId: '',
    email: '',
    phone: '',
    department: '',
    complaintType: '',
    otherDetails: '',
    description: '',
  });

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    
    e.preventDefault();
    if (!formData.fullName || !formData.studentId || !formData.email || !formData.complaintType || !formData.description) {
      setError('Please fill all required fields');
      return;
    }

    console.log('Complaint submitted:', formData);
    setSuccess('Thank you! Your complaint has been received. We’ll contact you soon.');
    setError('');

    // Reset form to blank
  setFormData({
    fullName: '',
    studentId: '',
    email: '',
    phone: '',
    department: '',
    complaintType: '',
    otherDetails: '',
    description: '',
  });

  setError('')
    // Optional: reset form
    // setFormData({ fullName:'', studentId:'', email:'', phone:'', department:'', complaintType:'', otherDetails:'', description:'' });
  };

  return (
    <div className="complaint-page">
      <div className="form-container">
        <div className="form-header">
          
          <h1>GCTU Student Complaint Form</h1>
          <p>Please fill out the form below to submit your complaint. Fields marked with * are required.</p>
        </div>

        <div className="form-body">
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit}>

            {/* Student Info */}
            <h2 className="section-title">Your Information</h2>
            <div className="form-grid">
              <div>
                <label>Full Name *</label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
              </div>
              <div>
                <label>Student ID / Index Number *</label>
                <input type="text" name="studentId" value={formData.studentId} onChange={handleChange} required />
              </div>
              <div>
                <label>Email Address *</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required />
              </div>
              <div>
                <label>Phone / WhatsApp</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="024xxxxxxx" />
              </div>
              <div className="full-width">
                <label>Programme (optional)</label>
                <input type="text" name="department" value={formData.department} onChange={handleChange}
                  placeholder="e.g., BSc. IT, Telecom Engineering" />
              </div>
            </div>

            {/* Complaint Type */}
            <h2 className="section-title">What is your complaint? *</h2>
            <div className="form-grid">
              <div className="full-width">
                <select name="complaintType" value={formData.complaintType} onChange={handleChange} required>
                  <option value="">-- Select your issue --</option>
                  <option>Complaint / Number change</option>
                  <option>Email change / activation</option>
                  <option>Programme change not showing (SIP)</option>
                  <option>Courses not showing / missing in SIP</option>
                  <option>Can't login to SIP portal</option>
                  <option>Reset password (SIP)</option>
                  <option>Reset password (Student Email)</option>
                  <option>Fees / Payment issues</option>
                  <option>Results not showing</option>
                  <option>Lecturer / Academic issue</option>
                  <option>Hostel / Accommodation</option>
                  <option>Other</option>
                </select>

                {formData.complaintType === 'Other' && (
                  <textarea
                    name="otherDetails"
                    placeholder="Please describe your issue..."
                    value={formData.otherDetails}
                    onChange={handleChange}
                    style={{ marginTop: '15px', minHeight: '100px' }}
                    required
                  />
                )}
              </div>
            </div>

            {/* Description */}
            <h2 className="section-title">Describe the Problem *</h2>
            <div className="form-grid">
              <div className="full-width">
                <textarea
                  name="description"
                  placeholder="Explain exactly what’s happening. The more details, the faster we can help!"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  style={{ minHeight: '200px' }}
                />
              </div>
            </div>

            <button type="submit" className="submit-btn">
              Submit Complaint
            </button>

            <p className="footer-text">
              Most issues fixed within 24–48 hours • You’ll get a email update • Contact the SSU if urgent
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}