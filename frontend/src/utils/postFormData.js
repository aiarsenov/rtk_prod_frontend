import { getCsrfHeaders } from './csrf.js';

async function postFormData(method = "POST", url = "", data = {}) {
    try {
        const response = await fetch(url, {
            method,
            body: data,
            headers: {
                ...getCsrfHeaders(),
            },
            credentials: "include",
            withCredentials: true,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`${errorData.err || "Unknown Error"}`);
        }

        return await response.json();
    } catch (error) {
        if (error.name === "AbortError") {
            console.log("Request was aborted");
        } else {
            console.error("Fetch error:", error);
            throw error;
        }
    }
}

export default postFormData;
