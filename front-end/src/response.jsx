import { useState } from "react";
import FormBuilder from "./FormBuilder";

export default function response() {
  const [activeTab, setActiveTab] = useState("edit");

  return (
    <div className="min-h-screen bg-[#FFF8F8] p-8">
      <div className="flex mb-4">
        <button
          onClick={() => setActiveTab("edit")}
          className={`px-4 py-2 ${activeTab === "edit" ? "bg-[#FE6059] text-white" : "bg-gray-200 text-gray-700"} font-medium rounded-md mr-2`}
        >
          Edit Form
        </button>
        <button
          onClick={() => setActiveTab("responses")}
          className={`px-4 py-2 ${activeTab === "responses" ? "bg-[#FE6059] text-white" : "bg-gray-200 text-gray-700"} font-medium rounded-md`}
        >
          View Responses
        </button>
      </div>
      {activeTab === "edit" ? (
        <FormBuilder />
      ) : (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Responses</h2>
          {/* Add your responses fetching and displaying logic here */}
          <p>No responses yet.</p>
        </div>
      )}
    </div>
  );
}