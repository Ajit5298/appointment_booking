import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [appointments, setAppointments] = useState([]);
  const [formData, setFormData] = useState({ name: '', date: '', time: '' });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/appointments');
      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.log('Error fetching appointments:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newAppointment = await response.json();
        setAppointments((prevAppointments) => [...prevAppointments, newAppointment]);
        setFormData({ name: '', date: '', time: '' });
      } else {
        console.log('Error creating appointment:', response.statusText);
      }
    } catch (error) {
      console.log('Error creating appointment:', error);
    }
  };

  const handleAccept = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/appointments/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'accepted' }),
      });

      if (response.ok) {
        const updatedAppointment = await response.json();
        setAppointments((prevAppointments) =>
          prevAppointments.map((appointment) =>
            appointment._id === id ? { ...appointment, status: updatedAppointment.status } : appointment
          )
        );
      } else {
        console.log('Error accepting appointment:', response.statusText);
      }
    } catch (error) {
      console.log('Error accepting appointment:', error);
    }
  };

  const handleReject = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/appointments/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'rejected' }),
      });

      if (response.ok) {
        const updatedAppointment = await response.json();
        setAppointments((prevAppointments) =>
          prevAppointments.filter((appointment) => appointment._id !== id)
        );
      } else {
        console.log('Error rejecting appointment:', response.statusText);
      }
    } catch (error) {
      console.log('Error rejecting appointment:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/appointments/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const updatedAppointments = appointments.filter((appointment) => appointment._id !== id);
        setAppointments(updatedAppointments);
      } else {
        console.log('Error deleting appointment:', response.statusText);
      }
    } catch (error) {
      console.log('Error deleting appointment:', error);
    }
  };

  return (
    <div className="App">
      <h1>Appointment Book App</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
        <input type="date" name="date" value={formData.date} onChange={handleChange} required />
        <input type="time" name="time" value={formData.time} onChange={handleChange} required />
        <button type="submit">Add Appointment</button>
      </form>
      <div className="appointments">
        <h2>Appointments</h2>
        {appointments.length === 0 ? <p>No appointments scheduled.</p> : null}
        <ul>
          {appointments.map((appointment) => (
            <li key={appointment._id}>
              <strong>{appointment.name}</strong>
              <p>Date: {appointment.date}</p>
              <p>Time: {appointment.time}</p>
              {appointment.status === 'pending' ? (
                <div>
                  <button id="accept" onClick={() => handleAccept(appointment._id)}>Accept</button>
                  <button id="reject" onClick={() => handleReject(appointment._id)}>Reject</button>
                </div>
              ) : (
                <p>Status: {appointment.status}</p>
              )}
              <button id="cut" onClick={() => handleDelete(appointment._id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
