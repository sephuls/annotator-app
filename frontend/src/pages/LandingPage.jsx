import { Header } from '../components/Header';


const LandingPage = () => {
    return (
        <div className="app">
            <Header />
            <div>
                <button onClick={() => {window.location.href = '/login'}}>Login</button>
                <button onClick={() => {window.location.href = '/register'}}>Register</button>
            </div>
        </div>
    );
}

export default LandingPage;