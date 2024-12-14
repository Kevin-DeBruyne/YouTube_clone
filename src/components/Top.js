import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import '../Navbar.css';

function Top() {
  return (
    
    <nav>
        <Link to="/">Home</Link>
        <Link to="/subscriptions">Subscriptions</Link>
      </nav>
  );
}

export default Top;
