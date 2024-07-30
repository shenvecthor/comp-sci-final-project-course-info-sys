import React from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import Dashboard from './components/Dashboard';
import CourseList from './components/CourseList';
import LecturerList from './components/LecturerList';
import ProgressUpdates from './components/ProgressUpdates';

function App() {
  return (
    <Router>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={NavLink} to="/">COMPSCI - Course Information System</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={NavLink} to="/">Dashboard</Nav.Link>
              <Nav.Link as={NavLink} to="/courses">Courses</Nav.Link>
              <Nav.Link as={NavLink} to="/lecturers">Lecturers</Nav.Link>
              <Nav.Link as={NavLink} to="/progress">Progress Updates</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-4">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/courses" element={<CourseList />} />
          <Route path="/lecturers" element={<LecturerList />} />
          <Route path="/progress" element={<ProgressUpdates />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;