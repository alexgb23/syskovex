import { createContext, useContext, useState } from "react";

const SearchContext = createContext(null);

export function SearchProvider({ children }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const openSearch = () => setIsSearchOpen(true);
  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery("");
  };
  const toggleSearch = () => setIsSearchOpen((prev) => !prev);

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        isSearchOpen,
        setIsSearchOpen,
        openSearch,
        closeSearch,
        toggleSearch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch debe usarse dentro de SearchProvider");
  }
  return context;
}
