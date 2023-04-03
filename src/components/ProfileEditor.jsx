import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faBan, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Auth from "../utils/auth";
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";


function ProfileEditor(props) {
    /*** This is our prop variables ***/
    const profile = props.profile;
    const { setEditProfile } = props.editor;

    /*** Function to relog the user after the changes have been made ***/
    const relog = async (relogData) => {

        const response = await fetch("/auth/Prelogged", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(relogData),
        })
        if (response.ok) {
            const data = await response.json();
            Auth.login(data.Value.token);
        } else {
            alert("Sorry we messed up, there was an erorr signing you back in")
            document.location.replace("/Login");
        };
    }

    // We will set the value of relogged back to false so the editor does not keep opening
    const setRelog = () => {
        localStorage.setItem("relogged", "false");
    }


    /***  EMAIL MODIFIERS ***/
    /* Variables to manage state of email */
    const [email, setEmail] = useState("");
    const [showEmail, setShowEmail] = useState(false);

    /* Handle the submit of the email change */
    const handleEmailSubmit = async (event) => {
        event.preventDefault();

        try {
            const data = {
                email: email,
                UserId: profile.userId
            };

            const response = await fetch("/api/Edit/UpdateEmail", {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) throw new Error(response.statusText);

            setEmail("");
            setShowEmail(false);

            toast.success("Email changed!, relogging user...", {
                position: toast.POSITION.TOP_CENTER,
                draggable: false
            });

            const relogData = {
                email: email,
                UserId: profile.userId
            };

            setTimeout(() => {
                Auth.logout(false);
                relog(relogData);
                localStorage.setItem("relogged", "true");
            }, 3000); // Wait for our success message to be displayed

        } catch (error) {
            toast.error(`${error}. There was an issue updating your email. Please contact support if the problem persists.`, {
                position: toast.POSITION.TOP_CENTER,
                draggable: false
            });
        }
    };

    /* Handler to update the state email when input is changed */
    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };


    /***  USERNAME  MODIFIERS ***/
    /* Variables to manage username state */
    const [name, setName] = useState("");
    const [showUsername, setShowUsername] = useState(false);

    /* Submit the request for the username update */
    const handleUsernameSubmit = async (event) => {
        event.preventDefault();

        try {
            const data = {
                name: name,
                UserId: profile.userId
            };

            const response = await fetch("/api/Edit/UpdateUsername", {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) throw new Error(response.statusText);

            setName("");
            setShowUsername(false);

            toast.success("Username changed!, relogging user...", {
                position: toast.POSITION.TOP_CENTER,
                draggable: false
            });

            const relogData = {
                email: profile.email,
                UserId: profile.userId
            };

            setTimeout(() => {
                Auth.logout(false);
                relog(relogData);
                localStorage.setItem("relogged", "true");
            }, 3000); // Wait for our success message to be displayed

        } catch (error) {
            toast.error(`${error}. There was an issue updating your username. Please contact support if the problem persists.`, {
                position: toast.POSITION.TOP_CENTER,
                draggable: false
            });
        }
    };

    /* Handler to update username state */
    const handleUsernameChange = (event) => {
        setName(event.target.value);
    };


    /***  PASSWORD MODIFIERS ***/
    /** All the variables we need to manage the submitted data and their state **/
    const [showPwForm, setShowPwForm] = useState(false);
    const [passwordsMatch, setPasswordsMatch] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    const [passwords, setPasswords] = useState({ currentPw: '', newPw1: '', newPw2: '' });

    /** Handlers for updating state when input is modified **/
    const handlePasswordInputChange = (event) => {
        const { name, value } = event.target;
        setPasswords({
            ...passwords,
            [name]: value,
        });
    };

    /* If current password is correct, we will update the users password here */
    const handlePasswordUpdate = async () => {
        const { newPw1 } = passwords;
        const data = {
          password: newPw1,
          UserId: profile.userId
        };
      
        try {
          const response = await fetch("/api/Edit/UpdatePassword", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(data),
          });
      
          if (response.status === 200) {
            setPasswords({ currentPw: "", newPw1: "", newPw2: "" });
            setShowPwForm(false);
      
            toast.success("Password changed, make sure you use this password next time you log in!", {
              position: toast.POSITION.TOP_CENTER,
              draggable: false,
            });
          } else {
            throw new Error(`${response.statusText} Sorry try again later`);
          }
        } catch (error) {
          toast.error(`${error}. There was an issue updating your password, please contact support if the problem persists.`, {
            position: toast.POSITION.TOP_CENTER,
            draggable: false,
          });
        }
      };

    /* Here we submit the request, first checking if the current password is correct */
    const handlePwSubmit = async (event) => {
        event.preventDefault();
        const { currentPw } = passwords;
        const data = {
            password: currentPw,
            UserId: profile.userId
        };

        try {
            const response = await fetch("/auth/CheckPassword", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
            });

            const responseData = await response.json();

            if (responseData === "Password Matches") {
                handlePasswordUpdate();
            } else {
                toast.error('Incorrect Password!', {
                    position: toast.POSITION.TOP_CENTER,
                    draggable: false,
                });
            }
        } catch (error) {
            toast.error(error + "Sorry try again later", {
                position: toast.POSITION.TOP_CENTER,
                draggable: false,
            });
        }
    };

    // This is how we will check if the passwords match AND if the criteria is met
    useEffect(() => {
        const { newPw1, newPw2 } = passwords;
        if (newPw1 !== "" && newPw2 !== "") {
            if (newPw1 === newPw2) {
                setPasswordsMatch(true);
            } else {
                setPasswordsMatch(false)
            }
        } else {
            return;
        }
    }, [passwords.newPw1, passwords.newPw2]);


    return (
        <div>
            <div className="editorWrapper fadeInDown">
                <div className="editorContent">
                    <h2 className="font"><u>Edit your profile</u></h2>
                    <div className="editBtns">

                        {/* Email edit */}
                        <div className="d-flex flex-row font w-100 justify-content-around">
                            <h4>Email: {profile.email}</h4>
                            <button
                                className="btn font"
                                onClick={() => {
                                    setShowEmail(true);
                                    setShowUsername(false);
                                    setShowPwForm(false);
                                }}
                            ><FontAwesomeIcon icon={faGear} />
                            </button>
                        </div>
                        {showEmail && (
                            <form className="d-flex flex-column align-items-center">
                                <label className="font">Enter New Email</label>
                                <input
                                    required
                                    type="email"
                                    onChange={handleEmailChange}
                                    value={email}
                                ></input>
                                <div>
                                    {/* Submit button */}
                                    <button
                                        className="btn font"
                                        onClick={handleEmailSubmit}
                                    >Change Email
                                    </button>
                                    {/* Cancel button */}
                                    <button
                                        className="btn cancel"
                                        onClick={() => setShowEmail(false)}
                                    >Cancel
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* Username edit */}
                        <div className="d-flex flex-row font w-100 justify-content-around">
                            <h4 className="">Username: {profile.unique_name}</h4>
                            <button
                                className="btn font"
                                onClick={() => {
                                    setShowUsername(true);
                                    setShowEmail(false);
                                    setShowPwForm(false);
                                }}
                            ><FontAwesomeIcon icon={faGear} />
                            </button>
                        </div>
                        {showUsername && (
                            <form className="d-flex flex-column align-items-center">
                                <label className="font">Enter New Username</label>
                                <input
                                    required
                                    type="name"
                                    onChange={handleUsernameChange}
                                    value={name}
                                ></input>
                                <div>
                                    {/* Submit button */}
                                    <button
                                        className="btn font"
                                        onClick={handleUsernameSubmit}
                                    >Change Username
                                    </button>
                                    {/* Cancel button */}
                                    <button
                                        className="btn cancel"
                                        onClick={() => setShowUsername(false)}
                                    >Cancel
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* Password edit */}
                        <div className="d-flex flex-row font w-100 justify-content-around">
                            <h4 className="">Password: ********</h4>
                            <button
                                className="btn font"
                                onClick={() => {
                                    setShowPwForm(true);
                                    setShowUsername(false);
                                    setShowEmail(false);
                                }}
                            ><FontAwesomeIcon icon={faGear} />
                            </button>
                        </div>

                        {showPwForm && (
                            <form className="d-flex flex-column align-items-center">
                                {/* Hide/Show Password Input */}
                                <div className="d-flex flex-row align-items-center ">
                                    <h6 className="font mx-1">Show password</h6>
                                    <button
                                        type="button"
                                        className="btn cust-btn font mx-1"
                                        onClick={togglePasswordVisibility}
                                    ><FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                    </button>
                                </div>

                                {/* Current Password Input */}
                                <label className="font">Enter Your Current Password</label>
                                <input
                                    required
                                    type={showPassword ? 'name' : 'password'}
                                    name="currentPw"
                                    value={passwords.currentPw}
                                    onChange={handlePasswordInputChange}
                                    placeholder="Current Password"
                                ></input>
                                {passwords.newPw1 !== "" && passwords.newPw2 !== "" && !passwordsMatch && (
                                    <div className="cancel">
                                        <FontAwesomeIcon icon={faBan} />
                                        <span>Passwords must match</span>
                                    </div>
                                )}

                                {/* New Password Input */}
                                <label className="font">Enter New Password</label>
                                <input
                                    required
                                    type={showPassword ? 'name' : 'password'}
                                    name="newPw1"
                                    value={passwords.newPw1}
                                    onChange={handlePasswordInputChange}
                                    placeholder="New Password"
                                ></input>

                                {/* Confirm new password input  */}
                                <label className="font">Confirm New Password</label>
                                <input
                                    required
                                    type={showPassword ? 'name' : 'password'}
                                    name="newPw2"
                                    value={passwords.newPw2}
                                    onChange={handlePasswordInputChange}
                                    placeholder="Confirm Password"
                                ></input>

                                {/* Control buttons */}
                                <div>
                                    {/* Submit button */}
                                    <button
                                        className="btn font"
                                        onClick={handlePwSubmit}
                                    >Change Password
                                    </button>
                                    {/* Cancel button */}
                                    <button
                                        className="btn cancel"
                                        onClick={() => setShowPwForm(false)}
                                    >Cancel
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                    <button className="btn font" onClick={() => { setEditProfile(false); setRelog(); }}>Done</button>
                </div>
            </div>
        </div>
    )
}

export default ProfileEditor;