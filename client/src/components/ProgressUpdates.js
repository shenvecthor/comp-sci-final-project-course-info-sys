import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Table, Container, Row, Col, Alert } from 'react-bootstrap';

function ProgressUpdates() {
  const [updates, setUpdates] = useState([]);
  const [courses, setCourses] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [newUpdate, setNewUpdate] = useState({
    course: '',
    lecturer: '',
    gradingStatus: '',
    gradingCompletionDate: '',
    marksheetStatus: '',
    marksheetCompletionDate: '',
    marksheetSubmitted: false,
    marksheetSubmissionDate: ''
  });
  const [editingUpdate, setEditingUpdate] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchUpdates();
    fetchCourses();
    fetchLecturers();
  }, []);

  const fetchUpdates = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/progress-updates');
      setUpdates(response.data);
    } catch (error) {
      setError('Error fetching progress updates: ' + error.message);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/courses/');
      setCourses(response.data);
    } catch (error) {
      setError('Error fetching courses: ' + error.message);
    }
  };

  const fetchLecturers = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/lecturers/');
      setLecturers(response.data);
    } catch (error) {
      setError('Error fetching lecturers: ' + error.message);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setNewUpdate({ ...newUpdate, [e.target.name]: value });
  };
// Old input handler
//   const handleEditInputChange = (e) => {
//     const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
//     setEditingUpdate({ ...editingUpdate, [e.target.name]: value });
//   };

const handleEditInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditingUpdate(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const addUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const response = await axios.post('http://localhost:5001/api/progress-updates', newUpdate);
      setUpdates([...updates, response.data]);
      setNewUpdate({
        course: '',
        lecturer: '',
        gradingStatus: '',
        gradingCompletionDate: '',
        marksheetStatus: '',
        marksheetCompletionDate: '',
        marksheetSubmitted: false,
        marksheetSubmissionDate: ''
      });
      setSuccess('Update added successfully!');
    } catch (error) {
      setError('Error adding progress update: ' + (error.response?.data?.message || error.message));
    }
  };

  const startEditing = async (updateId) => {
    try {
      const response = await axios.get(`http://localhost:5001/api/progress-updates/${updateId}`);
      setEditingUpdate(response.data);
    } catch (error) {
      setError('Error fetching update details: ' + error.message);
    }
  };

  const cancelEditing = () => {
    setEditingUpdate(null);
  };

  const updateProgressUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const response = await axios.patch(`http://localhost:5001/api/progress-updates/${editingUpdate._id}`, editingUpdate);
      setUpdates(prevUpdates => prevUpdates.map(update => 
        update._id === editingUpdate._id ? response.data : update
      ));
      setEditingUpdate(null);
      setSuccess('Update modified successfully!');
    } catch (error) {
      setError('Error updating progress update: ' + (error.response?.data?.message || error.message));
    }
  };

  const deleteUpdate = async (id) => {
    setError('');
    setSuccess('');
    try {
      await axios.delete(`http://localhost:5001/api/progress-updates/${id}`);
      setUpdates(updates.filter(update => update._id !== id));
      setSuccess('Update deleted successfully!');
    } catch (error) {
      setError('Error deleting progress update: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Progress Updates</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      
      <Form onSubmit={addUpdate} className="mb-4">
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Course</Form.Label>
              <Form.Select name="course" value={newUpdate.course} onChange={handleInputChange} required>
                <option value="">Select Course</option>
                {courses.map(course => (
                  <option key={course._id} value={course._id}>{course.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Lecturer</Form.Label>
              <Form.Select name="lecturer" value={newUpdate.lecturer} onChange={handleInputChange} required>
                <option value="">Select Lecturer</option>
                {lecturers.map(lecturer => (
                  <option key={lecturer._id} value={lecturer._id}>{lecturer.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Grading Status</Form.Label>
              <Form.Control type="text" name="gradingStatus" value={newUpdate.gradingStatus} onChange={handleInputChange} required />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Grading Completion Date</Form.Label>
              <Form.Control type="date" name="gradingCompletionDate" value={newUpdate.gradingCompletionDate} onChange={handleInputChange} />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Marksheet Status</Form.Label>
              <Form.Control type="text" name="marksheetStatus" value={newUpdate.marksheetStatus} onChange={handleInputChange} required />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Marksheet Completion Date</Form.Label>
              <Form.Control type="date" name="marksheetCompletionDate" value={newUpdate.marksheetCompletionDate} onChange={handleInputChange} />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Check 
                type="checkbox" 
                label="Marksheet Submitted" 
                name="marksheetSubmitted" 
                checked={newUpdate.marksheetSubmitted} 
                onChange={handleInputChange} 
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Marksheet Submission Date</Form.Label>
              <Form.Control type="date" name="marksheetSubmissionDate" value={newUpdate.marksheetSubmissionDate} onChange={handleInputChange} />
            </Form.Group>
          </Col>
        </Row>
        <Button variant="primary" type="submit">Add Update</Button>
      </Form>

      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th>Course</th>
            <th>Lecturer</th>
            <th>Grading Status</th>
            <th>Grading Completion Date</th>
            <th>Marksheet Status</th>
            <th>Marksheet Completion Date</th>
            <th>Marksheet Submitted</th>
            <th>Marksheet Submission Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {updates.map(update => (
            <tr key={update._id}>
              <td>{update.course ? update.course.name : 'N/A'}</td>
              <td>{update.lecturer ? update.lecturer.name : 'N/A'}</td>
              <td>{update.gradingStatus}</td>
              <td>{update.gradingCompletionDate ? new Date(update.gradingCompletionDate).toLocaleDateString() : 'N/A'}</td>
              <td>{update.marksheetStatus}</td>
              <td>{update.marksheetCompletionDate ? new Date(update.marksheetCompletionDate).toLocaleDateString() : 'N/A'}</td>
              <td>{update.marksheetSubmitted ? 'Yes' : 'No'}</td>
              <td>{update.marksheetSubmissionDate ? new Date(update.marksheetSubmissionDate).toLocaleDateString() : 'N/A'}</td>
              <td>
            <div className="d-grid gap-2">
            <Button className="btn-block" variant="warning" size="sm" onClick={() => startEditing(update._id)}>
  Edit
</Button>

                <Button className="btn-block" variant="danger" size="sm" onClick={() => deleteUpdate(update._id)}>
                    Delete
                </Button>
            </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {editingUpdate && (
        <Form onSubmit={updateProgressUpdate} className="mt-4">
        <h3>Edit Progress Update</h3>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Course</Form.Label>
              <Form.Select 
                name="course" 
                value={editingUpdate.course?._id || ''} 
                onChange={handleEditInputChange}
                required
              >
                <option value="">Select Course</option>
                {courses.map(course => (
                  <option key={course._id} value={course._id}>{course.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Lecturer</Form.Label>
              <Form.Select 
                name="lecturer" 
                value={editingUpdate.lecturer?._id || ''} 
                onChange={handleEditInputChange}
                required
              >
                <option value="">Select Lecturer</option>
                {lecturers.map(lecturer => (
                  <option key={lecturer._id} value={lecturer._id}>{lecturer.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Grading Status</Form.Label>
              <Form.Control 
                type="text" 
                name="gradingStatus" 
                value={editingUpdate.gradingStatus || ''} 
                onChange={handleEditInputChange}
                required 
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Grading Completion Date</Form.Label>
              <Form.Control 
                type="date" 
                name="gradingCompletionDate" 
                value={editingUpdate.gradingCompletionDate ? new Date(editingUpdate.gradingCompletionDate).toISOString().split('T')[0] : ''} 
                onChange={handleEditInputChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Marksheet Status</Form.Label>
              <Form.Control 
                type="text" 
                name="marksheetStatus" 
                value={editingUpdate.marksheetStatus || ''} 
                onChange={handleEditInputChange}
                required 
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Marksheet Completion Date</Form.Label>
              <Form.Control 
                type="date" 
                name="marksheetCompletionDate" 
                value={editingUpdate.marksheetCompletionDate ? new Date(editingUpdate.marksheetCompletionDate).toISOString().split('T')[0] : ''} 
                onChange={handleEditInputChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Check 
                type="checkbox" 
                label="Marksheet Submitted" 
                name="marksheetSubmitted" 
                checked={editingUpdate.marksheetSubmitted || false} 
                onChange={handleEditInputChange} 
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Marksheet Submission Date</Form.Label>
              <Form.Control 
                type="date" 
                name="marksheetSubmissionDate" 
                value={editingUpdate.marksheetSubmissionDate ? new Date(editingUpdate.marksheetSubmissionDate).toISOString().split('T')[0] : ''} 
                onChange={handleEditInputChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <Button variant="success" type="submit">Update</Button>{' '}
        <Button variant="secondary" onClick={cancelEditing}>Cancel</Button>
      </Form>
      )}
    </Container>
  );
}

export default ProgressUpdates;