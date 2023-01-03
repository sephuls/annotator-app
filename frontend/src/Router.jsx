import { BrowserRouter, Routes, Route } from "react-router-dom"
import LandingPage from "./pages/LandingPage"
import UserHomePage from "./pages/UserHomePage"
import ProjectPage from "./pages/ProjectPage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import { useState } from "react"
import { useEffect } from "react"
import httpClient from "./httpClient"


const Router = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const resp = await httpClient.get('http://localhost:5000/@me');
                setUser(resp.data);
            } catch (error) {
                console.log("Not authenticated");
            }
        })();
    }, []);

    return (
        <BrowserRouter>
            <Routes>
                {user != null ?
                    <Route path="/" element={<ProjectPage />} />

                    // <Route path="/" element={<UserHomePage/>} />
                 :
                    <Route path="/" element={<LandingPage/>} />
                }
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/register" element={<RegisterPage/>}/>
            </Routes>
        </BrowserRouter>
    )
};

export default Router;