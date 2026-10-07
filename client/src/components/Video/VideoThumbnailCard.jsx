import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { VolumeX, Volume2 } from "lucide-react";
import { calculatePublishTime } from "../../../utils/calculatePublishTime";

const VideoThumbanailCard = ({ video }) => {
  const navigate = useNavigate();
  const [isMuted, setIsMuted] = useState(true);
  const owner = video.ownerDetails || video.owner || {};

  const toggleMute = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMuted((prev) => !prev);
  };
  return (
    <article
      onClick={() => navigate(`/video/${video._id}`)}
      className="group cursor-pointer text-text-primary"
    >
      {/* Thumbnail */}
      <div className="relative h-52 w-full overflow-hidden rounded-lg bg-surface-sunken shadow-soft transition-shadow group-hover:shadow-raised lg:h-72">
        <video
          src={video.videoFile}
          poster={video.thumbnail}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          muted={isMuted}
          loop
          onMouseEnter={(e) => e.target.play()}
          onMouseLeave={(e) => e.target.pause()}
        ></video>
        <button
          type="button"
          onClick={toggleMute}
          aria-label={isMuted ? "Unmute preview" : "Mute preview"}
          className="absolute right-2 top-2 rounded-full bg-black/60 p-2 text-white transition hover:bg-black/80"
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
        <span className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-0.5 rounded-md">
          {Math.round(video.duration)}s
        </span>
      </div>
      <div className="mt-3 flex gap-3">
        <div className="h-10 w-10 shrink-0 rounded-full ring-1 ring-border sm:h-11 sm:w-11">
          <img
            src={owner.avatar || "/default-avatar.png"}
            alt=""
            className="h-full w-full rounded-full object-cover"
          />
        </div>
        <div className="min-w-0">
          <p className="line-clamp-2 text-base font-semibold leading-snug sm:text-[1.05rem]">
            {video.title}
          </p>
          <p className="mt-1 truncate text-sm font-medium text-text-muted">
            {owner.fullName || owner.userName || "Unknown creator"}
          </p>
          <div className="mt-0.5 flex text-xs text-text-muted sm:text-sm">
            <p>{Number(video.views || 0).toLocaleString()} views</p>
            <p className="mx-2 font-bold">·</p>
            <p>{calculatePublishTime(video.createdAt)} </p>
          </div>
        </div>
      </div>
    </article>
  );
};

export default VideoThumbanailCard;
