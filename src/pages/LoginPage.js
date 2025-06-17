import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authenticate } from '../api/Auth';
import { registerUserRole } from '../api/Users';
import { jwtDecode } from 'jwt-decode'; // Thư viện để giải mã JWT

const LoginPage = ({ setIsAuthenticated, setUserRole }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('');
  const [role, setRole] = useState('USER');
  const navigate = useNavigate();
  const currentUserRole = localStorage.getItem('userRole');

  useEffect(() => {
    // Khởi tạo tài khoản mẫu nếu chưa có
    let users = JSON.parse(localStorage.getItem('users') || '{}');
    if (Object.keys(users).length === 0) {
      users = {
        'admin': { password: 'admin', role: 'ADMIN' },
        'staff': { password: 'staff', role: 'STAFF' },
        'user': { password: 'user', role: 'USER' },
      };
      localStorage.setItem('users', JSON.stringify(users));
      console.log('Initialized users:', users);
    } else {
      console.log('Existing users before check:', users);
      const requiredUsers = ['admin', 'staff', 'user'];
      let needsUpdate = false;
      requiredUsers.forEach((reqUser) => {
        if (!users[reqUser]) {
          users[reqUser] = { password: reqUser, role: reqUser === 'admin' ? 'ADMIN' : 
                                                      reqUser === 'staff' ? 'STAFF' : 
                                                                            'USER' };
          needsUpdate = true;
        }
      });
      if (needsUpdate) {
        localStorage.setItem('users', JSON.stringify(users));
        console.log('Updated users with missing accounts:', users);
      }
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await authenticate({ username, password });
      if (response.code === 1000 && response.result.authenticated) {
        setIsAuthenticated(true);
        localStorage.setItem('username', username);
        localStorage.setItem('token', response.result.token);

        const decodedToken = jwtDecode(response.result.token);
        const scope = decodedToken.scope || '';
        const roles = scope.split(' ').filter(r => r.startsWith('ROLE_'));
        let userRole = 'USER';

        if (roles.length > 0) {
          userRole = roles[0].replace('ROLE_', '');
          if (!['ADMIN', 'STAFF', 'USER'].includes(userRole)) {
            console.warn(`Unexpected role: ${userRole}, falling back to USER`);
            userRole = 'USER';
          }
        }

        setUserRole(userRole);
        localStorage.setItem('userRole', userRole);

        navigate(userRole === 'ADMIN' ? '/admin' : userRole === 'STAFF' ? '/staff' : '/');
      } else {
        alert('Invalid username or password.');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    // Validation client-side
    if (newUsername.length < 6) {
      alert('Username must be at least 6 characters.');
      return;
    }
    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters.');
      return;
    }
    if (!firstName.trim()) {
      alert('First name cannot be empty.');
      return;
    }
    if (!lastName.trim()) {
      alert('Last name cannot be empty.');
      return;
    }
    if (!dob) {
      alert('Date of birth is required.');
      return;
    }
    // Kiểm tra tuổi (phải >= 18)
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    if (age < 18) {
      alert('You must be at least 18 years old.');
      return;
    }

    try {
      // Thông tin đăng ký
      const userData = {
        username: newUsername,
        password: newPassword,
        firstName: firstName, 
        lastName: lastName,
        dob: dob,
      };

      const response = await registerUserRole(userData);

      // Kiểm tra phản hồi từ API
      if(response.code === 1000) {
        alert('Registration successful! Please log in.');
        setIsLogin(true);
        // Reset form fields
        setNewUsername('');
        setNewPassword('');
        setFirstName('');
        setLastName('');
        setDob('');
      } else if (response.code === 1001 && response.result === 'User Existed!') {
        alert('Username already exists.');
      } else {
        alert('Registration failed: ' + (response.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('An error occurred during registration.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">{isLogin ? 'Login' : 'Register'}</h1>
        {isLogin ? (
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2" htmlFor="username">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-300"
            >
              Login
            </button>
            <p className="text-center mt-4">
              Don't have an account?{' '}
              <button onClick={() => setIsLogin(false)} className="text-blue-600 hover:underline">
                Register
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2" htmlFor="newUsername">
                Username
              </label>
              <input
                type="text"
                id="newUsername"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                minLength={6}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2" htmlFor="newPassword">
                Password
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                minLength={6}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2" htmlFor="firstName">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2" htmlFor="lastName">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2" htmlFor="dob">
                Date of Birth
              </label>
              <input
                type="date"
                id="dob"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-300"
            >
              Register
            </button>
            <p className="text-center mt-4">
              Already have an account?{' '}
              <button onClick={() => setIsLogin(true)} className="text-blue-600 hover:underline">
                Login
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginPage;