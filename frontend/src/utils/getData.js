async function getData(url = "", options = {}) {
    const { headers = {}, params = {} } = options;

    const queryString = new URLSearchParams(params).toString();
    const fullUrl = queryString ? `${url}?${queryString}` : url;

    try {
        const response = await fetch(fullUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                ...headers,
            },
            credentials: "include",
            withCredentials: true,
        });

        if (!response.ok) {
            const error = new Error("Ошибка сервера");
            error.status = response.status;
            throw error;
        }

        return {
            status: response.status,
            data: await response.json(),
        };
    } catch (error) {
        if (error.status === undefined && error.response) {
            error.status = error.response.status;
        }
        console.error("Ошибка получения данных: " + error);
        throw error;
    }
}

export default getData;
