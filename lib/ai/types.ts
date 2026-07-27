export interface CompositionSource {
  assetId: string;
  kind: "image" | "video" | "audio" | "text" | "document";
  caption?: string;
  extractedText?: string;
  temporaryReadUrl?: string;
}

export interface CompositionMessage {
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

export interface CompositionRequest {
  sources: CompositionSource[];
  userMemory: string;
  readerIntent: string;
  messages: CompositionMessage[];
}

export interface CompositionDraft {
  title: string;
  dek: string;
  bodyMarkdown: string;
  sourceAssetIds: string[];
  provenance: "AI_ASSISTED";
}

export interface AICompositionProvider {
  compose(request: CompositionRequest): Promise<CompositionDraft>;
}
