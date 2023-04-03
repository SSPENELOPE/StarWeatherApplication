import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import Auth from "../utils/auth";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

function Registration() {
    const [formState, setFormState] = useState({ name: '', email: '', password: '' });
    const [data, setData] = useState(false);
    const [passwordError, setPasswordError] = useState("");

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    };

    const handlePassworValidation = (event) => {
        if (event.target.name === "password") {
            if (!validatePassword(event.target.value)) {
                setPasswordError("Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character");
            } else {
                setPasswordError("");
            }
        }
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormState({
            ...formState,
            [name]: value,
        });
        if (name === "password") {
            handlePassworValidation(event);
        }
    };

    // We will use this to ensure the user does not have an account already or the username is not taken to remove duplications
    const checkIfExist = async (data) => {
        const response = await fetch('/auth/Authenticate', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const authData = await response.json();

        const emails = authData.map(data => data.email);
        const usernames = authData.map(data => data.name);

        if (emails.includes(data.email)) {
            toast.error(`You already have an account, please sign in`, {
                position: toast.POSITION.TOP_CENTER,
                draggable: false
            })
            setTimeout(() => {
                document.location.replace('/login')
            }, 3000)
            return false;
        } else if (usernames.includes(data.name)) {
            toast.error(`Username is already taken`, {
                position: toast.POSITION.TOP_CENTER,
                draggable: false
            });
            return false;
        } else {
            return true;
        }

    }

    const handleRegistration = async (data) => {

        const response = await fetch("/auth/Registration", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        if (response.ok) {
            const data = await response.json();
            Cookies.set("suggestionSettings", "On");
            toast.success(`Success, redirecting you to your profile!`, {
                position: toast.POSITION.TOP_RIGHT,
                draggable: false
            })
            setTimeout(() => {
                Auth.login(data.Value.token)
            }, 2000)
        } else {
            toast.error(`Their was an issue creating your account`, {
                position: toast.POSITION.TOP_CENTER,
                draggable: false
            })
        };
    }

    const handleFormSubmit = async (event) => {
        
        event.preventDefault();
        if(passwordError !== "") {
            toast.error(`Please make sure your password mathes the requirements`, {
                position: toast.POSITION.TOP_CENTER,
                draggable: false
            })
        } else {
            const data = {
                name: formState.name,
                email: formState.email,
                password: formState.password,
            }
    
            const response = await checkIfExist(data);
            if (response) {
                handleRegistration(data);
            } else {
                console.log("Uh Oh Spaghetti-Oh")
            };
        }
    };


    return (
        <div>

            {data ? (
                <p>
                    Success! You may now head{' '}
                    <Navigate to="/">back to the homepage.</Navigate>
                </p>
            ) : (
                <div className="regDiv mt-5">
                    <h1 className="text-light">Registration</h1>
                    <form className="regForm" onSubmit={handleFormSubmit}>
                        <label htmlFor="inputEmail4" className="align-self-start m-2">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formState.email}
                            onChange={handleChange}
                            id="inputEmail4"
                            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                            maxLength={50}
                            required
                        ></input>

                        <label htmlFor="inputName4" className="align-self-start m-2">Username</label>
                        <input
                            type="name"
                            name="name"
                            value={formState.name}
                            onChange={handleChange}
                            id="inputName4"
                            maxLength={20}
                            required
                        ></input>

                        <label htmlFor="inputPassword4" className="align-self-start m-2">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formState.password}
                            onChange={handleChange}
                            id="inputPassword4"
                            maxLength={25}
                            required
                        ></input>
                        {passwordError && <div className="text-light">{passwordError}</div>}
                        <button type="submit" className="btn regBtn p-2 m-2">Register</button>
                    </form>
                </div>
            )}
        </div>
    )
}

export default Registration;