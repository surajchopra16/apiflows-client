import { Outlet, Route, Routes } from "react-router";
import Home from "./features/home/Home.tsx";
import Login from "./features/login/Login.tsx";
import Signup from "./features/signup/Signup.tsx";
import Header from "./shared/components/Header.tsx";
import Sidebar from "./shared/components/Sidebar.tsx";
import APIs from "./features/apis/APIs.tsx";
import Docs from "./features/docs/Docs.tsx";
import Flow from "./features/flow/Flow.tsx";

/** App component */
const App = () => {
    return (
        <Routes>
            {/* Home route */}
            <Route path="/" element={<Home />} />

            {/* Auth routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* App routes */}
            <Route
                element={
                    <div className="flex h-screen w-full overflow-hidden bg-[#F5F5F5]">
                        {/* Sidebar */}
                        <Sidebar />

                        {/* Content */}
                        <div className="flex h-full min-w-0 flex-1 flex-col">
                            <Header />

                            <div className="mr-2 mb-2 min-h-0 flex-1">
                                <Outlet />
                            </div>
                        </div>
                    </div>
                }>
                {/* APIs route */}
                <Route path="/apis" element={<APIs />} />

                {/* Flow route */}
                <Route path="/flow" element={<Flow />} />

                {/* Docs route */}
                <Route path="/docs" element={<Docs />} />
            </Route>
        </Routes>
    );
};

export default App;
