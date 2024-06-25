import { useContext, useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import axios from "../service/axiosInstance";
import { useNavigate, NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Footer from "./Footer";
import ProfileTab from "../component/Tabs/ProfileTab";
import AccountTab from "../component/Tabs/AccountTab";
import NotificationsTab from "../component/Tabs/NotificationTab";
import PrivacyTab from "../component/Tabs/PrivacyTab";
import ChangePasswordTab from "../component/Tabs/ChangePassword";
// Icon
import { IoSettingsOutline } from "react-icons/io5";
import { MdOutlineDashboard } from "react-icons/md";

const UserSetting = () => {
  const [activeTab, setActiveTab] = useState(1);
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [loading, user, navigate]);

  const handleTabClick = (tabIndex) => {
    setActiveTab(tabIndex);
  };

  const handleProfileUpdate = async (data) => {
    try {
      const response = await axios.put("/update-user-profile", data);
      toast.success("Profile updated successfully");

      return response.data;
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
      throw error;
    }
  };

  const handleImageUpload = async (image) => {
    const formData = new FormData();
    formData.append("image", image);
    try {
      const response = await axios.put("/change-profile-picture", formData);
      toast.success("Profile picture updated successfully");
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload profile picture");
      throw error;
    }
  };

  const handleAccountUpdate = async (data) => {
    try {
      const response = await axios.put("/update-user-account", data);
      toast.success("Account updated successfully");
      return response.data;
    } catch (error) {
      console.error("Error updating account:", error);
      toast.error("Failed to update account");
      throw error;
    }
  };

  const handleNotificationsUpdate = async (data) => {
    try {
      const response = await axios.post("/notifications", data);
      toast.success("Notifications updated successfully");
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating notifications:", error);
      toast.error("Failed to update notifications");
      throw error;
    }
  };

  const handlePrivacyUpdate = async (data) => {
    try {
      const response = await axios.post(`/privacy`, data);
      toast.success("Privacy settings updated successfully");
      return response.data;
    } catch (error) {
      toast.error("Failed to update privacy settings");
      throw error;
    }
  };

  const handleChangePassword = async ({ currentPassword, newPassword }) => {
    try {
      const response = await axios.put("/update-password", {
        currentPassword,
        newPassword,
      });
      toast.success("Password changed successfully");
      return response.data;
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Failed to change password");
      throw error;
    }
  };

  const handleSubmit = async (e, tabIndex, data, image = null) => {
    e.preventDefault();
    console.log(`Handling submit for tab: ${tabIndex}`, data);
    try {
      switch (tabIndex) {
        case 1:
          await handleProfileUpdate(data);
          if (image) {
            await handleImageUpload(image);
          }
          break;
        case 2:
          await handleAccountUpdate(data);
          break;
        case 3:
          await handleNotificationsUpdate(data);
          break;
        case 4:
          await handlePrivacyUpdate(data);
          break;
        case 5:
          await handleChangePassword(data);
          break;
        default:
          break;
      }
      setActiveTab(tabIndex);
    } catch (error) {
      console.error("Error handling submit:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-gradient-to-r from-indigo-500 to-purple-600 text-white min-h-screen">
      <div className="breadcrumbs text-sm flex justify-center items-center my-4">
        <ul className="flex gap-2">
          <li>
            <NavLink to="/user" className="flex items-center gap-1">
              <MdOutlineDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <span className="flex items-center gap-1">
              <IoSettingsOutline className="h-4 w-4" />
              <span>Setting</span>
            </span>
          </li>
        </ul>
      </div>
      <div className="flex flex-grow flex-col lg:flex-row p-4 ">
        <div className="tabs-container flex flex-row lg:flex-col w-full lg:w-1/4 p-4 bg-white shadow-md rounded-lg lg:space-y-2 mb-4 lg:mb-0 lg:mr-4 space-x-2 lg:space-x-0">
          <a
            className={`tab ${
              activeTab === 1
                ? " text-white bg-purple-400"
                : "hover:bg-purple-400 hover:text-white"
            } p-2 rounded-lg cursor-pointer text-center `}
            onClick={() => handleTabClick(1)}
          >
            Profile
          </a>
          <a
            className={`tab ${
              activeTab === 2
                ? " text-white bg-purple-400"
                : "hover:bg-purple-400 hover:text-white"
            } p-2 rounded-lg cursor-pointer text-center `}
            onClick={() => handleTabClick(2)}
          >
            Account
          </a>
          <a
            className={`tab ${
              activeTab === 3
                ? " text-white bg-purple-400"
                : "hover:bg-purple-400 hover:text-white"
            } p-2 rounded-lg cursor-pointer text-center `}
            onClick={() => handleTabClick(3)}
          >
            Notifications
          </a>
          <a
            className={`tab ${
              activeTab === 4
                ? " text-white bg-purple-400"
                : "hover:bg-purple-400 hover:text-white"
            } p-2 rounded-lg cursor-pointer text-center `}
            onClick={() => handleTabClick(4)}
          >
            Privacy
          </a>
          <a
            className={`tab ${
              activeTab === 5
                ? " text-white bg-purple-400"
                : "hover:bg-purple-400 hover:text-white"
            } p-2 rounded-lg cursor-pointer text-center whitespace-nowrap `}
            onClick={() => handleTabClick(5)}
          >
            Change Password
          </a>
        </div>

        <div className="flex-grow p-4 bg-opacity-80 shadow-md rounded-lg">
          {activeTab === 1 && (
            <ProfileTab
              handleProfileUpdate={handleProfileUpdate}
              handleImageUpload={handleImageUpload}
              initialName={user?.name || ""}
              initialBio={user?.bio || ""}
              initialImage={user?.image || "default-image-url"}
              isSaving={isSaving}
              setIsSaving={setIsSaving}
            />
          )}
          {activeTab === 2 && (
            <AccountTab
              handleAccountUpdate={handleAccountUpdate}
              initialUsername={user?.username || ""}
              initialEmail={user?.email || ""}
              initialPhoneNumber={user?.phoneNumber || ""}
              initialDob={user?.dob || ""}
            />
          )}
          {activeTab === 3 && (
            <NotificationsTab
              handleSubmit={(e, data) => handleSubmit(e, 3, data)}
            />
          )}
          {activeTab === 4 && (
            <PrivacyTab
              handleSubmit={(e, data) => handleSubmit(e, 4, data)}
              user={user}
            />
          )}
          {activeTab === 5 && (
            <ChangePasswordTab handleSubmit={handleChangePassword} />
          )}
        </div>
      </div>

      <Footer />
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

export default UserSetting;
