import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserPlaylists } from "../../redux/slices/playlistSlice";
import { Link } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import { EllipsisVertical } from "lucide-react";
import {
  setAddVidoeToPlaylistAppear,
  setIsEditPlaylistModalAppear,
} from "../../redux/slices/pageAppear";
import { setSelectedPlaylistId } from "../../redux/slices/playlistSlice";
import { deletePlaylist } from "../../redux/slices/playlistSlice";
import { toast } from "react-toastify";

const ChannelPlaylists = () => {
  const dispatch = useDispatch();
  const { playlists, loading } = useSelector((state) => state.playlist);
  const { channel } = useSelector((state) => state.user);

  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRefs = useRef({});

  useEffect(() => {
    if (channel?._id) {
      dispatch(getUserPlaylists(channel._id));
    }
  }, [channel, dispatch]);

  // click outside to close
  useEffect(() => {
    const handle = (e) => {
      if (
        openMenuId &&
        menuRefs.current[openMenuId] &&
        !menuRefs.current[openMenuId].contains(e.target)
      ) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [openMenuId]);

  const openAddVideoModal = (playlistId) => {
    dispatch(setSelectedPlaylistId(playlistId)); // save playlist ID in playlist slice
    dispatch(setAddVidoeToPlaylistAppear(true)); // open modal
    setOpenMenuId(null); // close menu
  };

  //Edit playlist (title, description)
  const openEditPlaylistModel = (playlistId) => {
    dispatch(setSelectedPlaylistId(playlistId));
    dispatch(setIsEditPlaylistModalAppear(true));
    setOpenMenuId(null);
  };

  //delete playlist
  const handleDeletePlaylist = async (playlistId) => {
    try {
      await dispatch(deletePlaylist(playlistId)).unwrap();
      toast.success("Playlist deleted");
      setOpenMenuId(null);
      await dispatch(getUserPlaylists(channel._id));
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div className="w-full min-h-auto p-4 md:p-8">
      <h2 className="mb-6 text-2xl font-semibold text-text-primary md:text-3xl">
        Playlists
      </h2>

      {loading && <LoadingSpinner />}

      {!loading && playlists?.length === 0 && (
        <div className="mt-20 text-center text-text-muted">
          <p className="text-lg">No playlists yet</p>
          <p className="text-sm">Create a playlist to organize your videos</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {playlists?.map((pl) => (
          <div key={pl._id} className="relative group">
            <Link
              to={`/playlist/${pl._id}`}
              className="block overflow-hidden rounded-lg border border-border bg-surface shadow-soft transition hover:-translate-y-0.5 hover:shadow-raised"
            >
              {/* Thumbnail */}
              <div className="relative h-40 bg-surface-sunken">
                {pl.videos?.length > 0 ? (
                  <img
                    src={pl.videos[0].thumbnail}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-text-muted">
                    No Thumbnail
                  </div>
                )}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition"></div>
                <p className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {pl.videos?.length || 0} videos
                </p>
              </div>

              <div className="p-4">
                <h3 className="truncate text-lg font-semibold text-text-primary">
                  {pl.name}
                </h3>
                <p className="truncate text-sm text-text-muted">
                  {pl.description || "No description"}
                </p>
              </div>
            </Link>

            {/* Menu Button */}
            <div
              ref={(el) => (menuRefs.current[pl._id] = el)}
              className="absolute top-2 right-2 z-20"
            >
              <EllipsisVertical
                className="cursor-pointer rounded-full p-1 text-white opacity-0 transition hover:bg-black/40 group-hover:opacity-100"
                onClick={(e) => {
                  e.preventDefault();
                  setOpenMenuId(openMenuId === pl._id ? null : pl._id);
                }}
              />

              {/* Dropdown Menu */}
              {openMenuId === pl._id && (
                <div className="absolute right-0 top-10 z-30 w-36 rounded-md border border-border bg-surface-raised p-2 text-sm text-text-primary shadow-raised">
                  <button
                    onClick={() => openAddVideoModal(pl._id)}
                    className="w-full rounded px-2 py-1 text-left hover:bg-accent-soft"
                  >
                    Add Video
                  </button>
                  <button
                    onClick={() => openEditPlaylistModel(pl._id)}
                    className="w-full rounded px-2 py-1 text-left hover:bg-accent-soft"
                  >
                    Edit Playlist
                  </button>
                  <button
                    onClick={() => handleDeletePlaylist(pl._id)}
                    className="w-full rounded px-2 py-1 text-left text-red-700 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChannelPlaylists;
