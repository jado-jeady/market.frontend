import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import avatar from '../assets/user-female-icon.webp'

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    
    e.preventDefault();
    setError('');
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
      const response = await fetch(import.meta.env.VITE_API_URL + '/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        
        const data = await response.json();
        
        // Store token or user data
        localStorage.setItem('user', JSON.stringify(data));
        localStorage.setItem('isAuthenticated', 'true');


        if (data.data?.user?.role === "Admin"){
        navigate('/admin/dashboard');
        }
        else if(data?.data?.user?.role==="Cashier"){
          navigate('/user/dashboard');
        }
        }else {
          
        setError('Invalid username or password');
      }
    } catch (err) {
      // For demo purposes, allow login without API
      console.log('API not available, using demo login'+err);
      if (credentials.username === 'admin' && credentials.password === 'admin') {
        localStorage.setItem('user', JSON.stringify({ username: 'admin', role: 'admin' }));
        localStorage.setItem('isAuthenticated', 'true');
        navigate('/dashboard');
      } else {
        setError('Invalid username or password. Try admin/admin for demo.');
        console.error('Login error:', err);
      }
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
            <h3 className="text-3xl font-bold text-gray-800 mb-2">Tiger Market Place</h3>
           
            
             <p className="text-gray-600">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 py-6 px-6">
            <div>
              <label htmlFor="username" className="block text-xs font-medium text-gray-700 mb-2">
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
              <label htmlFor="password" className="block text-xs font-medium text-gray-700 mb-2">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
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
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-500 p-1 rounded-full"
                >
                  {showPassword ? (
                    // eye-off icon
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-5 0-9.27-3-11-7 1.12-2.62 3.01-4.73 5.22-6.02" />
                      <path d="M1 1l22 22" />
                      <path d="M9.88 9.88A3 3 0 0 0 14.12 14.12" />
                    </svg>
                  ) : (
                    // eye icon
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-600 md:bg-gray-600 bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
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
