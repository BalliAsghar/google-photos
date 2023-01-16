import fetch from "node-fetch";
import { getOAuthToken } from "../components/withGoogleAuth";
import { ListResponse } from "../types/google";

const BASE_URL = "https://photoslibrary.googleapis.com/v1";

export async function getPhotos(): Promise<ListResponse> {
  const token = getOAuthToken();
  const response = await fetch(`${BASE_URL}/mediaItems`, {
    headers: {
      Authorization: `Bearer ${token}`,
      pageSize: "100",
    },
  });

  if (response.status !== 200) {
    throw new Error("Cannot fetch photos");
  }

  return response.json() as Promise<ListResponse>;
}
