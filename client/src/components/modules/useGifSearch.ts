import { useState, useRef, useEffect } from "react";
import { get } from "../../utilities";

export function useGifSearch() {
  const [gifQuery, setGifQuery] = useState("");
  const [gifResults, setGifResults] = useState<string[]>([]);
  const [loadingGifs, setLoadingGifs] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  function fetchGifs(query: string) {
    setLoadingGifs(true);
    get("/api/gifs/search", { q: query })
      .then((urls: string[]) => setGifResults(urls || []))
      .finally(() => setLoadingGifs(false));
  }
  // load trending
  useEffect(() => {
    fetchGifs("");
  }, []);

  function handleGifSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setGifQuery(val);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => fetchGifs(val), 500);
  }

  return { gifQuery, gifResults, loadingGifs, handleGifSearchChange };
}
