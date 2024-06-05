let API_URL = import.meta.env.VITE_API_URL;
// API_URL = import.meta.env.VITE_LOCAL_API_URL;

export const fetchUsernames = async () => {
    const response = await fetch(`${API_URL}/users/usernames`);
    if (!response.ok) {
        return {
            message:
                "Application error!! Please try again later or refresh the page.",
            ok: false,
        };
    }
    const data = await response.json();

    return { usernames: data.usernames, ok: true };
};

export const validateUser = async (formData) => {
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
    };

    const response = await fetch(`${API_URL}/login`, requestOptions);
    if (!response.ok) {
        return { message: "Invalid username or password!", ok: false };
    }
    const resData = await response.json();

    return { token: resData.token, ok: true };
};

export const handleRegisterUser = async (formData) => {
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
    };

    const response = await fetch(`${API_URL}/register`, requestOptions);
    if (!response.ok) {
        return {
            message: "Error...fix errors",
            ok: false,
        };
    }

    const resData = await response.json();

    return resData;
};
