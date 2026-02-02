/** Imported modules */
import {
    Activity,
    AlertTriangle,
    ArrowRight,
    BarChart3,
    CheckCircle2,
    ChevronRight,
    Code2,
    FolderTree,
    Menu,
    Terminal,
    Users,
    X,
    Zap
} from "lucide-react";
import { Link } from "react-router";
import { useState } from "react";
import appWireframe from "../../../assets/images/app-wireframe.png";

/** Home component */
const Home = () => {
    /** States */
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative min-h-screen overflow-hidden bg-white font-sans selection:bg-purple-100 selection:text-purple-900">
            {/* Floating top navbar */}
            <nav className="fixed top-4 right-0 left-0 z-50 mx-auto w-full max-w-6xl px-4">
                {/* Card */}
                <div className="relative flex items-center justify-between rounded-full bg-white/80 px-2 py-2 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-gray-950/5 backdrop-blur-xl">
                    {/* Left section */}
                    <div className="flex items-center gap-6 pl-4">
                        {/* Logo */}
                        <Link
                            to="/"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-2 pr-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/20">
                                <Zap size={18} fill="currentColor" />
                            </div>

                            <span className="text-[17px] font-bold tracking-tight text-gray-900">
                                APIFlows
                            </span>
                        </Link>

                        {/* See all features */}
                        <div className="hidden items-center gap-1 md:flex">
                            <a
                                href="#features-grid"
                                className="group flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100/80 hover:text-gray-900">
                                See all features
                                <ChevronRight
                                    size={15}
                                    className="text-gray-400 transition-transform group-hover:translate-x-0.5"
                                />
                            </a>
                        </div>
                    </div>

                    {/* Right section */}
                    <div className="flex items-center gap-2">
                        {/* Login */}
                        <Link
                            to="/login"
                            className="hidden rounded-full px-5 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 md:block">
                            Log in
                        </Link>

                        {/* Get started */}
                        <Link
                            to="/signup"
                            className="hidden items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-blue-500/10 transition-all hover:bg-blue-700 sm:flex">
                            Get Started
                        </Link>

                        {/* Mobile dropdown toggle (Mobile) */}
                        <button
                            aria-label="Toggle dropdown"
                            aria-expanded={isOpen}
                            onClick={() => setIsOpen(!isOpen)}
                            className="ml-1 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200 hover:text-gray-900 focus:ring-2 focus:ring-blue-500/20 focus:outline-none md:hidden">
                            {isOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>

                {/* Mobile dropdown */}
                <div
                    className={`absolute top-full right-4 left-4 mt-2 origin-top transform transition-all duration-300 ease-in-out md:hidden ${isOpen ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none -translate-y-4 scale-95 opacity-0"} `}>
                    <div className="rounded-2xl bg-white p-2 shadow-xl ring-1 ring-gray-950/5 backdrop-blur-xl">
                        <div className="flex flex-col space-y-1 p-2">
                            {/* See all features */}
                            <a
                                href="#features-grid"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900">
                                See all features
                                <ChevronRight size={16} className="text-gray-400" />
                            </a>

                            <div className="my-2 border-t border-gray-100/50" />

                            {/* Login */}
                            <Link
                                to="/login"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900">
                                Log in
                            </Link>

                            {/* Get started */}
                            <Link
                                to="/signup"
                                onClick={() => setIsOpen(false)}
                                className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-blue-700">
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center pt-30">
                {/* Hero Section */}
                <div className="relative overflow-hidden pb-12 sm:pb-14">
                    <div className="mx-auto flex max-w-5xl flex-col items-center px-5 text-center">
                        {/* Badge */}
                        <div className="group relative mb-6 inline-flex items-center space-x-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 transition-all hover:border-blue-300 hover:bg-blue-50/30">
                            <span className="rounded-md bg-blue-600 px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-white uppercase shadow-sm">
                                New
                            </span>

                            <span className="text-sm font-medium text-gray-600 transition-colors group-hover:text-blue-600">
                                AI-Powered HTTP API Client
                            </span>
                        </div>

                        {/* Heading */}
                        <h1 className="mb-6 text-4xl font-bold tracking-tight text-balance text-gray-950 sm:text-6xl md:text-7xl lg:leading-[1.1]">
                            Test, Optimize, and Perfect <br className="hidden md:block" />
                            <span className="text-blue-600">APIs with AI</span>
                        </h1>

                        {/* Sub-heading */}
                        <p className="mb-8 max-w-4xl text-base leading-relaxed text-gray-600 sm:mb-10 sm:text-xl">
                            An intelligent API client that analyzes your requests, score quality,
                            and get AI insights to build bulletproof APIs faster
                        </p>

                        {/* Buttons */}
                        <div className="flex w-full flex-col justify-center gap-4 sm:flex-row">
                            <Link
                                to="/signup"
                                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700 sm:px-8 sm:py-4 sm:text-base">
                                Get Started Free
                                <svg
                                    width="20"
                                    height="20"
                                    className="transition-transform group-hover:translate-x-0.5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    strokeWidth="2.5">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                                    />
                                </svg>
                            </Link>

                            <button
                                onClick={() => {}}
                                className="group inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3.5 text-sm font-semibold text-gray-900 transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:bg-gray-50 hover:text-blue-600 sm:px-8 sm:py-4 sm:text-base">
                                <svg
                                    width="20"
                                    height="20"
                                    className="text-gray-500 transition-colors group-hover:text-blue-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    strokeWidth="2">
                                    <polygon points="5 3 19 12 5 21 5 3" />
                                </svg>
                                Try Demo
                            </button>
                        </div>
                    </div>
                </div>

                {/* App wireframe */}
                <div className="relative z-10 w-full px-4 sm:px-6 lg:px-0">
                    {/* Half background overlay */}
                    <div className="absolute bottom-0 left-1/2 h-1/2 w-full -translate-x-1/2 bg-[#FAFAFA]"></div>

                    {/* Image container */}
                    <div className="mx-auto w-full max-w-5xl rounded-xl bg-white/30 p-1.5 shadow-2xl ring-1 shadow-zinc-300/40 ring-gray-900/5 backdrop-blur-md sm:rounded-[1.75rem] sm:p-2.5">
                        <img
                            src={appWireframe}
                            alt="App Wireframe"
                            loading="lazy"
                            className="w-full rounded-lg border border-zinc-100 sm:rounded-[1.25rem]"
                        />
                    </div>
                </div>

                {/* Bento Grid */}
                <div
                    id="features-grid"
                    className="relative w-full bg-[#FAFAFA] px-4 py-12 md:py-24">
                    {/* Heading */}
                    <div className="mb-12 text-center">
                        <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                            Build APIs that <span className="text-blue-600">don't break</span>
                        </h2>

                        <p className="text-base font-normal text-gray-500 sm:text-lg">
                            Analyze, score, and perfect your REST design in real-time
                        </p>
                    </div>

                    {/* Grid */}
                    <div className="mx-auto w-full max-w-5xl">
                        <div className="grid auto-rows-[minmax(180px,auto)] grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:grid-rows-3">
                            {/* Tile 1 - Hero (Main Value Prop) */}
                            <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200 transition-all hover:shadow-lg md:col-span-2 md:row-span-2 lg:col-span-2 lg:row-span-2">
                                <div className="pointer-events-none absolute top-0 right-0 -mt-20 -mr-20 h-[300px] w-[300px] rounded-full bg-blue-50 opacity-50 blur-3xl transition-opacity group-hover:opacity-100"></div>

                                <div className="relative z-10 flex h-full flex-col justify-between">
                                    <div>
                                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/50 px-3 py-1 text-xs font-semibold text-blue-600 backdrop-blur-sm">
                                            <Zap size={14} className="fill-current" />
                                            <span>Real-time Analysis</span>
                                        </div>
                                        <h3 className="mb-3 text-3xl font-bold tracking-tight text-gray-900">
                                            Design Better APIs,
                                            <br /> Automatically
                                        </h3>
                                        <p className="max-w-md text-base leading-relaxed text-gray-500">
                                            Stop pushing bad endpoints. Test, analyze, and score
                                            your APIs against REST best practices before they hit
                                            production.
                                        </p>
                                    </div>

                                    <div className="mt-8 flex items-center gap-4">
                                        <button className="group/btn inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                                            Start Scanning
                                            <ArrowRight
                                                size={16}
                                                className="transition-transform group-hover/btn:translate-x-1"
                                            />
                                        </button>
                                    </div>
                                </div>

                                {/* Abstract Graphic for Hero */}
                                <div className="absolute right-4 bottom-4 hidden opacity-30 grayscale transition-all duration-500 group-hover:opacity-50 group-hover:grayscale-0 lg:block">
                                    <Activity className="h-30 w-30 text-blue-100" />
                                </div>
                            </div>

                            {/* Tile 2 - Quality Score (Updated to Light Theme) */}
                            <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200 transition-all hover:shadow-lg lg:col-span-1">
                                <div className="absolute top-0 right-0 p-4 opacity-50">
                                    <BarChart3 className="text-gray-300 transition-colors group-hover:text-blue-500" />
                                </div>
                                <div className="relative z-10 flex h-full flex-col justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            Quality Score
                                        </h3>
                                        <p className="text-xs text-gray-500">REST Compliance</p>
                                    </div>
                                    <div className="mt-4 flex items-end gap-2">
                                        <span className="text-5xl font-bold tracking-tighter text-gray-900">
                                            98
                                        </span>
                                        <span className="mb-2 text-sm font-medium text-green-600">
                                            /100
                                        </span>
                                    </div>
                                    <div className="mt-4 h-1.5 w-full rounded-full bg-gray-100">
                                        <div className="h-1.5 w-[98%] rounded-full bg-gradient-to-r from-blue-500 to-green-500"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Tile 3 - Request Builder */}
                            <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200 transition-all hover:ring-blue-200 lg:col-span-1">
                                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600 transition-colors group-hover:bg-amber-100">
                                    <Terminal size={20} />
                                </div>
                                <h3 className="mb-1 text-lg font-semibold text-gray-900">
                                    Request Builder
                                </h3>
                                <p className="mb-4 text-sm text-gray-500">
                                    Full control over headers & body.
                                </p>

                                <div className="flex flex-wrap gap-2">
                                    <span className="rounded-md border border-gray-200 bg-gray-100 px-2 py-1 font-mono text-[10px] font-medium text-gray-600">
                                        GET /users
                                    </span>
                                    <span className="rounded-md border border-blue-100 bg-blue-50 px-2 py-1 font-mono text-[10px] font-medium text-blue-600">
                                        POST /api
                                    </span>
                                </div>
                            </div>

                            {/* Tile 4 - Organization */}
                            <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200 transition-all hover:bg-gray-50 lg:col-span-1">
                                <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-green-50/50 transition-all group-hover:scale-150"></div>
                                <div className="relative">
                                    <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white text-green-600 shadow-sm ring-1 ring-gray-100">
                                        <FolderTree size={20} />
                                    </div>
                                    <h3 className="mb-1 text-lg font-semibold text-gray-900">
                                        Collections
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Folder-based organization for your endpoints.
                                    </p>
                                </div>
                            </div>

                            {/* Tile 5 - Intelligence/Analysis */}
                            <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200 transition-all lg:col-span-1">
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
                                <div className="relative">
                                    <div className="mb-4 flex items-center justify-between">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                                            <Code2 size={20} />
                                        </div>
                                        <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-bold tracking-wide text-purple-700 uppercase">
                                            AI Powered
                                        </span>
                                    </div>
                                    <h3 className="mb-1 text-lg font-semibold text-gray-900">
                                        Linter
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Auto-detect violations and flaws.
                                    </p>
                                </div>
                            </div>

                            {/* Tile 6 - Actionable Feedback (Restored Missing Element) */}
                            <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200 transition-all lg:col-span-1">
                                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition-transform group-hover:scale-110">
                                    <CheckCircle2 size={20} />
                                </div>
                                <h3 className="mb-1 text-lg font-semibold text-gray-900">
                                    Fix What Matters
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Instant suggestions for naming and status codes.
                                </p>
                            </div>

                            {/* Tile 7 - Error Handling */}
                            <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200 transition-all lg:col-span-1">
                                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-600 transition-transform group-hover:rotate-12">
                                    <AlertTriangle size={20} />
                                </div>
                                <h3 className="mb-1 text-lg font-semibold text-gray-900">
                                    Better Errors
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Standardize error formats instantly.
                                </p>
                            </div>

                            {/* Tile 8 - Collaboration (Wide) */}
                            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 p-6 shadow-sm ring-1 ring-gray-200 transition-all hover:shadow-md lg:col-span-2">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white shadow-md">
                                        <Users size={20} />
                                    </div>
                                    <div>
                                        <h3 className="mb-1 text-lg font-semibold text-gray-900">
                                            API-First Teams
                                        </h3>
                                        <p className="max-w-xs text-sm text-gray-500">
                                            Collaborate on design before you write code. Sync with
                                            your team in real-time.
                                        </p>
                                    </div>
                                    <div className="ml-auto hidden sm:block">
                                        <div className="flex -space-x-3">
                                            {[1, 2, 3, 4].map((i) => (
                                                <div
                                                    key={i}
                                                    className="h-8 w-8 rounded-full border-2 border-white bg-gray-200 shadow-sm"></div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
