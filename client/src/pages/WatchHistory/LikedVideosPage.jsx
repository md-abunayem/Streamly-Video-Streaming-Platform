import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getLikedVideos } from "../../redux/slices/likeSlice";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import VideoThumbnailCard from "../../components/Video/VideoThumbnailCard";

const LikedVideosPage = () => {
  const dispatch = useDispatch();
  const { likedVideos, isLoading, errorMessage } = useSelector(
    (state) => state.like,
  );

  useEffect(() => {
    dispatch(getLikedVideos());
  }, [dispatch]);

  if (isLoading) return <LoadingSpinner />;
  if (errorMessage)
    return <p className="p-6 text-center text-red-500">{errorMessage}</p>;

  return (
    <section className="p-6 text-text-primary">
      <h1 className="mb-6 text-2xl font-semibold">Liked videos</h1>
      {likedVideos.length === 0 ? (
        <p className="py-12 text-center text-text-muted">
          You have not liked any videos yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {likedVideos.map(({ video }) => (
            <VideoThumbnailCard key={video._id} video={video} />
          ))}
        </div>
      )}
    </section>
  );
};

export default LikedVideosPage;
