import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

export default function Login(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
 
    const {login} = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async(e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try{
            const response = await api.post('/auth/login', {email, password});
            login(response.data);
            if(response.data.role === 'ADMIN'){
                navigate('/admin');
            }else{
                navigate('/products');
            }
        }
        catch(err){
            setError(err.response?.data?.message || "Something Wrong!");
        }
        finally{
            setLoading(false)
        }
    }

    return(
        <div className="auth-page">
            <form className="auth-card" onSubmit={handleSubmit}>
                <div className="auth-header">
                    <span className="auth-eyebrow">Welcome</span>
                    <h1>Sign in to your account</h1>
                    <p>Enter your credentials.</p>
                </div>

                {error && <div className="auth-error">{error}</div>}

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

                <div className="auth-footer-row">
                    <Link to="/" className="auth-link">Forgot password?</Link>
                    <button className="auth-submit" type="submit" disabled={loading}>
                        {loading ? "Loading..." : "Login"}
                    </button>
                    <Link to='/register' className="auth-link">Don't have account!</Link>
                </div>
            </form>
        </div>
    );
}
