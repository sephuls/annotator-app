import { useState } from 'react';
import { Header } from '../components/Header';
import httpClient from '../httpClient';


const RegisterPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async () => {
        console.log(email, password)

        const resp = await httpClient.post("//localhost:5000/register", {
            email, password
        });

        if (resp.status === 200) {
            window.location.href = "/";
        }
    };

    return (
        <div className="app">
            <Header />
            <form>
                <input
                    type='text'
                    value={email}
                    onChange={(e) => {setEmail(e.target.value)}}
                    required
                />
                <input
                    type='password'
                    value={password}
                    onChange={(e) => {setPassword(e.target.value)}}
                    required
                />
                <button type="button" onClick={() => handleSubmit()}>Submit</button>
            </form>
        </div>
    );
}

export default RegisterPage;