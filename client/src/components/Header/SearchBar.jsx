import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

const SearchBar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  //local state to hold user search input
  const [inputValue, setInputValue] = useState(searchParams.get("q") || "");

  useEffect(() => {
    setInputValue(searchParams.get("q") || "");
  }, [searchParams]);

  const handleSearchChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const query = inputValue.trim();

    if (query) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setSearchParams({ q: query });
    } else {
      navigate("/");
      setSearchParams({});
    }
  };

  return (
    <div className="order-last mx-2 flex h-10 min-w-0 basis-full self-center items-center rounded-xl border border-border bg-surface-raised px-3 shadow-soft transition focus-within:border-accent focus-within:bg-surface focus-within:ring-2 focus-within:ring-accent/20 sm:order-none sm:mx-4 sm:h-11 sm:max-w-2xl sm:flex-1 sm:basis-0 sm:px-4">
      <Search
        className="h-[18px] w-[18px] shrink-0 text-accent"
        aria-hidden="true"
      />
      <div className="w-full min-w-0 pl-2.5 sm:pl-3">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Search Videos, Channels..."
            aria-label="Search videos and channels"
            value={inputValue}
            className="h-8 w-full min-w-0 bg-transparent text-base text-text-primary outline-none placeholder:text-text-muted sm:text-sm"
            onChange={handleSearchChange}
          />
        </form>
      </div>
    </div>
  );
};

export default SearchBar;
