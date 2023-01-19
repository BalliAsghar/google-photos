import { ActionPanel, Form, Action, Toast, showToast } from "@raycast/api";
import { useState } from "react";
import { validMediaTypes } from "./utils";

export default function Command() {
  const [files, setFiles] = useState<string[]>([]);
  const [error, setError] = useState<string | undefined>();
  const [logs, setLogs] = useState<string[]>([]);

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

    const toast = await showToast(Toast.Style.Animated, "Uploading files...");
  };

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Submit" onSubmit={({ files }) => uploadFiles(files)} />
        </ActionPanel>
      }
    >
      <Form.FilePicker id="files" value={files} onChange={setFiles} error={error} />
      <Form.Separator />
      {logs.map((log) => (
        <Form.Description text={log} />
      ))}
    </Form>
  );
}
