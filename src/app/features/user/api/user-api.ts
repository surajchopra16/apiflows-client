/** Imported modules */
import type { CurrentUser } from "../store/user-store.ts";
import { env } from "../../../../env.ts";

/** User data type */
type UserData = { email: string; password: string };

/** User response type */
type UserResponse = { role: "user" | "guest"; _id: string; email: string; createdAt: string };

/**
 * ==================== User API ====================>
 */

/** Get the current user status */
const status = async (): Promise<CurrentUser> => {
    try {
        const response = await fetch(`${env.HOST_URL}/api/v1/users/status`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include"
        });
        const result = await response.json();

        if (!response.ok) throw new Error(result.message || "Failed to get user status");

        return result.data.user as CurrentUser;
    } catch (err) {
        console.error("Error getting user status:", err);
        return null;
    }
};

/** Login the guest user */
const guest = async (): Promise<UserResponse> => {
    try {
        const response = await fetch(`${env.HOST_URL}/api/v1/users/guest`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include"
        });
        const result = await response.json();

        if (!response.ok) throw new Error(result.message || "Failed to login as guest");

        return result.data.user;
    } catch (err) {
        console.error("Error logging in as guest:", err);
        throw err;
    }
};

/** Signup the user */
const signup = async (data: UserData): Promise<UserResponse> => {
    try {
        const response = await fetch(`${env.HOST_URL}/api/v1/users/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(data)
        });
        const result = await response.json();

        if (!response.ok) throw new Error(result.message || "Failed to signup");

        return result.data.user;
    } catch (err) {
        console.error("Error signing up:", err);
        throw err;
    }
};

/** Login the user */
const login = async (data: UserData): Promise<UserResponse> => {
    try {
        const response = await fetch(`${env.HOST_URL}/api/v1/users/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(data)
        });
        const result = await response.json();

        if (!response.ok) throw new Error(result.message || "Failed to login");

        return result.data.user;
    } catch (err) {
        console.error("Error logging in:", err);
        throw err;
    }
};

/** Logout the user */
const logout = async (): Promise<void> => {
    try {
        const response = await fetch(`${env.HOST_URL}/api/v1/users/logout`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            credentials: "include"
        });
        const result = await response.json();

        if (!response.ok) throw new Error(result.message || "Failed to logout");
    } catch (err) {
        console.error("Error logging out:", err);
        throw err;
    }
};

export const userAPI = { status, guest, signup, login, logout };
