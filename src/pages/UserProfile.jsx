import { Unauthorised } from "../components/Unauthorised";
import { Loading } from "../components/Loading";
import { Error } from "../components/Error";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
    fetchUsernames,
    handleFetchDivisions,
    handleFetchUser,
    updateUser,
} from "../utils/http";
import { Button } from "../components/Button";
import { ShowUserInfo } from "../components/ShowUserInfo";
import Input from "../components/Input";
import {
    usernameExists,
    isEqualsToOtherValue,
    hasMinLength,
} from "../utils/validation.js";

export const UserProfile = () => {
    const storedToken = localStorage.getItem("token");
    const navigate = useNavigate();
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [error, setError] = useState({ message: "" });
    const [fetchedUser, setFetchedUser] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [fetchedUsernames, setFetchedUsernames] = useState([]);
    const [fetchedDivisions, setFetchedDivisions] = useState([]);
    const [afterSubmitMessage, setAfterSubmitMessage] = useState({
        message: "",
        ok: null,
    });
    const [enteredValues, setEnteredValues] = useState({
        previousPassword: "",
        updatedPassword: "",
        username: "",
        name: "",
        surname: "",
        title: "",
        division: "",
        requestedDivision: "",
    });

    const [didEdit, setDidEdit] = useState({
        previousPassword: "",
        updatedPassword: "",
        username: "",
        name: "",
        surname: "",
        title: "",
        division: "",
        requestedDivision: "",
    });
    const isCurrentUser = searchParams.get("currentUser");

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

            // setform values
            setEnteredValues((prevEdit) => ({
                ...prevEdit,
                username: user.username,
                name: user.name,
                surname: user.surname,
                title: user.title,
                division: user.division._id,
            }));

            const fetchedUsernames = await fetchUsernames();
            setFetchedUsernames(
                fetchedUsernames.usernames.filter(
                    (username) => username !== user.username
                )
            );
            const divisions = await handleFetchDivisions();
            console.log(divisions);
            console.log("-===-");

            setFetchedDivisions(divisions);
            console.log(fetchedUsernames);
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
    }, [isEditing]);

    const handleGoBack = () => {
        navigate("/dashboard");
    };

    const handleIsEditing = () => {
        setIsEditing(!isEditing);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        // setLoading(true);
        const fd = new FormData(event.target);
        const formData = Object.fromEntries(fd.entries());
        console.log(formData);
        if (
            fetchedUsernames.includes(formData.username) ||
            (formData.previousPassword !== "" &&
                formData.updatedPassword === "" &&
                formData.updatedPassword.length < 8) ||
            (formData.previousPassword === "" &&
                formData.updatedPassword !== "")
        ) {
            console.log("Invalid");
            return;
        }
        const updatedUser = await updateUser(
            {
                userId: id,
                properties: formData,
            },
            isCurrentUser,
            storedToken
        );

        setAfterSubmitMessage({
            ok: updatedUser.ok,
            message: updatedUser.message,
        });
        setTimeout(() => {
            setAfterSubmitMessage({
                message: "",
                ok: null,
            });
        }, 2000);

        console.log(updatedUser);
        if (updatedUser.ok) {
            setTimeout(() => {
                navigate("/dashboard");
            }, 1000);
        }
    };

    const handleUpdateUser = async (userId, formData) => {
        // setLoading(true);
        // console.log(isCurrentUser);
        // navigate(0);
        // setLoading(false);
    };

    // form error handling validation
    const checkIfValidUsername =
        didEdit.username &&
        usernameExists(fetchedUsernames, enteredValues.username);

    const checkIfPasswordTooShort =
        didEdit.updatedPassword &&
        !hasMinLength(enteredValues.updatedPassword, 8);

    const checkIfDivisionWasSelected =
        didEdit.requestedDivision &&
        enteredValues.requestedDivision === "default";

    let messageStyles = "text-sm flex items-center pl-2";
    if (afterSubmitMessage.ok === false) messageStyles += " text-red-500 ";
    if (afterSubmitMessage.ok === true) messageStyles += " text-green-500";

    let inputErrorStyles = "w-full h-10 px-2 rounded";
    if (checkIfDivisionWasSelected) {
        inputErrorStyles += " border border-red-500 border-solid";
    }

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
                        {!isEditing ? (
                            <div className="flex flex-col gap-5 rounded-md bg-gray-100 p-4 md:w-1/3 w-full">
                                <ShowUserInfo fetchedUser={fetchedUser} />
                                <div className="flex md:gap-2 justify-between">
                                    <div></div>
                                    <>
                                        <Button
                                            style="primary"
                                            onClick={handleIsEditing}>
                                            Edit
                                        </Button>
                                    </>
                                </div>
                            </div>
                        ) : (
                            <form
                                onSubmit={handleSubmit}
                                id="profile-update-form"
                                className="flex flex-col gap-5 rounded-md bg-gray-100 p-4 md:w-1/3 w-full">
                                <Input
                                    label="Username"
                                    id="username"
                                    type="text"
                                    name="username"
                                    minLength={4}
                                    placeholder={fetchedUser.username}
                                    value={enteredValues.username}
                                    onChange={(event) =>
                                        handleInputChange(
                                            "username",
                                            event.target.value
                                        )
                                    }
                                    onBlur={() => handleInputBlur("username")}
                                    required
                                    error={
                                        checkIfValidUsername &&
                                        "Username exists..."
                                    }
                                />
                                <Input
                                    label="Name"
                                    type="text"
                                    id="name"
                                    name="name"
                                    minLength={2}
                                    placeholder={fetchedUser.name}
                                    value={enteredValues.name}
                                    onChange={(event) =>
                                        handleInputChange(
                                            "name",
                                            event.target.value
                                        )
                                    }
                                    required
                                />
                                <Input
                                    label="Surname"
                                    id="surname"
                                    type="text"
                                    name="surname"
                                    minLength={1}
                                    placeholder={fetchedUser.surname}
                                    value={enteredValues.surname}
                                    onChange={(event) =>
                                        handleInputChange(
                                            "surname",
                                            event.target.value
                                        )
                                    }
                                    required
                                />

                                <Input
                                    label="Title"
                                    type="text"
                                    id="title"
                                    name="title"
                                    placeholder={fetchedUser.title}
                                    value={enteredValues.title}
                                    minLength={1}
                                    onChange={(event) =>
                                        handleInputChange(
                                            "title",
                                            event.target.value
                                        )
                                    }
                                    required
                                />

                                {isCurrentUser === "false" && (
                                    <>
                                        <div className="grid gap-1.5">
                                            <label
                                                htmlFor="division"
                                                className="text-gray-700">
                                                Division
                                            </label>
                                            <select
                                                className={inputErrorStyles}
                                                required
                                                id="division"
                                                name="division"
                                                value={enteredValues.division}
                                                onChange={(event) =>
                                                    handleInputChange(
                                                        "division",
                                                        event.target.value
                                                    )
                                                }
                                                onBlur={() =>
                                                    handleInputBlur("division")
                                                }>
                                                <option value="default">
                                                    Select A Division
                                                </option>
                                                {fetchedDivisions.allDivisions.map(
                                                    (division) => (
                                                        <option
                                                            key={division._id}
                                                            value={
                                                                division._id
                                                            }>
                                                            {division.name}
                                                        </option>
                                                    )
                                                )}
                                            </select>
                                            <div className="">
                                                {checkIfDivisionWasSelected && (
                                                    <p>
                                                        Please select a division
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                )}

                                <Input
                                    label="Enter Previous Password"
                                    id="previousPassword"
                                    type="password"
                                    name="previousPassword"
                                    value={enteredValues.previousPassword}
                                    onChange={(event) =>
                                        handleInputChange(
                                            "previousPassword",
                                            event.target.value
                                        )
                                    }
                                    onBlur={() =>
                                        handleInputBlur("previousPassword")
                                    }
                                />
                                <Input
                                    label="Updated Password"
                                    id="updatedPassword"
                                    type="password"
                                    name="updatedPassword"
                                    value={enteredValues.updatedPassword}
                                    onChange={(event) =>
                                        handleInputChange(
                                            "updatedPassword",
                                            event.target.value
                                        )
                                    }
                                    minLength={8}
                                    onBlur={() =>
                                        handleInputBlur("updatedPassword")
                                    }
                                    error={
                                        checkIfPasswordTooShort &&
                                        enteredValues.previousPassword !== "" &&
                                        "Password must be at least 8 characters"
                                    }
                                />

                                <div className="flex justify-between md:gap-2">
                                    <div className={messageStyles}>
                                        {afterSubmitMessage.message !== "" ? (
                                            <p>{afterSubmitMessage.message}</p>
                                        ) : undefined}
                                    </div>
                                    <div className="flex md:gap-2">
                                        {isEditing && (
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
                            </form>
                        )}
                    </div>
                </>
            ) : (
                <Error>{error.message}</Error>
            )}
        </div>
    );
};
