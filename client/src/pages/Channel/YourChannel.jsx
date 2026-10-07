import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, NavLink, Link } from "react-router-dom";
import { Plus } from "lucide-react";

import { fetchUserChannel } from "../../redux/slices/userSlice";
import {
  calculateSubscribers,
  calculateFollowing,
} from "../../../utils/calculateViews_and_Subscribers";
import ChannelPopUP from "../../components/Channel/ChannelPopUP";
import CreatePlaylist from "../../components/Playlist/CreatePlaylist";
import AddVideoToPlaylist from "../../components/Playlist/AddVideoToPlaylist";
import EditPlaylistModal from "../../components/Playlist/EditPlaylistModal";
import CreateTweet from "../../components/Tweet/CreateTweet";

const YourChannel = () => {
  const dispatch = useDispatch();
  const { channel } = useSelector((state) => state.user);
  const { user } = useSelector((state) => state.auth);
  const { isEditPlaylistModalAppear } = useSelector(
    (state) => state.pageAppear,
  );
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [createPlaylistAppear, setCreatePlaylistAppear] = useState(false);

  const { isAddVideoToPlaylistApear, isCreateTweetAppear } = useSelector(
    (state) => state.pageAppear,
  );

  useEffect(() => {
    if (user?.userName) {
      dispatch(fetchUserChannel(user.userName));
    }
  }, [dispatch, user?.userName]);

  return (
    <div className="min-h-screen bg-[var(--page)] text-[var(--text-primary)]">
      {/* ===== Cover Image Section ===== */}
      <div className="relative h-[25vh] min-h-40 w-full">
        {channel?.coverImage ? (
          <img
            src={channel.coverImage}
            alt="Cover Image"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-[var(--surface-raised)]"></div>
        )}

        {/* ===== Avatar Section (overlapping) ===== */}
        <div className="absolute -bottom-20 left-4 z-10 flex max-w-[calc(100%-2rem)] min-w-0 items-end gap-3 sm:-bottom-24 sm:left-6 sm:gap-4 md:-bottom-28 md:left-12">
          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full border-4 border-surface bg-surface shadow-raised sm:h-28 sm:w-28 md:h-36 md:w-36">
            <img
              src={channel?.avatar || "/default-avatar.png"}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0 pb-1 sm:pb-2">
            <h1 className="truncate text-lg font-bold sm:text-xl md:text-2xl">
              {channel?.fullName || "Full Name"}
            </h1>
            <p className="truncate text-xs text-text-muted sm:text-sm">
              @{channel?.userName || "username"}
            </p>
            <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-[0.68rem] text-text-muted sm:gap-5 sm:text-xs md:text-sm">
              <p>
                <span className="font-semibold text-text-primary">
                  {calculateSubscribers(channel?.subscribersCount) || 0}
                </span>
              </p>
              <p>
                <span className="font-semibold text-text-primary">
                  {calculateFollowing(channel?.channelsSubscribedToCount) || 0}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Render CreatePlaylist Window */}
      {createPlaylistAppear && (
        <CreatePlaylist setCreatePlaylistAppear={setCreatePlaylistAppear} />
      )}

      {/* Render AddToPlaylist window */}
      {isAddVideoToPlaylistApear && <AddVideoToPlaylist />}

      {/* Render EditPlaylist window */}
      {isEditPlaylistModalAppear && <EditPlaylistModal />}

      {/* Render Create Tweet window */}
      {isCreateTweetAppear && <CreateTweet />}

      {/* ===== Tabs Section ===== */}
      <div className="relative ml-4 mt-24 sm:ml-6 sm:mt-28 md:ml-12 md:mt-32">
        <div className="mb-3 flex justify-end pr-2 md:absolute md:-top-24 md:right-12 md:mb-0 md:pr-0">
          <button
            onClick={() => setShowCreateMenu(!showCreateMenu)}
            className="flex items-center justify-center rounded-md bg-[var(--accent)] px-6 py-2 font-semibold text-white hover:bg-[var(--accent-hover)]"
          >
            <Plus className="mr-1 font-bold" />
            Create
          </button>

          {/* Popup Menu */}
          {showCreateMenu && (
            <ChannelPopUP
              setShowCreateMenu={setShowCreateMenu}
              setCreatePlaylistAppear={setCreatePlaylistAppear}
            />
          )}
        </div>

        <div className="mr-2 flex gap-5 overflow-x-auto border-b border-border pb-2 sm:mr-12 sm:gap-6">
          <NavLink
            to="/your-channel/dashboard"
            className={({ isActive }) =>
              isActive
                ? "border-b-2 border-[var(--accent)] text-[var(--accent)]"
                : "hover:text-[var(--accent)]"
            }
          >
            Overview
          </NavLink>
          <NavLink
            to="/your-channel/videos"
            className={({ isActive }) =>
              isActive
                ? "border-b-2 border-[var(--accent)] text-[var(--accent)]"
                : "hover:text-[var(--accent)]"
            }
          >
            Videos
          </NavLink>
          <NavLink
            to="/your-channel/playlists"
            className={({ isActive }) =>
              isActive
                ? "border-b-2 border-[var(--accent)] text-[var(--accent)]"
                : "hover:text-[var(--accent)]"
            }
          >
            Playlists
          </NavLink>
          <NavLink
            to="/your-channel/tweets"
            className={({ isActive }) =>
              isActive
                ? "border-b-2 border-[var(--accent)] text-[var(--accent)]"
                : "hover:text-[var(--accent)]"
            }
          >
            Tweets
          </NavLink>
          <NavLink
            to="/your-channel/following"
            className={({ isActive }) =>
              isActive
                ? "border-b-2 border-[var(--accent)] text-[var(--accent)]"
                : "hover:text-[var(--accent)]"
            }
          >
            Following
          </NavLink>
        </div>
      </div>

      {/* ===== Content Section (Outlet renders here) ===== */}
      <div className="mt-6 ml-6 md:ml-12 mr-6 md:mr-12">
        <Outlet />
      </div>

      {showCreateMenu && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setShowCreateMenu(false)}
        ></div>
      )}
    </div>
  );
};

export default YourChannel;
