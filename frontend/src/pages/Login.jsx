import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

    const loginUser = async () => {
    try {
        const response = await axios.post(
        "https://helpdesk-ticket-system-se05.onrender.com/login",
        {
            email,
            password
        }
        );

        if (response.data.message !== "Login successful") {
        alert(response.data.message);
        return;
        }

        localStorage.setItem(
        "user_id",
        response.data.user_id
        );

        localStorage.setItem(
        "role",
        response.data.role
        );

        localStorage.setItem(
        "name",
        response.data.name
        );

        alert("Login successful");

        // Role Based Navigation
        if (response.data.role === "admin") {
        navigate("/admin");
        }
        else if (response.data.role === "agent") {
        navigate("/agent");
        }
        else {
        navigate("/user");
        }

    } catch (error) {
        console.log(error);
        alert("Login failed");
    }
    };

  return (
    <div>
      <h2>Login</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <br /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br /><br />

      <button onClick={loginUser}>
        Login
      </button>
    </div>
  );
}

export default Login;