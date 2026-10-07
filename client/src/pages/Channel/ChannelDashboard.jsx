import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Eye, Heart, Users, Video } from "lucide-react";
import {
  getAllChannelVideos,
  getDashboardStats,
} from "../../redux/slices/dashboardSlice";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";

const ChannelDashboard = () => {
  const dispatch = useDispatch();
  const { dashboardStats, allVideos, isLoading, errorMessage } = useSelector(
    (state) => state.dashboard,
  );

  useEffect(() => {
    dispatch(getDashboardStats());
    dispatch(getAllChannelVideos());
  }, [dispatch]);

  const stats = [
    { label: "Videos", value: dashboardStats?.totalVideos ?? 0, icon: Video },
    { label: "Views", value: dashboardStats?.totalViews ?? 0, icon: Eye },
    { label: "Likes", value: dashboardStats?.totalLikes ?? 0, icon: Heart },
    {
      label: "Subscribers",
      value: dashboardStats?.totalSubscribers ?? 0,
      icon: Users,
    },
  ];
  const videos = Array.isArray(allVideos) ? allVideos : allVideos?.docs || [];

  if (isLoading && !dashboardStats) return <LoadingSpinner />;

  return (
    <section className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold">Channel overview</h2>
        {errorMessage && (
          <p className="mt-2 text-sm text-red-500">{errorMessage}</p>
        )}
        <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {stats.map(({ label, value, icon: Icon }) => (
            <article
              key={label}
              className="flex items-center gap-4 rounded-md border border-border bg-surface p-4 shadow-soft"
            >
              <Icon className="h-5 w-5 text-accent" aria-hidden="true" />
              <div>
                <p className="text-sm text-text-muted">{label}</p>
                <p className="text-xl font-semibold">
                  {Number(value).toLocaleString()}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
      <div>
        <h2 className="mb-3 text-xl font-semibold">Recent videos</h2>
        {videos.length === 0 ? (
          <p className="py-8 text-center text-text-muted">
            No channel videos yet.
          </p>
        ) : (
          <div className="divide-y divide-border border-y border-border">
            {videos.map((video) => (
              <div key={video._id} className="flex items-center gap-4 py-3">
                <img
                  src={video.thumbnail}
                  alt=""
                  className="h-16 w-28 rounded object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{video.title}</p>
                  <p className="text-sm text-text-muted">
                    {Number(video.views || 0).toLocaleString()} views ·{" "}
                    {video.likesCount || 0} likes
                  </p>
                </div>
                <span className="text-sm text-text-muted">
                  {video.isPublished ? "Published" : "Private"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ChannelDashboard;
