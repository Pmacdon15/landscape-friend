import { Client } from "./types-clients";

export interface ImageListViewProps {
  client: Client;
  setView: (view: string) => void;
  previewSrc: string | null;
  setPreviewSrc: (src: string | null) => void;
}