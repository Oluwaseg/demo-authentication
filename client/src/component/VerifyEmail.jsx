import { useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const VerifyEmail = () => {
  useEffect(() => {
    const verifyToken = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      const token = searchParams.get("token");

      if (token) {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/verify-email?token=${token}`
          );
          const { success, message } = response.data;

          if (success) {
            // Show success message with toast
            toast.success("Email verified successfully");

            setTimeout(() => {
              window.location.href = "/login";
            }, 2500);
          } else {
            toast.error(`Failed to verify email: ${message}`);
          }
        } catch (error) {
          console.error("Error verifying email:", error.message);
          toast.error("Failed to verify email");
        }
      } else {
        console.error("Invalid verification token");
        toast.error("Invalid verification token");
      }
    };

    verifyToken();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600">
      <div className="max-w-md w-full bg-white p-8 shadow-lg rounded-lg text-center">
        <div className="mb-4">
          <div className="mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900 mx-auto"></div>
          </div>
          <p className="text-gray-800">Verifying...</p>
          <p className="text-sm text-gray-600">
            Please wait while we verify your email. You will be redirected to
            the login page shortly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
