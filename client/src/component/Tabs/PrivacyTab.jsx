import { useState, useEffect } from "react";
import axios from "../../service/axiosInstance";
import { toast, Toaster } from "react-hot-toast";
import PropTypes from "prop-types"; // Import PropTypes

const PrivacyTab = ({ handleSubmit, user }) => {
  const [profileVisibility, setProfileVisibility] = useState("");
  const [searchVisibility, setSearchVisibility] = useState(false);
  const [dataSharing, setDataSharing] = useState(false);

  useEffect(() => {
    const fetchUserSettings = async () => {
      try {
        const response = await axios.get(`/setting/${user._id}`);
        const { profileVisibility, searchVisibility, dataSharing } =
          response.data;

        setProfileVisibility(profileVisibility || "public");
        setSearchVisibility(searchVisibility || false);
        setDataSharing(dataSharing || false);
      } catch (error) {
        console.error("Error fetching user settings:", error);
        toast.error("Failed to fetch user settings");
      }
    };

    fetchUserSettings();
  }, [user._id]);

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    const formData = {
      profileVisibility,
      searchVisibility,
      dataSharing,
    };

    try {
      const response = await axios.post("/privacy", formData);

      setProfileVisibility(response.data.user.privacy.profileVisibility);
      setSearchVisibility(response.data.user.privacy.searchVisibility);
      setDataSharing(response.data.user.privacy.dataSharing);

      toast.success("Privacy settings updated successfully");

      handleSubmit(response.data.user.privacy); // Call handleSubmit function passed from props
    } catch (error) {
      console.error("Error handling form submission:", error);
      toast.error("Failed to update privacy settings");
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmitForm}
        className="space-y-4 p-4 bg-white shadow-md rounded-lg"
      >
        <div className="form-control">
          <label className="label">Profile Visibility</label>
          <select
            className="select select-bordered w-full"
            value={profileVisibility}
            onChange={(e) => setProfileVisibility(e.target.value)}
          >
            <option value="public">Public</option>
            <option value="friends">Friends only</option>
            <option value="private">Private</option>
          </select>
        </div>
        <div className="form-control">
          <label className="cursor-pointer label">
            <span className="label-text">Allow Search Visibility</span>
            <input
              type="checkbox"
              className="toggle toggle-primary"
              checked={searchVisibility}
              onChange={(e) => setSearchVisibility(e.target.checked)}
            />
          </label>
        </div>
        <div className="form-control">
          <label className="cursor-pointer label">
            <span className="label-text">Data Sharing Preferences</span>
            <input
              type="checkbox"
              className="toggle toggle-primary"
              checked={dataSharing}
              onChange={(e) => setDataSharing(e.target.checked)}
            />
          </label>
        </div>
        <button
          type="submit"
          className="btn btn-primary  bg-purple-600 text-white outline-none  mt-2 w-full sm:w-auto"
        >
          Save Privacy Settings
        </button>
      </form>
      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
};

// Prop types validation
PrivacyTab.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};

export default PrivacyTab;
