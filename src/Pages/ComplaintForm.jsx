// src/Pages/ComplaintForm.jsx
import { useState } from 'react';
import API_BASE from '../api/config';
import '../css/ComplaintForm.css';
import emailjs from "@emailjs/browser";
import Visual from '../assets/Visual.png';


export default function ComplaintForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    studentId: '',
    email: '',
    phone: '',
    department: '',
    complaintType: [],
    otherDetails: '',
    description: '',
  });

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState(false); // for dropdown toggle

  const complaintOptions = [
    "Complaint / Number change",
    "Email change / activation",
    "Programme change not showing (SIP)",
    "Courses not showing / missing in SIP",
    "Can't login to SIP portal",
    "Reset password (SIP)",
    "Reset password (Student Email)",
    "Fees / Payment issues",
    "Results not showing",
    "Lecturer / Academic issue",
    "Hostel / Accommodation",
    "Other"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setFormData(prev => ({ ...prev, complaintType: [...prev.complaintType, value] }));
    } else {
      setFormData(prev => ({ ...prev, complaintType: prev.complaintType.filter(item => item !== value) }));
    }
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.fullName.trim())
      { newErrors.fullName = 'Full Name is required'; 

      }
      if (!formData.studentId.trim())
      { newErrors.studentId = 'Student ID is required';

      }
      if (!formData.email.trim())
      {newErrors.email = 'Email is required';}
      else if (!/\S+@\S+\.\S+$/.test(formData.email))
      { newErrors.email = 'Email is invalid'; 

      }
      if (formData.complaintType. length=== 0)
      { newErrors.complaintType = 'Please select at least one complaint type';

      }
      if (formData.complaintType.includes("Other") && 
          !formData.otherDetails.trim())
        { newErrors.otherDetails = 'Please provide details for "Other" complaint type';

        }
      if (!formData.description.trim())
      { newErrors.description = 'Description is required';}
      else if (formData.description.trim().length < 10)
      { newErrors.description = 'Description should be at least 10 characters long';
      
      
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;

  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setError('Please correct the errors in the form.');
      return;
    }

    try {
      // Send complaint to backend API
      const response = await fetch(`${API_BASE}/api/complaints`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          category: formData.complaintType[0] || 'Other',
          subject: formData.complaintType.join(', '),
          description: formData.description,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit complaint');
      }

      const data = await response.json();
      console.log('Complaint submitted:', data);

      // Send email via EmailJS
      emailjs.send(
        "Complaint Sys",        // Service ID
        "template_tz1yigv",     // Template ID
        {
          name: formData.fullName,
          email: formData.email,
          complaint_type: formData.complaintType.join(", "),
          complaint_desc: formData.description,
          other_details: formData.otherDetails || "N/A"
        },
        "OwXsUH2O0sPaCuzNC"     // Public Key
      )
      .then(() => {
        console.log("Email sent successfully!");
        setSuccess('Thank you! Your complaint has been received. A confirmation email has been sent.');
      })
      .catch((err) => {
        console.error("Email sending error:", err);
        setSuccess('Complaint saved, but email could not be sent.');
      });

      // Reset form
      setFormData({
        fullName: '',
        studentId: '',
        email: '',
        phone: '',
        department: '',
        complaintType: [],
        otherDetails: '',
        description: '',
      });
      setDropdownOpen(false);
    } catch (error) {
      console.error('Error submitting complaint:', error);
      setError('Failed to submit complaint. Please try again.');
    }
  };

  return (
    <div className="complaint-page">
      <div className="form-container">
        <div className="form-header">
          <img 
src={Visual} 
alt="GCTU Logo" 
className="form-logo" // (Using the class I provided in the CSS)
/>
          <h1>GCTU Student Complaint Form</h1>
          <p>Please fill out the form below. Fields marked with * are required.</p>
        </div>

        <div className="form-body">
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit}>

            <h2 className="section-title">Your Information</h2>
            <div className="form-grid">
              <div>
                <label>Full Name *</label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} />
                {errors.fullName && <small className='error'>{errors.fullName}</small>}
              </div>

              <div>
                <label>Student ID / Index Number *</label>
                <input type="text" name="studentId" value={formData.studentId} onChange={handleChange}  />
                {errors.studentId && <small className='error'>{errors.studentId}</small>}
              </div>

              <div>
                <label>Email *</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} />
                {errors.email && <small className='error'>{errors.email}</small>}
              </div>

              <div>
                <label>Phone / WhatsApp</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} />
              </div>

              <div className="full-width">
                <label>Programme (optional)</label>
                <input type="text" name="department" value={formData.department} onChange={handleChange} />
              </div>
            </div>

            <h2 className="section-title">What is your complaint? *</h2>
            <div className="dropdown">
              <button type="button" className="dropdown-toggle" onClick={() => setDropdownOpen(prev => !prev)}>
                {formData.complaintType.length > 0
                  ? formData.complaintType.join(", ")
                  : "Select your complaint(s)"} 
              </button>
              {dropdownOpen && (
                <div className="dropdown-menu">
                  {complaintOptions.map((item, index) => (
                    <label key={index} className="dropdown-item">
                      <input
                        type="checkbox"
                        value={item}
                        checked={formData.complaintType.includes(item)}
                        onChange={handleCheckboxChange}
                      />
                      {item}
                    </label>
                  ))}
                </div>
              )}
              {errors.complaintType && <small className='error'>{errors.complaintType}</small>}
            </div>

            

            {formData.complaintType.includes("Other") && (
              <div>
              <textarea
                name="otherDetails"
                placeholder="Please describe your issue..."
                value={formData.otherDetails}
                onChange={handleChange}
                className="other-textarea"
               
              />
                 {errors.otherDetails && (
                  <small className="error">{errors.otherDetails}</small>
                 )}
              </div>
               )}

              
           
            <h2 className="section-title">Describe the Problem *</h2>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Explain exactly what’s happening..."
              className="description-box"
            />
            {errors.description && 
            (<small className='error'>{errors.description}</small>)}

            <button type="submit" className="submit-btn">
              Submit Complaint
            </button>

            <p className="footer-text">
              Most issues resolved within 24–48 hours • You will receive email updates
            </p>

          </form>
        </div>
      </div>
    </div>
  );
}
