import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Top from './components/Top';
import Search from './components/Search';
import YouTubeSubscriptions from './components/YouTubeSubscriptions'; // New Component

function App() {
  return (
    <Router>
      <Top />
      <Routes>
        <Route path="/" element={<Search />} /> 
        <Route path="/subscriptions" element={<YouTubeSubscriptions />} />
      </Routes>
    </Router>
  );
}

export default App;
