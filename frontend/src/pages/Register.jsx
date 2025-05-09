import { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { Link } from 'react-router-dom';

export default function Register() {
  const { registerUser } = useContext(UserContext);

  const [fullName, setfullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);

  const fromData = new FormData();
  fromData.append('fullName', fullName);
  fromData.append('email', email);
  fromData.append('password', password);
  fromData.append('profileImage', profilePicture);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted');
    registerUser(fromData);
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="w-96 rounded-lg shadow-lg p-6 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Register</h1>
        <form
          className="flex flex-col w-full"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          <label className="mb-1 font-medium" htmlFor="fullName">
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            className="input validator mb-2"
            value={fullName}
            onChange={(e) => setfullName(e.target.value)}
            required
            placeholder="JohnDoe"
            pattern="[A-Za-z][A-Za-z0-9\-]*"
            minLength="3"
            maxLength="30"
            title="Only letters, numbers or dash"
          />
          <p className="validator-hint mb-3 text-sm text-gray-500">
            Must be 3 to 30 characters containing only letters, numbers or dash
          </p>

          <label className="mb-1 font-medium" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="input validator mb-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="mail@site.com"
          />
          <p className="validator-hint mb-3 text-sm text-gray-500">
            Enter a valid email address
          </p>

          <label className="mb-1 font-medium" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="input validator mb-2"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength="8"
            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
            title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
          />
          <p className="validator-hint mb-3 text-sm text-gray-500">
            Must be more than 8 characters, including:
            <br />
            - At least one number
            <br />
            - At least one lowercase letter
            <br />- At least one uppercase letter
          </p>

          <label className="mb-1 font-medium" htmlFor="avatar">
            Profile Picture
          </label>
          <input
            type="file"
            id="profilePicture"
            onChange={(e) => setProfilePicture(e.target.files[0])}
            name="profilePicture"
            className="file-input mb-4"
            accept="image/*"
          />

          <button
            type="submit"
            className="btn bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
          >
            Register
          </button>
        </form>
        <p className="text-sm mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
