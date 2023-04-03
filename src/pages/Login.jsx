import React, {useState} from "react";
import { Link } from "react-router-dom";
import Auth from "../utils/auth";
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

function Login() {
    const [formState, setFormState] = useState({ email: '', password: '' });

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormState({
            ...formState,
            [name]: value,
        });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        const data = {
            email: formState.email,
            password: formState.password
        }

        const response = await fetch("/auth/Login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        if(response.ok) {
            const data = await response.json();
            Auth.login(data.Value.token);
        } else {
            toast.error("Invalid Username or Password", {
                position: toast.POSITION.TOP_CENTER,
                draggable: false,
              })
        };
    }

    return (
        <div className="loginBackground">
        <div className="wrapper fadeInDown">
            <div id="formContent">
                <div className="fadeIn first">
                    <h2 className="font">Welcome Back</h2>
                </div>
                
                    <form onSubmit={handleFormSubmit}>
                        <input
                            type="email"
                            name="email"
                            value={formState.email}
                            onChange={handleChange}
                            id="login"
                            className="fadeIn second"
                            placeholder="email"
                        ></input>
                        <input
                            type="password"
                            name="password"
                            value={formState.password}
                            onChange={handleChange}
                            id="password"
                            className="fadeIn third"
                            placeholder="password"
                        ></input>
                        <input
                            type="submit"
                            className="fadeIn fourth"
                            value="Log In"
                        ></input>
                    </form>

                <div id="formFooter">
                    <p>Dont have an accout yet?</p>
                    <Link to="/Registration" className="underlineHover" href="#"><strong>Register Here</strong></Link>
                </div>
            </div>
        </div >
    </div>
    )
}

export default Login;