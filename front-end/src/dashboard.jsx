import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "./context/AuthContext";

const REACT_APP_API_BASE_URL = "http://localhost:5001";

export default function Dashboard() {
  const { auth } = useContext(AuthContext);
  const [userProfile, setUserProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await axios.get(
          `${REACT_APP_API_BASE_URL}/api/auth/profile`,
          {
            headers: { Authorization: `Bearer ${auth.token}` },
          }
        );
        console.log("Fetched user profile:", res.data);
        setUserProfile(res.data);
      } catch (error) {
        console.error("Failed to fetch user profile", error);
      }
    };

    if (auth && auth.token) {
      fetchUserProfile();
    }
  }, [auth]);

  return (
    <div className="min-h-screen bg-[#FFF8F8] flex flex-col items-center p-8">
      <div className="w-full max-w-4xl text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Hi - {userProfile && userProfile.username ? userProfile.username : "Loading..."}
        </h1>
        <button
          onClick={() => navigate('/FormBuilder')}
          className="px-4 py-2 bg-[#FE6059] text-white font-medium rounded-md hover:bg-red-600"
        >
          + Create Form
        </button>
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Forms</h1>
      <div className="w-full max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Render additional dashboard content such as forms here */}
        </div>
      </div>
    </div>
  );
}