/** Base URL for the API */
const BASE_URL = "http://localhost:8080";

/** User data type */
type UserData = { email: string; password: string };

/** User response type */
type UserResponse = { _id: string; email: string; createdAt: string };

/** Login the user */
const login = async (data: UserData): Promise<UserResponse> => {
    try {
        const response = await fetch(`${BASE_URL}/api/v1/users/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
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

/** Signup the user */
const signup = async (data: UserData): Promise<UserResponse> => {
    try {
        const response = await fetch(`${BASE_URL}/api/v1/users/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
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

export const userAPI = { login, signup };
