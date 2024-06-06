import { Unauthorised } from "../components/Unauthorised";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { handleFetchDivision } from "../utils/http";
import { Loading } from "../components/Loading";
import { Error } from "../components/Error";
import { Users } from "./Users";
import { Button } from "../components/Button";
import { Credentials } from "./Credentials";

export const Dashboard = () => {
    const storedToken = localStorage.getItem("token");
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState({ message: "" });
    const [fetchedDivision, setFetchedDivision] = useState([]);

    useEffect(() => {
        const getDivision = async () => {
            const divisionInfo = await handleFetchDivision(storedToken);
            console.log(divisionInfo);
            setFetchedDivision(divisionInfo);
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

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    const handleShowProfile = (userId) => {
        console.log(userId);
        navigate(`/user/${userId}/profile`);
    };

    if (!storedToken) return <Unauthorised />;

    return (
        <div>
            {loading ? (
                <Loading loadingMessage="Loading..." />
            ) : error.message === "" ? (
                <>
                    <nav className="flex gap-2 mb-4 justify-center">
                        {fetchedDivision.currentUser.roles.includes(
                            "admin"
                        ) && <Button style="primary">Requested Users</Button>}
                        <Button
                            style="primary"
                            onClick={() =>
                                handleShowProfile(
                                    fetchedDivision.currentUser._id
                                )
                            }>
                            Profile
                        </Button>
                        <Button onClick={handleLogout} style="secondary">
                            Logout
                        </Button>
                    </nav>
                    {fetchedDivision.currentUser.division === null ? (
                        <>No Division</>
                    ) : undefined}
                    {fetchedDivision.currentUser.division !== null &&
                    fetchedDivision.currentUser.roles.length === 1
                        ? navigate(
                              `/user/${fetchedDivision.currentUser._id}/credentials?division=${fetchedDivision.currentUser.division}&home=true`
                          )
                        : undefined}
                    {fetchedDivision.currentUser.division !== null &&
                    fetchedDivision.currentUser.roles.length > 1 ? (
                        <Users otherUsers={fetchedDivision.otherUsers} />
                    ) : undefined}
                </>
            ) : (
                <Error>{error.message}</Error>
            )}
        </div>
    );
};
