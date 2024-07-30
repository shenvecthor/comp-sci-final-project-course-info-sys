import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function LecturerList() {
  const [lecturers, setLecturers] = useState([]);
  const [newLecturer, setNewLecturer] = useState({ name: '', email: '', department: '' });
  const [editingLecturer, setEditingLecturer] = useState(null);

  useEffect(() => {
    fetchLecturers();
  }, []);

  const fetchLecturers = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/lecturers');
      setLecturers(response.data);
    } catch (error) {
      console.error('Error fetching lecturers:', error);
    }
  };

  const handleInputChange = (e) => {
    setNewLecturer({ ...newLecturer, [e.target.name]: e.target.value });
  };

  const handleEditInputChange = (e) => {
    setEditingLecturer({ ...editingLecturer, [e.target.name]: e.target.value });
  };

  const addLecturer = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5001/api/lecturers', newLecturer);
      setNewLecturer({ name: '', email: '', department: '' });
      fetchLecturers();
    } catch (error) {
      console.error('Error adding lecturer:', error);
    }
  };

  const startEditing = (lecturer) => {
    setEditingLecturer(lecturer);
  };

  const cancelEditing = () => {
    setEditingLecturer(null);
  };

  const updateLecturer = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`http://localhost:5001/api/lecturers/${editingLecturer._id}`, editingLecturer);
      setEditingLecturer(null);
      fetchLecturers();
    } catch (error) {
      console.error('Error updating lecturer:', error);
    }
  };

  const deleteLecturer = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/lecturers/${id}`);
      fetchLecturers();
    } catch (error) {
      console.error('Error deleting lecturer:', error);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Lecturers</h2>
      <form onSubmit={addLecturer} className="mb-4">
        <div className="row g-3">
          <div className="col-md-4">
            <input name="name" value={newLecturer.name} onChange={handleInputChange} placeholder="Name" required className="form-control" />
          </div>
          <div className="col-md-4">
            <input name="email" value={newLecturer.email} onChange={handleInputChange} placeholder="Email" required className="form-control" />
          </div>
          <div className="col-md-3">
            <input name="department" value={newLecturer.department} onChange={handleInputChange} placeholder="Department" required className="form-control" />
          </div>
          <div className="col-md-1">
            <button type="submit" className="btn btn-primary w-100">Add</button>
          </div>
        </div>
      </form>
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {lecturers.map(lecturer => (
              <tr key={lecturer._id}>
                {editingLecturer && editingLecturer._id === lecturer._id ? (
                  <>
                    <td><input name="name" value={editingLecturer.name} onChange={handleEditInputChange} className="form-control" /></td>
                    <td><input name="email" value={editingLecturer.email} onChange={handleEditInputChange} className="form-control" /></td>
                    <td><input name="department" value={editingLecturer.department} onChange={handleEditInputChange} className="form-control" /></td>
                    <td>
                      <button onClick={updateLecturer} className="btn btn-success btn-sm me-2">Save</button>
                      <button onClick={cancelEditing} className="btn btn-secondary btn-sm">Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{lecturer.name}</td>
                    <td>{lecturer.email}</td>
                    <td>{lecturer.department}</td>
                    <td>
                      <button onClick={() => startEditing(lecturer)} className="btn btn-warning btn-sm me-2">Edit</button>
                      <button onClick={() => deleteLecturer(lecturer._id)} className="btn btn-danger btn-sm">Delete</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LecturerList;