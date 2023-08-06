import React, { useState } from 'react'
import {useNavigate} from 'react-router-dom'

const Login = (props) => {

    const[credentials,setCredentials] = useState({email:"",password:""});
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch("http://localhost:4000/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({email:credentials.email,password:credentials.password}),
        });
        const json = await response.json();
        if(json.success){
            //redirect
            localStorage.setItem('token',json.authToken);  
            props.showAlert("Logged in Successfully","success");
            navigate("/");
        }
        else{
            props.showAlert("Invalid Credentials","danger");
        }
    }

    const onChange=(e)=>{
        setCredentials({...credentials, [e.target.name]:e.target.value})
    }
    return (
        <div className='container mt-2'>
            <h2 className='my-2'>Create an account on iNotebook to continue</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" onChange={onChange} value={credentials.email} className="form-control" id="email" name="email" aria-describedby="emailHelp" />
                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" onChange={onChange} value={credentials.password} className="form-control" id="password" name="password" />
                </div>

                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}

export default Login
