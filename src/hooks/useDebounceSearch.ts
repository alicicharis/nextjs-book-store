import { useCallback, useState } from "react";

interface SearchResult {
  id?: number;
  name?: string;
}

export function useDebounceSearch<T extends SearchResult>(
  searchFunction: (term: string) => Promise<T[]>,
  debounceTime: number = 500
) {
  const [suggestions, setSuggestions] = useState<T[]>([]);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const debounce = useCallback((func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }, []);

  const debouncedSearch = useCallback(
    debounce(async (searchTerm: string) => {
      if (searchTerm.length < 3) {
        setSuggestions([]);
        return;
      }

      const results = await searchFunction(searchTerm);

      if (results.length > 0) {
        setSuggestions(results);
      }
    }, debounceTime),
    [searchFunction, debounceTime]
  );

  return {
    suggestions,
    setSuggestions,
    isInputFocused,
    setIsInputFocused,
    debouncedSearch,
  };
}
