/** Imported modules */
import { useState, useImperativeHandle, useRef, type FormEvent, type Ref, type FC } from "react";
import * as Dialog from "@radix-ui/react-dialog";

/** Name type */
type NameType = "collection" | "folder" | "request";

/** Rename dialog handler type */
export type RenameDialogHandler = {
    open: (options: { type: NameType; name: string }) => Promise<string | null>;
    close: () => void;
};

/** Rename dialog component */
const RenameDialog: FC<{ ref: Ref<RenameDialogHandler> }> = ({ ref }) => {
    /** States */
    const [open, setOpen] = useState(false);
    const [type, setType] = useState<NameType>("collection");
    const [oldName, setOldName] = useState("");
    const [newName, setNewName] = useState("");

    /** Refs */
    const inputRef = useRef<HTMLInputElement | null>(null);
    const resolverRef = useRef<((newName: string | null) => void) | null>(null);

    /** Expose open and close methods */
    useImperativeHandle(ref, () => ({
        open: ({ type, name }) =>
            new Promise((resolve) => {
                resolverRef.current = resolve;
                setType(type);
                setOldName(name);
                setNewName(name);
                setOpen(true);
            }),
        close: () => handleCancel()
    }));

    /** Handle save */
    const handleSave = (event: FormEvent) => {
        event.preventDefault();

        const trimmed = newName.trim();

        if (!trimmed || trimmed === oldName) resolverRef.current?.(null);
        else resolverRef.current?.(trimmed);

        setOpen(false);
    };

    /** Handle cancel */
    const handleCancel = () => {
        resolverRef.current?.(null);
        setOpen(false);
    };

    return (
        <Dialog.Root open={open} onOpenChange={(isOpen) => !isOpen && handleCancel()}>
            <Dialog.Portal>
                {/* Overlay */}
                <Dialog.Overlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50" />

                {/* Content */}
                <Dialog.Content className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-1/2 left-1/2 z-50 w-full max-w-120 -translate-x-1/2 -translate-y-1/2 rounded-xl border border-gray-200 bg-white p-6 shadow-lg duration-200">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                        {/* Title and description */}
                        <div className="space-y-1.5">
                            <Dialog.Title className="text-base font-semibold text-gray-900">
                                Rename {type}
                            </Dialog.Title>

                            <Dialog.Description className="text-sm leading-relaxed font-normal text-gray-600">
                                Enter a new name for your {type}
                            </Dialog.Description>
                        </div>

                        {/* Close icon */}
                        <button
                            type="button"
                            aria-label="Close"
                            onClick={handleCancel}
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

                    {/* Form */}
                    <form onSubmit={handleSave} className="mt-5">
                        {/* Name input */}
                        <div className="space-y-2">
                            <label
                                htmlFor="name"
                                className="block text-[13px] leading-none font-medium text-gray-900">
                                Name
                            </label>

                            <input
                                id="name"
                                ref={inputRef}
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                placeholder={`Enter ${type} name`}
                                className="rounded-10 w-full border border-gray-200 px-3 py-2.25 text-sm font-normal text-gray-900 placeholder:text-gray-500 focus-visible:border-blue-500 focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:outline-none"
                            />
                        </div>

                        {/* Cancel and Save buttons */}
                        <div className="mt-6 flex items-center justify-end gap-3">
                            <button
                                type="button"
                                aria-label="Cancel"
                                onClick={handleCancel}
                                className="rounded-10 border border-[#E6E6E6] bg-white px-3.75 py-2.25 text-sm font-medium text-gray-900 hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none">
                                Cancel
                            </button>

                            <button
                                type="submit"
                                aria-label="Save changes"
                                className="rounded-10 bg-blue-500 px-3.75 py-2.25 text-sm font-medium text-white hover:bg-blue-600 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none">
                                Save changes
                            </button>
                        </div>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export default RenameDialog;
