/** Imported modules */
import { createContext, type FC, type ReactNode, useContext, useState } from "react";
import { Loader2 } from "lucide-react";

/** Loading context type */
type LoadingContext = {
    showLoading: () => void;
    hideLoading: () => void;
    isLoading: boolean;
};

/** Loading overlay context */
const LoadingOverlayContext = createContext<LoadingContext | null>(null);

/** Loading overlay provider */
export const LoadingOverlayProvider: FC<{ children: ReactNode }> = ({ children }) => {
    /** States */
    const [isLoading, setIsLoading] = useState(false);

    /** Show the loading */
    const showLoading = () => setIsLoading(true);

    /** Hide the loading */
    const hideLoading = () => setIsLoading(false);

    return (
        <LoadingOverlayContext.Provider value={{ showLoading, hideLoading, isLoading }}>
            {children}

            {/* Loading Overlay */}
            {isLoading && (
                <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm duration-200">
                    <div className="animate-in zoom-in-95 flex flex-col items-center gap-4 rounded-2xl bg-white p-8 shadow-2xl duration-200">
                        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
                        <p className="text-sm font-medium text-gray-700">Loading...</p>
                    </div>
                </div>
            )}
        </LoadingOverlayContext.Provider>
    );
};

/** Loading overlay hook */
export const useLoadingOverlay = () => {
    const context = useContext(LoadingOverlayContext);
    if (!context) throw new Error("useLoadingOverlay must be inside LoadingOverlayProvider");
    return context;
};
