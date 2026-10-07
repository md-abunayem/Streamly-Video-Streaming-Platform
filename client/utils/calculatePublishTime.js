export const calculatePublishTime = (createdAt) => {
  const timestamp = new Date(createdAt).getTime();
  if (!Number.isFinite(timestamp)) return "Unknown date";

  const elapsedSeconds = (timestamp - Date.now()) / 1000;
  const absoluteElapsed = Math.abs(elapsedSeconds);
  if (absoluteElapsed < 10) return "Just now";

  const units = [
    { name: "second", seconds: 1 },
    { name: "minute", seconds: 60 },
    { name: "hour", seconds: 60 * 60 },
    { name: "day", seconds: 24 * 60 * 60 },
    { name: "month", seconds: 30 * 24 * 60 * 60 },
    { name: "year", seconds: 365 * 24 * 60 * 60 },
  ];

  const unit =
    [...units].reverse().find(({ seconds }) => absoluteElapsed >= seconds) ||
    units[0];
  const value = Math.max(1, Math.floor(absoluteElapsed / unit.seconds));
  const relativeTime = new Intl.RelativeTimeFormat(undefined, {
    numeric: "auto",
    style: "long",
  });

  return relativeTime.format(elapsedSeconds < 0 ? -value : value, unit.name);
};
