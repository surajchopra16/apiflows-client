/** Imported modules */
import { useState, useImperativeHandle, useRef, type FC, type Ref } from "react";
import * as Dialog from "@radix-ui/react-dialog";

/** Action type */
type Action = "dont_save" | "cancel" | "save";

/** Save dialog handler type */
export type SaveDialogHandler = {
    open: () => Promise<Action>;
    close: () => void;
};

/** Save dialog component */
const SaveDialog: FC<{ ref: Ref<SaveDialogHandler> }> = ({ ref }) => {
    /** States */
    const [open, setOpen] = useState(false);

    /** Resolver ref */
    const resolverRef = useRef<((action: Action) => void) | null>(null);

    /** Expose open and close methods */
    useImperativeHandle(ref, () => ({
        open: () =>
            new Promise((resolve) => {
                resolverRef.current = resolve;
                setOpen(true);
            }),
        close: () => closeWithResult("cancel")
    }));

    /** Close with result */
    const closeWithResult = (action: Action) => {
        setOpen(false);
        if (resolverRef.current) resolverRef.current(action);
        resolverRef.current = null;
    };

    return (
        <Dialog.Root open={open} onOpenChange={(isOpen) => !isOpen && closeWithResult("cancel")}>
            <Dialog.Portal>
                {/* Overlay */}
                <Dialog.Overlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50" />

                {/* Content */}
                <Dialog.Content className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-1/2 left-1/2 z-50 w-full max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-xl border border-gray-200 bg-white p-6 shadow-xl duration-200">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                        {/* Title and description */}
                        <div className="space-y-1.5">
                            <Dialog.Title className="text-base font-semibold text-gray-900">
                                DO YOU WANT TO SAVE?
                            </Dialog.Title>

                            <Dialog.Description className="text-sm leading-normal font-normal text-gray-600">
                                This tab has unsaved changes which will be lost if you choose to
                                close it. Save these changes to avoid losing your work
                            </Dialog.Description>
                        </div>

                        {/* Close icon */}
                        <button
                            type="button"
                            aria-label="Close"
                            onClick={() => closeWithResult("cancel")}
                            className="shrink-0 rounded-md bg-white p-1 text-gray-600 hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none">
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M17 7L7 17M7 7L17 17"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Buttons */}
                    <div className="mt-6 flex items-center justify-between gap-3">
                        {/* Don't save button */}
                        <button
                            type="button"
                            aria-label="Don't save"
                            onClick={() => closeWithResult("dont_save")}
                            className="rounded-10 bg-[#F2F2F2] px-3.75 py-2.25 text-sm font-medium text-gray-900 hover:bg-zinc-200 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none">
                            Don't save
                        </button>

                        <div className="flex items-center gap-3">
                            {/* Cancel button */}
                            <button
                                type="button"
                                aria-label="Cancel"
                                onClick={() => closeWithResult("cancel")}
                                className="rounded-10 border border-[#E6E6E6] bg-white px-3.75 py-2.25 text-sm font-medium text-gray-900 hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none">
                                Cancel
                            </button>

                            {/* Save changes button */}
                            <button
                                type="button"
                                aria-label="Save changes"
                                onClick={() => closeWithResult("save")}
                                className="rounded-10 bg-blue-500 px-3.75 py-2.25 text-sm font-medium text-white hover:bg-blue-600 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none">
                                Save changes
                            </button>
                        </div>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export default SaveDialog;
