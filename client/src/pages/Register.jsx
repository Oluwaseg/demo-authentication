import { useState } from "react";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import ClipLoader from "react-spinners/ClipLoader";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    image: null,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState("");
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" })); // Clear errors on change
    if (name === "image") {
      setFormData((prevData) => ({
        ...prevData,
        image: files[0],
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!isValidEmail(formData.email))
      newErrors.email = "Invalid email format";
    if (!formData.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotification("");
    if (!validateForm()) return;

    setIsLoading(true);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("password", formData.password);
    if (formData.image) {
      data.append("image", formData.image);
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/register",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Registration successful:", response.data);
      toast.success(
        "Registration successful. Please check your email to verify your account."
      );
      setRegistrationSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      console.error("Registration failed:", error.response.data);
      setNotification(
        "Registration failed: " +
          (error.response?.data?.message || "Unknown error")
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (registrationSuccess) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 to-purple-600 p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 text-center">
            <ClipLoader color="purple" loading={true} size={50} />
            <p className="text-lg font-medium mt-4">
              Registration successful! Redirecting to login...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 to-purple-600 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 sm:p-8 bg-gradient-to-r from-indigo-600 to-purple-500 text-white text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">Register</h2>
          <p className="text-sm sm:text-base">Create your account</p>
        </div>
        <div className="p-6 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border bg-white border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="John Doe"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              {errors.name && (
                <p className="text-red-500 text-xs mt-2">{errors.name}</p>
              )}
            </div>
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
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border bg-white border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="you@example.com"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MdEmail className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-2">{errors.email}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border bg-white border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="••••••••"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <div
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <FaEyeSlash className="h-5 w-5 text-gray-400" />
                  ) : (
                    <FaEye className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-2">{errors.password}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-700"
              >
                Select Image (Optional)
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="file"
                  id="image"
                  name="image"
                  onChange={handleChange}
                  className="block w-full text-sm py-1 text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <ClipLoader color="white" loading={true} size={20} />
                    <span className="ml-2">Registering...</span>
                  </div>
                ) : (
                  "Register"
                )}
              </button>
            </div>
          </form>
          {notification && (
            <div
              className={`mt-4 p-2 rounded ${
                notification.startsWith("Registration failed")
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {notification}
            </div>
          )}
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <NavLink
              to="/login"
              className="text-indigo-600 hover:text-indigo-500"
            >
              Login
            </NavLink>
          </p>
        </div>
      </div>
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

export default Register;
