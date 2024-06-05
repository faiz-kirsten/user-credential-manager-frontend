import { useEffect, useState } from "react";
import { fetchUsernames as fetchUsernames } from "../utils/http.js";
import { Login } from "../components/Login.jsx";
import { Register } from "../components/Register.jsx";

export default function Auth() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({ message: "" });
    const [usernames, setUsernames] = useState([]);
    const [curSelectedForm, setCurSelectedForm] = useState("login");

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

    function changeCurForm(form) {
        setCurSelectedForm(form);
    }

    // code for debugging
    // function showUsers() {
    //     console.log(usernames);
    // }

    return (
        <div className="">
            {loading ? (
                <p>Loading...</p>
            ) : error.message === "" ? (
                <>
                    {curSelectedForm === "login" ? (
                        <Login handleChangeCurForm={changeCurForm} />
                    ) : (
                        <Register
                            fetchedUsernames={usernames}
                            handleChangeCurForm={changeCurForm}
                        />
                    )}
                    {/* Code for debugging */}
                    {/* <button onClick={showUsers}>Show Usernames</button> */}
                </>
            ) : (
                <p>{error.message}</p>
            )}
        </div>
    );
}
