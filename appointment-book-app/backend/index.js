const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors());
app.use(express.json());

// Connect to MongoDB (Replace 'YOUR_MONGODB_CONNECTION_STRING_HERE' with your actual MongoDB connection string)
const mongoURI = "mongodb://localhost:27017/appointment";
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create a MongoDB Schema and Model for appointments
const appointmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  status: { type: String, default: 'pending' }, // Add 'status' field with default 'pending'
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

// API Endpoints
app.get('/api/appointments', async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching appointments' });
  }
});

app.post('/api/appointments', async (req, res) => {
  try {
    const { name, date, time } = req.body;
    const newAppointment = new Appointment({ name, date, time });
    await newAppointment.save();
    res.json(newAppointment);
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ error: 'Error creating appointment' });
  }
});

app.patch('/api/appointments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value. Must be "accepted" or "rejected".' });
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(id, { status }, { new: true });
    res.json(updatedAppointment);
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ error: 'Error updating appointment' });
  }
});

app.delete('/api/appointments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Appointment.findByIdAndRemove(id);
    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({ error: 'Error deleting appointment' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${7000}`);
});
