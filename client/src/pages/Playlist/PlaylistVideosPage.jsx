import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getPlaylistById } from "../../redux/slices/playlistSlice";
import PlaylistVideoCard from "../../components/Playlist/PlaylistVideoCard";

const PlaylistVideosPage = () => {
  const { playlistId } = useParams();
  const dispatch = useDispatch();
  const { playlist, loading } = useSelector((state) => state.playlist);

  useEffect(() => {
    if (playlistId) dispatch(getPlaylistById(playlistId));
  }, [playlistId, dispatch]);

  if (loading) return <p className="p-4 text-text-muted">Loading...</p>;
  if (!playlist)
    return <p className="p-4 text-text-muted">Playlist not found</p>;

  return (
    <div className="mt-4 flex min-h-screen w-full flex-col justify-center p-4 text-text-primary md:mt-0 md:p-8 lg:flex-row lg:justify-start">
      {/* Info about playlist */}
      <div className="w-full rounded-lg border border-border bg-surface p-6 shadow-soft lg:sticky lg:top-20 lg:h-[80vh] lg:w-[32%]">
        <div className="w-full ">
          <img
            src={playlist?.videos[0]?.thumbnail}
            alt="video image"
            className="w-full rounded-md object-cover md:max-h-65 lg:max-h-56"
          />
        </div>
        <p className="mt-4 text-xl font-bold md:text-2xl">{playlist.name}</p>
        <div className="flex items-center my-2">
          <img
            src={playlist.owner.avatar}
            alt="owner"
            className="h-8 w-8 rounded-full mr-4"
          />{" "}
          <p className="text-sm font-semibold">by {playlist.owner?.fullName}</p>
        </div>
        <p>
          playlist • {playlist.totalVideos} videos • {playlist.totalViews} views
        </p>
      </div>

      {/* videos of the playlist*/}
      <div className="flex h-auto flex-1 flex-col justify-start gap-4 overflow-x-auto lg:pl-4">
        {playlist &&
          playlist.videos.map((video) => (
            <PlaylistVideoCard video={video} key={video._id} />
          ))}
      </div>
    </div>
  );
};

export default PlaylistVideosPage;
