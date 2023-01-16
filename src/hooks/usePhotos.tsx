import { getOAuthToken } from "../components/withGoogleAuth";
import fetch from "node-fetch";
import { ListResponse, MediaItem } from "../types/google";
import { useEffect, useState } from "react";

const BASE_URL = "https://photoslibrary.googleapis.com/v1";

export const usePhotos = (type: string) => {
  const [photos, setPhotos] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log(type);
    const fetchPhotos = async () => {
      setLoading(true);
      setPhotos([]);
      try {
        const token = getOAuthToken();
        const res = await fetch(`${BASE_URL}/mediaItems:search`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            pageSize: 50,
            filters: {
              mediaTypeFilter: {
                mediaTypes: [type],
              },
            },
          }),
        });

        const data = (await res.json()) as ListResponse;
        setPhotos(data.mediaItems);
        setLoading(false);
      } catch (error: any) {
        setError(error.message);
        setLoading(false);
      }
    };
    fetchPhotos();
  }, [type]);

  return { photos, loading, error };
};
