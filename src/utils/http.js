let API_URL = process.env.REACT_APP_API_URL;
API_URL = process.env.REACT_APP_LOCAL_API_URL;

export const fetchUsers = async () => {
    const response = await fetch(`${API_URL}/users`);
    if (!response.ok) {
        return { message: "Error!! Please try again later", ok: false };
    }
    const data = await response.json();

    return { users: data.users, ok: true };
};
