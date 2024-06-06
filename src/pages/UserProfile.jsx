import { Unauthorised } from "../components/Unauthorised";
import { Loading } from "../components/Loading";
import { Error } from "../components/Error";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { handleFetchUser } from "../utils/http";
import { Button } from "../components/Button";

export const UserProfile = () => {
    const storedToken = localStorage.getItem("token");
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState({ message: "" });
    const [fetchedUser, setFetchedUser] = useState([]);

    if (!storedToken)
        setTimeout(() => {
            navigate("/");
        }, 2000);

    useEffect(() => {
        const getUser = async () => {
            const user = await handleFetchUser(storedToken, id);
            console.log(user);
            setFetchedUser(user);
            setLoading(false);
        };
        try {
            getUser();
        } catch (err) {
            setError({
                message: err.message || "Error fetching user info or users",
            });
            setLoading(false);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    const handleGoBack = () => {
        navigate("/dashboard");
    };

    if (!storedToken) return <Unauthorised />;
    return (
        <div>
            {loading ? (
                <Loading loadingMessage="Loading..." />
            ) : error.message === "" ? (
                <>
                    <nav className="flex gap-2 mb-4 justify-center">
                        <Button style="primary" onClick={handleGoBack}>
                            Go Back
                        </Button>
                        <Button onClick={handleLogout} style="secondary">
                            Logout
                        </Button>
                    </nav>
                    <>{fetchedUser.username}</>
                </>
            ) : (
                <Error>{error.message}</Error>
            )}
        </div>
    );
};
