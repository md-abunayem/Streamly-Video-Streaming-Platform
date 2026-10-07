import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserChannelSubscribers } from "../../redux/slices/SubscriptionSlice";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";

const ChannelFollowers = () => {
  const dispatch = useDispatch();
  const { channel } = useSelector((state) => state.user);
  const { subscribers, isLoading, errorMessage } = useSelector(
    (state) => state.subscription,
  );

  useEffect(() => {
    if (channel?._id) dispatch(getUserChannelSubscribers(channel._id));
  }, [dispatch, channel?._id]);

  if (isLoading) return <LoadingSpinner />;
  if (errorMessage)
    return <p className="py-8 text-center text-red-500">{errorMessage}</p>;

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Followers</h2>
      {subscribers.length === 0 ? (
        <p className="py-8 text-center text-text-muted">No followers yet.</p>
      ) : (
        <ul className="divide-y divide-border">
          {subscribers.map(({ _id, subscriberDetails }) => (
            <li key={_id} className="flex items-center gap-4 py-4">
              <img
                src={subscriberDetails?.avatar || "/default-avatar.png"}
                alt=""
                className="h-12 w-12 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold">{subscriberDetails?.fullName}</p>
                <p className="text-sm text-text-muted">
                  @{subscriberDetails?.userName}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default ChannelFollowers;
