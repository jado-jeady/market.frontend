import { useState, useEffect } from 'react';
import { getUsers,createUser,disableUser } from '../../../utils/user.util.js'; 
import { toast } from "react-toastify";

// User Management Component
const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({ full_name: '', email: '', role: '', password: '' });
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');


  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      const response = await getUsers();
      console.log('Fetched users:', response);
      if (response?.success) setUsers(response.data);
    };
    fetchUsers();
  }, []);

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      console.log('Creating user with payload:', newUser);
      // prevent duplicate username or email
      if (users.some(user => user.username === newUser.username)) {
        setUsernameError('Username already exists');
        return;
      } else {
        setUsernameError('');
      }
      if (users.some(user => user.email === newUser.email)) {
        setEmailError('Email already exists');
        return;
      } else {
        setEmailError('');
      }
      if (newUser.password.length < 6) {
        setPasswordError('Password must be at least 6 characters');
        return;
      } else {
        setPasswordError('');
      }
      // prevent invalid email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(newUser.email)) {
        setEmailError('Invalid email format');
        return;
      } else {
        setEmailError('');
      }
      console.log(newUser);

      const response = await createUser(newUser);
      if (response.success) {
        toast.success('User added successfully!');
        setShowAddUser(false);
        setNewUser({ full_name: '', username: '', email: '', role: '', password: '' });
        // Refresh user list here if necessary, e.g. by re-fetching users or adding the new user to state
        setUsers([...users, newUser]);
      }
    } catch (error) {
      console.error('API call failed:', error);
      toast.error('Error adding user: ' + (error.message || 'Demo mode'));
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const userData = JSON.parse(localStorage.getItem('user')).user;
        const userId = userData?.id;
        if(userId === userId){
          toast.error('Cannot delete YourSelf');
          return;
        }

        const response = await disableUser(userId);
        if (response.success) {
          setUsers(users.filter(user => user.id !== userId));
          toast.success(`User deleted successfully! ${users.username}` );
        }
      } catch (error) {
        console.error('API call failed:', error);
        toast.error(`Error deleting user ${userId}: ${error.message || 'Demo mode'}` );
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">User Management</h3>
        <button 
          onClick={() => setShowAddUser(true)} 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Add User
        </button>
      </div>

{/* MODAL OVERLAY */}
      {showAddUser && (
        <div className="fixed inset-0 z-50  text-gray-600 inset-0  bg-opacity-40 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 transform transition-all">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-bold text-gray-900">Add New User</h4>
              <button onClick={() => { setShowAddUser(false); setNewUser({ full_name: '', username: '', email: '', role: '', password: '' }); }} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input type="text" value={newUser.full_name} onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })} className="w-full px-4 text-gray-600 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" required />
              {usernameError && <p className="text-red-600 text-sm mt-1">{usernameError}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
              <input type="text" value={newUser.username} onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} className="w-full px-4 text-gray-600 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" required />
              {usernameError && <p className="text-red-600 text-sm mt-1">{usernameError}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input type="email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" required />
              {emailError && <p className="text-red-600 text-sm mt-1">{emailError}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <select required value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })} className="w-full px-4 py-2 border text-gray-600 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
                <option value="" selected disabled>Select Role</option>
                <option value="Storekeeper">Store Keeper</option>
                <option value="Cashier">Cashier</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input type="password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-600 focus:ring-2 focus:ring-primary-500" required />
              {passwordError && <p className="text-red-600 text-sm mt-1">{passwordError}</p>}
            </div>
            <div className="md:col-span-2">
              <button type="submit" className="bg-blue-600 text-white px-8 py-2 rounded-lg hover:bg-blue-700 transition">
                Create User
              </button>
              <button type="button" onClick={() => { setShowAddUser(false); setNewUser({ full_name: '', username: '', email: '', role: '', password: '' }); }} className="bg-gray-600 text-white px-8 py-2 rounded-lg hover:bg-gray-700 transition ml-2">
                Cancel
              </button>
            </div>
            </form>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.full_name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.username}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    user.role === 'Admin' ? 'bg-purple-100 text-purple-800' : 
                    user.role === 'Manager' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    {user.status || 'Active'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                  <button className="text-blue-600 hover:text-blue-800 font-medium">Edit</button>
                  <button onClick={() => handleDeleteUser(user.id)} className="text-red-600 hover:text-red-800 font-medium">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
