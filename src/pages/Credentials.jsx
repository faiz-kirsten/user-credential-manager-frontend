import { Unauthorised } from "../components/Unauthorised";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { Loading } from "../components/Loading";
import { Error } from "../components/Error";
import { Button } from "../components/Button";
import { handleFetchUserCredentials } from "../utils/http";
import { CredentialsTable } from "../components/CredentialsTable";

export const Credentials = () => {
    const storedToken = localStorage.getItem("token");
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const isHome = searchParams.get("home");
    const { id } = useParams();
    const [error, setError] = useState({ message: "" });
    const [fetchedCredentials, setFetchedCredentials] = useState([]);
    useEffect(() => {
        const userDivisionId = searchParams.get("division");
        console.log(userDivisionId);
        const getDivision = async () => {
            const divisionInfo = await handleFetchUserCredentials(
                storedToken,
                id,
                userDivisionId
            );
            console.log(divisionInfo);
            setFetchedCredentials(divisionInfo);
            setLoading(false);
        };
        try {
            getDivision();
        } catch (err) {
            setError({
                message: err.message || "Error fetching user info or users",
            });
            setLoading(false);
        }
    }, []);

    if (!storedToken)
        setTimeout(() => {
            navigate("/");
        }, 2000);

    const handleShowProfile = (userId) => {
        console.log(userId);
        navigate(`/users/${userId}/profile`);
    };

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
                    {isHome ? (
                        <>
                            <nav className="flex gap-2 mb-4 justify-center">
                                <Button
                                    style="primary"
                                    onClick={() =>
                                        handleShowProfile(
                                            fetchedCredentials.currentUser._id
                                        )
                                    }>
                                    Profile
                                </Button>
                                <Button
                                    onClick={handleLogout}
                                    style="secondary">
                                    Logout
                                </Button>
                            </nav>
                            <h2 className="text-2xl mb-2 text-center">
                                Credentials
                            </h2>
                        </>
                    ) : (
                        <>
                            <nav>
                                {" "}
                                <Button style="primary" onClick={handleGoBack}>
                                    Go Back
                                </Button>
                            </nav>
                            <h2>
                                Current User: {fetchedCredentials.user.username}
                            </h2>
                            <h3>
                                Current Division:{" "}
                                {fetchedCredentials.user.division.name}
                            </h3>
                        </>
                    )}
                    {fetchedCredentials.credentials.length > 0 ? (
                        <CredentialsTable
                            credentials={fetchedCredentials.credentials}
                        />
                    ) : (
                        <>No Available Credentials, create a credential</>
                    )}
                </>
            ) : (
                <Error>{error.message}</Error>
            )}
        </div>
    );
};
