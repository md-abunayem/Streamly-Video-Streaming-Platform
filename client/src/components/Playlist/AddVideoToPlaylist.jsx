import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAddVidoeToPlaylistAppear } from "../../redux/slices/pageAppear";
import { addVideoToPlaylist } from "../../redux/slices/playlistSlice";
import { toast } from "react-toastify";

const AddVideoToPlaylist = () => {
  const dispatch = useDispatch();

  const { videos } = useSelector((state) => state.video);

  // previous logic (playlist created)
  const { playlist, selectedPlaylistId } = useSelector(
    (state) => state.playlist,
  );

  const [selectedVideos, setSelectedVideos] = useState([]);
  const [finalPlaylistId, setFinalPlaylistId] = useState(null);

  // MERGED LOGIC: detect which playlist ID should be used
  useEffect(() => {
    if (playlist?._id) {
      setFinalPlaylistId(playlist._id); // newly created playlist
    } else if (selectedPlaylistId) {
      setFinalPlaylistId(selectedPlaylistId); // selected playlist
    } else {
      setFinalPlaylistId(null);
    }
  }, [playlist, selectedPlaylistId]);

  const toggleVideos = (videoId) => {
    setSelectedVideos((prev) =>
      prev.includes(videoId)
        ? prev.filter((id) => id !== videoId)
        : [...prev, videoId],
    );
  };

  const handleAdd = async () => {
    if (selectedVideos.length === 0) return;

    if (!finalPlaylistId) {
      toast.info("No playlist selected!");
      return;
    }

    try {
      await Promise.all(
        selectedVideos.map((videoId) =>
          dispatch(
            addVideoToPlaylist({
              videoId,
              playlistId: finalPlaylistId, // merged final id
            }),
          ),
        ),
      );

      dispatch(setAddVidoeToPlaylistAppear(false));
      toast.success("Videos added successfully!");
    } catch (error) {
      toast.error(error?.message || "Failed to add videos");
    }
  };

  return (
    <div
      role="dialog"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
    >
      <div className="w-full max-w-2xl rounded-lg border border-border bg-surface p-6 text-text-primary shadow-raised">
        <h2 className="mb-4 text-xl font-semibold">Add to Playlist</h2>

        <div className="max-h-[400px] overflow-y-auto flex flex-col gap-3">
          {videos?.map((video) => (
            <div
              key={video._id}
              className="flex cursor-pointer items-center justify-between rounded-md p-2 transition hover:bg-surface-raised"
            >
              <video
                src={video.videoFile}
                className="h-20 w-36 object-cover rounded"
              ></video>

              <div className="ml-4 flex-1">
                <p className="font-medium text-text-primary">{video.title}</p>
              </div>

              <input
                type="checkbox"
                checked={selectedVideos.includes(video._id)}
                onChange={() => toggleVideos(video._id)}
                className="h-5 w-5 accent-accent"
              />
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button
            className="rounded-md border border-border bg-surface-raised px-4 py-2 text-text-primary transition hover:bg-accent-soft"
            onClick={() => dispatch(setAddVidoeToPlaylistAppear(false))}
          >
            Cancel
          </button>

          <button
            className="rounded-md bg-accent px-4 py-2 font-semibold text-accent-contrast transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
            onClick={handleAdd}
            disabled={selectedVideos.length === 0}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddVideoToPlaylist;
