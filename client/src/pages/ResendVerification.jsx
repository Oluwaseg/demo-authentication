import { useState } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { MdEmail } from "react-icons/md";
import { NavLink, useNavigate } from "react-router-dom";

const ResendVerification = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleResendVerification = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/resend-verification",
        { email }
      );

      toast.success(response.data.message);
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Unknown error";
      console.error("Resend failed:", errorMessage);
      toast.error("Resend failed: " + errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 to-purple-600 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 sm:p-8 bg-gradient-to-r from-indigo-600 to-purple-500 text-white text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">
            Resend Verification Email
          </h2>
          <p className="text-sm sm:text-base">
            Enter your email to resend verification
          </p>
        </div>
        <div className="p-6 space-y-6">
          <form onSubmit={handleResendVerification} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="you@example.com"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MdEmail className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
            <div>
              <button
                type="submit"
                className={`w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zM2 12a10 10 0 0010 10v-4a6 6 0 01-6-6H2z"
                    ></path>
                  </svg>
                ) : (
                  "Resend Verification Email"
                )}
              </button>
            </div>
          </form>
          <div className="flex justify-center">
            <NavLink
              to="/login"
              className="text-sm text-indigo-600 hover:underline"
            >
              Back to Login
            </NavLink>
          </div>
        </div>
      </div>
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

export default ResendVerification;
