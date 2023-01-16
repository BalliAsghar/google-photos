import { useEffect, useState } from "react";
import { getPhotos } from "./api/google";
import { Grid } from "@raycast/api";
import { withGoogleAuth } from "./components/withGoogleAuth";
import { ListResponse, MediaItem } from "./types/google";

const GooglePhotos: React.FunctionComponent = () => {
  const [photos, setPhotos] = useState<MediaItem[]>([]);

  useEffect(() => {
    async function fetchPhotos() {
      const response: ListResponse = await getPhotos();
      const mediaItems: MediaItem[] = response.mediaItems;
      setPhotos(mediaItems);
    }

    fetchPhotos();
  }, []);

  return (
    <Grid columns={3} inset={Grid.Inset.Zero} filtering={false}>
      {photos.map((photo) => (
        <Grid.Item key={photo.id} content={photo.baseUrl} />
      ))}
    </Grid>
  );
};

export default function Command() {
  return withGoogleAuth(<GooglePhotos />);
}
