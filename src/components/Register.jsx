import { useState } from "react";
import { handleRegisterUser } from "../utils/http.js";
import {
    usernameExists,
    isEqualsToOtherValue,
    hasMinLength,
} from "../utils/validation.js";
import Input from "./Input.jsx";
import { Button } from "./Button.jsx";

export const Register = ({ handleChangeCurForm, fetchedUsernames }) => {
    const [afterSubmitMessage, setAfterSubmitMessage] = useState({
        message: "",
        ok: null,
    });
    const [enteredValues, setEnteredValues] = useState({
        password: "",
        confirmedPassword: "",
        username: "",
    });
    const [didEdit, setDidEdit] = useState({
        password: "",
        confirmedPassword: "",
        username: "",
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

    const handleSubmit = (event) => {
        event.preventDefault();
        const fd = new FormData(event.target);
        const formData = Object.fromEntries(fd.entries());
        console.log(formData);

        async function callHandleRegisterUser() {
            const requestOutcome = await handleRegisterUser(formData);
            if (requestOutcome.ok) {
                document.getElementById("register-form").reset();
                localStorage.setItem(
                    "enteredUsername",
                    requestOutcome.username
                );
                setTimeout(() => {
                    handleChangeCurForm("login");
                }, 2000);
                setTimeout(() => {
                    localStorage.removeItem("enteredUsername");
                }, 10000);
            }

            setAfterSubmitMessage(requestOutcome);
            setTimeout(() => {
                setAfterSubmitMessage({
                    message: "",
                    ok: null,
                });
            }, 3000);
        }

        callHandleRegisterUser();
    };

    // form error handling validation
    const usernameInvalid =
        didEdit.username &&
        usernameExists(fetchedUsernames, enteredValues.username);

    const passwordsDontMatch =
        didEdit.confirmedPassword &&
        !isEqualsToOtherValue(
            enteredValues.password,
            enteredValues.confirmedPassword
        );

    const passwordTooShort =
        didEdit.password && !hasMinLength(enteredValues.password, 8);

    let messageStyles = "text-sm flex items-center pl-2";

    if (afterSubmitMessage.ok === false) messageStyles += " text-red-500 ";
    if (afterSubmitMessage.ok === true) messageStyles += " text-green-500";

    // code for debugging
    // function showMessage() {
    //     console.log(afterSubmitMessage);
    //     console.log(fetchedUsernames);
    // }

    return (
        <>
            <h2 className="text-xl text-center mb-3">Create an account</h2>
            <div className="flex justify-center mb-4">
                <form
                    onSubmit={handleSubmit}
                    id="register-form"
                    className="flex flex-col gap-5 rounded-md bg-gray-100 p-4 md:w-1/3 w-full">
                    <Input
                        label="Name"
                        type="text"
                        id="name"
                        name="name"
                        required
                        minLength={1}
                    />
                    <Input
                        label="Surname"
                        id="surname"
                        type="text"
                        name="surname"
                        required
                        minLength={1}
                    />
                    <Input
                        label="Username"
                        id="username"
                        type="text"
                        name="username"
                        value={enteredValues.username}
                        onChange={(event) =>
                            handleInputChange("username", event.target.value)
                        }
                        onBlur={() => handleInputBlur("username")}
                        minLength={4}
                        required
                        error={usernameInvalid && "Username exists..."}
                    />

                    <Input
                        label="Title"
                        type="text"
                        id="title"
                        name="title"
                        required
                    />

                    <Input
                        label="Password"
                        id="password"
                        type="password"
                        name="password"
                        value={enteredValues.password}
                        onChange={(event) =>
                            handleInputChange("password", event.target.value)
                        }
                        minLength={8}
                        onBlur={() => handleInputBlur("password")}
                        required
                        error={
                            passwordTooShort &&
                            "Password must be at least 8 characters"
                        }
                    />

                    <Input
                        label="Confirm Password"
                        id="confirmedPassword"
                        type="password"
                        name="confirmedPassword"
                        value={enteredValues.confirmedPassword}
                        onChange={(event) =>
                            handleInputChange(
                                "confirmedPassword",
                                event.target.value
                            )
                        }
                        onBlur={() => handleInputBlur("confirmedPassword")}
                        minLength={8}
                        required
                        error={passwordsDontMatch && "Passwords do not match"}
                    />

                    <div className="flex justify-between md:gap-2">
                        <div className={messageStyles}>
                            {afterSubmitMessage.message !== "" ? (
                                <>
                                    <p>{afterSubmitMessage.message}</p>
                                </>
                            ) : undefined}
                        </div>

                        <div className="flex md:gap-2">
                            <Button
                                type="button"
                                style="tertiary"
                                onClick={() => {
                                    document
                                        .getElementById("register-form")
                                        .reset();
                                    setEnteredValues({
                                        password: "",
                                        confirmedPassword: "",
                                        username: "",
                                    });
                                    setDidEdit({
                                        password: "",
                                        confirmedPassword: "",
                                        username: "",
                                    });
                                }}>
                                Clear
                            </Button>

                            <Button type="submit" style="primary">
                                Sign Up
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
            <div className="text-center">
                <Button
                    type="button"
                    style="secondary"
                    onClick={() => handleChangeCurForm("login")}>
                    Already have an account?
                </Button>
            </div>

            {/* Code for debugging */}
            {/* <button onClick={showMessage}>Show message outcome</button> */}
        </>
    );
};
