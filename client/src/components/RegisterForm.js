import { useState } from "react"
import axios from "axios"

const RegisterForm = () => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post(`${process.env.REACT_APP_API_URL}signup`, {
            "email": email,
            "password": password
        })
        .then(response => {
            if(response.status === 200 ) {
                alert("Success")
            }
        })
        .catch()
    }

    return (
        <div>
            <form onSubmit={event => handleSubmit(event)}>
                <label htmlFor="email">Email</label>
                <br />
                <input
                type="email"
                value={email}
                placeholder="Email"
                onChange= {(event) => setEmail(event.target.value)}
                />
                <br />
                <label htmlFor="password">Password</label>
                <br />
                <input
                type="password"
                value={password}
                placeholder="Password"
                onChange={(event) => setPassword(event.target.value)}
                />
                <br />
                <label htmlFor="password">Confirm Password</label>
                <br />
                <input
                type="password"
                value={confirmPassword}
                placeholder="Password"
                onChange={(event) => setConfirmPassword(event.target.value)}
                />
                <button>Submit</button>
            </form>
        </div>
    )

}

export default RegisterForm;