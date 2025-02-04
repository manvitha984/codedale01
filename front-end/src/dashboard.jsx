import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import create from "./assets/11554177.jpg";
import { AuthContext } from "./context/AuthContext";

const REACT_APP_API_BASE_URL = "http://localhost:5001";

export default function Dashboard() {
  const { auth,logout } = useContext(AuthContext);
  const [userProfile, setUserProfile] = useState(null);
  const [forms, setForms] = useState([]);
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

    const fetchForms = async () => {
      try {
        const res = await axios.get(
          `${REACT_APP_API_BASE_URL}/api/form/myforms`,
          {
            headers: { Authorization: `Bearer ${auth.token}` },
          }
        );
        console.log(res.data);
        setForms(res.data);
      } catch (err) {
        console.error("Error fetching forms", err);
      }
    };

    if (auth && auth.token) {
      fetchUserProfile();
      fetchForms();
    }
  }, [auth]);

  const handleLogout = () => {
    logout(); // Clear auth context and localStorage
    navigate('/login'); // Redirect to login page
  };

  return (
    <div className="min-h-screen bg-[#FFF8F8] flex flex-col items-center p-8">
      <div className="w-full max-w-4xl text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Welcome back, {userProfile && userProfile.username ? userProfile.username : "Loading..."}!
        </h1>
        <button
          onClick={() => navigate('/FormBuilder')}
          className="px-4 py-2 bg-[#FE6059] text-white font-medium rounded-md hover:bg-red-600"
        >
          + Create Form
        </button>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-[#FE6059] text-white font-medium rounded-md hover:bg-red-600 ml-4"
        >
          Logout
        </button>
        <img
          src={create}
          alt="Dashboard Illustration"
          className="mt-6 w-full max-w-md mx-auto rounded-lg shadow-md"
        />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Recent Forms</h1>
      <div className="w-full max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forms.map((form) => (
            <div
              key={form._id}
              className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                {form.title}
              </h3>
              <p className="text-gray-600 mb-4">{form.description}</p>
              {form._id && (
                <a
                  href={`${window.location.origin}/form/${form._id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline break-all"
                >
                  Link to the form
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}