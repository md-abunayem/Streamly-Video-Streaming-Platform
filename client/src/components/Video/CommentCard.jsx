import React, { useState } from "react";
import { ThumbsUp, EllipsisVertical, Pencil, Trash2 } from "lucide-react";

const CommentCard = ({
  comment,
  onDeleteComment,
  onEditComment,
  onLikeComment,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleActions = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <article className="mt-4 flex items-start justify-between gap-3 rounded-md border border-border bg-surface px-3 py-3 shadow-soft">
      {/* Profile & Comment */}
      <div>
        <div className="flex space-x-4">
          <div className="h-10 w-10 md:h-12 md:w-12">
            <img
              src={comment.owner.avatar}
              alt="Profile"
              className="h-full w-full object-cover rounded-full"
            />
          </div>

          <div>
            <p className="font-semibold text-accent">
              @{comment.owner.userName}
            </p>
            <p className="text-text-primary">{comment.content}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onLikeComment(comment)}
          aria-label="Like comment"
        >
          <ThumbsUp className="ml-4 mt-2 text-text-muted" size={17} />
        </button>
      </div>

      {/* Three Dot Menu */}
      <div className="relative">
        <button
          type="button"
          onClick={handleActions}
          className="rounded-full p-1 text-text-muted hover:bg-surface-raised hover:text-text-primary"
        >
          <EllipsisVertical size={20} />
        </button>

        {isMenuOpen && (
          <div className="absolute right-0 z-20 mt-2 w-32 rounded-md border border-border bg-surface-raised p-1 text-text-primary shadow-raised">
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded px-3 py-2 text-left hover:bg-accent-soft"
              onClick={() => onEditComment(comment)}
            >
              <Pencil size={16} />
              Edit
            </button>
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded px-3 py-2 text-left text-red-700 hover:bg-red-50"
              onClick={() => onDeleteComment(comment)}
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        )}
      </div>
    </article>
  );
};

export default CommentCard;
