import React from "react";
import { Link } from "react-router-dom";

export default function Register() {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted");
    // you can grab form values using e.target.elements or FormData here
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
            id="avatar"
            name="avatar"
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
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
