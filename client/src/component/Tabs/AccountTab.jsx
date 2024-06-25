import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const AccountTab = ({
  initialUsername,
  initialEmail,
  initialPhoneNumber,
  initialDob,
  handleAccountUpdate,
}) => {
  const [username, setUsername] = useState(initialUsername || "");
  const [email, setEmail] = useState(initialEmail || "");
  const [phoneNumber, setPhoneNumber] = useState(initialPhoneNumber || "");
  const [dob, setDob] = useState(initialDob || "");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setUsername(initialUsername || "");
    setEmail(initialEmail || "");
    setPhoneNumber(initialPhoneNumber || "");
    setDob(initialDob || "");
  }, [initialUsername, initialEmail, initialPhoneNumber, initialDob]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    try {
      await handleAccountUpdate({ username, email, phoneNumber, dob });
    } catch (error) {
      setError("Failed to update account. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="space-y-4 p-4 bg-white shadow-md rounded-lg"
    >
      {error && <p className="text-red-500">{error}</p>}
      <div className="form-control">
        <label className="label text-gray-700">Username</label>
        <input
          type="text"
          className="input input-bordered w-full bg-gray-300"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="form-control">
        <label className="label text-gray-700">Email</label>
        <input
          type="email"
          className="input input-bordered w-full bg-gray-300"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="form-control">
        <label className="label text-gray-700">Phone Number</label>
        <input
          type="text"
          className="input input-bordered w-full bg-gray-300"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
      </div>
      <div className="form-control">
        <label className="label text-gray-700">Date of Birth</label>
        <input
          type="date"
          className="input input-bordered w-full bg-gray-300"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
        />
      </div>
      <button
        type="submit"
        className={`btn btn-primary bg-purple-600 text-white outline-none  mt-2 w-full sm:w-auto ${
          isSaving ? "btn-loading" : ""
        }`}
        disabled={isSaving}
      >
        Save Account
        {isSaving && (
          <span className="ml-2 animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></span>
        )}
      </button>
    </form>
  );
};

AccountTab.propTypes = {
  initialUsername: PropTypes.string,
  initialEmail: PropTypes.string,
  initialPhoneNumber: PropTypes.string,
  initialDob: PropTypes.string,
  handleAccountUpdate: PropTypes.func.isRequired,
};

export default AccountTab;
