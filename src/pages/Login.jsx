import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import avatar from "../assets/user-female-icon.webp";
import { EyeOff, Eye } from "lucide-react";

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const infoMessage = location.state?.message;

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // if (credentials.username === 'admin' && credentials.password === 'admin' ) {
    //     localStorage.setItem('user', JSON.stringify({ username: 'admin', role: 'admin', password: 'admin', token: 'admin-token'}));
    //     localStorage.setItem('isAuthenticated', 'true');
    //     navigate('/admin/dashboard');
    //   }else if(credentials.username === 'user' && credentials.password === 'user'){
    //     localStorage.setItem('user', JSON.stringify({ username: 'user', role: 'user', password: 'user',token: 'user-token' }));
    //     localStorage.setItem('isAuthenticated', 'true');
    //     navigate('/user/dashboard');
    //   } else {
    //     setError('Invalid username or password. Try admin/admin for demo.');

    //   }

    try {
      // Replace with your actual API endpoint
      const response = await fetch(
        import.meta.env.VITE_API_URL + "/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        },
      );

      if (response.ok) {
        const data = await response.json();

        // Store token or user data
        localStorage.setItem("user", JSON.stringify(data));
        localStorage.setItem("isAuthenticated", "true");

        if (data.data?.user?.role === "Admin") {
          console.log(infoMessage);
          navigate("/admin/dashboard");
        } else if (data?.data?.user?.role === "Cashier") {
          navigate("/user/dashboard");
        } else if (data?.data?.user?.role === "Storekeeper") {
          navigate("/storekeeper/dashboard");
        }
      } else {
        setError("Invalid username or password");
      }
    } catch (err) {
      // For demo purposes, allow login without API
      console.log(err);
      setError(`Internal Server Error \n call Admin : 0782228575`);
    } finally {
      setLoading(false);
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex bg-gray-100 flex-col">
      <div className="flex items-center justify-center bg-gradient-to-br from-secondary-500 to-primary-500 min-h-screen">
        <div className="bg-white p-5 md:p-10 md:text-xs rounded-lg shadow-2xl md:w-full max-w-md my-5">
          <div className="text-center">
            <img
              src={avatar}
              alt="User avatar"
              className="w-24 h-24  mx-auto object-cover"
            />
            <h3 className="text-3xl font-bold text-gray-800 mb-2">
              Tyga Market Place
            </h3>

            <p className="text-gray-600">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 py-6 px-6">
            <div>
              <label
                htmlFor="username"
                className="block text-xs font-medium text-gray-700 mb-2"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={credentials.username}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-gray-800 focus:border-gray-500 outline-none transition"
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-medium text-gray-700 mb-2"
              >
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 pr-11 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-gray-800 focus:border-gray-500 outline-none transition"
                  placeholder="Enter your password"
                />
                {/*
                 */}
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-500 p-1 rounded-full"
                >
                  {showPassword ? (
                    // eye-off icon
                    <EyeOff size={16} className="text-red-500" />
                  ) : (
                    // eye icon
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-center border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-semibold transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed
             text-white
             bg-gray-600 
             lg:bg-gray-700
             xl:bg-gray-900"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className=" text-center text-sm">
            <Link to={"#"}>Forgot Password</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
