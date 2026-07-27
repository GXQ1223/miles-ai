import type {
  AICompositionProvider,
  CompositionDraft,
  CompositionRequest
} from "./types";

export class MockCompositionProvider implements AICompositionProvider {
  async compose(request: CompositionRequest): Promise<CompositionDraft> {
    const sourceIds = request.sources.map((source) => source.assetId);
    return {
      title: "A memory in revision",
      dek: "A placeholder draft showing the contract between source material, present memory, and publication.",
      bodyMarkdown: [
        "## What remained",
        "",
        request.userMemory || "Add the memory that the source artifact cannot explain by itself.",
        "",
        "## Why it matters now",
        "",
        request.readerIntent || "Add what the reader should understand.",
        "",
        "---",
        "",
        `Sources: ${sourceIds.join(", ") || "none selected"}`
      ].join("\n"),
      sourceAssetIds: sourceIds,
      provenance: "AI_ASSISTED"
    };
  }
}
