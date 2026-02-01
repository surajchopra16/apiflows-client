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
                <div className="animate-in fade-in fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-white/80 backdrop-blur-sm duration-200">
                    <Loader2 className="h-12 w-12 animate-spin text-gray-950" />
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
