import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Card, Row, Col, ListGroup, Badge } from 'react-bootstrap';

function Dashboard() {
  const [coursesCount, setCoursesCount] = useState(0);
  const [lecturersCount, setLecturersCount] = useState(0);
  const [recentUpdates, setRecentUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [coursesRes, lecturersRes, updatesRes] = await Promise.all([
          axios.get('http://localhost:5001/api/courses/'),
          axios.get('http://localhost:5001/api/lecturers/'),
          axios.get('http://localhost:5001/api/progress-updates/')
        ]);

        setCoursesCount(coursesRes.data.count);
        setLecturersCount(lecturersRes.data.count);
        setRecentUpdates(updatesRes.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch dashboard data');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div className="text-center mt-5"><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></div>;
  if (error) return <div className="alert alert-danger" role="alert">{error}</div>;

  return (
    <div className="dashboard">
      <h1 className="mb-4">Dashboard</h1>
      <Row className="mb-4">
        <Col md={6}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Courses</Card.Title>
              <Card.Text className="display-4">{coursesCount}</Card.Text>
              <Link to="/courses" className="btn btn-primary">View All Courses</Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Lecturers</Card.Title>
              <Card.Text className="display-4">{lecturersCount}</Card.Text>
              <Link to="/lecturers" className="btn btn-primary">View All Lecturers</Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Card>
        <Card.Body>
          <Card.Title>Recent Progress Updates</Card.Title>
          <ListGroup variant="flush">
            {recentUpdates.map(update => (
              <ListGroup.Item key={update._id} className="d-flex justify-content-between align-items-start">
                <div className="ms-2 me-auto">
                  <div className="fw-bold">{update.course.name}</div>
                  {update.gradingStatus}
                  <div><small className="text-muted">Updated on: {new Date(update.date).toLocaleDateString()}</small></div>
                </div>
                <Badge bg="primary" pill>
                  {update.marksheetSubmitted ? 'Submitted' : 'Pending'}
                </Badge>
              </ListGroup.Item>
            ))}
          </ListGroup>
          <Link to="/progress" className="btn btn-primary mt-3">View All Updates</Link>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Dashboard;