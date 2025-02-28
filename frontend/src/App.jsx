import React, { useState } from "react";
import JobSeekerChat from "../components/Jobseekerchat";
import RecruiterChat from "../components/Recruiterchat";

const App = () => {
  const [userType, setUserType] = useState(null);
  const [userId, setUserId] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div>
      <h1>Chat Application</h1>

      {!userType ? (
        <div>
          <h3>Select User Type</h3>
          <button onClick={() => setUserType("jobseeker")}>Job Seeker</button>
          <button onClick={() => setUserType("recruiter")}>Recruiter</button>
        </div>
      ) : !isLoggedIn ? (
        <div>
          <h3>Enter User ID</h3>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Enter a unique ID (e.g., user123)"
          />
          <button onClick={() => setIsLoggedIn(true)} disabled={!userId.trim()}>
            Login
          </button>
        </div>
      ) : (
        <>
          <p>Logged in as: <strong>{userId}</strong> ({userType})</p>
          {userType === "jobseeker" ? (
            <JobSeekerChat userId={userId} />
          ) : (
            <RecruiterChat userId={userId} />
          )}
        </>
      )}
    </div>
  );
};

export default App;
