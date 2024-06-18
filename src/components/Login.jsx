import { useState } from "react";
import { validateUser } from "../utils/http";
import { useNavigate } from "react-router-dom";
import Input from "./Input";
import { Button } from "./Button";
import { Loading2 } from "./Loading2";

export const Login = ({ handleChangeCurForm }) => {
    const navigate = useNavigate();
    const [loggingIn, setLoggingIn] = useState(false);
    const [afterSubmitMessage, setAfterSubmitMessage] = useState({
        message: "",
        ok: null,
    });
    const [enteredUsername, setEnteredUsername] = useState(
        localStorage.getItem("enteredUsername") !== null
            ? localStorage.getItem("enteredUsername")
            : ""
    );

    function resetState() {
        setTimeout(() => {
            setAfterSubmitMessage({
                message: "",
                ok: null,
            });
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
                message: "Enter username & password",
                ok: false,
            });
            resetState();
            return;
        }

        async function validateFormInput() {
            const token = await validateUser(formData);

            if (!token.ok) {
                setAfterSubmitMessage({ message: token.message, ok: false });
                resetState();
            }
            console.log(token);
            if (token.ok) {
                localStorage.setItem("token", token.token);
                setAfterSubmitMessage({
                    message: "Login Successful",
                    ok: true,
                });
                setTimeout(() => {
                    navigate("/dashboard");
                    setAfterSubmitMessage({
                        message: "",
                        ok: null,
                    });
                }, 2000);
            }

            setLoggingIn(false);
        }

        validateFormInput();
    }

    let messageStyles = "text-sm flex items-center pl-2";

    if (afterSubmitMessage.ok === false) messageStyles += " text-red-500 ";
    if (afterSubmitMessage.ok === true) messageStyles += " text-green-500";

    return (
        <>
            <h2 className="text-xl text-center mb-3">Welcome back</h2>
            <div className="flex justify-center mb-4">
                <form
                    onSubmit={handleSubmit}
                    id="login-form"
                    className="flex flex-col gap-5 rounded-md  p-4 md:w-1/3 w-full">
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
                    <div className="flex justify-between md:gap-2">
                        <div className={messageStyles}>
                            {afterSubmitMessage.message !== "" && !loggingIn ? (
                                <p>{afterSubmitMessage.message}</p>
                            ) : undefined}
                        </div>

                        <div className="flex md:gap-2">
                            <Button
                                style="tertiary"
                                type="button"
                                onClick={() => {
                                    document
                                        .getElementById("login-form")
                                        .reset();
                                    setEnteredUsername("");
                                }}>
                                Clear
                            </Button>
                            {loggingIn ? (
                                <Loading2 />
                            ) : (
                                <Button style="primary" type="submit">
                                    Sign In
                                </Button>
                            )}
                        </div>
                    </div>
                </form>
            </div>
            <div className="text-center">
                <Button
                    style="secondary"
                    type="button"
                    onClick={() => handleChangeCurForm("register")}>
                    Don&apos;t have an account?
                </Button>
            </div>
        </>
    );
};
