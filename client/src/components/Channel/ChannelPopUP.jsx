import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Upload, PencilLine, FilePlus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import { setIsCreateTweetAppear } from "../../redux/slices/pageAppear";
const ChannelPopUP = ({ setShowCreateMenu, setCreatePlaylistAppear }) => {
  const dispatch = useDispatch();

  return (
    <div className="absolute right-0 z-20 mt-2 w-48 overflow-hidden rounded-md border border-border bg-surface-raised text-text-primary shadow-raised">
      <NavLink
        to={"/upload-video"}
        // relative="path"
        onClick={() => {
          setShowCreateMenu(false);
        }}
        className="flex w-full items-center gap-2 px-4 py-3 text-left transition hover:bg-accent-soft"
      >
        <Upload size={18} className="text-accent" />
        Upload Video
      </NavLink>
      <NavLink
        onClick={() => {
          setShowCreateMenu(false);
          dispatch(setIsCreateTweetAppear(true));
        }}
        className="flex w-full items-center gap-2 px-4 py-3 text-left transition hover:bg-accent-soft"
      >
        <PencilLine size={18} className="text-accent" />
        Create Tweet
      </NavLink>
      <button
        onClick={() => {
          setShowCreateMenu(false);
          setCreatePlaylistAppear(true);
        }}
        className="flex w-full items-center gap-2 px-4 py-3 text-left transition hover:bg-accent-soft"
      >
        <FilePlus size={18} className="text-accent" />
        Create Playlist
      </button>
    </div>
  );
};

export default ChannelPopUP;
