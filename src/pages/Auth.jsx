import { useEffect, useState } from "react";
import { fetchUsernames as fetchUsernames } from "../utils/http.js";
import { Login } from "../components/Login.jsx";
import { Register } from "../components/Register.jsx";

export default function Auth() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({ message: "" });
    const [usernames, setUsernames] = useState([]);
    const [switchForms, setSwitchForms] = useState("login");

    useEffect(() => {
        setLoading(true);
        try {
            const getUsernames = async () => {
                const fetchedUsernames = await fetchUsernames();
                console.log(fetchedUsernames);
                if (!fetchedUsernames.ok) {
                    setError({ message: fetchedUsernames.message });
                    setLoading(false);
                    return;
                }
                setUsernames(fetchedUsernames.usernames);
                setLoading(false);
            };

            getUsernames();
        } catch (err) {
            setError({
                message: err.message || "Error!! Please try again later",
            });
            setLoading(false);
        }
    }, []);

    function showUsers() {
        console.log(usernames);
    }

    function handleSwitchForms(form) {
        setSwitchForms(form);
    }

    return (
        <div className="">
            <h2>An app to manage all employee credentials</h2>

            {loading ? (
                <p>Loading...</p>
            ) : error.message === "" ? (
                <>
                    {switchForms === "login" ? (
                        <Login onFormSwitch={handleSwitchForms} />
                    ) : (
                        <Register
                            users={usernames}
                            onFormSwitch={handleSwitchForms}
                        />
                    )}

                    <button onClick={showUsers}>Show Usernames</button>
                </>
            ) : (
                <p>{error.message}</p>
            )}
        </div>
    );
}
