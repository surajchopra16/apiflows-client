import Tester from "./components/Tester.tsx";
import { useState } from "react";
import { Clock, FileText, Settings, Server } from "lucide-react";
import Flow from "./components/Flow.tsx";

function App() {
    const [active, setActive] = useState("APIs");

    const menuItems = [
        { name: "APIs", icon: <Server size={20} /> },
        { name: "Tests", icon: <FileText size={20} /> },
        { name: "History", icon: <Clock size={20} /> },
        { name: "Settings", icon: <Settings size={20} /> }
    ];

    return (
        <div className="flex min-h-screen items-stretch bg-[#F7F7F7] py-2 pr-2">
            {/* Sidebar */}
            <div>
                <div className="flex w-20 flex-col items-center space-y-8 py-6">
                    {menuItems.map((item) => (
                        <button
                            key={item.name}
                            onClick={() => setActive(item.name)}
                            className={`flex flex-col items-center gap-1 text-xs transition-colors ${
                                active === item.name ? "text-blue-500" : "text-gray-500"
                            }`}>
                            <div
                                className={`rounded-lg p-2 ${
                                    active === item.name ? "bg-blue-100 text-blue-500" : ""
                                }`}>
                                {item.icon}
                            </div>
                            <span>{item.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Main content */}
            <div className="flex flex-1 overflow-hidden rounded-xl border border-[#EBEBEB] bg-white">
                {/*Sidebar*/}
                <div className="w-64 border-r border-[#EBEBEB]"></div>

                <div className="flex-1">
                    <div className="h-10 w-full"></div>
                    <div className="h-full border-t border-[#EBEBEB]">
                        <Flow />
                    </div>
                    {/*<Tester />*/}
                </div>
            </div>
        </div>
    );
}

export default App;
