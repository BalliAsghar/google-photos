import fetch from "node-fetch";
import { getOAuthToken } from "../components/withGoogleAuth";
import { ListResponse } from "../types/google";

const BASE_URL = "https://photoslibrary.googleapis.com/v1";

export async function getPhotos() {
  const token = await getOAuthToken();
  const response = await fetch(`${BASE_URL}/mediaItems`, {
    headers: {
      Authorization: `Bearer ${token}`,
      pageSize: "100",
    },
  });

  const data = await response.json();
  return data as ListResponse;
}
