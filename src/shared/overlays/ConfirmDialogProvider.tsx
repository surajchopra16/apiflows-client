/** Imported modules */
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import {
    createContext,
    type FC,
    type ReactNode,
    useCallback,
    useContext,
    useRef,
    useState
} from "react";

/** Confirm function type */
type ConfirmFn = (title: string, message: string) => Promise<boolean>;

/** Confirm context */
const ConfirmContext = createContext<ConfirmFn | null>(null);

/** Confirm dialog provider component */
export const ConfirmDialogProvider: FC<{ children: ReactNode }> = ({ children }) => {
    /** States */
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");

    /** Resolver ref */
    const resolverRef = useRef<((value: boolean) => void) | null>(null);

    /** Handle close */
    const handleClose = (ok: boolean) => {
        setOpen(false);
        if (resolverRef.current) resolverRef.current(ok);
        resolverRef.current = null;
    };

    /** Confirm function */
    const confirm: ConfirmFn = useCallback((title: string, message: string) => {
        setTitle(title);
        setMessage(message);
        setOpen(true);

        return new Promise<boolean>((resolve) => (resolverRef.current = resolve));
    }, []);

    return (
        <ConfirmContext.Provider value={confirm}>
            {children}
            <AlertDialog.Root open={open}>
                <AlertDialog.Portal>
                    {/* Overlay */}
                    <AlertDialog.Overlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50" />

                    {/* Content */}
                    <AlertDialog.Content className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-1/2 left-1/2 z-50 w-full max-w-120 -translate-x-1/2 -translate-y-1/2 rounded-xl border border-gray-200 bg-white p-6 shadow-lg duration-200">
                        {/* Title */}
                        <AlertDialog.Title className="text-base leading-none font-semibold text-gray-900">
                            {title}
                        </AlertDialog.Title>

                        {/* Description */}
                        <AlertDialog.Description className="mt-2.5 text-sm leading-relaxed font-normal text-gray-600">
                            {message}
                        </AlertDialog.Description>

                        {/* Cancel & Confirm buttons */}
                        <div className="mt-5 flex items-center justify-end gap-3">
                            <AlertDialog.Cancel asChild>
                                <button
                                    type="button"
                                    aria-label="Cancel"
                                    onClick={() => handleClose(false)}
                                    className="rounded-10 inline-flex h-10 items-center justify-center border border-gray-200 px-4 py-2 text-sm font-medium text-gray-900 shadow-xs hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-blue-600/90 focus-visible:outline-none">
                                    Cancel
                                </button>
                            </AlertDialog.Cancel>

                            <AlertDialog.Action asChild>
                                <button
                                    type="button"
                                    aria-label="Confirm"
                                    onClick={() => handleClose(true)}
                                    className="rounded-10 inline-flex h-10 items-center justify-center bg-blue-500 px-4 py-2 text-sm font-medium text-white shadow-xs hover:bg-blue-600 focus-visible:ring-2 focus-visible:ring-blue-600/90 focus-visible:outline-none">
                                    Confirm
                                </button>
                            </AlertDialog.Action>
                        </div>
                    </AlertDialog.Content>
                </AlertDialog.Portal>
            </AlertDialog.Root>
        </ConfirmContext.Provider>
    );
};

/** Use confirm hook */
export const useConfirm = () => {
    const context = useContext(ConfirmContext);
    if (!context) throw new Error("useConfirm must be inside ConfirmProvider");
    return context;
};
