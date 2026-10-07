import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIsCreateTweetAppear } from "../../redux/slices/pageAppear";
import { createTweet } from "../../redux/slices/tweetSlice";
import { toast } from "react-toastify";

const MAX = 280;

const CreateTweet = () => {
  const dispatch = useDispatch();
  // If you already conditionally mount this modal in a parent, you can remove the selector and the early return.
  const isOpen = useSelector((s) => s.pageAppear?.isCreateTweetAppear);
  const [tweetInput, setTweetInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const dialogRef = useRef(null);
  const textareaRef = useRef(null);

  const closeCreateWindow = () => {
    dispatch(setIsCreateTweetAppear(false));
  };

  useEffect(() => {
    if (!isOpen) return;

    // Lock body scroll while modal is open
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Close on Escape + minimal focus trap
    const onKeyDown = (e) => {
      if (e.key === "Escape") closeCreateWindow();
      if (e.key === "Tab") {
        const sel =
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
        const nodes = dialogRef.current?.querySelectorAll(sel);
        if (!nodes || nodes.length === 0) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    // Autofocus textarea
    const t = setTimeout(() => textareaRef.current?.focus(), 0);

    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  const handleChange = (e) => {
    setTweetInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const content = tweetInput.trim();

    if (!content) {
      toast.error("Tweet cannot be empty.");
      return;
    }
    if (content.length > MAX) {
      toast.error(`Tweet must be ${MAX} characters or fewer.`);
      return;
    }

    setSubmitting(true);
    try {
      await dispatch(createTweet({ content })).unwrap();
      toast.success("Tweet created");
      setTweetInput("");
      dispatch(setIsCreateTweetAppear(false));
    } catch (error) {
      const msg =
        typeof error === "string"
          ? error
          : error?.message || "Failed to create tweet";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const remaining = MAX - tweetInput.length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={closeCreateWindow} // click outside to close
    >
      {/* overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        aria-hidden="true"
      />

      {/* dialog panel */}
      <div
        ref={dialogRef}
        className="relative z-10 w-[90%] rounded-lg border border-border bg-surface p-5 text-text-primary shadow-raised sm:p-6 lg:max-w-[600px]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-tweet-title"
        aria-describedby="create-tweet-help"
        onClick={(e) => e.stopPropagation()} // keep clicks inside from closing
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 id="create-tweet-title" className="text-3xl font-semibold">
            Create Tweet
          </h2>
          <button
            type="button"
            onClick={closeCreateWindow}
            className="rounded-md p-2 text-text-muted transition hover:bg-surface-raised hover:text-text-primary"
            aria-label="Close"
            title="Close"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <p id="create-tweet-help" className="sr-only">
            Write up to {MAX} characters.
          </p>
          <label htmlFor="tweet-input" className="sr-only">
            Tweet text
          </label>
          <textarea
            id="tweet-input"
            ref={textareaRef}
            rows={4}
            value={tweetInput}
            onChange={handleChange}
            maxLength={MAX}
            className="w-full resize-y rounded-md border border-border bg-page p-3 text-text-primary outline-none placeholder:text-text-muted focus:border-accent focus:ring-2 focus:ring-accent/20"
            placeholder="Write here..."
          />

          <div className="mt-4 flex items-center justify-between">
            <span
              className={`text-xs ${remaining <= 20 ? "text-red-600" : "text-text-muted"}`}
              aria-live="polite"
            >
              {remaining} characters left
            </span>

            <div className="space-x-3">
              <button
                type="button"
                className="rounded-md border border-border bg-surface-raised px-4 py-2 font-semibold text-text-primary transition hover:bg-accent-soft"
                onClick={closeCreateWindow}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || tweetInput.trim().length === 0}
                className="rounded-md bg-accent px-4 py-2 font-semibold text-accent-contrast transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? "Posting…" : "Create"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTweet;
