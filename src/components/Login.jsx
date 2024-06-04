import { useState } from "react";
import { validateUser } from "../utils/http";
import { useNavigate } from "react-router-dom";

export const Login = ({ onFormSwitch }) => {
    const [loggingIn, setLoggingIn] = useState(false);
    const [error, setError] = useState({ message: "" });
    const navigate = useNavigate();

    const [enteredUsername, setEnteredUsername] = useState(
        localStorage.getItem("enteredUsername") !== null
            ? localStorage.getItem("enteredUsername")
            : ""
    );

    function handleSubmit(event) {
        setLoggingIn(true);
        event.preventDefault();
        const fd = new FormData(event.target);
        const formData = Object.fromEntries(fd.entries());
        if (formData.username === "" || formData.password === "") {
            setError({ message: "Password and Username are required fields" });
            setTimeout(() => {
                setError({ message: "" });
            }, 2000);
            setLoggingIn(false);
            return;
        }
        async function validateFormInput() {
            const token = await validateUser(formData);
            console.log("===");

            if (!token.ok) {
                setError({ message: token.message });
                setTimeout(() => {
                    setError({ message: "" });
                }, 2000);
                setLoggingIn(false);
            }
            console.log(token);
            if (token.ok) {
                localStorage.setItem("token", token.token);
                navigate("/dashboard");
            }

            setLoggingIn(false);
        }

        validateFormInput();
    }

    let formStyling = "border-solid border-2";

    return (
        <div
            className={
                error.message !== "" && !loggingIn
                    ? (formStyling += "  border-red-600")
                    : (formStyling += " border-slate-600 ")
            }>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username</label>
                    <input
                        id="username"
                        type="username"
                        name="username"
                        value={enteredUsername}
                        onChange={(e) => {
                            setEnteredUsername(e.target.value);
                        }}
                    />
                </div>

                <div className="">
                    <label htmlFor="password">Password</label>
                    <input id="password" type="password" name="password" />
                </div>
                <p className="flex gap-3">
                    <button
                        type="button"
                        className=""
                        onClick={() => onFormSwitch("register")}>
                        Sign Up
                    </button>
                    <button type="reset" className="">
                        Reset
                    </button>

                    <button type="submit" className="">
                        Login
                    </button>
                </p>
            </form>
            {error.message !== "" && !loggingIn ? (
                <p>{error.message}</p>
            ) : undefined}
        </div>
    );
};
