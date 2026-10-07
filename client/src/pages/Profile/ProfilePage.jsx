import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  changeUserPassword,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
} from "../../redux/slices/authSlice";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user, isLoading } = useSelector((state) => state.auth);
  const [details, setDetails] = useState({ fullName: "", email: "" });
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    setDetails({ fullName: user?.fullName || "", email: user?.email || "" });
  }, [user]);

  const submitDetails = async (event) => {
    event.preventDefault();
    try {
      await dispatch(updateAccountDetails(details)).unwrap();
      toast.success("Account details updated");
    } catch (error) {
      toast.error(error);
    }
  };

  const submitPassword = async (event) => {
    event.preventDefault();
    try {
      await dispatch(changeUserPassword(passwords)).unwrap();
      setPasswords({ oldPassword: "", newPassword: "" });
      toast.success("Password changed");
    } catch (error) {
      toast.error(error);
    }
  };

  const uploadImage = async (event, action, label) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      await dispatch(action(file)).unwrap();
      toast.success(`${label} updated`);
    } catch (error) {
      toast.error(error);
    } finally {
      event.target.value = "";
    }
  };

  const fieldClass =
    "w-full rounded-md border border-border bg-page px-3 py-2 text-text-primary outline-none focus:border-accent focus:ring-2 focus:ring-accent/20";
  const buttonClass =
    "rounded-md bg-accent px-4 py-2 font-semibold text-accent-contrast transition hover:bg-accent-hover";

  return (
    <main className="mx-auto max-w-3xl space-y-8 p-5 sm:p-8">
      <header>
        <p className="text-sm font-semibold uppercase text-accent">Account</p>
        <h1 className="mt-1 text-3xl font-semibold">Profile settings</h1>
      </header>
      <section className="space-y-4 border-b border-border pb-8">
        <h2 className="text-xl font-semibold">Images</h2>
        <div className="flex flex-wrap items-center gap-5">
          <img
            src={user?.avatar || "/default-avatar.png"}
            alt="Current avatar"
            className="h-16 w-16 rounded-full object-cover"
          />
          <label className="cursor-pointer text-sm font-semibold text-accent">
            Change avatar
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              disabled={isLoading}
              onChange={(event) =>
                uploadImage(event, updateUserAvatar, "Avatar")
              }
            />
          </label>
          <label className="cursor-pointer text-sm font-semibold text-accent">
            Change cover image
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              disabled={isLoading}
              onChange={(event) =>
                uploadImage(event, updateUserCoverImage, "Cover image")
              }
            />
          </label>
        </div>
      </section>
      <form
        onSubmit={submitDetails}
        className="space-y-4 border-b border-border pb-8"
      >
        <h2 className="text-xl font-semibold">Personal details</h2>
        <label className="block space-y-1 text-sm">
          <span>Full name</span>
          <input
            className={fieldClass}
            autoComplete="name"
            value={details.fullName}
            onChange={(event) =>
              setDetails({ ...details, fullName: event.target.value })
            }
            required
          />
        </label>
        <label className="block space-y-1 text-sm">
          <span>Email</span>
          <input
            className={fieldClass}
            type="email"
            autoComplete="email"
            value={details.email}
            onChange={(event) =>
              setDetails({ ...details, email: event.target.value })
            }
            required
          />
        </label>
        <button className={buttonClass} type="submit" disabled={isLoading}>
          Save details
        </button>
      </form>
      <form onSubmit={submitPassword} className="space-y-4">
        <h2 className="text-xl font-semibold">Change password</h2>
        <label className="block space-y-1 text-sm">
          <span>Current password</span>
          <input
            className={fieldClass}
            type="password"
            autoComplete="current-password"
            value={passwords.oldPassword}
            onChange={(event) =>
              setPasswords({ ...passwords, oldPassword: event.target.value })
            }
            required
          />
        </label>
        <label className="block space-y-1 text-sm">
          <span>New password</span>
          <input
            className={fieldClass}
            type="password"
            autoComplete="new-password"
            value={passwords.newPassword}
            onChange={(event) =>
              setPasswords({ ...passwords, newPassword: event.target.value })
            }
            required
          />
        </label>
        <button className={buttonClass} type="submit" disabled={isLoading}>
          Update password
        </button>
      </form>
    </main>
  );
};

export default ProfilePage;
