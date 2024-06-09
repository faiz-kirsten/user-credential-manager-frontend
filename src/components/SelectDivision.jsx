import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { Loading } from "./Loading";
import { Error } from "./Error";
import { Button } from "./Button";
import { handleFetchDivisions, handleSelectDivision } from "../utils/http";

export const SelectDivision = () => {
    const storedToken = localStorage.getItem("token");
    const navigate = useNavigate();
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const requestedDivisionId = searchParams.get("requested-division");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState({ message: "" });
    const [fetchedDivisions, setFetchedDivisions] = useState([]);
    const [selectedDivision, setSelectedDivision] = useState("default");
    // console.log(requestedDivisionId);
    useEffect(() => {
        const getDivision = async () => {
            const divisions = await handleFetchDivisions(storedToken);
            console.log(divisions);
            console.log("-===-");

            setFetchedDivisions(divisions);
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

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    const handleShowProfile = (userId) => {
        console.log(userId);
        navigate(`/users/${userId}/profile`);
    };

    const callHandleSelectDivision = async (e) => {
        e.preventDefault();
        console.log(selectedDivision);
        console.log(fetchedDivisions.currentUser);
        // send currentUserId, storedToken, selectedDivision, ?selectingDivision=true
        if (selectedDivision === "default") return;
        setLoading(true);
        const body = { selectedDivision: selectedDivision, updatedUserId: id };
        const addUserToDivision = await handleSelectDivision(body, storedToken);
        console.log(addUserToDivision);
        if (addUserToDivision.success)
            setTimeout(() => {
                navigate("/dashboard");
                setLoading(false);
            }, 3000);
    };

    return (
        <div>
            {loading ? (
                <Loading loadingMessage="Loading..." />
            ) : error.message === "" ? (
                <>
                    <nav className="flex gap-2 mb-4 justify-center">
                        <Button
                            style="primary"
                            onClick={() =>
                                handleShowProfile(
                                    fetchedDivisions.currentUser._id
                                )
                            }>
                            Profile
                        </Button>
                        <Button onClick={handleLogout} style="secondary">
                            Logout
                        </Button>
                    </nav>
                    {requestedDivisionId === "null" ? (
                        <>
                            <>You are currently not in any division. </>
                            <>
                                Please select the division you need to be
                                assigned to:{" "}
                            </>
                            <form onSubmit={callHandleSelectDivision}>
                                <select
                                    onChange={(e) =>
                                        setSelectedDivision(e.target.value)
                                    }
                                    className="px-2 py-1.5"
                                    required>
                                    <option value="default">
                                        Select A Division
                                    </option>
                                    {fetchedDivisions.allDivisions.map(
                                        (division) => (
                                            <option
                                                key={division._id}
                                                value={division._id}>
                                                {division.name}
                                            </option>
                                        )
                                    )}
                                </select>
                                <Button style="primary" type="submit">
                                    Request
                                </Button>
                            </form>
                        </>
                    ) : (
                        <div className="text-xl">
                            You have requested to join the
                            {fetchedDivisions.requestedDivision.name}
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
