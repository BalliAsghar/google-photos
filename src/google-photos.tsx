import { useEffect, useState } from "react";
import { getPhotos, getPhoto } from "./api/google";
import { Grid, ActionPanel, Action, Detail, Icon } from "@raycast/api";
import { withGoogleAuth } from "./components/withGoogleAuth";
import { ListResponse, MediaItem, MediaMetadata } from "./types/google";

const sorts = [
  { id: "all", name: "All", value: "ALL_MEDIA" },
  { id: "photos", name: "Photos", value: "PHOTOS" },
  { id: "videos", name: "Videos", value: "VIDEOS" },
];

const categories = [
  { id: "albums", name: "Albums", value: "ALBUMS" },
  { id: "sharedAlbums", name: "Shared Albums", value: "SHARED_ALBUMS" },
];

const GooglePhotos: React.FunctionComponent = () => {
  const [photos, setPhotos] = useState<MediaItem[]>([]);
  const [type, setType] = useState<string>("ALL_MEDIA");

  useEffect(() => {
    async function fetchPhotos() {
      const response: ListResponse = await getPhotos();
      const mediaItems: MediaItem[] = response.mediaItems;
      setPhotos(mediaItems);
    }

    fetchPhotos();
  }, []);

  return (
    <Grid
      columns={6}
      inset={Grid.Inset.Zero}
      filtering={false}
      isLoading={photos.length === 0}
      searchBarAccessory={
        <Grid.Dropdown tooltip="Sort By" storeValue={true} onChange={(newValue) => setType(newValue)}>
          <Grid.Dropdown.Section title="Sort By">
            {sorts.map((type) => (
              <Grid.Dropdown.Item key={type.id} title={type.name} value={type.value} />
            ))}
          </Grid.Dropdown.Section>
          <Grid.Dropdown.Section title="Categories">
            {categories.map((type) => (
              <Grid.Dropdown.Item key={type.id} title={type.name} value={type.value} />
            ))}
          </Grid.Dropdown.Section>
        </Grid.Dropdown>
      }
    >
      {photos.map((photo) => (
        <Grid.Item
          key={photo.id}
          content={photo.baseUrl}
          actions={
            <ActionPanel>
              <Action.Push title="View Photo" target={<Photo photo={photo.id} />} />
              <Action.OpenInBrowser url={photo.productUrl} />
            </ActionPanel>
          }
        />
      ))}
    </Grid>
  );
};

export default function Command() {
  return withGoogleAuth(<GooglePhotos />);
}

const Photo = ({ photo }: { photo: string }) => {
  const [mediaItem, setMediaItem] = useState<MediaItem>();

  useEffect(() => {
    async function fetchPhoto() {
      const response: MediaItem = await getPhoto(photo);
      setMediaItem(response);
    }

    fetchPhoto();
  }, []);

  return (
    <Detail
      markdown={`![${mediaItem?.filename}](${mediaItem?.baseUrl})`}
      navigationTitle={mediaItem?.filename}
      actions={
        <ActionPanel>
          <Action.OpenInBrowser url={mediaItem?.productUrl ?? ""} />
        </ActionPanel>
      }
      metadata={
        <Detail.Metadata>
          <Detail.Metadata.Label title="Filename" text={mediaItem?.filename} />
          <Detail.Metadata.Label title="MIME Type" text={mediaItem?.mimeType} />
          <Detail.Metadata.Label title="Created" text={mediaItem?.mediaMetadata?.creationTime} />
          <Detail.Metadata.Label title="Width" text={mediaItem?.mediaMetadata?.width.toString() + "px"} />
          <Detail.Metadata.Label title="Width" text={mediaItem?.mediaMetadata?.height.toString() + "px"} />
          <Detail.Metadata.Separator />
          <Detail.Metadata.Link
            title="View in Google Photos"
            target={mediaItem?.productUrl ?? ""}
            text="Open in Browser"
          />
        </Detail.Metadata>
      }
    />
  );
};
