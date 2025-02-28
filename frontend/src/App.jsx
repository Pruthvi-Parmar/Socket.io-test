import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import JobSeekerChat from "../components/Jobseekerchat";
import RecruiterChat from "../components/Recruiterchat";

const App = () => {
    return (
        <Router>
            <div>
                <nav>
                    <ul>
                        <li><Link to="/jobseeker-chat">JobSeeker Chat</Link></li>
                        <li><Link to="/recruiter-chat">Recruiter Chat</Link></li>
                    </ul>
                </nav>

                <Routes>
                    <Route path="/jobseeker-chat" element={<JobSeekerChat />} />
                    <Route path="/recruiter-chat" element={<RecruiterChat />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
