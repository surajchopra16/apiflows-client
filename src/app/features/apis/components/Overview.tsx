// if (true) {
//     return (
//         <div className="flex min-h-0 flex-1 flex-col bg-[#FAFAFA]">
//             <div className="w-full max-w-4xl px-8 py-10">
//                 {/* Header */}
//                 <div className="mb-10 text-center">
//                     <h1 className="text-2xl font-bold text-gray-800">Welcome 👋</h1>
//                     <p className="mt-2 text-sm text-gray-500">
//                         Here’s how to get started with your first API request.
//                     </p>
//                 </div>
//
//                 {/* Core Features */}
//                 <div className="mb-8">
//                     <h2 className="mb-4 text-sm font-semibold text-gray-700">Core Features</h2>
//                     <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
//                         {features.map((feature, index) => (
//                             <div
//                                 key={index}
//                                 className="flex flex-col items-start rounded-xl bg-white p-4 ring ring-gray-200 hover:border-blue-300 hover:bg-blue-50">
//                                 <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-md bg-blue-100 text-blue-600">
//                                     {feature.icon}
//                                 </div>
//                                 <div className="text-sm font-medium text-gray-800">
//                                     {feature.title}
//                                 </div>
//                                 <div className="mt-1 text-xs text-gray-500">
//                                     {feature.description}
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//
//                 {/* Tips Section */}
//                 <div className="mt-8 rounded-lg bg-white p-4 ring ring-gray-200">
//                     <div className="mb-2 flex items-center gap-2 text-xs font-medium text-gray-700">
//                         <Keyboard size={14} />
//                         Tips
//                     </div>
//                     <ul className="space-y-1 text-xs text-gray-500">
//                         <li>- Press Ctrl+Enter to send a request.</li>
//                         <li>- Use collections to keep related requests together.</li>
//                         <li>- Switch environments to test dev, staging, or prod APIs.</li>
//                     </ul>
//                 </div>
//             </div>
//         </div>
//     );
// }

// /*
// FeatureShowcase.tsx
// Professional React + Tailwind component to highlight app features.
//
// Requirements:
//  - Tailwind CSS configured in your project
//  - Install dependencies: npm i framer-motion lucide-react
//
// Usage:
//  import FeatureShowcase from './FeatureShowcase';
//  <FeatureShowcase />
//
// This single-file component provides:
//  - Hero with CTAs and animated metrics
//  - Responsive grid of feature cards with icons and micro-interactions
//  - Click-to-view feature details, code sample with copy button
//  - Environment toggle and short tips section
//  - Accessible markup and keyboard focus styles
// */
//
// import React, { useEffect, useMemo, useRef, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Zap, ShieldCheck, Server, Code, Cpu, Keyboard } from "lucide-react";
//
// type Feature = {
//     id: string;
//     title: string;
//     description: string;
//     icon: React.ReactNode;
//     metric?: number; // optional stat
//     tag?: string;
// };
//
// const FEATURES: Feature[] = [
//     {
//         id: "low-latency",
//         title: "Low latency edge API",
//         description: "Route requests to edge locations for faster responses and lower cost.",
//         icon: <Zap size={18} />,
//         metric: 12,
//         tag: "New"
//     },
//     {
//         id: "security",
//         title: "Enterprise-grade security",
//         description: "Built-in RBAC, audit logs, and encryption at rest and transit.",
//         icon: <ShieldCheck size={18} />,
//         metric: 99
//     },
//     {
//         id: "scaling",
//         title: "Auto-scaling clusters",
//         description: "Autoscale seamlessly with predictable performance under load.",
//         icon: <Server size={18} />,
//         metric: 4200
//     },
//     {
//         id: "sdk",
//         title: "SDKs & Examples",
//         description: "Official SDKs for JavaScript, Python and more — get started quickly.",
//         icon: <Code size={18} />,
//         metric: 15,
//         tag: "Popular"
//     },
//     {
//         id: "observability",
//         title: "Built-in observability",
//         description: "Traces, logs and metrics integrated for fast debugging.",
//         icon: <Cpu size={18} />,
//         metric: 98
//     }
// ];
//
// function useAnimateNumber(target: number, duration = 1000) {
//     const [value, setValue] = useState(0);
//     useEffect(() => {
//         let start: number | null = null;
//         const from = 0;
//         const diff = target - from;
//         function step(ts: number) {
//             if (!start) start = ts;
//             const elapsed = ts - start;
//             const progress = Math.min(elapsed / duration, 1);
//             setValue(Math.round(from + diff * progress));
//             if (progress < 1) requestAnimationFrame(step);
//         }
//         requestAnimationFrame(step);
//         return () => {
//             start = null;
//         };
//     }, [target, duration]);
//     return value;
// }
//
// export default function FeatureShowcase() {
//     const [selected, setSelected] = useState<Feature | null>(FEATURES[0]);
//     const [env, setEnv] = useState<"dev" | "staging" | "prod">("prod");
//     const [showTips, setShowTips] = useState(true);
//
//     const metrics = useMemo(
//         () => ({
//             rps: 1280,
//             uptime: 99.99,
//             customers: 542
//         }),
//         []
//     );
//
//     const rps = useAnimateNumber(metrics.rps, 1400);
//     const uptime = useAnimateNumber(Math.round(metrics.uptime * 100), 1400); // store as percent * 100
//     const customers = useAnimateNumber(metrics.customers, 1400);
//
//     // Code sample to show in the panel
//     const codeSample = `// Minimal example: send a request\nimport fetch from 'node-fetch';\n\nasync function callApi() {\n  const res = await fetch('https://api.yourapp.com/v1/execute', {\n    method: 'POST',\n    headers: { 'Authorization': 'Bearer $YOUR_KEY', 'Content-Type': 'application/json' },\n    body: JSON.stringify({ prompt: 'Hello from the SDK' }),\n  });\n  const data = await res.json();\n  console.log(data);\n}\n\ncallApi();`;
//
//     const codeRef = useRef<HTMLPreElement | null>(null);
//
//     async function copyCode() {
//         try {
//             await navigator.clipboard.writeText(codeSample);
//             // small visual feedback (could be enhanced)
//             const el = codeRef.current;
//             if (el) {
//                 el.animate([{ opacity: 0.6 }, { opacity: 1 }], { duration: 300 });
//             }
//         } catch (e) {
//             // fallback
//             console.error("Copy failed", e);
//         }
//     }
//
//     return (
//         <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white px-6 py-10">
//             <div className="mx-auto max-w-6xl">
//                 <div className="grid gap-8 lg:grid-cols-2">
//                     {/* LEFT: Hero / Overview */}
//                     <section className="order-2 lg:order-1">
//                         <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-100">
//                             <div className="flex items-start justify-between gap-4">
//                                 <div>
//                                     <h1 className="text-3xl leading-tight font-bold text-slate-900">
//                                         Ship features faster —{" "}
//                                         <span className="text-indigo-600">with confidence</span>
//                                     </h1>
//                                     <p className="mt-3 max-w-xl text-sm text-slate-600">
//                                         A production-ready API platform with predictable
//                                         performance, secure defaults, and developer tooling designed
//                                         for scale. Get running in minutes and iterate safely across
//                                         environments.
//                                     </p>
//
//                                     <div className="mt-6 flex flex-wrap gap-3">
//                                         <button
//                                             onClick={() => window.open("/console", "_self")}
//                                             className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
//                                             Get started
//                                         </button>
//                                         <button
//                                             onClick={() => window.open("/docs", "_self")}
//                                             className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-200">
//                                             View docs
//                                         </button>
//                                     </div>
//
//                                     {/* Metrics */}
//                                     <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-3">
//                                         <div className="rounded-lg bg-slate-50 px-3 py-2 text-center">
//                                             <div className="text-xs font-medium text-slate-500">
//                                                 Requests / sec
//                                             </div>
//                                             <div className="mt-1 text-lg font-semibold text-slate-900">
//                                                 {rps}
//                                             </div>
//                                         </div>
//                                         <div className="rounded-lg bg-slate-50 px-3 py-2 text-center">
//                                             <div className="text-xs font-medium text-slate-500">
//                                                 Uptime
//                                             </div>
//                                             <div className="mt-1 text-lg font-semibold text-slate-900">
//                                                 {(uptime / 100).toFixed(2)}%
//                                             </div>
//                                         </div>
//                                         <div className="rounded-lg bg-slate-50 px-3 py-2 text-center">
//                                             <div className="text-xs font-medium text-slate-500">
//                                                 Active customers
//                                             </div>
//                                             <div className="mt-1 text-lg font-semibold text-slate-900">
//                                                 {customers}
//                                             </div>
//                                         </div>
//                                     </div>
//
//                                     {/* Environment toggle */}
//                                     <div className="mt-6 flex items-center gap-3">
//                                         <div className="text-xs font-medium text-slate-600">
//                                             Environment
//                                         </div>
//                                         <div className="inline-flex items-center gap-1 rounded-full bg-slate-100 p-1">
//                                             <button
//                                                 aria-pressed={env === "dev"}
//                                                 onClick={() => setEnv("dev")}
//                                                 className={`rounded-full px-3 py-1 text-xs font-medium ${env === "dev" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600"}`}>
//                                                 Dev
//                                             </button>
//                                             <button
//                                                 aria-pressed={env === "staging"}
//                                                 onClick={() => setEnv("staging")}
//                                                 className={`rounded-full px-3 py-1 text-xs font-medium ${env === "staging" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600"}`}>
//                                                 Staging
//                                             </button>
//                                             <button
//                                                 aria-pressed={env === "prod"}
//                                                 onClick={() => setEnv("prod")}
//                                                 className={`rounded-full px-3 py-1 text-xs font-medium ${env === "prod" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600"}`}>
//                                                 Prod
//                                             </button>
//                                         </div>
//
//                                         <div className="ml-auto text-xs text-slate-500">
//                                             <Keyboard size={14} />{" "}
//                                             <span className="ml-1 align-middle">
//                                                 Ctrl+Enter to test
//                                             </span>
//                                         </div>
//                                     </div>
//                                 </div>
//
//                                 <div className="hidden w-48 shrink-0 md:block">
//                                     {/* Decorative / product mockup placeholder */}
//                                     <div className="rounded-lg bg-gradient-to-br from-indigo-50 to-white p-4 text-sm text-indigo-900">
//                                         <div className="h-28 w-full rounded-md bg-white/60 p-3 shadow-inner">
//                                             <div className="h-full w-full rounded border border-dashed border-indigo-100" />
//                                         </div>
//                                         <div className="mt-3 text-xs text-indigo-600">
//                                             Live dashboard preview
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//
//                             {/* Tips */}
//                             <div className="mt-6 border-t border-slate-100 pt-4">
//                                 <div className="flex items-center justify-between">
//                                     <div className="text-sm font-semibold text-slate-700">
//                                         Quick tips
//                                     </div>
//                                     <button
//                                         onClick={() => setShowTips((v) => !v)}
//                                         className="text-xs text-slate-500 underline-offset-2 hover:underline">
//                                         {showTips ? "Hide" : "Show"}
//                                     </button>
//                                 </div>
//                                 <AnimatePresence>
//                                     {showTips && (
//                                         <motion.ul
//                                             initial={{ opacity: 0, height: 0 }}
//                                             animate={{ opacity: 1, height: "auto" }}
//                                             exit={{ opacity: 0, height: 0 }}
//                                             className="mt-3 space-y-2 text-xs text-slate-500">
//                                             <li>
//                                                 • Use environments to safely test changes before
//                                                 releasing.
//                                             </li>
//                                             <li>
//                                                 • Group related endpoints into Collections for
//                                                 faster iteration.
//                                             </li>
//                                             <li>
//                                                 • Use our SDKs to handle retries and exponential
//                                                 backoff automatically.
//                                             </li>
//                                         </motion.ul>
//                                     )}
//                                 </AnimatePresence>
//                             </div>
//                         </div>
//                     </section>
//
//                     {/* RIGHT: Features panel */}
//                     <aside className="order-1 lg:order-2">
//                         <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
//                             <div className="flex items-center justify-between">
//                                 <h3 className="text-sm font-semibold text-slate-700">
//                                     Core features
//                                 </h3>
//                                 <div className="text-xs text-slate-400">
//                                     {FEATURES.length} items
//                                 </div>
//                             </div>
//
//                             <div className="mt-4 grid gap-3 sm:grid-cols-2">
//                                 {FEATURES.map((f) => (
//                                     <motion.button
//                                         key={f.id}
//                                         onClick={() => setSelected(f)}
//                                         whileHover={{ y: -4 }}
//                                         whileTap={{ scale: 0.98 }}
//                                         className={`group relative flex items-start gap-3 rounded-lg border border-transparent bg-slate-50 px-4 py-3 text-left hover:border-indigo-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-200 ${selected?.id === f.id ? "bg-white shadow-sm ring-1 ring-indigo-100" : ""}`}>
//                                         <div className="flex h-10 w-10 items-center justify-center rounded-md bg-indigo-50 text-indigo-600">
//                                             {f.icon}
//                                         </div>
//                                         <div className="flex-1">
//                                             <div className="flex items-start gap-2">
//                                                 <div className="text-sm font-medium text-slate-900">
//                                                     {f.title}
//                                                 </div>
//                                                 {f.tag && (
//                                                     <div className="ml-auto rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
//                                                         {f.tag}
//                                                     </div>
//                                                 )}
//                                             </div>
//                                             <div className="mt-1 text-xs text-slate-500">
//                                                 {f.description}
//                                             </div>
//
//                                             <div className="mt-2 flex items-center gap-3">
//                                                 <div className="flex items-center gap-2 text-xs text-slate-500">
//                                                     <div className="rounded-full bg-white/60 px-2 py-0.5 ring ring-gray-50">
//                                                         {f.metric ?? "—"}
//                                                     </div>
//                                                     <div>usage</div>
//                                                 </div>
//
//                                                 <div className="ml-auto text-xs text-indigo-600 group-hover:underline">
//                                                     Details →
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </motion.button>
//                                 ))}
//                             </div>
//
//                             {/* Selected feature details */}
//                             <div className="mt-6 border-t border-slate-100 pt-4">
//                                 <AnimatePresence>
//                                     {selected && (
//                                         <motion.div
//                                             key={selected.id}
//                                             initial={{ opacity: 0, y: 8 }}
//                                             animate={{ opacity: 1, y: 0 }}
//                                             exit={{ opacity: 0, y: 8 }}>
//                                             <div className="flex items-start gap-4">
//                                                 <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
//                                                     {selected.icon}
//                                                 </div>
//                                                 <div className="flex-1">
//                                                     <div className="flex items-center gap-4">
//                                                         <h4 className="text-sm font-semibold text-slate-900">
//                                                             {selected.title}
//                                                         </h4>
//                                                         {selected.tag && (
//                                                             <div className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
//                                                                 {selected.tag}
//                                                             </div>
//                                                         )}
//                                                     </div>
//                                                     <p className="mt-2 text-xs text-slate-600">
//                                                         {selected.description}
//                                                     </p>
//
//                                                     <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
//                                                         <div className="rounded-lg bg-slate-50 p-3 text-xs">
//                                                             <div className="text-xs font-medium text-slate-500">
//                                                                 Getting started
//                                                             </div>
//                                                             <div className="mt-2 text-sm font-medium text-slate-900">
//                                                                 Deploy in minutes
//                                                             </div>
//                                                         </div>
//
//                                                         <div className="rounded-lg bg-slate-50 p-3 text-xs">
//                                                             <div className="text-xs font-medium text-slate-500">
//                                                                 Best for
//                                                             </div>
//                                                             <div className="mt-2 text-sm font-medium text-slate-900">
//                                                                 Production workloads
//                                                             </div>
//                                                         </div>
//                                                     </div>
//
//                                                     {/* Code sample */}
//                                                     <div className="mt-4">
//                                                         <div className="flex items-center justify-between">
//                                                             <div className="text-xs font-medium text-slate-600">
//                                                                 Code sample
//                                                             </div>
//                                                             <div className="flex items-center gap-2">
//                                                                 <button
//                                                                     onClick={copyCode}
//                                                                     className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-medium hover:bg-slate-50">
//                                                                     Copy
//                                                                 </button>
//                                                                 <button
//                                                                     onClick={() =>
//                                                                         window.open(
//                                                                             "/docs",
//                                                                             "_blank"
//                                                                         )
//                                                                     }
//                                                                     className="rounded-md bg-indigo-600 px-3 py-1 text-xs font-semibold text-white hover:bg-indigo-700">
//                                                                     Docs
//                                                                 </button>
//                                                             </div>
//                                                         </div>
//                                                         <pre
//                                                             ref={codeRef}
//                                                             className="mt-2 max-h-40 overflow-auto rounded-md border border-slate-100 bg-slate-50 p-3 text-xs text-slate-700">
//                                                             <code>{codeSample}</code>
//                                                         </pre>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </motion.div>
//                                     )}
//                                 </AnimatePresence>
//                             </div>
//                         </div>
//
//                         {/* footer compact CTA */}
//                         <div className="mt-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
//                             <div className="flex items-center justify-between gap-4">
//                                 <div>
//                                     <div className="text-xs font-semibold text-slate-700">
//                                         Launch checklist
//                                     </div>
//                                     <div className="mt-1 text-xs text-slate-500">
//                                         Security review · Load testing · Observability
//                                     </div>
//                                 </div>
//                                 <button
//                                     onClick={() => window.open("/signup", "_self")}
//                                     className="rounded-full bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700">
//                                     Start a trial
//                                 </button>
//                             </div>
//                         </div>
//                     </aside>
//                 </div>
//             </div>
//         </div>
//     );
// }

// import { Keyboard, FileText, Layers, Rocket } from 'lucide-react';
//
// const features = [
//     {
//         title: "API Workflows",
//         description: "Design, test, and automate your API workflows seamlessly.",
//         icon: <Layers size={16} />,
//     },
//     {
//         title: "Docs Generation",
//         description: "Generate clear API documentation for your team automatically.",
//         icon: <FileText size={16} />,
//     },
//     {
//         title: "Quick Requests",
//         description: "Send API requests instantly with keyboard shortcuts.",
//         icon: <Rocket size={16} />,
//     },
// ];
//
// export default function Overview() {
//     return (
//         <div className="flex min-h-screen flex-col bg-fixed bg-gradient-to-b from-gray-50 via-gray-100 to-gray-50 p-8">
//             {/* Main container */}
//             <div className="mx-auto w-full max-w-5xl space-y-12">
//                 {/* Welcome Header */}
//                 <div className="text-center">
//                     <h1 className="text-3xl font-extrabold text-gray-800">Welcome to API Tester 👋</h1>
//                     <p className="mt-2 text-sm text-gray-500">
//                         Start testing your APIs, generate docs, and automate workflows efficiently.
//                     </p>
//                 </div>
//
//                 {/* Core Features */}
//                 <div>
//                     <h2 className="mb-6 text-lg font-semibold text-gray-700">Core Features</h2>
//                     <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
//                         {features.map((feature, index) => (
//                             <div
//                                 key={index}
//                                 className="group flex flex-col rounded-xl bg-white p-6 shadow-md ring-1 ring-gray-200 hover:ring-blue-300 hover:shadow-lg transition-all duration-200"
//                             >
//                                 <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-blue-100 text-blue-600 transition-all duration-200 group-hover:bg-blue-200 group-hover:text-blue-700">
//                                     {feature.icon}
//                                 </div>
//                                 <div className="text-md font-semibold text-gray-800">{feature.title}</div>
//                                 <p className="mt-1 text-sm text-gray-500">{feature.description}</p>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//
//                 {/* Quick Tips */}
//                 <div className="rounded-lg bg-white p-6 shadow-md ring-1 ring-gray-200">
//                     <div className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-700">
//                         <Keyboard size={16} />
//                         Quick Tips
//                     </div>
//                     <ul className="space-y-2 text-sm text-gray-500">
//                         <li>• Press <span className="font-mono bg-gray-100 px-1 rounded">Ctrl+Enter</span> to send a request.</li>
//                         <li>• Use collections to organize related requests.</li>
//                         <li>• Switch environments to test dev, staging, or prod APIs.</li>
//                         <li>• Generate API docs directly from your workflows.</li>
//                     </ul>
//                 </div>
//
//                 {/* Call to Action / Get Started */}
//                 <div className="text-center">
//                     <button className="rounded-full bg-blue-600 px-6 py-3 text-white font-semibold shadow-md hover:bg-blue-700 transition">
//                         Get Started
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// }

import { useEffect, useState } from "react";
import { Play, Copy, Zap, BookOpen, Layers, Terminal } from "lucide-react";

// OverviewTabVertical.jsx
// Fixed: Quick Start layout issues, made the whole page scrollable so Pro Tips are revealed on scroll.
// Behavior changes (intentional and minimal):
// - Container is now scrollable (overflow-y-auto) so the top header + quick start + features are shown on initial view.
// - Header (12vh) + Quick Start (28vh) + Features (60vh) are sized to fit the first viewport without vertical scroll.
// - Pro Tips live below and require scrolling to see (16vh), ensuring it appears only when the user intentionally scrolls.
// - Quick Start code block is now independently scrollable (overflow-auto) so long cURL content won't break the layout.

const SAMPLE_CURL = `curl -X POST "https://api.example.com/v1/resource" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <API_KEY>" \
  -d '{"name":"example","value":1}'`;

const FEATURES = [
    {
        id: 1,
        title: "Quick Requests",
        desc: "Save, replay and pin commonly used requests.",
        icon: <Terminal size={18} />,
        shape: "tall"
    },
    {
        id: 2,
        title: "Workflows",
        desc: "Build request pipelines with conditions & retries.",
        icon: <Layers size={18} />,
        shape: "card"
    },
    {
        id: 3,
        title: "Auto Docs",
        desc: "Generate docs automatically from examples.",
        icon: <BookOpen size={18} />,
        shape: "pill"
    },
    {
        id: 4,
        title: "Monitoring",
        desc: "Track latency, errors & uptime.",
        icon: <Zap size={18} />,
        shape: "card"
    },
    {
        id: 5,
        title: "SDK Snippets",
        desc: "Export curl, JS or SDK snippets.",
        icon: <Copy size={18} />,
        shape: "wide"
    },
    {
        id: 6,
        title: "Templates",
        desc: "Start fast with curated samples.",
        icon: <Play size={18} />,
        shape: "card"
    }
];

export default function Overview() {
    const [copied, setCopied] = useState(false);
    const [running, setRunning] = useState(false);
    const [result, setResult] = useState<any>(null);

    useEffect(() => {
        if (!copied) return;
        const t = setTimeout(() => setCopied(false), 1200);
        return () => clearTimeout(t);
    }, [copied]);

    function copySample() {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(SAMPLE_CURL).then(() => setCopied(true));
        } else setCopied(true);
    }

    function runSample() {
        setRunning(true);
        setResult(null);
        // Simulate a request run — replace with your real runner
        setTimeout(() => {
            setRunning(false);
            setResult({ status: 200, time: "110ms", body: '{"ok":true,"id":42}' });
        }, 700);
    }

    return (
        <div className="h-screen w-full overflow-y-auto bg-[#FAFAFA] p-6">
            <div className="mx-auto flex max-w-5xl flex-col gap-4">
                {/* Header (12vh) */}
                <header className="flex items-center justify-between" style={{ height: "12vh" }}>
                    <div>
                        <h1 className="text-lg font-semibold text-slate-800">
                            API Studio — Overview
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">
                            Compact vertical layout — sample quick start, large features area and
                            short pro tips (reveal on scroll).
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="text-xs text-slate-500">Environment</div>
                        <div className="rounded-md bg-white/60 px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200">
                            Dev
                        </div>
                    </div>
                </header>

                {/* Quick Start (28vh) - fixed layout issues: pre is scrollable and buttons are constrained */}
                <section className="rounded-2xl bg-white p-4 shadow-sm" style={{ height: "28vh" }}>
                    <div className="flex h-full flex-col justify-between">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="text-sm font-medium text-slate-800">
                                    Quick Start
                                </div>
                                <div className="mt-1 text-xs text-slate-500">
                                    Run a sample request to preview a response instantly.
                                </div>
                            </div>

                            <div className="text-xs text-slate-400">Sample</div>
                        </div>

                        <div className="mt-3 flex h-full gap-4">
                            {/* code block is scrollable now */}
                            <pre className="flex-1 overflow-auto rounded-md border border-slate-100 bg-slate-50 p-3 text-[12px] leading-snug text-slate-700">
                                <code>{SAMPLE_CURL}</code>
                            </pre>

                            <div className="flex w-36 flex-col items-stretch gap-2">
                                <button
                                    onClick={runSample}
                                    className="inline-flex items-center justify-center gap-2 rounded-md bg-slate-900 px-3 py-2 text-xs font-medium text-white">
                                    <Play size={14} /> {running ? "Running" : "Run"}
                                </button>

                                <button
                                    onClick={copySample}
                                    className="inline-flex items-center justify-center gap-2 rounded-md bg-white px-3 py-2 text-xs font-medium text-slate-700 ring-1 ring-slate-100">
                                    <Copy size={14} /> {copied ? "Copied" : "Copy"}
                                </button>

                                <div className="mt-1 text-center text-xs text-slate-500">
                                    {result ? `${result.status} • ${result.time}` : "No run yet"}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features (60vh) - large, visually varied area */}
                <section className="rounded-2xl bg-white p-4 shadow-sm" style={{ height: "60vh" }}>
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm font-medium text-slate-800">Core Features</div>
                            <div className="mt-1 text-xs text-slate-500">
                                Large, varied tiles to showcase capabilities visually.
                            </div>
                        </div>

                        <div className="text-xs text-slate-400">6 items</div>
                    </div>

                    <div className="mt-4 h-full">
                        <div
                            className="grid h-full grid-cols-3 gap-4"
                            style={{ gridAutoRows: "1fr" }}>
                            <div className="col-span-1 row-span-2 rounded-2xl bg-gradient-to-br from-indigo-50 to-white p-4 shadow-inner">
                                <div className="flex h-full flex-col justify-between">
                                    <div>
                                        <div className="inline-flex items-center gap-3">
                                            <div className="rounded-lg bg-white/80 p-2 text-indigo-600">
                                                {FEATURES[0].icon}
                                            </div>
                                            <div className="text-sm font-semibold text-slate-800">
                                                {FEATURES[0].title}
                                            </div>
                                        </div>

                                        <p className="mt-3 text-xs text-slate-600">
                                            {FEATURES[0].desc}
                                        </p>

                                        <div className="mt-4 flex flex-wrap gap-2">
                                            <div className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700">
                                                Pin
                                            </div>
                                            <div className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                                                Examples
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-2 text-[11px] text-slate-500">
                                        Most used • 24 pins
                                    </div>
                                </div>
                            </div>

                            <div className="col-span-2 row-span-1 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-md bg-slate-50 p-2 text-slate-700">
                                            {FEATURES[1].icon}
                                        </div>
                                        <div>
                                            <div className="text-sm font-semibold text-slate-800">
                                                {FEATURES[1].title}
                                            </div>
                                            <div className="mt-1 text-xs text-slate-500">
                                                {FEATURES[1].desc}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-xs text-slate-400">Visual</div>
                                </div>

                                <div className="mt-3 text-xs text-slate-500">
                                    Open the workflow builder to compose multi-step test scenarios,
                                    add assertions, and replay.
                                </div>
                            </div>

                            <div className="col-span-1 row-span-1 rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-100">
                                <div className="flex items-start gap-3">
                                    <div className="rounded-md bg-amber-50 p-2 text-amber-600">
                                        {FEATURES[2].icon}
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold text-slate-800">
                                            {FEATURES[2].title}
                                        </div>
                                        <div className="mt-1 text-xs text-slate-500">
                                            {FEATURES[2].desc}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-span-1 row-span-1 rounded-2xl bg-gradient-to-tr from-emerald-50 to-white p-3 shadow-sm">
                                <div>
                                    <div className="inline-flex items-center gap-3">
                                        <div className="rounded-md bg-emerald-100 p-2 text-emerald-700">
                                            {FEATURES[3].icon}
                                        </div>
                                        <div className="text-sm font-semibold text-slate-800">
                                            {FEATURES[3].title}
                                        </div>
                                    </div>

                                    <div className="mt-2 text-xs text-slate-500">
                                        {FEATURES[3].desc}
                                    </div>

                                    <div className="mt-3 flex gap-2">
                                        <div className="rounded-md bg-white/80 px-3 py-1 text-xs">
                                            Metrics
                                        </div>
                                        <div className="rounded-md bg-white/80 px-3 py-1 text-xs">
                                            Alerts
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-span-2 row-span-1 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-md bg-slate-50 p-2 text-slate-700">
                                        {FEATURES[4].icon}
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold text-slate-800">
                                            {FEATURES[4].title}
                                        </div>
                                        <div className="mt-1 text-xs text-slate-500">
                                            {FEATURES[4].desc}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-3 text-xs text-slate-500">
                                    Export code snippets in multiple languages and copy with one
                                    click.
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Pro Tips (16vh) - intentionally below the fold so user scrolls to reveal */}
                <aside className="rounded-2xl bg-white p-4 shadow-sm" style={{ height: "16vh" }}>
                    <div className="flex h-full items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="rounded-md bg-indigo-50 p-2 text-indigo-600">
                                <Zap size={14} />
                            </div>
                            <div>
                                <div className="text-sm font-medium text-slate-800">Pro Tips</div>
                                <div className="mt-1 text-xs text-slate-500">
                                    Small tips to get better docs & tests.
                                </div>
                            </div>
                        </div>

                        <div className="text-xs text-slate-500">
                            Press <span className="rounded bg-slate-100 px-1 py-0.5">Ctrl</span> +{" "}
                            <span className="rounded bg-slate-100 px-1 py-0.5">Enter</span> to run
                            selected request
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
