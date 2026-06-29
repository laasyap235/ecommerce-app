import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../utils/Authcontext";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../utils/msalConfig";

const SignInPage = () => {
  const navigate = useNavigate();
  const { signin, microsoftSignin } = useAuth();
  const { instance } = useMsal();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);
    try {
      await signin({ email: formData.email, password: formData.password });
      navigate("/");
    } catch (err) {
      const message = err.response?.data?.message || "Invalid email or password. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleMicrosoftLogin = async () => {
    try {
      const result = await instance.loginPopup(loginRequest);
      await microsoftSignin(result.accessToken);
      navigate("/");
    } catch (err) {
      console.log(err);
      setError("Microsoft login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="w-full max-w-md">
        <Link to="/" className="block text-center text-xl font-bold text-gray-900 mb-8">
          ShopHub
        </Link>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 sm:p-10">
          <h2 className="text-3xl font-bold text-gray-900 text-center">Sign in</h2>
          <p className="text-gray-600 mt-2 mb-8 text-center">
            New here?{" "}
            <Link to="/signup" className="text-gray-900 font-medium underline underline-offset-2">
              Create an account
            </Link>
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Link to="/forgot-password" className="text-sm text-gray-500 hover:text-gray-900">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 pr-11 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12c1.292 4.338 5.31 7.5 10.066 7.5.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.5a10.522 10.522 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 text-white font-medium rounded-lg py-2.5 hover:bg-gray-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-400">or</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleMicrosoftLogin}
            className="w-full flex items-center justify-center gap-3 border border-gray-300 text-gray-700 font-medium rounded-lg py-2.5 hover:bg-gray-50 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 21 21">
              <rect x="1" y="1" width="9" height="9" fill="#f25022"/>
              <rect x="11" y="1" width="9" height="9" fill="#7fba00"/>
              <rect x="1" y="11" width="9" height="9" fill="#00a4ef"/>
              <rect x="11" y="11" width="9" height="9" fill="#ffb900"/>
            </svg>
            Sign in with Microsoft
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          © {new Date().getFullYear()} ShopHub. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default SignInPage;