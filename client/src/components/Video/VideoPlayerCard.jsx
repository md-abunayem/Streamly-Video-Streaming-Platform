import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { ThumbsUp, Forward, Download } from "lucide-react";

import { calculateSubscribers } from "../../../utils/calculateViews_and_Subscribers";
import {
  toggleSubscription,
  getUserChannelSubscribers,
} from "../../redux/slices/SubscriptionSlice";
import { toggleVideoLike } from "../../redux/slices/likeSlice";

const VideoPlayerCard = () => {
  const dispatch = useDispatch();
  const { selectedVideo, errorMessage } = useSelector((state) => state.video);
  const { subscribers } = useSelector((state) => state.subscription);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [isLiked, setIsLiked] = useState(false);

  const { videoFile, thumbnail, title, description, owner, ownerDetails } =
    selectedVideo || {};

  useEffect(() => {
    setIsLiked(Boolean(selectedVideo?.isLiked));
  }, [selectedVideo?._id]);

  // Handle errors
  useEffect(() => {
    if (errorMessage) toast.error(errorMessage);
  }, [errorMessage]);

  // Fetch channel subscribers when video owner changes
  useEffect(() => {
    if (owner && isAuthenticated) dispatch(getUserChannelSubscribers(owner));
  }, [owner, isAuthenticated, dispatch]);

  // Check if the current user is subscribed
  const isSubscribed =
    subscribers?.some((sub) => sub.subscriber === user?._id) || false;

  const handleToggleSubscribe = () => {
    if (!isAuthenticated) {
      toast.info("Please login to subscribe");
      return;
    }
    if (!owner) return;

    dispatch(toggleSubscription(owner)).then(() => {
      dispatch(getUserChannelSubscribers(owner));
    });
  };

  const handleLike = () => {
    if (!isAuthenticated) {
      toast.info("Please login to like this video");
      return;
    }
    if (!selectedVideo?._id) return;
    dispatch(toggleVideoLike(selectedVideo._id))
      .unwrap()
      .then((result) => setIsLiked(Boolean(result?.isLiked)))
      .catch((error) => toast.error(error));
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: title,
        text: "Check out this video!",
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.info("Video link copied to clipboard!");
    }
  };

  const handleDownload = () => {
    if (!videoFile) return;
    const link = document.createElement("a");
    link.href = videoFile;
    link.download = title || "video.mp4";
    link.click();
  };

  return (
    <div className="flex flex-col px-3 py-3 text-[var(--text-primary)] sm:px-4 sm:py-4 md:px-6 md:py-4 lg:px-8 lg:py-4 xl:px-12">
      {/* Video Player */}
      {videoFile ? (
        <video
          src={videoFile}
          poster={thumbnail}
          autoPlay
          controls
          className="w-full aspect-video max-h-[50vh] sm:max-h-[55vh] md:max-h-[60vh] lg:max-h-[68vh] xl:max-h-[71vh] rounded-lg md:rounded-xl lg:rounded-2xl object-cover"
        />
      ) : (
        <div className="flex aspect-video w-full items-center justify-center rounded-lg bg-surface-sunken md:rounded-xl lg:rounded-2xl">
          <p className="text-sm text-text-muted sm:text-base md:text-lg">
            No video selected
          </p>
        </div>
      )}

      {/* Video Information Section */}
      <div className="mt-3 sm:mt-4 md:mt-5 space-y-3 sm:space-y-4">
        {/* Video Title */}
        <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold leading-tight break-words">
          {title || "Untitled Video"}
        </h1>

        {/* Owner & Actions Container */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start md:items-center gap-3 sm:gap-4">
          {/* Owner Info */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex-shrink-0">
              <img
                src={ownerDetails?.avatar || "/default-avatar.png"}
                alt={ownerDetails?.fullName || "Creator"}
                className="h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12 lg:h-14 lg:w-14 object-cover rounded-full"
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold truncate">
                {ownerDetails?.fullName || "Unknown Creator"}
              </p>
              {isAuthenticated && (
                <p className="text-xs font-medium text-text-muted sm:text-sm md:text-base">
                  {calculateSubscribers(subscribers?.length)}
                </p>
              )}
            </div>

            {/* Subscribe Button - Desktop */}
            <button
              onClick={handleToggleSubscribe}
              className="hidden h-9 items-center justify-center rounded-full border border-border bg-surface-raised px-4 text-sm font-semibold text-text-primary transition-colors hover:bg-accent-soft sm:flex md:h-10 md:px-5 md:text-base lg:px-6"
            >
              {isSubscribed ? "Unsubscribe" : "Subscribe"}
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {/* Subscribe Button - Mobile */}
            <button
              onClick={handleToggleSubscribe}
              className="flex h-9 min-w-[100px] flex-1 items-center justify-center rounded-full border border-border bg-surface-raised px-4 text-sm font-semibold text-text-primary transition-colors hover:bg-accent-soft sm:hidden"
            >
              {isSubscribed ? "Unfollow" : "Follow"}
            </button>

            {/* Like Button */}
            <button
              onClick={handleLike}
              className={`flex h-9 w-12 flex-shrink-0 items-center justify-center rounded-full transition-colors md:h-10 md:w-14 ${isLiked ? "bg-accent text-accent-contrast" : "border border-border bg-surface-raised text-text-primary hover:bg-accent-soft"}`}
              aria-label={isLiked ? "Unlike video" : "Like video"}
              aria-pressed={isLiked}
            >
              <ThumbsUp className="w-4 h-4 md:w-5 md:h-5" />
            </button>

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="flex h-9 items-center justify-center gap-1.5 rounded-full border border-border bg-surface-raised px-3 text-sm font-semibold text-text-primary transition-colors hover:bg-accent-soft md:h-10 md:px-4 md:text-base"
            >
              <Forward className="w-4 h-4 md:w-5 md:h-5" />
              <span className="hidden sm:inline">Share</span>
            </button>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              className="flex h-9 items-center justify-center gap-1.5 rounded-full border border-border bg-surface-raised px-3 text-sm font-semibold text-text-primary transition-colors hover:bg-accent-soft md:h-10 md:px-4 md:text-base lg:px-5"
            >
              <Download className="w-4 h-4 md:w-5 md:h-5" />
              <span className="hidden sm:inline">Download</span>
            </button>
          </div>
        </div>

        {/* Video Description */}
        <div className="relative mt-10 rounded-lg border border-border bg-surface p-5 pt-7 shadow-soft transition duration-300">
          {/* Title */}
          <span
            className="absolute top-0 left-[1.5%] -translate-y-1/2 
               border border-border bg-surface px-3 py-0.5 text-sm font-semibold uppercase text-text-muted sm:text-base 
               rounded-full shadow-sm"
          >
            Description
          </span>

          {/* Content */}
          <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-text-muted sm:text-base lg:text-lg">
            {description || "No description available."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayerCard;
