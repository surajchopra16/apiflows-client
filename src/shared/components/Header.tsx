import { Home, ChevronRight, RefreshCw, Settings, Bell } from "lucide-react";

/** Header component */
const Header = () => {
    return (
        <nav className="flex h-10 w-full items-center">
            <div className="flex flex-1 items-center justify-between px-2 py-1 sm:px-3">
                {/* Left Side: Breadcrumbs */}
                <div className="flex items-center text-[12px] text-slate-600">
                    <a
                        href="#"
                        className="flex items-center transition-colors hover:text-slate-900">
                        <Home className="mr-1 h-3 w-3 flex-shrink-0" />
                        <span className="hidden text-[12px] sm:inline">Home</span>
                    </a>
                    <ChevronRight className="mx-1 h-3 w-3 text-slate-400" />
                    <span className="truncate text-[12px] font-semibold text-slate-800">
                        Sample Project
                    </span>
                </div>

                {/* Right Side: Actions and User Profile */}
                <div className="flex items-center space-x-1 sm:space-x-2">
                    <button className="rounded-full p-0.5 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-800 focus:bg-slate-200 focus:outline-none">
                        <RefreshCw className="h-3 w-3" />
                    </button>

                    <button className="rounded-full p-0.5 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-800 focus:bg-slate-200 focus:outline-none">
                        <Settings className="h-3 w-3" />
                    </button>

                    <button className="rounded-full p-0.5 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-800 focus:bg-slate-200 focus:outline-none">
                        <Bell className="h-3 w-3" />
                    </button>

                    <div className="pl-1">
                        <button className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 focus:outline-none">
                            S
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Header;
