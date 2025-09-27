import Editor from "./components/Editor.tsx";

const Flow = () => {
    return (
        <div className="flex h-full w-full overflow-hidden rounded-xl bg-white ring ring-[#EBEBEB]">
            {/* Sidebar */}
            <div className="w-64 border-r border-[#EBEBEB] pt-4"></div>

            {/* Content */}
            <div className="flex min-w-0 flex-1 flex-col">
                <div className="h-10 w-full bg-white"></div>

                <Editor />
            </div>
        </div>
    );
};

export default Flow;
