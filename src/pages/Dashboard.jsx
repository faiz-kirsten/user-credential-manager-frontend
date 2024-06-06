import { Unauthorised } from "../components/Unauthorised";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { handleFetchDivision } from "../utils/http";
import { Loading } from "../components/Loading";
import { Error } from "../components/Error";
import { Users } from "./Users";

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

    if (!storedToken) return <Unauthorised />;

    return (
        <div>
            {loading ? (
                <Loading loadingMessage="Loading..." />
            ) : error.message === "" ? (
                <>
                    <>Sub Header</>
                    {fetchedDivision.currentUser.division === null ? (
                        <>No Division</>
                    ) : undefined}
                    {fetchedDivision.currentUser.division !== null &&
                    fetchedDivision.currentUser.roles.length === 1 ? (
                        <>Regular User</>
                    ) : undefined}
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
