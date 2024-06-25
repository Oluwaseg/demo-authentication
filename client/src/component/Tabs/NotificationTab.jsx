import { useState, useEffect } from "react";
import axios from "../../service/axiosInstance";
import { toast, Toaster } from "react-hot-toast";
import PropTypes from "prop-types";

const NotificationsTab = ({ handleSubmit }) => {
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(false);

  useEffect(() => {
    const fetchUserSettings = async () => {
      try {
        const response = await axios.get("/notifications");
        const { emailNotifications, smsNotifications, pushNotifications } =
          response.data;

        setEmailNotifications(emailNotifications || false);
        setSmsNotifications(smsNotifications || false);
        setPushNotifications(pushNotifications || false);
      } catch (error) {
        console.error("Error fetching user notifications settings:", error);
        toast.error("Failed to fetch notification settings");
      }
    };

    fetchUserSettings();
  }, []);

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    const formData = {
      emailNotifications,
      smsNotifications,
      pushNotifications,
    };

    try {
      const response = await axios.post("/notifications", formData);
      toast.success("Notification settings updated successfully");

      handleSubmit(response.data.user.notifications);
    } catch (error) {
      toast.error("Failed to update notification settings");
      console.error("Error updating notifications:", error);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmitForm}
        className="space-y-4 p-4 bg-white shadow-md rounded-lg"
      >
        <div className="form-control">
          <label className="cursor-pointer label">
            <span className="label-text">Email Notifications</span>
            <input
              type="checkbox"
              className="toggle toggle-primary"
              checked={emailNotifications}
              onChange={(e) => setEmailNotifications(e.target.checked)}
            />
          </label>
        </div>
        <div className="form-control">
          <label className="cursor-pointer label">
            <span className="label-text">SMS Notifications</span>
            <input
              type="checkbox"
              className="toggle toggle-primary"
              checked={smsNotifications}
              onChange={(e) => setSmsNotifications(e.target.checked)}
            />
          </label>
        </div>
        <div className="form-control">
          <label className="cursor-pointer label">
            <span className="label-text">Push Notifications</span>
            <input
              type="checkbox"
              className="toggle toggle-primary"
              checked={pushNotifications}
              onChange={(e) => setPushNotifications(e.target.checked)}
            />
          </label>
        </div>
        <button
          type="submit"
          className="btn btn-primary  bg-purple-600 text-white outline-none  mt-2 w-full sm:w-auto"
        >
          Save Notifications
        </button>
      </form>
      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
};

NotificationsTab.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

export default NotificationsTab;
