import { Unauthorised } from "../components/Unauthorised";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { handleFetchDivision } from "../utils/http";
import { Loading } from "../components/Loading";
import { Error } from "../components/Error";
import { Users } from "./Users";
import { Button } from "../components/Button";

export const Dashboard = () => {
    const storedToken = localStorage.getItem("token");
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState({ message: "" });
    const [fetchedDivision, setFetchedDivision] = useState([]);
    const [showRequestedUsers, setShowRequestedUsers] = useState(false);

    useEffect(() => {
        const getDivision = async () => {
            const divisionInfo = await handleFetchDivision(storedToken);
            console.log(divisionInfo);
            console.log("-===-");

            if (
                divisionInfo.currentUser.division !== null &&
                divisionInfo.currentUser.roles.length === 1
            ) {
                navigate(
                    `/users/${divisionInfo.currentUser._id}/credentials?division=${divisionInfo.currentUser.division}&home=true`
                );
            }

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
        navigate(`/users/${userId}/profile`);
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
                        ) && (
                            <Button
                                style="primary"
                                onClick={() =>
                                    setShowRequestedUsers(
                                        (prevState) => !prevState
                                    )
                                }>
                                {showRequestedUsers
                                    ? "Hide Requested"
                                    : "Show Requested"}
                            </Button>
                        )}
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
                    {fetchedDivision.currentUser.division !== null &&
                    fetchedDivision.currentUser.roles.includes("admin") ? (
                        <>
                            {!showRequestedUsers ? (
                                <Users users={fetchedDivision.otherUsers} />
                            ) : (
                                <>
                                    {fetchedDivision.requestedUsers.length >
                                    0 ? (
                                        <Users
                                            users={
                                                fetchedDivision.requestedUsers
                                            }
                                            showRequestedUsers={true}
                                        />
                                    ) : (
                                        <div className="text-xl">
                                            There are no users requesting to
                                            join the division
                                        </div>
                                    )}
                                </>
                            )}
                        </>
                    ) : undefined}

                    {fetchedDivision.currentUser.division !== null &&
                    !fetchedDivision.currentUser.roles.includes("admin") &&
                    fetchedDivision.currentUser.roles.includes("management") ? (
                        <Users users={fetchedDivision.otherUsers} />
                    ) : undefined}

                    {fetchedDivision.currentUser.division === null &&
                        fetchedDivision.currentUser.requestedDivision !==
                            null && (
                            <div className="text-xl">
                                You have requested to join the{" "}
                                {
                                    fetchedDivision.currentUser
                                        .requestedDivision.name
                                }{" "}
                                division. Please wait until an admin grants you
                                access.
                            </div>
                        )}
                </>
            ) : (
                <Error>{error.message}</Error>
            )}
        </div>
    );
};
