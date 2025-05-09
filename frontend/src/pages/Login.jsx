import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Login() {
  const [fromData, setfromData] = useState({
    email: "",
    password: "",
  });

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
            onChange={(e) =>
              setfromData({ ...fromData, email: e.target.value })
            }
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
            onChange={(e) =>
              setfromData({ ...fromData, password: e.target.value })
            }
          />
          <p className="validator-hint mb-3 text-sm text-gray-500">
            Must be more than 8 characters, including:
            <br />
            - At least one number
            <br />
            - At least one lowercase letter
            <br />- At least one uppercase letter
          </p>

          <button
            type="submit"
            className="btn bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
          >
            Login
          </button>
        </form>
        <p className="text-sm mt-4">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-500 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
