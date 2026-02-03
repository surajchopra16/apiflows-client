/** Imported modules */
import { Home, ChevronRight, LogOut, User } from "lucide-react";
import { DropdownMenu } from "radix-ui";
import { useUserStore } from "../../features/user/store/user-store.ts";
import { Link, useNavigate } from "react-router";
import { userAPI } from "../../features/user/api/user-api.ts";
import { useLoadingOverlay } from "../overlays/LoadingOverlayProvider.tsx";
import { toast } from "sonner";

/** Header component */
const Header = () => {
    /** Hook */
    const navigate = useNavigate();
    const { user, clearUser } = useUserStore();
    const { showLoading, hideLoading } = useLoadingOverlay();

    /** Handler the logout */
    const handleLogout = async () => {
        showLoading();
        try {
            await userAPI.logout();
            clearUser();
            toast.success("Logged out successfully");
            navigate("/login");
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to logout";
            toast.error(message);
        } finally {
            hideLoading();
        }
    };

    return (
        <nav className="flex h-10 w-full items-center">
            <div className="flex flex-1 items-center justify-between px-2 py-1 sm:px-3">
                {/* Left section */}
                <div className="flex items-center">
                    {/* Home link */}
                    <Link to="/" className="group flex items-center gap-1.5 focus:outline-none">
                        <Home
                            width="14"
                            height="14"
                            className="mb-0.25 shrink-0 text-gray-500 transition-colors group-hover:text-gray-900"
                        />

                        <span className="inline text-xs font-medium text-gray-500 transition-colors group-hover:text-gray-900">
                            Home
                        </span>
                    </Link>

                    {/* Separator */}
                    <ChevronRight className="mx-2 h-3 w-3 flex-shrink-0 text-gray-300" />

                    {/* APIs */}
                    <span className="truncate text-xs font-semibold text-gray-900">APIs</span>
                </div>

                {/* Right section */}
                <div className="pr-1">
                    {/* Account dropdown */}
                    <DropdownMenu.Root>
                        <DropdownMenu.Trigger asChild>
                            <button className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-gray-600 transition-all duration-200 hover:border-gray-300 hover:text-gray-800 focus:outline-none">
                                <User width="15" height="15" />
                            </button>
                        </DropdownMenu.Trigger>

                        <DropdownMenu.Portal>
                            <DropdownMenu.Content
                                align="end"
                                sideOffset={8}
                                alignOffset={-6}
                                className="animate-in fade-in zoom-in-95 slide-in-from-top-2 z-50 min-w-[220px] overflow-hidden rounded-xl border border-[#EBEBEB] bg-white p-1 shadow-xl shadow-gray-200/60">
                                {user?.email && (
                                    <>
                                        <div className="space-y-0.5 px-2.5 py-2">
                                            <p className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
                                                Signed in as
                                            </p>
                                            <p className="truncate text-sm font-medium text-gray-900">
                                                {user.email}
                                            </p>
                                        </div>

                                        <DropdownMenu.Separator className="my-1 h-px bg-gray-100" />
                                    </>
                                )}

                                {/* Log out button */}
                                <DropdownMenu.Item
                                    onSelect={handleLogout}
                                    className="group flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-gray-600 transition-colors outline-none hover:bg-red-50 hover:text-red-600 data-[highlighted]:bg-red-50 data-[highlighted]:text-red-600">
                                    <LogOut className="h-3.5 w-3.5 text-gray-400 transition-colors group-hover:text-red-600 group-focus:text-red-600 group-data-[highlighted]:text-red-600" />
                                    <span>Log out</span>
                                </DropdownMenu.Item>
                            </DropdownMenu.Content>
                        </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                </div>
            </div>
        </nav>
    );
};

export default Header;
