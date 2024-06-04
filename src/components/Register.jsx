import { useState } from "react";
import { handleRegisterUser } from "../utils/http.js";

export const Register = ({ onFormSwitch }) => {
    const [messageOutcome, setMessageOutcome] = useState({
        message: "",
        ok: null,
    });

    const [enteredValues, setEnteredValues] = useState({
        password: "",
        confirmedPassword: "",
        username: "",
    });

    function handleInputChange(identifier, value) {
        setEnteredValues((prevValues) => ({
            ...prevValues,
            [identifier]: value,
        }));
    }
    const [error, setError] = useState({ message: "" });

    const handleSubmit = (event) => {
        event.preventDefault();
        const fd = new FormData(event.target);
        const formData = Object.fromEntries(fd.entries());
        console.log(formData);

        async function callHandleRegisterUser() {
            const requestOutcome = await handleRegisterUser(formData);
            if (requestOutcome.ok) {
                document.getElementById("login-form").reset();
                localStorage.setItem(
                    "enteredUsername",
                    requestOutcome.username
                );
                setTimeout(() => {
                    onFormSwitch("login");
                }, 5000);
                setTimeout(() => {
                    localStorage.removeItem("enteredUsername");
                }, 7000);
            }

            setMessageOutcome(requestOutcome);
            setTimeout(() => {
                setMessageOutcome({
                    message: "",
                    ok: null,
                });
                setError({ message: "" });
            }, 5000);
        }

        callHandleRegisterUser();
    };

    function showMessage() {
        console.log(messageOutcome);
    }

    return (
        <div>
            <form onSubmit={handleSubmit} id="login-form">
                <div>
                    <label htmlFor="name">Name</label>
                    <input id="name" type="name" name="name" required />
                </div>
                <div>
                    <label htmlFor="surname">Surname</label>
                    <input
                        id="surname"
                        type="surname"
                        name="surname"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="username">Username</label>
                    <input
                        id="username"
                        type="username"
                        name="username"
                        value={enteredValues.username}
                        onChange={(event) =>
                            handleInputChange("username", event.target.value)
                        }
                        required
                    />
                </div>
                <div>
                    <label htmlFor="title">Title</label>
                    <input id="title" type="title" name="title" required />
                </div>

                <div className="">
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={enteredValues.password}
                        onChange={(event) =>
                            handleInputChange("password", event.target.value)
                        }
                        required
                    />
                </div>
                <div className="">
                    <label htmlFor="confirmedPassword">Confirm Password</label>
                    <input
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
                        required
                    />
                </div>
                <p className="flex gap-3">
                    <button
                        type="button"
                        className=""
                        onClick={() => onFormSwitch("login")}>
                        Sign In
                    </button>
                    <button type="reset" className="">
                        Reset
                    </button>

                    <button type="submit" className="">
                        Register
                    </button>
                </p>
            </form>
            {messageOutcome.message !== "" ? (
                <>
                    <p>{messageOutcome.message}</p>
                </>
            ) : undefined}
            <button onClick={showMessage}>Show message outcome</button>
        </div>
    );
};
