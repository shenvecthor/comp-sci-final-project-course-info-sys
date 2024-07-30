import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Table, Container, Row, Col, Alert } from 'react-bootstrap';

function CourseList() {
  const [courses, setCourses] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [newCourse, setNewCourse] = useState({ name: '', code: '', lecturer: '', semester: '' });
  const [editingCourse, setEditingCourse] = useState(null);
  const [error, setError] = useState('');

  const addCourse = async (e) => {
    e.preventDefault();
    try {
      const courseData = {
        name: newCourse.name,
        code: newCourse.code,
        lecturer: newCourse.lecturer, 
        semester: newCourse.semester, 
      };
      await axios.post('http://localhost:5001/api/courses', courseData);
      setNewCourse({ name: '', code: '', lecturer: '', semester: '' });
      fetchCourses();
    } catch (error) {
      setError('Error adding course');
      console.error('Error adding course:', error);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchLecturers();
    fetchSemesters();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/courses');
      setCourses(response.data);
    } catch (error) {
      setError('Error fetching courses');
      console.error('Error fetching courses:', error);
    }
  };

  const fetchLecturers = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/lecturers');
      setLecturers(response.data);
    } catch (error) {
      setError('Error fetching lecturers');
      console.error('Error fetching lecturers:', error);
    }
  };

  const fetchSemesters = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/semesters');
      setSemesters(response.data);
    } catch (error) {
      setError('Error fetching semesters');
      console.error('Error fetching semesters:', error);
    }
  };

  const handleInputChange = (e) => {
    setNewCourse({ ...newCourse, [e.target.name]: e.target.value });
  };

  const handleEditInputChange = (e) => {
    setEditingCourse({ ...editingCourse, [e.target.name]: e.target.value });
  };

  const startEditing = (course) => {
    setEditingCourse({
      ...course,
      lecturer: course.lecturer._id,
      semester: course.semester._id
    });
  };

  const cancelEditing = () => {
    setEditingCourse(null);
  };

  const updateCourse = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`http://localhost:5001/api/courses/${editingCourse._id}`, editingCourse);
      setEditingCourse(null);
      fetchCourses();
    } catch (error) {
      setError('Error updating course');
      console.error('Error updating course:', error);
    }
  };

  const deleteCourse = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/courses/${id}`);
      fetchCourses();
    } catch (error) {
      setError('Error deleting course');
      console.error('Error deleting course:', error);
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Course List</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={addCourse} className="mb-4">
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                name="name"
                value={newCourse.name}
                onChange={handleInputChange}
                placeholder="Course Name"
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                name="code"
                value={newCourse.code}
                onChange={handleInputChange}
                placeholder="Course Code"
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Select
                name="lecturer"
                value={newCourse.lecturer}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Lecturer</option>
                {lecturers.map(lecturer => (
                  <option key={lecturer._id} value={lecturer._id}>
                    {lecturer.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Select
                name="semester"
                value={newCourse.semester}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Semester</option>
                {semesters.map(semester => (
                  <option key={semester._id} value={semester._id}>
                    {semester.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        <Button variant="primary" type="submit">Add Course</Button>
      </Form>

      <Table striped bordered hover>
      <thead className="table-dark">
          <tr>
            <th>Name</th>
            <th>Code</th>
            <th>Lecturer</th>
            <th>Semester</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map(course => (
            <tr key={course._id}>
              <td>{course.name}</td>
              <td>{course.code}</td>
              <td>{course.lecturer ? course.lecturer.name : 'N/A'}</td>
              <td>{course.semester ? course.semester.name : 'N/A'}</td>
              <td>
                <Button variant="warning" size="sm" onClick={() => startEditing(course)}>Edit</Button>{' '}
                <Button variant="danger" size="sm" onClick={() => deleteCourse(course._id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {editingCourse && (
        <Form onSubmit={updateCourse} className="mt-4">
          <h3>Edit Course</h3>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  name="name"
                  value={editingCourse.name}
                  onChange={handleEditInputChange}
                  placeholder="Course Name"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  name="code"
                  value={editingCourse.code}
                  onChange={handleEditInputChange}
                  placeholder="Course Code"
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Select
                  name="lecturer"
                  value={editingCourse.lecturer}
                  onChange={handleEditInputChange}
                  required
                >
                  <option value="">Select Lecturer</option>
                  {lecturers.map(lecturer => (
                    <option key={lecturer._id} value={lecturer._id}>
                      {lecturer.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Select
                  name="semester"
                  value={editingCourse.semester}
                  onChange={handleEditInputChange}
                  required
                >
                  <option value="">Select Semester</option>
                  {semesters.map(semester => (
                    <option key={semester._id} value={semester._id}>
                      {semester.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Button variant="success" type="submit">Update Course</Button>{' '}
          <Button variant="secondary" onClick={cancelEditing}>Cancel</Button>
        </Form>
      )}
    </Container>
  );
}

export default CourseList;