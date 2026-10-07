import {
  Home,
  UserPlus,
  History,
  ListVideo,
  Heart,
  TvMinimalPlay,
  UserRoundCheck,
} from "lucide-react";
import { Link } from "react-router-dom";

const sidebarItems = [
  { icon: Home, label: "Home", id: "home", path: "/" },
  {
    icon: UserPlus,
    label: "Subscriptions",
    id: "subscriptions",
    path: "/your-channel/following",
  },
];

const sidebarLibrary = [
  {
    icon: History,
    label: "Watched Videos",
    id: "history",
    path: "/watch-history",
  },
  {
    icon: ListVideo,
    label: "Playlists",
    id: "playlists",
    path: "/your-channel/playlists",
  },
  { icon: Heart, label: "Liked Videos", id: "liked", path: "/liked-videos" },
];

const channelLibrary = [
  {
    icon: TvMinimalPlay,
    label: "Your Channel",
    id: "your-channel",
    path: "/your-channel",
  },
  {
    icon: UserRoundCheck,
    label: "Followers",
    id: "followers",
    path: "/your-channel/followers",
  },
];

const Sidebar = ({ isSidebarOpen, closeSidebar }) => {
  return (
    <>
      {/* Overlay with fade animation */}
      <div
        className={`fixed inset-x-0 bottom-0 top-24 z-40 bg-black/50 transition-opacity duration-300 sm:top-14 md:top-16 lg:hidden ${
          isSidebarOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={closeSidebar}
        aria-hidden="true"
      />
      <aside
        className={`fixed bottom-0 top-24 z-40 w-80 border-r border-border bg-surface text-text-primary sm:top-14 md:top-16 ${
          isSidebarOpen ? "block" : "hidden"
        }`}
      >
        <div className="pt-4 pl-4 pr-4">
          {sidebarItems.map((item) => {
            return (
              <Link
                key={item.id}
                to={item.path}
                className="flex items-center gap-6 rounded-lg px-3 py-4 transition hover:bg-[var(--surface-raised)]"
                onClick={closeSidebar}
              >
                <item.icon className="w-8 h-8" />
                <span className="block text-[1.3rem] font-semibold">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
        <hr className="mx-6 mb-6 mt-10 border-border" />
        <div className="pt-4 pl-4 pr-4">
          {sidebarLibrary.map((item) => {
            return (
              <Link
                key={item.id}
                to={item.path}
                className="flex items-center gap-6 rounded-lg px-3 py-4 transition hover:bg-[var(--surface-raised)]"
                onClick={closeSidebar}
              >
                <item.icon className="w-8 h-8" />
                <span className="block text-[1.3rem] font-semibold">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>

        <hr className="mx-6 mb-6 mt-10 border-border" />
        <div className="pt-4 pl-4 pr-4">
          {channelLibrary.map((item) => {
            return (
              <Link
                key={item.id}
                to={item.path}
                className="flex items-center gap-6 rounded-lg px-3 py-4 transition hover:bg-[var(--surface-raised)]"
                onClick={closeSidebar}
              >
                <item.icon className="w-8 h-8" />
                <span className="block text-[1.3rem] font-semibold">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
