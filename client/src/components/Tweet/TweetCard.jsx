import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ThumbsUp } from "lucide-react";
import { toast } from "react-toastify";
import { toggleTweetLike } from "../../redux/slices/likeSlice";

// A simple tweet card component
const TweetCard = ({ tweet }) => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [isLiked, setIsLiked] = useState(false);
  // Format createdAt for Dhaka time zone
  const formattedDate = new Date(tweet.createdAt).toLocaleString("en-US", {
    timeZone: "Asia/Dhaka",
    dateStyle: "medium",
    timeStyle: "short",
  });
  const owner = typeof tweet.owner === "object" ? tweet.owner : null;

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.info("Please login to like tweets.");
      return;
    }
    try {
      const result = await dispatch(toggleTweetLike(tweet._id)).unwrap();
      setIsLiked(Boolean(result?.isLiked));
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <article className="mb-4 rounded-lg border border-border bg-surface p-4 shadow-soft transition hover:-translate-y-0.5 hover:shadow-raised">
      {/* Header section */}
      <header className="mb-2 flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-text-primary">
            {owner?.fullName || owner?.userName || "Creator"}
          </h3>
          <time className="block text-sm text-text-muted">{formattedDate}</time>
        </div>
      </header>

      {/* Content section */}
      <p className="text-text-primary">{tweet.content}</p>
      <button
        type="button"
        onClick={handleLike}
        aria-label={isLiked ? "Unlike tweet" : "Like tweet"}
        aria-pressed={isLiked}
        className={`mt-3 inline-flex items-center gap-2 text-sm ${isLiked ? "text-accent" : "text-text-muted hover:text-accent"}`}
      >
        <ThumbsUp size={17} />
        <span>{isLiked ? "Liked" : "Like"}</span>
      </button>
    </article>
  );
};

export default TweetCard;
