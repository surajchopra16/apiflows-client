/** Imported modules */
import {
    Activity,
    AlertTriangle,
    ArrowRight,
    BarChart3,
    CheckCircle2,
    Code2,
    FolderTree,
    Menu,
    Terminal,
    Users,
    Zap
} from "lucide-react";
import { Link } from "react-router";

/** Home component */
const Home = () => {
    return (
        <div className="relative min-h-screen overflow-hidden bg-white font-sans selection:bg-purple-100 selection:text-purple-900">
            {/* Floating navbar */}
            <nav className="fixed top-4 right-0 left-0 z-50 mx-auto flex max-w-6xl justify-center px-4">
                <div className="flex w-full items-center justify-between rounded-full bg-white/70 px-2 py-2 shadow-[0_8px_30px_rgb(0,0,0,0.02)] ring ring-gray-950/5 backdrop-blur-xl">
                    {/* Left section */}
                    <div className="flex items-center gap-6 pl-4">
                        <a href="#" className="flex items-center gap-2 pr-6">
                            {/* Logo Shadow: Tighter and colored */}
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-md ring-1 shadow-blue-500/20 ring-blue-500/20">
                                <Zap size={18} fill="currentColor" />
                            </div>
                            <span className="text-lg font-bold tracking-tight text-slate-800">
                                talkbase
                            </span>
                        </a>

                        {/* Desktop Nav Items */}
                        <div className="hidden items-center gap-1 md:flex">
                            {["Product", "Resources", "Pricing"].map((item) => (
                                <a
                                    href="#"
                                    key={item}
                                    className="group relative rounded-full px-4 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100/80 hover:text-slate-900">
                                    {item}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Right section */}
                    <div className="flex items-center gap-2">
                        <Link
                            to="/login"
                            className="hidden rounded-full px-5 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 md:block">
                            Log in
                        </Link>

                        {/* Button Shadow: Multi-layered for depth */}
                        <Link
                            to="/signup"
                            className="group relative flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-blue-700">
                            Get Started
                        </Link>

                        {/* Mobile Menu Toggle */}
                        <button className="ml-2 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200 hover:text-slate-900 md:hidden">
                            <Menu size={20} />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Gradient blurs (Hero section) */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                {/* Teal Gradient - Top Right */}
                <div className="absolute top-10 right-20 h-[240px] w-[240px] rounded-full bg-gradient-to-br from-teal-400/20 via-cyan-400/12 to-emerald-300/8 blur-[55px]"></div>

                {/* Rose Gradient - Top Left */}
                <div className="absolute top-20 -left-16 h-[220px] w-[220px] rounded-full bg-gradient-to-br from-rose-400/18 via-pink-400/10 to-fuchsia-300/6 blur-[60px]"></div>

                {/* Amber Gradient - Middle Right */}
                <div className="absolute top-[280px] -right-12 h-[180px] w-[180px] rounded-full bg-gradient-to-l from-amber-400/15 via-yellow-300/8 to-transparent blur-[45px]"></div>

                {/* Button Area Blur - Centered on CTA buttons */}
                <div className="absolute top-[460px] left-1/2 h-[160px] w-[360px] -translate-x-1/2 rounded-full bg-gradient-to-r from-teal-300/12 via-rose-300/8 to-amber-300/12 blur-[45px]"></div>

                {/* Subtle Indigo Accent - Bottom Left */}
                <div className="absolute top-[380px] left-10 h-[140px] w-[140px] rounded-full bg-gradient-to-tr from-indigo-400/10 via-violet-300/6 to-transparent blur-[40px]"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center pt-30">
                {/* Hero Section */}
                <div className="mx-auto flex max-w-4xl flex-col items-center px-4 text-center md:px-8">
                    {/* Badge */}
                    <div className="relative mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/80 px-3 py-1 text-sm font-medium text-blue-600 backdrop-blur-sm">
                        <svg
                            width="6"
                            height="6"
                            className="shrink-0 animate-pulse fill-blue-600"
                            viewBox="0 0 2 2"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <circle cx="1" cy="1" r="1" />
                        </svg>
                        AI-Powered HTTP API Client
                    </div>

                    {/* Heading */}
                    <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-950 sm:text-6xl sm:leading-[1.1]">
                        Test, Optimize, and Perfect <br className="hidden sm:block" />
                        <span className="text-blue-600">APIs with AI</span>
                    </h1>

                    {/* Sub-heading */}
                    <p className="mb-10 max-w-3xl text-lg leading-relaxed text-gray-500">
                        An intelligent API client that analyzes your requests, scores API structure
                        quality, optimizes performance, and provides AI-powered insights to build
                        better APIs
                    </p>

                    {/* Buttons */}
                    <div className="mb-14 flex w-full flex-col justify-center gap-4 sm:flex-row">
                        {/* Get started free button */}
                        <Link
                            to="/signup"
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 text-base font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl">
                            Get started free
                            <svg
                                width="20"
                                height="20"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round">
                                <path d="M5 12h14" />
                                <path d="m12 5 7 7-7 7" />
                            </svg>
                        </Link>

                        {/* Try demo button */}
                        <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-7 py-3.5 text-base font-semibold text-gray-800 transition-all hover:-translate-y-0.5 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900">
                            <svg
                                width="20"
                                height="20"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round">
                                <polygon points="5 3 19 12 5 21 5 3" />
                            </svg>
                            Try Demo
                        </button>
                    </div>
                </div>

                {/* App wireframe */}
                <div className="relative z-10 w-full px-4 sm:px-0">
                    {/* Half background overlay */}
                    <div className="absolute bottom-0 left-1/2 h-1/2 w-full -translate-x-1/2 bg-[#FAFAFA]"></div>

                    {/* Image container */}
                    <div className="mx-auto w-full max-w-5xl rounded-[1.75rem] bg-white/30 p-2.5 shadow-2xl ring-1 shadow-zinc-300/40 ring-gray-900/5 backdrop-blur-md">
                        <img
                            src="/src/assets/images/app-wireframe.png"
                            alt="App Wireframe"
                            className="w-full rounded-[1.25rem] border border-zinc-100"
                        />
                    </div>
                </div>

                {/* Bento Grid */}
                <div className="relative w-full bg-[#FAFAFA] px-4 py-12 md:py-24">
                    {/* Heading */}
                    <div className="mb-12 text-center">
                        <h2 className="mb-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                            Build APIs that <span className="text-blue-600">don't break</span>
                        </h2>

                        <p className="text-lg font-normal text-gray-500">
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
