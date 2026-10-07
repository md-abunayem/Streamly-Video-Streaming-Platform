// src/pages/UploadVideoPage.jsx
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UploadCloud, Video, Image, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  publishVideo,
  togglePublishVideo,
} from "../../redux/slices/videoSlice";
import { toast } from "react-toastify";

const UploadVideoPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, errorMessage } = useSelector((state) => state.video);

  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    setVideoFile(e.dataTransfer.files[0]);
  };
  const handleFileChange = (e) => setVideoFile(e.target.files[0]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!videoFile || !thumbnail || !title.trim() || !description.trim()) {
      toast.warning(
        "Add a video, thumbnail, title, and description before publishing.",
      );
      return;
    }

    const formData = { videoFile, thumbnail, title, description };
    setIsSubmitting(true);
    try {
      const video = await dispatch(publishVideo(formData)).unwrap();
      try {
        await dispatch(togglePublishVideo(video._id)).unwrap();
      } catch (error) {
        toast.error(`Video uploaded but could not be published: ${error}`);
        navigate("/your-channel/videos");
        return;
      }
      toast.success("Video published successfully");
      navigate("/your-channel/videos");
    } catch (error) {
      toast.error(`Video upload failed: ${error}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-page p-6 text-text-primary">
      <div className="w-full max-w-xl rounded-lg border border-border bg-surface p-8 shadow-raised">
        <h2 className="mb-6 text-center text-2xl font-bold">
          Upload Your Video
        </h2>

        {/* Drag & Drop Zone */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center transition-all duration-300 ${
            isDragging
              ? "border-accent bg-surface-raised"
              : "border-border bg-page hover:border-accent"
          }`}
        >
          {!videoFile ? (
            <>
              <UploadCloud size={48} className="text-gray-400 mb-3" />
              <p className="mb-2 text-text-muted">
                Drag & drop your video here
              </p>
              <label className="cursor-pointer font-medium text-accent hover:underline">
                or browse to select a file
                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </>
          ) : (
            <div className="text-center">
              <Video size={40} className="text-green-500 mx-auto mb-2" />
              <p className="font-semibold">{videoFile.name}</p>
              <p className="text-sm text-gray-400">
                {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          )}
        </div>

        {/* Video Details */}
        <div className="mt-6 space-y-4">
          <input
            type="text"
            placeholder="Video Title"
            className="w-full rounded-md border border-border bg-page p-3 text-text-primary outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Description"
            className="w-full rounded-md border border-border bg-page p-3 text-text-primary outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <label className="flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-border bg-page p-4 text-text-primary transition hover:border-accent">
            <Image size={24} className="text-gray-400 mb-1" />
            <span className="text-gray-300 text-sm">
              {thumbnail ? thumbnail.name : "Upload Thumbnail"}
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setThumbnail(e.target.files[0])}
            />
          </label>
        </div>

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={isLoading || isSubmitting}
          className={`mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition ${
            isLoading || isSubmitting
              ? "cursor-not-allowed bg-accent/60 text-accent-contrast"
              : "bg-accent text-accent-contrast hover:bg-accent-hover"
          }`}
        >
          {isLoading || isSubmitting ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Uploading...
            </>
          ) : (
            <>
              <UploadCloud size={20} />
              Upload Video
            </>
          )}
        </button>

        {errorMessage && (
          <p className="text-red-500 mt-4 text-center font-medium">
            ❌ {errorMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default UploadVideoPage;
