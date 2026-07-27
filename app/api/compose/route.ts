import { MockCompositionProvider } from "@/lib/ai/mock";
import type { CompositionRequest } from "@/lib/ai/types";

export async function POST(request: Request) {
  const body = await request.json() as CompositionRequest;

  if (!Array.isArray(body.sources)) {
    return Response.json({ error: "sources must be an array" }, { status: 400 });
  }

  // Replace through a provider factory after adding OpenAI/Anthropic adapters.
  const provider = new MockCompositionProvider();
  const draft = await provider.compose(body);
  return Response.json(draft);
}
