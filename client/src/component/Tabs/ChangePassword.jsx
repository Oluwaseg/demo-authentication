import { useState } from "react";
import PropTypes from "prop-types";

const ChangePasswordTab = ({ handleSubmit }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters long");
      return;
    }

    try {
      await handleSubmit({ currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setError("");
    } catch (error) {
      console.error("Error changing password:", error);
      setError("Failed to change password");
    }
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="space-y-4 p-4 bg-white shadow-md rounded-lg"
    >
      {error && <div className="text-red-500">{error}</div>}
      <div className="form-control">
        <label className="label">Current Password</label>
        <input
          type="password"
          className="input input-bordered w-full"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
      </div>
      <div className="form-control">
        <label className="label">New Password</label>
        <input
          type="password"
          className="input input-bordered w-full"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>
      <div className="form-control">
        <label className="label">Confirm New Password</label>
        <input
          type="password"
          className="input input-bordered w-full"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
        />
      </div>
      <button
        type="submit"
        className="btn btn-primary  bg-purple-600 text-white outline-none  mt-2 w-full sm:w-auto"
      >
        Change Password
      </button>
    </form>
  );
};

ChangePasswordTab.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

export default ChangePasswordTab;
