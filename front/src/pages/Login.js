import LoginForm from "../components/LoginForm";
import LoginHeader from "../components/LoginHeader";
import RegistrationForm from "../components/RegistrationForm";

const Login = () => (
    <div className="app login-app">
        <LoginHeader></LoginHeader>
        <LoginForm></LoginForm>
        <RegistrationForm></RegistrationForm>
    </div>
);

export default Login