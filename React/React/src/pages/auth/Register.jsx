import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';

export default function Register(){

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [number, setNumber] = useState("");
    const [address, setAddress] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async(e) => {
        e.preventDefault();
        setError("");

        const PhoneRegex = /^(06|07)\d{8}$/;
        if (!PhoneRegex.test(number)) {
            setError("The number format is wrong.");
            return;
        }
        setLoading(true);

        try{
            const response = await api.post("/auth/register", {username, password, email, number, address});
            alert("The account is created.");
            navigate('/login');
        }
        catch(err){
            setError(err.response?.data?.message || "Failed!");
        }
        finally{
            setLoading(false);
        }

    }

    return(
    <div className="auth-page">
        <form className="auth-card" onSubmit={handleSubmit}>
                <div className="auth-header">
                    <span className="auth-eyebrow">Welcome</span>
                    <h1>Create a new account</h1>
                    <p>Enter your credentials.</p>
                </div>
            {error && <div className="auth-error">{error}</div>}
            <div className="auth-field">
                    <label htmlFor="username">Username</label>
                    <input
                        id="username"
                        value={username}
                        type="text"
                        placeholder="user"
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
            </div>
            <div className="auth-field">
                    <label htmlFor="email">Email Address</label>
                    <input
                        id="email"
                        value={email}
                        type="email"
                        placeholder="user@mail.com"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
            </div>
            <div className="auth-field">
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        value={password}
                        type="password"
                        placeholder="••••••••"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
            </div>
            <div className="auth-field">
                    <label htmlFor="number">Phone Number</label>
                    <input
                        id="number"
                        value={number}
                        type="tel"
                        placeholder="0612345678"
                        onChange={(e) => setNumber(e.target.value)}
                        required
                        minLength={10}
                        maxLength={10}
                    />
            </div>
            <div className="auth-field">
                    <label htmlFor="address">Address</label>
                    <input
                        id="address"
                        value={address}
                        type="text"
                        placeholder="Street, City"
                        onChange={(e) => setAddress(e.target.value)}
                        required
                    />
            </div>
            <div className="auth-footer-row">
                <Link to='/login' className="auth-link">Already have an account? Log in</Link>
                <button className="auth-submit" type="submit" disabled={loading}>
                    {loading ? "Loading..." : "Create account"}
                </button>
            </div>
        </form>
    </div>);
}
