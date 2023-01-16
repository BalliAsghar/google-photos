import { useState } from "react";
import { Grid, ActionPanel, Action, Detail, Toast, showToast } from "@raycast/api";
import { withGoogleAuth } from "./components/withGoogleAuth";
import { usePhotos } from "./hooks/usePhotos";
import { usePhoto } from "./hooks/usePhoto";

const sorts = [
  { id: "all", name: "All", value: "ALL_MEDIA" },
  { id: "photos", name: "Photos", value: "PHOTO" },
  { id: "videos", name: "Videos", value: "VIDEO" },
];

const GooglePhotos: React.FunctionComponent = () => {
  const [type, setType] = useState<string>("ALL_MEDIA");
  const { photos, loading, error } = usePhotos(type);

  return (
    <Grid
      columns={4}
      inset={Grid.Inset.Zero}
      filtering={false}
      isLoading={loading}
      searchBarAccessory={
        <Grid.Dropdown tooltip="Sort By" storeValue={false} onChange={setType}>
          <Grid.Dropdown.Section title="Sort By">
            {sorts.map((type) => (
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
              <Action.Push title="View" target={<Photo id={photo.id} />} />
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

const Photo = ({ id }: { id: string }) => {
  const { photo, loading, error } = usePhoto(id);

  if (error) {
    showToast(Toast.Style.Failure, "Error", error);
  }

  return (
    <Detail
      isLoading={loading}
      markdown={`![${photo?.filename}](${photo?.baseUrl})`}
      navigationTitle={photo?.filename}
      actions={
        <ActionPanel>
          <Action.OpenInBrowser url={photo?.productUrl ?? ""} />
        </ActionPanel>
      }
      metadata={
        <Detail.Metadata>
          <Detail.Metadata.Label title="Filename" text={photo?.filename} />
          <Detail.Metadata.Label title="MIME Type" text={photo?.mimeType} />
          <Detail.Metadata.Label
            title="Created"
            text={photo?.mediaMetadata?.creationTime && new Date(photo?.mediaMetadata?.creationTime).toLocaleString()}
          />
          <Detail.Metadata.Label title="Width" text={photo?.mediaMetadata?.width.toString() + "px"} />
          <Detail.Metadata.Label title="Width" text={photo?.mediaMetadata?.height.toString() + "px"} />
          <Detail.Metadata.Separator />
          <Detail.Metadata.Link title="View in Google Photos" target={photo?.productUrl ?? ""} text="Open in Browser" />
        </Detail.Metadata>
      }
    />
  );
};
