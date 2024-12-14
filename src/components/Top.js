import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';

function Top() {
  return (
    <Navbar sticky="top" bg="dark" variant="dark">
      <Container>
         <Nav className="me-auto">
          <Nav.Link as={Link} to="/">Home</Nav.Link>
          <Nav.Link as={Link} to="/subscriptions">Subscriptions</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default Top;
