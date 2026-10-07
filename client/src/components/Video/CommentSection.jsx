import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createVideoComment,
  getAllComments,
  updateComment,
  deleteComment,
  clearSuccess,
  clearError,
} from "../../redux/slices/commentSlice";
import { toggleCommentLike } from "../../redux/slices/likeSlice";
import { CircleUser } from "lucide-react";
import { toast } from "react-toastify";
import CommentCard from "./CommentCard";

const CommentSection = ({ videoId }) => {
  const dispatch = useDispatch();
  const [userComment, setUserComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);

  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { allComments, isLoading, errorMessage, successMessage } = useSelector(
    (state) => state.comment,
  );

  //handle comment input
  const handleCommentChange = (event) => {
    setUserComment(event.target.value);
  };

  //submit or update comment
  const handleSubmitComment = () => {
    if (!isAuthenticated) {
      toast.info("You have to login to submit comment.");
      return;
    }

    if (!userComment.trim()) {
      toast.warning("Comment cannot be empty.");
      return;
    }

    if (editingCommentId) {
      //update existing comment
      dispatch(
        updateComment({ commentId: editingCommentId, content: userComment }),
      )
        .then(() => dispatch(getAllComments(videoId)))
        .finally(() => {
          setUserComment("");
          setEditingCommentId(null);
        });
    } else {
      dispatch(createVideoComment({ videoId, content: userComment })).then(() =>
        dispatch(getAllComments(videoId)),
      );
      setUserComment("");
    }
  };

  //fetch all comments
  useEffect(() => {
    if (videoId) {
      dispatch(getAllComments(videoId));
    }
  }, [dispatch, videoId]);

  //Edit Comment
  const handleEditComment = (comment) => {
    if (comment?.owner?._id !== user?._id) {
      toast.info("You can not edit others people's comments");
      return;
    }
    setUserComment(comment.content);
    setEditingCommentId(comment?._id);
  };

  //Delete Comment
  const handleDeleteComment = (comment) => {
    if (comment?.owner?._id !== user?._id) {
      toast.info("You can not delete others people's comments");
      return;
    }
    dispatch(deleteComment(comment._id)).then(() =>
      dispatch(getAllComments(videoId)),
    );
  };

  const handleLikeComment = async (comment) => {
    if (!isAuthenticated) {
      toast.info("Please login to like comments.");
      return;
    }
    try {
      await dispatch(toggleCommentLike(comment._id)).unwrap();
      dispatch(getAllComments(videoId));
    } catch (error) {
      toast.error(error);
    }
  };

  //handle success and error message
  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(clearError());
    }
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearSuccess());
    }
  }, [errorMessage, successMessage, dispatch]);

  return (
    <section className="flex flex-col px-3 py-3 text-text-primary sm:px-4 sm:py-4 md:px-6 md:py-4 lg:max-w-full lg:px-8 lg:py-4 xl:px-12">
      {/* Headline */}
      <h2 className="text-xl font-semibold sm:text-2xl lg:text-3xl">
        Comments
      </h2>

      {/* //Comment input */}
      <div>
        <div className="mt-4 flex space-x-4">
          {isAuthenticated ? (
            <div className="h-8 w-8 md:h-12 md:w-12 rounded-full ">
              <img
                src={user?.avatar}
                alt="User Photo"
                className="h-full w-full rounded-full object-cover"
              />
            </div>
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface-raised md:h-12 md:w-12">
              <CircleUser className="h-5 w-5 text-text-muted md:h-7 md:w-7" />
            </div>
          )}
          <input
            type="text"
            name="content"
            value={userComment}
            id="comment"
            className="w-full border-b border-border bg-transparent text-text-primary transition focus:border-accent focus:outline-none placeholder:text-text-muted sm:w-full"
            placeholder="Write something..."
            onChange={handleCommentChange}
          />
        </div>

        {/* actions */}
        <div className="w-full flex justify-end">
          <button
            type="button"
            className="relative mt-4 h-10 rounded-full bg-accent px-5 font-semibold text-accent-contrast transition hover:bg-accent-hover"
            onClick={handleSubmitComment}
          >
            {editingCommentId ? "Update" : "comment"}
          </button>
        </div>
      </div>
      <div>
        {allComments.map((comment) => (
          <CommentCard
            key={comment._id}
            comment={comment}
            onDeleteComment={handleDeleteComment}
            onEditComment={handleEditComment}
            onLikeComment={handleLikeComment}
          />
        ))}
      </div>
    </section>
  );
};

export default CommentSection;
