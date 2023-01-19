import { ActionPanel, Form, Action, Toast, showToast, Icon } from "@raycast/api";
import { useState } from "react";
import { validMediaTypes, GetToken, createMediaItem } from "./utils";
import { withGoogleAuth } from "./components/withGoogleAuth";

const GoogleUpload: React.FunctionComponent = () => {
  const [files, setFiles] = useState<string[]>([]);
  const [error, setError] = useState<string | undefined>();

  const uploadFiles = async (files: Array<any>) => {
    if (!files.length) {
      setError("No files selected");
      return;
    }

    const validFiles = files.filter((file) => validMediaTypes.includes(file.split(".").pop()!));

    if (!validFiles.length) {
      setError("No valid files selected");
      return;
    }

    const toast = await showToast(Toast.Style.Animated, "Getting token...");

    await Promise.all(
      validFiles.map(async (file) => {
        const token = await GetToken(file);
        if (!token) return;
        toast.title = "Uploading";
        toast.message = `${file.split("/").pop()}`;
        await createMediaItem(token);
      })
    );

    toast.style = Toast.Style.Success;
    toast.message = "Upload complete";
    toast.title = "Success";
  };

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Submit" onSubmit={({ files }) => uploadFiles(files)} icon={Icon.Upload} />
        </ActionPanel>
      }
    >
      <Form.FilePicker id="files" value={files} onChange={setFiles} error={error} />
      <Form.Separator />
    </Form>
  );
};

export default function Command() {
  return withGoogleAuth(<GoogleUpload />);
}
