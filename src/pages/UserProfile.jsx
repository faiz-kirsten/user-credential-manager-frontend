import { Unauthorised } from "../components/Unauthorised";
import { Loading } from "../components/Loading";
import { Error } from "../components/Error";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { handleFetchUser } from "../utils/http";
import { Button } from "../components/Button";
import { ShowUserInfo } from "../components/ShowUserInfo";

export const UserProfile = () => {
    const storedToken = localStorage.getItem("token");
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState({ message: "" });
    const [fetchedUser, setFetchedUser] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [afterSubmitMessage, setAfterSubmitMessage] = useState({
        message: "",
        ok: null,
    });
    const [enteredValues, setEnteredValues] = useState({
        password: "",
        confirmedPassword: "",
        username: "",
        requestedDivision: "default",
    });
    const [didEdit, setDidEdit] = useState({
        password: "",
        confirmedPassword: "",
        username: "",
        requestedDivision: "",
    });

    function handleInputBlur(identifier) {
        setDidEdit((prevEdit) => ({
            ...prevEdit,
            [identifier]: true,
        }));
    }

    function handleInputChange(identifier, value) {
        setEnteredValues((prevValues) => ({
            ...prevValues,
            [identifier]: value,
        }));
        setDidEdit((prevEdit) => ({
            ...prevEdit,
            [identifier]: false,
        }));
    }

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

    const handleIsEditing = () => {
        setIsEditing(!isEditing);
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
                        {}
                    </nav>
                    <div className="flex justify-center mb-4">
                        <div className="flex flex-col gap-5 rounded-md bg-gray-100 p-4 md:w-1/3 w-full">
                            {!isEditing ? (
                                <ShowUserInfo fetchedUser={fetchedUser} />
                            ) : (
                                <></>
                            )}
                            <div className="flex justify-between md:gap-2">
                                <div className=""></div>
                                <div className="flex md:gap-2">
                                    {!isEditing ? (
                                        <>
                                            <Button
                                                style="primary"
                                                onClick={handleIsEditing}>
                                                Edit
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button
                                                style="tertiary"
                                                onClick={handleIsEditing}>
                                                Cancel
                                            </Button>
                                            <Button style="primary">
                                                Save
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <Error>{error.message}</Error>
            )}
        </div>
    );
};
