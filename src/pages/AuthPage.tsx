import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";

function AuthPage() {
  const [showRegister, setShowRegister] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const { logIn, register } = authContext!;

  const handleLogin = async () => {
    try {
      setError("");
      setLoading(true);
      // api call here
      await logIn(email, password);
      navigate("/projects");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    try {
      setError("");
      setLoading(true);
      // api call here
      await register(username, email, password);
      navigate("/projects");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
    //   console.error(error.message);
    //   setError(error.message);
    console.error("Register error:", error);
    // <-- throw error so frontend can catch it and show messages
    throw new Error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-white flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mt-10 text-center">
        Start managing your projects.
      </h1>

      {/* This section is for ERRORS  */}
      {error && <div>{error}</div>}

      {/*This section is for the register FORM  */}
      {showRegister ? (
        <form
          onSubmit={(e) => {
            // prevent page reload
            // without e.preventDefault can cause the page to refresh before login function runs.
            e.preventDefault();
            handleRegister();
          }}
          className="border mt-10 p-2 h-60 w-150 flex flex-col justify-around items-center rounded"
        >
          <div className="text-xl font-bold">Register</div>

          <label htmlFor="username">
            Username:
            <input
              type="text"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="ml-2 border rounded"
            />
          </label>
          <label htmlFor="email">
            Email:
            <input
              type="text"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="ml-10 border rounded"
            />
          </label>
          <label htmlFor="password">
            Password:
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="ml-3 border rounded"
            />
          </label>

          <input
            type="submit"
            value="Register"
            className="border py-2 px-4 rounded"
          />

          {/* LOADING  */}
          {loading && <div className="animate-pulse">...</div>}
        </form>
      ) : (
        <form
          onSubmit={(e) => {
            // prevent page reload
            // can cause the page to refresh before login function runs.
            e.preventDefault();
            handleLogin();
          }}
          className="border mt-10 p-2 h-60 w-150 flex flex-col justify-around items-center rounded"
        >
          <div className="text-xl font-bold">Login</div>
          <label htmlFor="email">
            Email:
            <input
              type="text"
              name="email"
              value={email}
              //   React collects email
              onChange={(e) => setEmail(e.target.value)}
              className="ml-10 border rounded"
            />
          </label>
          <label htmlFor="password">
            Password:
            <input
              type="password"
              name="password"
              value={password}
              //   React collects password
              onChange={(e) => setPassword(e.target.value)}
              className="ml-3 border rounded"
            />
          </label>
          <input
            type="submit"
            value="Login"
            className="border py-2 px-4 rounded"
          />

          {/* LOADING  */}
          {loading && <div className="animate-pulse">...</div>}
        </form>
      )}

      {/* TOGGLE FORM  */}
      {showRegister ? (
        <div>
          Already have an account?{" "}
          <span
            className="text-blue-500 hover:cursor-pointer"
            onClick={() => setShowRegister(false)}
          >
            Sign in
          </span>{" "}
          <p className="text-sm text-center">password minimum length:8</p>
        </div>
      ) : (
        <div>
          Don't have an account?{" "}
          <span
            className="text-blue-500 hover:cursor-pointer"
            onClick={() => setShowRegister(true)}
          >
            Sign up
          </span>{" "}
        </div>
      )}
    </div>
  );
}

export default AuthPage;
