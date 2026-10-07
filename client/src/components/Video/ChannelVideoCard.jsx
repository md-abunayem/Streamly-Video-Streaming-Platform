import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Pencil, Save, Trash2, VolumeX, Volume2, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { calculatePublishTime } from "../../../utils/calculatePublishTime";
import { calculateViews } from "../../../utils/calculateViews_and_Subscribers";
import {
  deleteVideo,
  togglePublishVideo,
  updateVideo,
} from "../../redux/slices/videoSlice";

const ChannelVideoCard = ({ video, onChange }) => {
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.video.isLoading);
  const [isMuted, setIsMuted] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(video.title);
  const [description, setDescription] = useState(video.description || "");

  const toggleMute = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMuted((prev) => !prev);
  };
  const handleUpdate = async () => {
    try {
      await dispatch(
        updateVideo({
          videoId: video._id,
          updatedData: { title, description },
        }),
      ).unwrap();
      setIsEditing(false);
      onChange();
      toast.success("Video details updated");
    } catch (error) {
      toast.error(error);
    }
  };

  const handlePublishToggle = async () => {
    try {
      await dispatch(togglePublishVideo(video._id)).unwrap();
      onChange();
      toast.success(
        video.isPublished ? "Video set to private" : "Video published",
      );
    } catch (error) {
      toast.error(error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${video.title}"? This cannot be undone.`))
      return;
    try {
      await dispatch(deleteVideo(video._id)).unwrap();
      onChange();
      toast.success("Video deleted");
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <article className="mx-4 mb-4 overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)]">
      <Link to={`/video/${video._id}`} className="block">
        <div className="relative h-48">
          <video
            src={video.videoFile}
            poster={video.thumbnail}
            className="object-cover h-full w-full"
            muted={isMuted}
            loop
            onMouseEnter={(e) => e.target.play()}
            onMouseLeave={(e) => e.target.pause()}
          ></video>
          <button
            type="button"
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute preview" : "Mute preview"}
            className="absolute right-2 top-2 rounded-full bg-black/60 p-2 text-white hover:bg-black/80"
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <span className="absolute right-2 bottom-2 bg-black bg-opacity-70 text-white text-xs px-2 py-0.5 rounded-md">
            {Math.round(video.duration)}s
          </span>
        </div>

        <div className="px-4 pt-3 text-[var(--text-primary)]">
          <p className="truncate text-lg font-semibold">{video.title}</p>
          <p className="font-semibold text-[var(--text-muted)]">
            {video.ownerDetails?.fullName || "Your channel"}
          </p>
          <div className="flex">
            <p className="">{calculateViews(video.views)}</p>
            <p className="px-2">·</p>
            <p>{calculatePublishTime(video.createdAt)}</p>
          </div>
        </div>
      </Link>
      <div className="flex flex-wrap items-center gap-2 px-4 py-3">
        <button
          type="button"
          onClick={() => setIsEditing((value) => !value)}
          className="inline-flex items-center gap-2 rounded-md border border-[var(--border)] px-3 py-2 text-sm hover:bg-[var(--surface-raised)]"
        >
          {isEditing ? <X size={16} /> : <Pencil size={16} />}
          {isEditing ? "Cancel" : "Edit"}
        </button>
        <button
          type="button"
          onClick={handlePublishToggle}
          disabled={isLoading}
          className="inline-flex items-center gap-2 rounded-md border border-[var(--border)] px-3 py-2 text-sm hover:bg-[var(--surface-raised)] disabled:opacity-50"
        >
          <Eye size={16} />
          {video.isPublished ? "Make private" : "Publish"}
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={isLoading}
          className="ml-auto inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-500/10 disabled:opacity-50"
        >
          <Trash2 size={16} />
          Delete
        </button>
      </div>
      {isEditing && (
        <div className="space-y-3 border-t border-[var(--border)] p-4">
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            aria-label="Video title"
            className="w-full rounded-md border border-[var(--border)] bg-[var(--page)] px-3 py-2 text-[var(--text-primary)]"
          />
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            aria-label="Video description"
            rows={3}
            className="w-full rounded-md border border-[var(--border)] bg-[var(--page)] px-3 py-2 text-[var(--text-primary)]"
          />
          <button
            type="button"
            onClick={handleUpdate}
            disabled={isLoading || !title.trim() || !description.trim()}
            className="inline-flex items-center gap-2 rounded-md bg-[var(--accent)] px-3 py-2 text-sm font-semibold text-white hover:bg-[var(--accent-hover)] disabled:opacity-50"
          >
            <Save size={16} />
            Save changes
          </button>
        </div>
      )}
    </article>
  );
};

export default ChannelVideoCard;
