import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Top from './components/Top';
import Search from './components/Search';
import Subscriptions from './components/Subscriptions'; // New Component

function App() {
  return (
    <Router>
      <Top />
      <Routes>
        <Route path="/" element={<Search />} /> 
        <Route path="/subscriptions" element={<Subscriptions />} />
      </Routes>
    </Router>
  );
}

export default App;
