import React, { useState } from "react";
import {
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import {
  auth,
  googleProvider,
  githubProvider,
  facebookProvider,
  twitterProvider,
  microsoftProvider,
  appleProvider,
} from "./firebase";
import toast, { Toaster } from "react-hot-toast";

function App() {
  // State variables
  const [user, setUser] = useState(null); // Store the logged-in user
  const [email, setEmail] = useState(""); // Email input value
  const [password, setPassword] = useState(""); // Password input value
  const [showPassword, setShowPassword] = useState(false); // Toggle password visibility
  const [name, setName] = useState(""); // Name input for sign-up

  const [isSignUp, setIsSignUp] = useState(false); // Toggle between Sign Up and Login forms

  // Handle login with social providers (Google, GitHub, etc.)
  const handleLogin = async (provider, providerName) => {
    try {
      // Open a popup to sign in with the selected provider (Google, GitHub, etc.)
      const result = await signInWithPopup(auth, provider);

      // Save the signed-in user's data to state
      setUser(result.user);

      // Show a success notification indicating which provider was used
      toast.success(`Logged in using ${providerName}`);
    } catch (error) {
      let message;
      // console.error("Login Error:", error);

      // Map Firebase error codes to user-friendly messages
      switch (error.code) {
        case "auth/invalid-credential":
          // Occurs if credentials are invalid or expired
          message = `Could not authenticate with ${providerName}. Please try again.`;
          break;
        case "auth/operation-not-allowed":
          // Happens if the provider login is disabled in Firebase settings
          message = `${providerName} login is not enabled. Please contact support.`;
          break;
        case "auth/cancelled-popup-request":
          // Happens if the popup login process was interrupted by another request
          message = "Login was canceled. Please try again.";
          break;
        case "auth/popup-closed-by-user":
          // Occurs when the user closes the popup before completing sign-in
          message =
            "You closed the login window before completing the process.";
          break;
        case "auth/network-request-failed":
          // Occurs if there is an internet connectivity issue during sign-in
          message =
            "Network error. Check your internet connection and try again.";
          break;
        case "auth/account-exists-with-different-credential":
          message =
            "This email is already linked to another sign-in method (e.g., Google or GitHub). Please use the method you signed up with.";
          break;

        default:
          // Generic fallback message for unknown errors
          message = "Something went wrong. Please try again later.";
        // message = `An error occurred: ${error.message}`;
      }

      // Display the error message to the user
      toast.error(message);
    }
  };

  // Handle logout

  const handleLogout = async () => {
    await signOut(auth); // Sign out user from Firebase
    setUser(null); // Clear user state
    toast("Logged out successfully", { icon: "👋" }); // Show toast message
  };

  // Handle Email & Password authentication (Sign Up / Login)
  const handleEmailAuth = async () => {
    try {
      if (isSignUp) {
        // If the user is signing up (creating a new account)
        if (!name || !email || !password) {
          // Check if any field is empty before sending the request
          toast.error("Please fill in all fields");
          return; // Stop execution if any field is empty
        }

        // Create a new user with email and password using Firebase
        await createUserWithEmailAndPassword(auth, email, password);

        // Update the user's profile to include their display name
        await updateProfile(auth.currentUser, { displayName: name });

        // Show success message after account creation
        toast.success("Account created successfully ✅");
      } else {
        // If the user is logging in
        if (!email || !password) {
          // Check if email or password is missing
          toast.error("Please enter your email and password");
          return;
        }

        // Sign in the user with email and password using Firebase
        await signInWithEmailAndPassword(auth, email, password);

        // Show success message after successful login
        toast.success("Logged in successfully ✅");
      }

      // Update the state with the current authenticated user
      setUser(auth.currentUser);
    } catch (error) {
      // Handle Firebase authentication errors and display user-friendly messages
      let message;

      // Check the error code returned by Firebase and set a custom message
      switch (error.code) {
        case "auth/invalid-email":
          message = "Invalid email address. Please enter a valid email.";
          break;
        case "auth/missing-password":
          message = "Password is required.";
          break;
        case "auth/weak-password":
          message = "Password is too weak. It should be at least 6 characters.";
          break;
        case "auth/email-already-in-use":
          message = "This email is already registered. Try logging in.";
          break;
        case "auth/user-not-found":
          message = "No account found with this email.";
          break;
        case "auth/wrong-password":
          message = "Incorrect password. Please try again.";
          break;
        default:
          // Fallback message if the error code is unknown
          message = "Something went wrong. Please try again.";
      }

      // Display the error message using toast notification
      toast.error(message);
    }
  };

  return (
    <div className="flex items-center justify-center flex-col w-full">
      {/* Toast notifications container */}
      <Toaster position="bottom-center" />

      {/* If user is NOT logged in, show login/sign-up form */}
      {!user ? (
        <div className="bg-white shadow-lg rounded-xl p-6 m-6 sm:m-8 sm:p-8 sm:w-[100vw] w-full max-w-md text-center">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            {isSignUp ? "Create a New Account" : "Log In"}
          </h2>

          {/* Social login buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 mb-6 ">
            <button
              onClick={() => handleLogin(googleProvider, "Google")}
              className="btn-social"
            >
              <img
                src="assets/icons/google-icon-logo-svgrepo-com.svg"
                alt="Google"
                className="icon"
              />
              Google
            </button>
            <button
              onClick={() => handleLogin(githubProvider, "GitHub")}
              className="btn-social "
            >
              <img
                src="assets/icons/github-142-svgrepo-com.svg"
                alt="GitHub"
                className="icon"
              />
              GitHub
            </button>
            <button
              onClick={() => handleLogin(twitterProvider, "Twitter")}
              className="btn-social"
            >
              <img
                src="assets/icons/twitter-color-svgrepo-com.svg"
                alt="Twitter"
                className="icon"
              />
              Twitter / X
            </button>
            <button
              onClick={() => handleLogin(facebookProvider, "Facebook")}
              className="btn-social"
            >
              <img
                src="assets/icons/facebook-svgrepo-com.svg"
                alt="Facebook"
                className="icon"
              />
              Facebook
            </button>
            <button
              onClick={() => handleLogin(microsoftProvider, "Microsoft")}
              className="btn-social"
            >
              <img
                src="assets/icons/microsoft-svgrepo-com.svg"
                alt="Microsoft"
                className="icon"
              />
              Microsoft
            </button>
            <button
              onClick={() => handleLogin(appleProvider, "Apple")}
              className="btn-social"
            >
              <img
                src="assets/icons/apple-173-svgrepo-com.svg"
                alt="Apple"
                className="icon"
              />
              Apple
            </button>
          </div>

          {/* Divider with text */}
          <div className="flex items-center my-6">
            <hr className="flex-grow border-gray-300" />
            <span className="px-3 text-gray-500 text-sm">Or continue with</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          {/* Sign-up name field (only if creating an account) */}
          {isSignUp && (
            <>
              <label
                htmlFor="name"
                className="block mb-1 text-sm font-medium text-gray-700 text-left"
              >
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your name"
                className="input-field"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </>
          )}

          {/* Email input field */}
          <label
            htmlFor="email"
            className="block mb-1 text-sm font-medium text-gray-700 text-left"
          >
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            autoComplete="email"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Password input field with toggle visibility */}
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block mb-1 text-sm font-medium text-gray-700 text-left"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"} // Show password text if showPassword is true
                placeholder="Enter your password"
                className="input-field pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={isSignUp ? "new-password" : "current-password"}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)} // Toggle show/hide password
                className="absolute right-3 top-1 transform-translate-y-1 focus:outline-none"
              >
                <img
                  src={
                    showPassword
                      ? "assets/icons/eye-off-svgrepo-com.svg"
                      : "assets/icons/eye-svgrepo-com.svg"
                  }
                  alt="Toggle password visibility"
                  className="w-5 h-5"
                />
              </button>
            </div>
          </div>

          {/* Submit button for Login / Sign Up */}
          <button onClick={handleEmailAuth} className="btn-primary">
            {isSignUp ? "Sign Up" : "Log In"}
          </button>

          {/* Switch between Login and Sign Up */}
          <p className="mt-4 text-sm text-gray-600">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={() => setIsSignUp(!isSignUp)} // Toggle the form type
              className="text-purple-600 font-semibold hover:underline underline-offset-4"
            >
              {isSignUp ? "Log In" : "Sign Up"}
            </button>
          </p>
        </div>
      ) : (
        // If user IS logged in, show profile info
        <div className="flex items-center justify-center flex-col bg-white shadow-lg rounded-xl p-8 w-[90%] max-w-md text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Hello, {user.displayName || "User"}
          </h2>
          <img
            src={user.photoURL}
            alt="User"
            className="w-16 h-16 rounded-full mx-auto mb-4"
          />
          <p className="text-gray-600">{user.email}</p>
        </div>
      )}

      {/* Logout button (only visible if user is logged in) */}
      {user && (
        <button
          onClick={handleLogout}
          className="mt-6 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold"
        >
          Logout
        </button>
      )}
    </div>
  );
}

export default App;
