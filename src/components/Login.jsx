import { useState } from "react";
import { validateUser } from "../utils/http";
import { useNavigate } from "react-router-dom";
import Input from "./Input";
import { Button } from "./Button";

export const Login = ({ handleChangeCurForm }) => {
    const navigate = useNavigate();
    const [loggingIn, setLoggingIn] = useState(false);
    const [afterSubmitMessage, setAfterSubmitMessage] = useState({
        message: "",
    });
    const [enteredUsername, setEnteredUsername] = useState(
        localStorage.getItem("enteredUsername") !== null
            ? localStorage.getItem("enteredUsername")
            : ""
    );

    function resetState() {
        setTimeout(() => {
            setAfterSubmitMessage({ message: "" });
        }, 2000);
        setLoggingIn(false);
    }

    function handleSubmit(e) {
        setLoggingIn(true);
        e.preventDefault();
        const fd = new FormData(e.target);
        const formData = Object.fromEntries(fd.entries());
        if (formData.username === "" || formData.password === "") {
            setAfterSubmitMessage({
                message: "Username and password are required",
            });
            resetState();
            return;
        }

        async function validateFormInput() {
            const token = await validateUser(formData);

            if (!token.ok) {
                setAfterSubmitMessage({ message: token.message });
                resetState();
            }
            console.log(token);
            if (token.ok) {
                localStorage.setItem("token", token.token);
                setAfterSubmitMessage({
                    message: "Login Successful, redirecting to home page...",
                });
                setTimeout(() => {
                    navigate("/dashboard");
                    setAfterSubmitMessage({
                        message: "",
                    });
                }, 2000);
            }

            setLoggingIn(false);
        }

        validateFormInput();
    }

    return (
        <div>
            <form onSubmit={handleSubmit} id="login-form">
                <Input
                    label="Username"
                    id="username"
                    type="text"
                    name="username"
                    value={enteredUsername}
                    onChange={(e) => {
                        setEnteredUsername(e.target.value);
                    }}
                />
                <Input
                    label="Password"
                    id="password"
                    type="password"
                    name="password"
                />
                <p className="">
                    <Button
                        style="tertiary"
                        type="button"
                        onClick={() => {
                            document.getElementById("login-form").reset();
                            setEnteredUsername("");
                        }}>
                        Clear
                    </Button>
                    <Button
                        style="secondary"
                        type="button"
                        onClick={() => handleChangeCurForm("register")}>
                        Sign Up
                    </Button>
                    <Button type="submit" style="primary">
                        Sign In
                    </Button>
                </p>
            </form>
            {afterSubmitMessage.message !== "" && !loggingIn ? (
                <p className="">{afterSubmitMessage.message}</p>
            ) : undefined}
        </div>
    );
};
