import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Dashboard = () => {
  const { user, loading, handleLogout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [loading, user, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
      {user && (
        <div className="">
          <div className="navbar">
            <div className="flex-1">
              <a className="btn btn-ghost text-xl">daisyUI</a>
            </div>
            <div className="flex-none gap-2">
              <div className="hidden lg:flex space-x-4">
                <a className="btn btn-ghost">Home</a>
                <a className="btn btn-ghost">About</a>
                <a className="btn btn-ghost">Services</a>
                <a className="btn btn-ghost">Contact</a>
              </div>
              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle avatar"
                >
                  <div className="w-10 rounded-full">
                    <img alt="User avatar" src={user.image} />
                  </div>
                </div>
                <ul
                  tabIndex={0}
                  className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-74"
                >
                  <li>
                    <a className="justify-between">
                      {user.name}
                      <span className="badge">New</span>
                    </a>
                  </li>
                  <li>
                    <a className="justify-between">{user.email}</a>
                  </li>
                  <li>
                    <a href="/setting">Settings</a>
                  </li>
                  <li>
                    <button onClick={handleLogout}>Logout</button>
                  </li>
                </ul>
              </div>
              <div className="dropdown dropdown-end lg:hidden">
                <button
                  tabIndex={0}
                  className="btn btn-ghost btn-circle"
                  aria-label="Menu"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16m-7 6h7"
                    />
                  </svg>
                </button>
                <ul
                  tabIndex={0}
                  className="mt-3 z-[1] p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52"
                >
                  <li>
                    <a>Home</a>
                  </li>
                  <li>
                    <a>About</a>
                  </li>
                  <li>
                    <a>Services</a>
                  </li>
                  <li>
                    <a>Contact</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className=" mt-10">
        {/* Hero Section */}
        <div
          className="hero bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.pexels.com/photos/443446/pexels-photo-443446.jpeg?auto=compress&cs=tinysrgb&w=600')",
          }}
        >
          <div className="hero-overlay bg-opacity-60"></div>
          <div className="hero-content text-center text-neutral-content">
            <div className="max-w-lg">
              <h1 className="mb-5 text-5xl font-bold">
                Welcome to Your Website
              </h1>
              <p className="mb-5 text-xl">
                Crafted with Daisy UI and Tailwind CSS
              </p>
              <button className="btn btn-primary">Get Started</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
