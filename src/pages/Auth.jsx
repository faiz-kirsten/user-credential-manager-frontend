import { useEffect, useState } from "react";
import { fetchUsers } from "../utils/http.js";

export default function Auth() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({ message: "" });
    const [users, setUsers] = useState([]);

    useEffect(() => {
        setLoading(true);
        try {
            const getUsers = async () => {
                const users = await fetchUsers();
                // console.log(users);
                if (!users.ok) {
                    setError({ message: users.message });
                    setLoading(false);
                    return;
                }
                setUsers(users.users);
                setLoading(false);
            };

            getUsers();
        } catch (err) {
            setError({
                message: err.message || "Error!! Please try again later",
            });
            setLoading(false);
        }
    }, []);

    function showUsers() {
        console.log(users);
    }

    return (
        <div>
            <h2 className="text-4xl bg-stone-600 ">
                An app to manage all employee credentials
            </h2>

            {loading ? (
                <p className="text-4xl">Loading...</p>
            ) : error.message === "" ? (
                <>
                    <p>Users</p>
                    <button className="bg-red-600" onClick={showUsers}>
                        Show Users
                    </button>
                </>
            ) : (
                <p>{error.message}</p>
            )}
        </div>
    );
}
