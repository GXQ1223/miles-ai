export const featuredSystems = [
  {
    slug: "safe-ai-actions",
    title: "Making AI safe enough to act",
    summary:
      "Guardrails, validation, and human escalation for LLM agents that take real actions in production logistics operations.",
    stack: ["Zendesk", "Salesforce", "Deposco", "Snowflake"],
    sections: {
      reality:
        "Customer support and fulfillment teams needed an AI agent that could actually resolve tickets — not just draft a reply for a human to check. But the underlying systems (Zendesk, Salesforce, Deposco, Snowflake) were never built for a non-deterministic caller, and a wrong action costs real money and customer trust.",
      role:
        "I architected the tool-augmented agent layer: intent detection, a validation pass before any tool call, and a confidence-gated escalation path to a human when the agent wasn't sure. I owned this end to end, from design through production reliability.",
      systemMap:
        "Request → intent classification → constrained tool selection → validation against business rules → execution against Zendesk/Salesforce/Deposco/Snowflake → confidence check → either resolve or escalate to a human queue with full context attached.",
      hardDecision:
        "The tempting path was to let the agent act whenever it produced a plausible-looking answer. I chose to gate on confidence and escalate instead of guess — trading full automation for a system people would actually trust with real orders.",
      failureModes:
        "Multi-intent messages that looked single-intent, third-party API timeouts and retries that could double-submit an action if not made idempotent, and silent wrong answers that look confident. Each needed its own guard, not a single catch-all.",
      outcome:
        "The agent runs in production across fulfillment and 3PL support workflows. Diagnosing bottlenecks in the request path also lifted overall system throughput roughly 13×.",
      atScale:
        "At 100× the volume, the fixed validation rules become a bottleneck of their own. I'd move toward a policy engine with per-customer configuration and a continuous evaluation harness, so guardrails can be tuned and tested without a redeploy."
    }
  },
  {
    slug: "hostile-integrations",
    title: "Building through systems I do not control",
    summary:
      "A natural-language interface over fragmented operational data, so non-technical ops teams can ask questions without filing an engineering ticket.",
    stack: ["Zendesk", "Salesforce", "Deposco", "Snowflake"],
    sections: {
      reality:
        "Operational data lived scattered across Zendesk, Salesforce, Deposco, and Snowflake, with no single source of truth. Ops teams needed answers in minutes, but every question meant waiting on an engineer to write a query.",
      role:
        "I built the LLM-powered interface that turns a plain-language question into a query, and — more importantly — designed the validation and safe-execution pipeline that stands between a generated query and production data.",
      systemMap:
        "Natural-language question → schema-aware prompt construction → generated query → validation and sandboxed execution → formatted result, with ambiguous or unresolvable requests routed back for clarification instead of a guessed answer.",
      hardDecision:
        "I chose to validate and sandbox every generated query rather than trust the model's output directly. It's slower per request, but it's the difference between a tool ops teams can rely on and one that quietly returns a wrong number.",
      failureModes:
        "Malformed or ambiguous generated queries, schema references that drift as the underlying data model changes, and the most dangerous failure mode of all: a query that runs successfully but answers the wrong question.",
      outcome:
        "Non-technical operations users now query production data directly in plain language, without opening an engineering ticket for every question.",
      atScale:
        "Scaling this across more data sources means the schema-aware prompt stops being enough on its own. I'd build a semantic layer that federates across sources and an evaluation harness that catches correctness drift as schemas evolve."
    }
  },
  {
    slug: "multi-tenant-ai",
    title: "One platform, many customer realities",
    summary:
      "An internal agent-management platform where authentication, feature visibility, and workflows all have to flex per customer without forking the codebase.",
    stack: ["AWS Cognito", "Amplify", "Next.js"],
    sections: {
      reality:
        "One platform served many customers, each with different workflows, integrations, and access rules. A single shared codebase had to feel purpose-built to every one of them without becoming a maze of one-off conditionals.",
      role:
        "I architected a two-layer authentication model — exchanging Cognito sessions for platform access tokens — and a dynamic feature-visibility system that gates the UI per user based on feature flags, entitlements, and domain rules.",
      systemMap:
        "Browser → AWS Cognito/Amplify session → Next.js API routes acting as a backend-for-frontend → platform access tokens issued and refreshed server-side → feature-gated dashboard UI, with session replay, audio playback, and analytics layered on top.",
      hardDecision:
        "I kept every token and header server-side behind the BFF instead of trusting the client with them directly. It added a hop and some latency, but it meant no credential ever had to live in the browser.",
      failureModes:
        "Token refresh races during long sessions, entitlement configuration drifting out of sync with what a customer actually purchased, and per-tenant configuration sprawling into something nobody could reason about.",
      outcome:
        "The platform now manages AI agents, tool configuration, workflows, analytics, and support ticket data for multiple customers from one codebase.",
      atScale:
        "At far more tenants, per-tenant conditionals stop being viable. I'd push isolation down into the data layer itself and treat tenant configuration as versioned code, with automated tests for entitlement correctness."
    }
  }
];

export const otherProjects = [
  {
    title: "intdesign.ai",
    year: "2024",
    role: "Solo build",
    summary:
      "A full-stack AI tool that generates interior design concepts and moodboards — prompt interface, image-generation pipeline, and results UI.",
    href: "https://intdesign.ai"
  },
  {
    title: "NewBee Running Club",
    year: "2023",
    role: "Full-stack build",
    summary:
      "Frontend and backend for a running community platform serving NYC members — the same instinct as this site: give a community a real, working home.",
    href: "https://newbeerunning.org"
  },
  {
    title: "Generative design tooling, KPF",
    year: "2021–2024",
    role: "Computational design & visualization",
    summary:
      "Parametric tools that iterated large-scale project options, compressing exploration cycles from weeks to hours, plus the visualization tooling used in client and city-agency reviews.",
    href: "/architecture"
  }
];

export const currentChapter = {
  building: "Customer-facing AI systems for logistics and fulfillment at BackOps AI",
  learning: "Finishing a CS-focused master's at Penn — infrastructure, systems design, and evaluation",
  running: "The next long-distance training cycle",
  question: "How can a personal archive become a living work of art?"
};

export const sampleVaultAssets = [
  {
    id: "asset_001",
    capturedAt: "2016-05-14",
    kind: "image",
    title: "A photograph waiting for context",
    visibility: "PRIVATE",
    status: "INGESTED",
    tags: ["architecture", "memory"]
  },
  {
    id: "asset_002",
    capturedAt: "2024-11-03",
    kind: "image",
    title: "New York City Marathon",
    visibility: "PRIVATE",
    status: "ENRICHED",
    tags: ["running", "new-york", "marathon"]
  },
  {
    id: "asset_003",
    capturedAt: "2026-07-26",
    kind: "journal",
    title: "The idea for miles.ai",
    visibility: "PRIVATE",
    status: "DRAFT_SOURCE",
    tags: ["website", "identity", "archive"]
  }
];
