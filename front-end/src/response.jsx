import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./context/AuthContext";
import { 
  FaHeading, FaUser, FaEnvelope, FaHome, FaPhone, FaCalendarAlt, FaTextHeight,
  FaAlignLeft, FaList, FaDotCircle, FaCheckSquare, FaHashtag, FaImage, FaFileUpload,
  FaClock, FaPaperPlane, FaTimes 
} from "react-icons/fa";

export default function Response() {
  const [forms, setForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);
  const [activeTab, setActiveTab] = useState("edit");
  const [responses, setResponses] = useState([]);
  const { auth } = useContext(AuthContext);
  const REACT_APP_API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

  const [formTitle, setFormTitle] = useState("");
  const [formFields, setFormFields] = useState([]);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const res = await axios.get(
          `${REACT_APP_API_BASE_URL}/api/form/myforms`,
          {
            headers: { Authorization: `Bearer ${auth.token}` },
          }
        );
        setForms(res.data);
      } catch (err) {
        console.error("Error fetching forms", err);
      }
    };
    fetchForms();
  }, [auth.token, REACT_APP_API_BASE_URL]);

  useEffect(() => {
    if (selectedForm) {
      setFormTitle(selectedForm.title || "");
      setFormFields(
        (selectedForm.fields || []).map((field, index) => ({
          ...field,
          id: field.id || Date.now() + index
        }))
      );
    }
  }, [selectedForm]);

  useEffect(() => {
    const fetchResponses = async () => {
      if (selectedForm && activeTab === "view") {
        try {
          const res = await axios.get(
            `${REACT_APP_API_BASE_URL}/api/form/${selectedForm._id}/responses`,
            {
              headers: { Authorization: `Bearer ${auth.token}` },
            }
          );
          setResponses(res.data);
        } catch (err) {
          console.error("Error fetching responses", err);
        }
      }
    };
    fetchResponses();
  }, [activeTab, selectedForm, auth.token, REACT_APP_API_BASE_URL]);

  const addField = (type) => {
    setFormFields([
      ...formFields,
      { type, id: Date.now(), label: type, options: ["Option 1", "Option 2"] },
    ]);
  };

  const updateLabel = (id, newLabel) => {
    setFormFields(
      formFields.map((field) => (field.id === id ? { ...field, label: newLabel } : field))
    );
  };

  const updateOption = (fieldId, optionIndex, newOption) => {
    setFormFields(
      formFields.map((field) => {
        if (field.id === fieldId) {
          const newOptions = [...field.options];
          newOptions[optionIndex] = newOption;
          return { ...field, options: newOptions };
        }
        return field;
      })
    );
  };

  const addOption = (fieldId) => {
    setFormFields(
      formFields.map((field) => {
        if (field.id === fieldId) {
          return { ...field, options: [...field.options, `Option ${field.options.length + 1}`] };
        }
        return field;
      })
    );
  };

  const deleteField = (id) => {
    setFormFields(formFields.filter((field) => field.id !== id));
  };

  const handleUpdateForm = async () => {
    const preparedFields = formFields.map(field => ({
      label: field.label,
      name: field.label.replace(/\s+/g, "").toLowerCase(),
      type: field.type,
      options: field.options
    }));
    const updatedData = { title: formTitle, fields: preparedFields };
    try {
      const res = await axios.put(
        `${REACT_APP_API_BASE_URL}/api/form/${selectedForm._id}`, 
        updatedData,
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
      setSelectedForm(res.data);
      alert("Form updated successfully!");
    } catch (err) {
      console.error("Error updating form", err);
      alert("Error updating form");
    }
  };

  if (!selectedForm) {
    return (
      <div className="min-h-screen bg-[#FFF8F8] p-8">
        <h2 className="text-3xl font-bold text-center mb-8">My Forms</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {forms.map((form) => (
            <div
              key={form._id}
              onClick={() => {
                setSelectedForm(form);
                setActiveTab("edit");
                setResponses([]);
              }}
              className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
            >
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                {form.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8F8] p-8">
      <button
  onClick={() => setSelectedForm(null)}
  className="mb-4 px-4 py-2 bg-[#FE6059] rounded hover:bg-red-600 text-white font-medium transition-colors"
>
  &larr; Back to My Forms
</button>
      <div className="bg-white shadow rounded-lg p-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">
          {selectedForm.title}
        </h2>
        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
        <button
  onClick={() => setActiveTab("edit")}
  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
    activeTab === "edit"
      ? "bg-[#FE6059] text-white"
      : "bg-gray-200 text-gray-800"
  }`}
>
  Edit Form
</button>
<button
  onClick={() => setActiveTab("view")}
  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
    activeTab === "view"
      ? "bg-[#FE6059] text-white"
      : "bg-gray-200 text-gray-800"
  }`}
>
  View Responses
</button>
        </div>
        {/* Tab Content */}
        {activeTab === "edit" && (
          <div className="flex">
            {/* Components Column */}
            <div className="w-1/4 p-4 bg-white shadow-md mr-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Components</h2>
              {[
                { type: "Heading", icon: <FaHeading /> },
                { type: "Fullname", icon: <FaUser /> },
                { type: "Email", icon: <FaEnvelope /> },
                { type: "Address", icon: <FaHome /> },
                { type: "Phone", icon: <FaPhone /> },
                { type: "Date picker", icon: <FaCalendarAlt /> },
                { type: "Short text", icon: <FaTextHeight /> },
                { type: "Long text", icon: <FaAlignLeft /> },
                { type: "Drop down", icon: <FaList /> },
                { type: "Single choice", icon: <FaDotCircle /> },
                { type: "Multiple choice", icon: <FaCheckSquare /> },
                { type: "Number", icon: <FaHashtag /> },
                { type: "Image", icon: <FaImage /> },
                { type: "File upload", icon: <FaFileUpload /> },
                { type: "Time", icon: <FaClock /> },
                { type: "Submit", icon: <FaPaperPlane /> },
              ].map((field) => (
                <button
                  key={field.type}
                  onClick={() => addField(field.type)}
                  className="w-full mb-2 px-4 py-2 bg-[#FE6059] text-white font-medium rounded-md hover:bg-red-600 flex items-center"
                >
                  {field.icon} <span className="ml-2">{field.type}</span>
                </button>
              ))}
            </div>
            <div className="w-3/4 p-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Form Preview</h2>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Form Title"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              {formFields.map((field) => (
                <div key={field.id} className="mb-4 relative">
                  <button
                    type="button"
                    onClick={() => deleteField(field.id)}
                    className="absolute top-0 right-0 mt-2 mr-2 text-red-500 hover:text-red-700"
                  >
                    <FaTimes />
                  </button>
                  <input
                    type="text"
                    value={field.label}
                    onChange={(e) => updateLabel(field.id, e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md mb-2 font-bold text-lg"
                  />
                  {field.type === "Fullname" && (
                    <input
                      type="text"
                      placeholder="Full Name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                  )}
                  {field.type === "Email" && (
                    <input
                      type="email"
                      placeholder="Email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                  )}
                  {field.type === "Address" && (
                    <input
                      type="text"
                      placeholder="Address"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                  )}
                  {field.type === "Phone" && (
                    <input
                      type="tel"
                      placeholder="Phone"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                  )}
                  {field.type === "Date picker" && (
                    <input
                      type="date"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                  )}
                  {field.type === "Short text" && (
                    <input
                      type="text"
                      placeholder="Short Text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                  )}
                  {field.type === "Long text" && (
                    <textarea
                      placeholder="Long Text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                  )}
                  {field.type === "Drop down" && (
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-md">
                      {field.options.map((option, index) => (
                        <option key={index}>{option}</option>
                      ))}
                    </select>
                  )}
                  {field.type === "Single choice" && (
                    <div>
                      {field.options.map((option, index) => (
                        <div key={index} className="flex items-center mb-1">
                          <input type="radio" name={`single-${field.id}`} className="mr-2" />
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => updateOption(field.id, index, e.target.value)}
                            className="border border-gray-300 rounded-md px-2 py-1"
                          />
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addOption(field.id)}
                        className="mt-2 px-4 py-2 bg-[#FE6059] text-white font-medium rounded-md hover:bg-red-600"
                      >
                        Add Option
                      </button>
                    </div>
                  )}
                  {field.type === "Multiple choice" && (
                    <div>
                      {field.options.map((option, index) => (
                        <div key={index} className="flex items-center mb-1">
                          <input type="checkbox" className="mr-2" />
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => updateOption(field.id, index, e.target.value)}
                            className="border border-gray-300 rounded-md px-2 py-1"
                          />
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addOption(field.id)}
                        className="mt-2 px-4 py-2 bg-[#FE6059] text-white font-medium rounded-md hover:bg-red-600"
                      >
                        Add Option
                      </button>
                    </div>
                  )}
                  {field.type === "Number" && (
                    <input
                      type="number"
                      placeholder="Number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                  )}
                  {field.type === "Image" && (
                    <input
                      type="file"
                      accept="image/*"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                  )}
                  {field.type === "File upload" && (
                    <input
                      type="file"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                  )}
                  {field.type === "Time" && (
                    <input
                      type="time"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                  )}
                </div>
              ))}
              <div>
                <button
                  onClick={handleUpdateForm}
                  className="w-full px-4 py-2 bg-[#FE6059] rounded hover:bg-red-600 text-white "
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
        {activeTab === "view" && (
          <div>
            {responses.length === 0 ? (
              <p className="text-gray-600">No responses yet for this form.</p>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {responses.map((response) => (
                  <div
                    key={response._id}
                    className="border p-4 bg-white rounded shadow"
                  >
                    <h4 className="font-bold mb-2 text-gray-800">
                      Response ID: {response._id}
                    </h4>
                    {response.responses && typeof response.responses === "object" ? (
                      <div className="space-y-1">
                        {Object.entries(response.responses).map(([field, value]) => (
                          <div key={field} className="flex">
                            <span className="font-semibold mr-2 text-gray-700">
                              {field}:
                            </span>
                            <span className="text-gray-600">{value}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600">No data provided</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}