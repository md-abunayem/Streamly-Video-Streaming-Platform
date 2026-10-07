import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPlaylist } from "../../redux/slices/playlistSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { setAddVidoeToPlaylistAppear } from "../../redux/slices/pageAppear";

const CreatePlaylist = ({ setCreatePlaylistAppear }) => {
  const [playlistData, setPlaylistData] = useState({
    name: "",
    description: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAddVideoToPlaylistApear } = useSelector(
    (state) => state.pageAppear,
  );

  // Handle input changes
  const handleChange = (e) => {
    setPlaylistData({ ...playlistData, [e.target.name]: e.target.value });
  };

  // Handle playlist creation
  const handleCreate = async () => {
    try {
      await dispatch(createPlaylist(playlistData)).unwrap();

      // Close modal after success
      setCreatePlaylistAppear(false);
      dispatch(setAddVidoeToPlaylistAppear(true));
      console.log(isAddVideoToPlaylistApear);
    } catch (error) {
      toast.error(error?.message || "Something went wrong");
    }
  };

  return (
    // Backdrop covering the full screen
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={() => setCreatePlaylistAppear(false)} // close when clicking outside
    >
      {/* Modal content */}
      <div
        className="w-full max-w-2xl rounded-lg border border-border bg-surface p-6 text-text-primary shadow-raised sm:p-8"
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
      >
        <p className="mb-6 text-2xl font-semibold text-text-primary">
          Create Playlist
        </p>

        <input
          type="text"
          name="name"
          value={playlistData.name}
          onChange={handleChange}
          placeholder="Playlist Title"
          className="w-full rounded-md border border-border bg-page p-3 text-text-primary outline-none placeholder:text-text-muted focus:border-accent focus:ring-2 focus:ring-accent/20"
        />

        <textarea
          name="description"
          value={playlistData.description}
          onChange={handleChange}
          placeholder="Description"
          className="mt-4 w-full rounded-md border border-border bg-page p-3 text-text-primary outline-none placeholder:text-text-muted focus:border-accent focus:ring-2 focus:ring-accent/20"
          rows="4"
        />

        {/* Buttons */}
        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={() => setCreatePlaylistAppear(false)}
            className="rounded-md border border-border bg-surface-raised px-4 py-2 font-semibold text-text-primary transition hover:bg-accent-soft"
          >
            Cancel
          </button>

          <button
            onClick={handleCreate}
            className="rounded-md bg-accent px-4 py-2 font-semibold text-accent-contrast transition hover:bg-accent-hover"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePlaylist;
