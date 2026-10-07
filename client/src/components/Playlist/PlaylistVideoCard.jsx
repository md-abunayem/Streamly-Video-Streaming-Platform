import React from "react";
import { Link } from "react-router-dom";
import { calculatePublishTime } from "../../../utils/calculatePublishTime";
import { calculateViews } from "../../../utils/calculateViews_and_Subscribers";

const PlaylistVideoCard = ({ video }) => {
  return (
    <div className="max-h-full max-w-full flex gap-x-4 my-4 lg:mt-0 flex-1">
      <Link to={`/video/${video._id}`}>
        <video
          src={video.videoFile}
          className="h-32 w-64 object-cover rounded-xl"
        ></video>
      </Link>
      <div className="">
        <p className="text-lg font-semibold text-text-primary sm:text-xl">
          {video.title}
        </p>
        <div className="flex items-center text-sm text-text-muted">
          <p className="font-semibold">{video.owner?.fullName}</p>
          <p className="mx-2">·</p>
          <p>{calculateViews(video.views)}</p>
        </div>
      </div>
    </div>
  );
};

export default PlaylistVideoCard;
