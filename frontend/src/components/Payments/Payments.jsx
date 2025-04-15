import React, { useState } from "react";
import ViewPayments from "./ViewPayments";
import CreatePayment from "./CreatePayment";
import VisualizePayments from "./VisualizePayments";

const Payments = ({ setIsLoggedIn, setUserRole }) => {
    const [view, setView] = useState("view"); // "view", "create", or "visualize"

    return (
        <div className="p-6 max-w-[1400px] mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-gray-800 border-b-2 border-gray-200 pb-4">
                Payments Management
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
                    View Payments
                </button>
                <button
                    onClick={() => setView("create")}
                    className={`flex-1 p-3 rounded-lg font-medium transition-all duration-200 ${
                        view === "create"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                >
                    Create Payment
                </button>
                <button
                    onClick={() => setView("visualize")}
                    className={`flex-1 p-3 rounded-lg font-medium transition-all duration-200 ${
                        view === "visualize"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                >
                    Visualize Payments
                </button>
            </div>

            {/* Render View, Create, or Visualize */}
            {view === "view" ? (
                <ViewPayments setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole} />
            ) : view === "create" ? (
                <CreatePayment setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole} setView={setView} />
            ) : (
                <VisualizePayments setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole} />
            )}
        </div>
    );
};

export default Payments;