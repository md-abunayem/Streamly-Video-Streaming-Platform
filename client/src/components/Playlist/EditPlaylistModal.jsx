import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updatePlaylist,
  getPlaylistById,
} from "../../redux/slices/playlistSlice";
import { toast } from "react-toastify";
import { setIsEditPlaylistModalAppear } from "../../redux/slices/pageAppear";

const EditPlaylistModal = () => {
  const [updatedDetails, setUpdateDetails] = useState({
    name: "",
    description: "",
  });

  const dispatch = useDispatch();
  const { selectedPlaylistId, playlist } = useSelector(
    (state) => state.playlist,
  );

  // Populate form with current playlist data when modal opens
  useEffect(() => {
    if (selectedPlaylistId) {
      dispatch(getPlaylistById(selectedPlaylistId));
    }
  }, [selectedPlaylistId, dispatch]);

  // Update form when playlist data is loaded
  useEffect(() => {
    if (playlist) {
      setUpdateDetails({
        name: playlist.name || "",
        description: playlist.description || "",
      });
    }
  }, [playlist]);

  // Handle input changes
  const handleChange = (e) => {
    setUpdateDetails({ ...updatedDetails, [e.target.name]: e.target.value });
  };

  // Handle playlist update
  const handleEdit = async () => {
    if (!updatedDetails.name.trim()) {
      toast.error("Playlist name cannot be empty");
      return;
    }

    try {
      await dispatch(
        updatePlaylist({
          playlistId: selectedPlaylistId,
          updatedDetails,
        }),
      ).unwrap();

      toast.success("Playlist updated successfully!");
      dispatch(setIsEditPlaylistModalAppear(false));
    } catch (error) {
      toast.error(error?.message || "Failed to update playlist");
    }
  };

  return (
    // Backdrop covering the full screen
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={() => dispatch(setIsEditPlaylistModalAppear(false))} // close when clicking outside
    >
      {/* Modal content */}
      <div
        className="w-full max-w-2xl rounded-lg border border-border bg-surface p-6 text-text-primary shadow-raised sm:p-8"
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
      >
        <p className="mb-6 text-2xl font-semibold text-text-primary">
          Update Playlist
        </p>

        <input
          type="text"
          name="name"
          value={updatedDetails.name}
          onChange={handleChange}
          placeholder="Playlist Title"
          className="w-full rounded-md border border-border bg-page p-3 text-text-primary outline-none placeholder:text-text-muted focus:border-accent focus:ring-2 focus:ring-accent/20"
        />

        <textarea
          name="description"
          value={updatedDetails.description}
          onChange={handleChange}
          placeholder="Description"
          className="mt-4 w-full rounded-md border border-border bg-page p-3 text-text-primary outline-none placeholder:text-text-muted focus:border-accent focus:ring-2 focus:ring-accent/20"
          rows="4"
        />

        {/* Buttons */}
        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={() => dispatch(setIsEditPlaylistModalAppear(false))}
            className="rounded-md border border-border bg-surface-raised px-4 py-2 font-semibold text-text-primary transition hover:bg-accent-soft"
          >
            Cancel
          </button>

          <button
            onClick={handleEdit}
            className="rounded-md bg-accent px-4 py-2 font-semibold text-accent-contrast transition hover:bg-accent-hover"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPlaylistModal;
