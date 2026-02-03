/** Imported modules */
import { createBrowserRouter, Outlet, RouterProvider } from "react-router";
import Home from "./features/home/Home.tsx";
import Login from "./features/user/pages/Login.tsx";
import Signup from "./features/user/pages/Signup.tsx";
import Header from "./shared/components/Header.tsx";
import Sidebar from "./shared/components/Sidebar.tsx";
import APIs from "./features/apis/APIs.tsx";
import { Toaster } from "sonner";
import { AlertDialogProvider } from "./shared/overlays/AlertDialogProvider.tsx";
import { LoadingOverlayProvider } from "./shared/overlays/LoadingOverlayProvider.tsx";
import { useEffect } from "react";
import { useUserStore } from "./features/user/store/user-store.ts";
import { userAPI } from "./features/user/api/user-api.ts";

/** Browser router */
const router = createBrowserRouter([
    { path: "/", element: <Home /> },
    { path: "/login", element: <Login /> },
    { path: "/signup", element: <Signup /> },
    {
        element: (
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
        ),
        children: [
            { path: "/apis", element: <APIs /> }
            // { path: "/flow", element: <Flow /> }
        ]
    }
]);

/** App component */
const App = () => {
    /** Hooks */
    const { setUser } = useUserStore();

    /** Fetch the user status on app mount */
    useEffect(() => {
        userAPI
            .status()
            .then((user) => setUser(user))
            .catch(() => setUser(null));
    }, [setUser]);

    return (
        <AlertDialogProvider>
            <LoadingOverlayProvider>
                {/* Toaster for notifications */}
                <Toaster position="top-right" />

                {/* Router provider */}
                <RouterProvider router={router} />
            </LoadingOverlayProvider>
        </AlertDialogProvider>
    );
};

export default App;
