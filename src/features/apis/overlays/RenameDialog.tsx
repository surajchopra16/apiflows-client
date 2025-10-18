/** Imported modules */
import { useState, useImperativeHandle, useRef, type FormEvent, type Ref, type FC } from "react";
import * as Dialog from "@radix-ui/react-dialog";

/** Rename dialog handler type */
export type RenameDialogHandler = {
    open: (options: {
        type: "collection" | "folder" | "request";
        name: string;
        onConfirm: (newName: string | null) => void;
    }) => void;
    close: () => void;
};

/** Rename dialog component */
const RenameDialog: FC<{ ref: Ref<RenameDialogHandler> }> = ({ ref }) => {
    /** States */
    const [open, setOpen] = useState(false);
    const [type, setType] = useState<"collection" | "folder" | "request">("collection");
    const [oldName, setOldName] = useState("");
    const [newName, setNewName] = useState("");

    /** Refs */
    const inputRef = useRef<HTMLInputElement | null>(null);
    const onConfirmRef = useRef<((newName: string | null) => void) | null>(null);

    /** Expose open and close methods */
    useImperativeHandle(ref, () => ({
        open: ({ type, name, onConfirm }) => {
            setType(type);
            setOldName(name);
            setNewName(name);
            onConfirmRef.current = onConfirm;
            setOpen(true);
        },
        close: () => setOpen(false)
    }));

    /** Handle save */
    const handleSave = (event: FormEvent) => {
        event.preventDefault();

        const trimmed = newName.trim();

        if (!trimmed || trimmed === oldName) onConfirmRef.current?.(null);
        else onConfirmRef.current?.(trimmed);

        setOpen(false);
    };

    /** Handle cancel */
    const handleCancel = () => {
        onConfirmRef.current?.(null);
        setOpen(false);
    };

    /** Handle open change */
    const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen) onConfirmRef.current?.(null);
        setOpen(isOpen);
    };

    return (
        <Dialog.Root open={open} onOpenChange={handleOpenChange}>
            <Dialog.Portal>
                {/* Overlay */}
                <Dialog.Overlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50" />

                {/* Content */}
                <Dialog.Content
                    onOpenAutoFocus={(event) => event.preventDefault()}
                    className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-1/2 left-1/2 z-50 w-full max-w-120 -translate-x-1/2 -translate-y-1/2 rounded-xl border border-gray-200 bg-white p-6 shadow-lg duration-200">
                    {/* Header */}
                    <div className="space-y-2">
                        <Dialog.Title className="text-base leading-none font-semibold text-gray-900">
                            Rename {type}
                        </Dialog.Title>

                        <Dialog.Description className="text-sm leading-relaxed font-normal text-gray-600">
                            Enter a new name for your {type}
                        </Dialog.Description>
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
                                className="rounded-10 h-10 w-full border border-gray-200 px-3 py-2 text-sm font-normal text-gray-900 shadow-xs placeholder:text-gray-500 focus-visible:border-0 focus-visible:ring-2 focus-visible:ring-blue-600/90 focus-visible:outline-none"
                            />
                        </div>

                        {/* Cancel and Save buttons */}
                        <div className="mt-6 flex items-center justify-end gap-3">
                            <button
                                type="button"
                                aria-label="Cancel"
                                onClick={handleCancel}
                                className="rounded-10 inline-flex h-10 items-center justify-center border border-gray-200 px-4 py-2 text-sm font-medium text-gray-900 shadow-xs hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-blue-600/90 focus-visible:outline-none">
                                Cancel
                            </button>

                            <button
                                type="submit"
                                aria-label="Save changes"
                                className="rounded-10 inline-flex h-10 items-center justify-center bg-blue-500 px-4 py-2 text-sm font-medium text-white shadow-xs hover:bg-blue-600 focus-visible:ring-2 focus-visible:ring-blue-600/90 focus-visible:outline-none">
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
