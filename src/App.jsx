import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Home from './pages/Home';
import UploadPage from './pages/UploadPage';
import CustomizePage from './pages/CustomizePage';
import ResultsPage from './pages/ResultsPage';

function App() {
    return (
        <Router>
            <AppLayout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/upload" element={<UploadPage />} />
                    <Route path="/customize" element={<CustomizePage />} />
                    <Route path="/results" element={<ResultsPage />} />
                </Routes>
            </AppLayout>
        </Router>
    );
}

export default App;
