import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const ProfileTab = ({
  handleProfileUpdate,
  handleImageUpload,
  initialName,
  initialBio,
  initialImage,
  isSaving,
  setIsSaving,
}) => {
  const [name, setName] = useState(initialName || "");
  const [bio, setBio] = useState(initialBio || "");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(initialImage || null);

  useEffect(() => {
    setPreview(initialImage || null);
  }, [initialImage]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // Simulate a delay before saving
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await handleProfileUpdate({ name, bio });
      if (image) {
        await handleImageUpload(image);
        setImage(null);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleProfileSubmit}
      className="space-y-4 p-4 bg-white shadow-md rounded-lg"
    >
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-36 h-36">
          <input
            type="file"
            id="upload-button"
            accept="image/*"
            className="absolute w-full h-full opacity-0 cursor-pointer"
            onChange={handleImageChange}
          />
          <div className="w-full h-full rounded-full overflow-hidden border-2 border-gray-200 bg-gray-100 flex items-center justify-center">
            {preview ? (
              <img
                src={preview}
                alt="Profile Preview"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-20 w-20 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="form-control">
          <label className="label text-gray-700">Name</label>
          <input
            type="text"
            className="input input-bordered bg-gray-300 w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-control">
          <label className="label text-gray-700">Bio</label>
          <textarea
            className="textarea textarea-bordered bg-gray-300 w-full"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>
      </div>

      <button
        type="submit"
        className={`btn btn-primary  bg-purple-600 text-white outline-none  w-full sm:w-auto ${
          isSaving ? "btn-loading" : ""
        }`}
        disabled={isSaving}
      >
        Save Profile
        {isSaving && (
          <span className="ml-2 animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-indigo-500"></span>
        )}
      </button>
    </form>
  );
};

ProfileTab.propTypes = {
  handleProfileUpdate: PropTypes.func.isRequired,
  handleImageUpload: PropTypes.func.isRequired,
  initialName: PropTypes.string,
  initialBio: PropTypes.string,
  initialImage: PropTypes.string,
  isSaving: PropTypes.bool.isRequired,
  setIsSaving: PropTypes.func.isRequired,
};

export default ProfileTab;
