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
type ConfirmFn = (options: {
    title: string;
    message: string;
    cancelText: string;
    confirmText: string;
}) => Promise<boolean>;

/** Alert dialog context */
const AlertDialogContext = createContext<ConfirmFn | null>(null);

/** Alert dialog provider */
export const AlertDialogProvider: FC<{ children: ReactNode }> = ({ children }) => {
    /** States */
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [cancelText, setCancelText] = useState("");
    const [confirmText, setConfirmText] = useState("");

    /** Resolver ref */
    const resolverRef = useRef<((value: boolean) => void) | null>(null);

    /** Confirm function */
    const confirm: ConfirmFn = useCallback(
        ({ title, message, cancelText, confirmText }) =>
            new Promise((resolve) => {
                resolverRef.current = resolve;
                setTitle(title);
                setMessage(message);
                setCancelText(cancelText);
                setConfirmText(confirmText);
                setOpen(true);
            }),
        []
    );

    /** Handle close */
    const handleClose = (ok: boolean) => {
        setOpen(false);
        if (resolverRef.current) resolverRef.current(ok);
        resolverRef.current = null;
    };

    return (
        <AlertDialogContext.Provider value={confirm}>
            {children}
            <AlertDialog.Root open={open} onOpenChange={(isOpen) => !isOpen && handleClose(false)}>
                <AlertDialog.Portal>
                    {/* Overlay */}
                    <AlertDialog.Overlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50" />

                    {/* Content */}
                    <AlertDialog.Content className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-1/2 left-1/2 z-50 w-full max-w-120 -translate-x-1/2 -translate-y-1/2 rounded-xl border border-gray-200 bg-white p-6 shadow-lg duration-200">
                        {/* Header */}
                        <div className="space-y-1.5">
                            {/* Title */}
                            <AlertDialog.Title className="text-base font-semibold text-gray-900">
                                {title}
                            </AlertDialog.Title>

                            {/* Description */}
                            <AlertDialog.Description className="text-sm leading-relaxed font-normal text-gray-600">
                                {message}
                            </AlertDialog.Description>
                        </div>

                        {/* Buttons */}
                        <div className="mt-5 flex items-center justify-end gap-3">
                            {/* Cancel button */}
                            <AlertDialog.Cancel asChild>
                                <button
                                    type="button"
                                    aria-label="Cancel"
                                    onClick={() => handleClose(false)}
                                    className="rounded-10 border border-[#E6E6E6] bg-white px-3.75 py-2.25 text-sm font-medium text-gray-900 hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none">
                                    {cancelText}
                                </button>
                            </AlertDialog.Cancel>

                            {/* Confirm button */}
                            <AlertDialog.Action asChild>
                                <button
                                    type="button"
                                    aria-label="Confirm"
                                    onClick={() => handleClose(true)}
                                    className="rounded-10 bg-blue-500 px-3.75 py-2.25 text-sm font-medium text-white hover:bg-blue-600 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none">
                                    {confirmText}
                                </button>
                            </AlertDialog.Action>
                        </div>
                    </AlertDialog.Content>
                </AlertDialog.Portal>
            </AlertDialog.Root>
        </AlertDialogContext.Provider>
    );
};

/** Alert dialog hook */
export const useAlertDialog = () => {
    const context = useContext(AlertDialogContext);
    if (!context) throw new Error("useAlertDialog must be inside AlertDialogProvider");
    return context;
};
