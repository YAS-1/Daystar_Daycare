import React, { useState } from "react";
import ViewIncidents from "./ViewIncidents";
import CreateIncident from "./CreateIncident";

const Incidents = ({ setIsLoggedIn, setUserRole }) => {
    const [view, setView] = useState("view"); // "view" or "create"

    return (
        <div className="p-6 max-w-[1400px] mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-gray-800 border-b-2 border-gray-200 pb-4">
                Incidents Management
            </h2>

            {/* Toggle Bar */}
            <div className="flex space-x-4 mb-6">
                <button
                    onClick={() => setView("view")}
                    className={`flex-1 p-3 rounded-lg font-medium transition-all duration-200 ${
                        view === "view"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                >
                    View Incidents
                </button>
                <button
                    onClick={() => setView("create")}
                    className={`flex-1 p-3 rounded-lg font-medium transition-all duration-200 ${
                        view === "create"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                >
                    Create Incident
                </button>
            </div>

            {/* Render View or Create */}
            {view === "view" ? (
                <ViewIncidents setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole} />
            ) : (
                <CreateIncident setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole} setView={setView} />
            )}
        </div>
    );
};

export default Incidents;