"use strict";
/* Curriculum: tracks, phases, 12 weeks, skill map and daily templates. */
const TRACKS = {
  py: { n: "Python Engineering", c: "#E3B341" },
  llm: { n: "Claude & LLM Engineering", c: "#FF7A33" },
  evals: { n: "Evaluation", c: "#C792EA" },
  sec: { n: "AI Security", c: "#F2556B" },
  cloud: { n: "Cloud Architecture (AWS)", c: "#56B6F7" },
  sys: { n: "Backend & System Design", c: "#7BD389" },
  dsa: { n: "Algorithms & Interviews", c: "#A0A6B1" },
  sa: { n: "Solutions Architect Craft", c: "#4FD1C5" },
  career: { n: "Career Assets", c: "#F59ABF" },
};
const PHASES = [
  { n: "Foundations", w: [1, 4], d: "Python, backend and the Claude API. Kairo Phase 1 ships." },
  { n: "Security & Evals", w: [5, 8], d: "Threat model, approvals, AgentGuard and measured results." },
  { n: "Architect & Apply", w: [9, 12], d: "Solution briefs, AWS exam, interviews and applications." },
];
// t = theory topics, p = practical tasks, each [id, text, track]
const WEEKS = [
  {
    n: 1,
    title: "Reset & Python core",
    phase: 0,
    t: [
      ["w1t1", "Python type hints; dataclasses vs Pydantic models", "py"],
      ["w1t2", "pytest basics: tests, fixtures, parametrize", "py"],
      ["w1t3", "Claude Academy: Building with the Claude API (first modules)", "llm"],
      ["w1t4", "OWASP Top 10 for LLM apps: read all 10, note the 3 that hit Kairo", "sec"],
      ["w1t5", "Git workflow: conventional commits, branches, clean PRs", "career"],
    ],
    p: [
      ["w1p1", "Rewrite CV to one page with the new headline", "career"],
      ["w1p2", "GitHub profile README, pin 4 best repos, LinkedIn headline", "career"],
      ["w1p3", "Create the kairo repo: README, layout, ruff pre-commit", "sys"],
      ["w1p4", "Kairo Phase 0 spec: Phase 1 scope, non-goals, 20 evaluation tasks", "evals"],
    ],
    dsa: "Arrays & hashing (6 problems)",
    write: "Write the Phase 0 spec in plain English",
    ms: "New CV live; kairo repo public with its spec",
  },
  {
    n: 2,
    title: "Async Python & FastAPI",
    phase: 0,
    t: [
      ["w2t1", "async/await and the event loop; gather and timeouts", "py"],
      ["w2t2", "FastAPI: routes, dependencies, request and response models", "sys"],
      ["w2t3", "Docker: Dockerfile and layers; Compose services, volumes, healthchecks", "sys"],
      ["w2t4", "PostgreSQL: transactions, unique constraints, JSONB", "sys"],
      ["w2t5", "Claude Academy: finish Building with the Claude API (certificate)", "llm"],
    ],
    p: [
      ["w2p1", "FastAPI gateway skeleton with /health and typed errors", "sys"],
      ["w2p2", "docker compose: API + Postgres, data survives a restart", "sys"],
      ["w2p3", "Alembic migration: users, sessions, audit_log (with rollback)", "sys"],
      ["w2p4", "Gateway tests with pytest + httpx", "py"],
    ],
    dsa: "Two pointers",
    write: "Document the local setup in the README",
    ms: "docker compose up runs API + Postgres with tests passing",
  },
  {
    n: 3,
    title: "Claude API & tool use",
    phase: 0,
    t: [
      ["w3t1", "Messages API: system prompts, roles, streaming, stop reasons", "llm"],
      ["w3t2", "Tool use: tool schemas and the tool_use → tool_result loop", "llm"],
      ["w3t3", "Structured output: JSON schema + Pydantic validation", "llm"],
      ["w3t4", "Prompt caching and token budgets; cost per request", "llm"],
      ["w3t5", "AWS foundations: IAM users, roles, policies; regions and AZs", "cloud"],
    ],
    p: [
      ["w3p1", "Telegram webhook → gateway; owner-only allowlist, reject groups", "sec"],
      ["w3p2", "Claude call with a system prompt; reply back to Telegram", "llm"],
      ["w3p3", "Append-only audit log for every request", "sec"],
      ["w3p4", "Per-task token budget; cost recorded per task", "llm"],
    ],
    dsa: "Sliding window + stack",
    write: "Notes: how a Telegram message becomes a task",
    ms: "First Telegram → Claude → Telegram round trip, audited",
  },
  {
    n: 4,
    title: "Agents with LangGraph",
    phase: 0,
    t: [
      ["w4t1", "Workflows vs agents: Anthropic's Building effective agents", "llm"],
      ["w4t2", "LangGraph: state, nodes, edges, conditional routing", "llm"],
      ["w4t3", "Checkpointers and interrupts (human in the loop)", "llm"],
      ["w4t4", "AWS compute and storage: EC2, Lambda, S3 classes", "cloud"],
    ],
    p: [
      ["w4p1", "LangGraph agent with a bounded loop (max steps)", "llm"],
      ["w4p2", "Tool 1: read tomorrow's calendar through your n8n workflow", "llm"],
      ["w4p3", "Tool 2: read GitHub issues with a read-only token", "sec"],
      ["w4p4", "Eval runner v1: run the 20 tasks with pytest, record pass rate", "evals"],
      ["w4p5", "Write-up #1 draft: the model proposes, code decides", "career"],
    ],
    dsa: "Binary search",
    write: "Write-up #1 draft",
    ms: "Kairo Phase 1 done: one agent, two read-only tools, audit log, pass rate recorded",
  },
  {
    n: 5,
    title: "Threat modelling & approvals",
    phase: 1,
    t: [
      ["w5t1", "Threat modelling with STRIDE; trust boundaries; data-flow diagrams", "sec"],
      ["w5t2", "Prompt injection, direct and indirect; why policy lives outside the model", "sec"],
      ["w5t3", "Excessive agency and least privilege; scoped capability tokens", "sec"],
      ["w5t4", "AWS networking: VPC, subnets, security groups, load balancers", "cloud"],
    ],
    p: [
      ["w5p1", "Kairo threat model: data-flow diagram + STRIDE table + mitigations", "sec"],
      ["w5p2", "Risk classification rules in YAML: read, write, irreversible", "sec"],
      ["w5p3", "Approval flow in Telegram: signed one-time token, expiry, audit entry", "sec"],
      ["w5p4", "Publish write-up #1", "career"],
    ],
    dsa: "Linked lists",
    write: "Polish and publish write-up #1",
    ms: "Every write action waits for your approval; threat model published",
  },
  {
    n: 6,
    title: "AgentGuard I",
    phase: 1,
    light: true,
    t: [
      ["w6t1", "Read Simon Willison's prompt injection series (key posts)", "sec"],
      ["w6t2", "Claude Academy: Introduction to Model Context Protocol", "llm"],
      ["w6t3", "Anthropic research: summarise 2 posts in 5 lines each", "career"],
    ],
    p: [
      ["w6p1", "AgentGuard harness: attack cases as YAML (email, issue, web page)", "sec"],
      ["w6p2", "10 injection cases with the expected safe behaviour", "evals"],
      ["w6p3", "Run them against Kairo; record block rate v1", "evals"],
    ],
    dsa: "Review weeks 1–5 (redo 5 problems)",
    write: "AgentGuard notes",
    ms: "AgentGuard v1: 10 cases, first block rate recorded",
  },
  {
    n: 7,
    title: "MCP, secrets & sandboxing",
    phase: 1,
    light: true,
    t: [
      ["w7t1", "MCP: servers, tools, resources, transports", "llm"],
      ["w7t2", "Claude Academy: MCP Advanced Topics", "llm"],
      ["w7t3", "Secrets management and sandboxing: Docker secrets, read-only, no network", "sec"],
    ],
    p: [
      ["w7p1", "Build your own MCP server exposing n8n workflows as typed tools", "llm"],
      ["w7p2", "Move secrets out of code into Docker secrets; rotate the GitHub token", "sec"],
      ["w7p3", "Run tool code in a locked-down container (no network, read-only root)", "sec"],
    ],
    dsa: "Trees: traversals",
    write: "README for the MCP server",
    ms: "Your MCP server on GitHub; no secret in code or logs",
  },
  {
    n: 8,
    title: "Evals & proof",
    phase: 1,
    t: [
      ["w8t1", "Eval design: deterministic checks first, LLM-as-judge where needed", "evals"],
      ["w8t2", "Regression evals in CI with GitHub Actions", "evals"],
      ["w8t3", "AWS data: RDS vs DynamoDB, ElastiCache, backups", "cloud"],
      ["w8t4", "AWS resilience: multi-AZ and disaster-recovery strategies", "cloud"],
    ],
    p: [
      ["w8p1", "AgentGuard to 20+ cases; fix what gets through; block rate v2", "sec"],
      ["w8p2", "Evals run on every push in GitHub Actions", "evals"],
      ["w8p3", "README with real numbers: pass rate, block rate, cost per task", "career"],
      ["w8p4", "Demo video v1 (3 min) + write-up #2: injection test results", "career"],
      ["w8p5", "First open-source PR to an MCP or agent project", "career"],
    ],
    dsa: "Trees II + tries",
    write: "Write-up #2 and the demo script",
    ms: "Public README with measured pass rate, block rate and cost",
  },
  {
    n: 9,
    title: "Solutions architect craft",
    phase: 2,
    t: [
      ["w9t1", "Discovery: the questions an architect asks; success criteria", "sa"],
      ["w9t2", "AWS Well-Architected: the 6 pillars", "cloud"],
      ["w9t3", "Reference architectures for LLM apps: RAG, agents, guardrails, evals", "sa"],
      ["w9t4", "Embeddings and pgvector; hybrid retrieval", "llm"],
    ],
    p: [
      ["w9p1", "Solution brief #1: secure Claude support agent for a Sri Lankan bank", "sa"],
      ["w9p2", "Kairo memory: pgvector store for stated preferences, with delete", "llm"],
      ["w9p3", "AWS practice exam #1; list your weak domains", "cloud"],
      ["w9p4", "Book the AWS Solutions Architect Associate exam for week 11", "cloud"],
    ],
    dsa: "Heaps + graphs (BFS/DFS)",
    write: "Solution brief #1",
    ms: "Solution brief #1 published; exam date booked",
  },
  {
    n: 10,
    title: "System design",
    phase: 2,
    t: [
      ["w10t1", "System design method: requirements, estimates, API, data, scale", "sys"],
      ["w10t2", "Caching, queues, rate limiting, idempotency", "sys"],
      ["w10t3", "AWS weak domains from practice exam #1", "cloud"],
      ["w10t4", "Cost estimates for LLM workloads: tokens, caching, model routing", "sa"],
    ],
    p: [
      ["w10p1", "Solution brief #2: agentic operations assistant for SMEs", "sa"],
      ["w10p2", "AWS practice exam #2 (aim for 75%+)", "cloud"],
      ["w10p3", "Mock system design interview #1, recorded", "career"],
      ["w10p4", "Write-up #3: what to check before deploying an agent", "career"],
    ],
    dsa: "Graphs II",
    write: "Write-up #3 / brief #2",
    ms: "Solution brief #2 published; practice exam 75%+",
  },
  {
    n: 11,
    title: "Exam & interview prep",
    phase: 2,
    t: [
      ["w11t1", "AWS final review with practice exam #3", "cloud"],
      ["w11t2", "Anthropic job posts: map each line to your proof", "career"],
      ["w11t3", "STAR stories: 6 from Brandiflow, Waypoint and Kairo", "career"],
    ],
    p: [
      ["w11p1", "Sit the AWS Solutions Architect Associate exam", "cloud"],
      ["w11p2", "10-minute Kairo demo for a non-technical CTO, recorded", "sa"],
      ["w11p3", "Why Anthropic answer, 200–400 words", "career"],
      ["w11p4", "Mock interviews x2: system design + customer scenario", "career"],
    ],
    dsa: "1-D dynamic programming",
    write: "Practise the 10-minute demo out loud",
    ms: "AWS exam taken; demo recorded",
  },
  {
    n: 12,
    title: "Launch & apply",
    phase: 2,
    t: [
      ["w12t1", "Retrospective: what worked, what to drop", "career"],
      ["w12t2", "Plan the next 90 days", "career"],
    ],
    p: [
      ["w12p1", "Final one-page CV with Kairo numbers and certificates", "career"],
      ["w12p2", "loheeshan.me project pages: Kairo, AgentGuard, briefs", "career"],
      ["w12p3", "Apply: Anthropic open roles (Bengaluru first) + 25 target roles", "career"],
      ["w12p4", "Outreach: 10 messages to solutions and AI engineers", "career"],
    ],
    dsa: "Mixed review (10 problems)",
    write: "Outreach messages",
    ms: "Applications out; everything public",
  },
];
// Skill map: track → headings → subtopics. weeks = where it is studied.
const SKILLS = [
  {
    k: "py",
    why: "Required in every Applied AI posting. Kairo is written in it.",
    h: [
      {
        n: "Language core",
        w: [1],
        s: [
          "Type hints",
          "Dataclasses and Pydantic models",
          "Generators and comprehensions",
          "Errors and custom exceptions",
        ],
        r: [
          ["Python tutorial", "https://docs.python.org/3/tutorial/"],
          ["Pydantic docs", "https://docs.pydantic.dev/latest/"],
        ],
      },
      {
        n: "Async Python",
        w: [2],
        s: ["Event loop", "async / await", "gather and timeouts", "httpx async client"],
        r: [["asyncio docs", "https://docs.python.org/3/library/asyncio.html"]],
      },
      {
        n: "Code quality",
        w: [1, 2],
        s: ["pytest and fixtures", "Mocking external APIs", "ruff and type checking", "Project layout"],
        r: [["pytest docs", "https://docs.pytest.org/"]],
      },
    ],
  },
  {
    k: "llm",
    why: "The core of the job: build with Claude, tools, agents and MCP.",
    h: [
      {
        n: "Claude API",
        w: [1, 2, 3],
        s: ["Messages and system prompts", "Streaming", "Token counting and cost", "Prompt caching"],
        r: [
          ["Claude Academy", "https://academy.claude.com"],
          ["Claude docs", "https://docs.claude.com"],
        ],
      },
      {
        n: "Tool use",
        w: [3],
        s: ["Tool schemas", "Tool-use loop", "Structured JSON output", "Tool errors"],
        r: [["Claude docs", "https://docs.claude.com"]],
      },
      {
        n: "Agents",
        w: [4],
        s: [
          "Workflows vs agents",
          "LangGraph state graphs",
          "Checkpoints and interrupts",
          "Bounded loops and budgets",
        ],
        r: [
          ["Anthropic engineering blog", "https://www.anthropic.com/engineering"],
          ["LangGraph", "https://github.com/langchain-ai/langgraph"],
        ],
      },
      {
        n: "Model Context Protocol",
        w: [6, 7],
        s: ["Tools, resources, prompts", "Build a server", "Transports and auth"],
        r: [["MCP docs", "https://modelcontextprotocol.io"]],
      },
      {
        n: "Memory & retrieval",
        w: [9],
        s: ["Embeddings", "pgvector", "Hybrid search", "Citing sources"],
        r: [["pgvector", "https://github.com/pgvector/pgvector"]],
      },
    ],
  },
  {
    k: "evals",
    why: "Architects help customers measure Claude on their own tasks.",
    h: [
      {
        n: "Eval design",
        w: [1, 4, 8],
        s: [
          "Task sets with expected outcomes",
          "Deterministic checks",
          "LLM-as-judge",
          "Regression runs in CI",
        ],
        r: [["Your AI product needs evals", "https://hamel.dev/blog/posts/evals/"]],
      },
      {
        n: "Metrics",
        w: [4, 6, 8],
        s: ["Pass rate", "Cost and latency per task", "Injection block rate"],
        r: [],
      },
    ],
  },
  {
    k: "sec",
    why: "Your edge: deploying agents safely. Links straight to AgentGuard.",
    h: [
      {
        n: "LLM threats",
        w: [1, 5, 6],
        s: [
          "OWASP Top 10 for LLM apps",
          "Direct and indirect prompt injection",
          "Excessive agency",
          "Sensitive data disclosure",
        ],
        r: [
          ["OWASP LLM Top 10", "https://genai.owasp.org/llm-top-10/"],
          ["Prompt injection series", "https://simonwillison.net/series/prompt-injection/"],
        ],
      },
      {
        n: "Threat modelling",
        w: [5],
        s: ["STRIDE", "Trust boundaries", "Data-flow diagrams", "Abuse cases"],
        r: [
          [
            "OWASP threat modelling",
            "https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html",
          ],
        ],
      },
      {
        n: "Controls",
        w: [3, 5, 7],
        s: [
          "Least privilege and scoped tokens",
          "Human approval",
          "Secrets management",
          "Sandboxing",
          "Audit logs",
        ],
        r: [
          [
            "OWASP secrets management",
            "https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html",
          ],
        ],
      },
    ],
  },
  {
    k: "cloud",
    why: "Architect roles expect you to design on a cloud. The certificate passes CV filters.",
    h: [
      {
        n: "Foundations",
        w: [3],
        s: ["IAM", "Regions and AZs", "Shared responsibility"],
        r: [["AWS Skill Builder", "https://skillbuilder.aws"]],
      },
      {
        n: "Compute & network",
        w: [4, 5],
        s: ["EC2 and Lambda", "S3", "VPC and security groups", "Load balancers"],
        r: [],
      },
      {
        n: "Data & resilience",
        w: [8],
        s: ["RDS vs DynamoDB", "Caching", "Backups and disaster recovery"],
        r: [],
      },
      {
        n: "Design & exam",
        w: [9, 10, 11],
        s: ["Well-Architected pillars", "Cost optimisation", "Practice exams", "The exam"],
        r: [
          ["Well-Architected", "https://aws.amazon.com/architecture/well-architected/"],
          ["SAA exam page", "https://aws.amazon.com/certification/certified-solutions-architect-associate/"],
        ],
      },
    ],
  },
  {
    k: "sys",
    why: "Kairo's backend, and the system design interview.",
    h: [
      {
        n: "Backend",
        w: [2],
        s: ["FastAPI", "Postgres transactions and indexes", "Alembic migrations", "Docker Compose"],
        r: [
          ["FastAPI tutorial", "https://fastapi.tiangolo.com/tutorial/"],
          ["Compose docs", "https://docs.docker.com/compose/"],
        ],
      },
      {
        n: "System design",
        w: [10],
        s: ["Requirements and estimates", "Caching", "Queues and idempotency", "Rate limiting"],
        r: [["System design primer", "https://github.com/donnemartin/system-design-primer"]],
      },
    ],
  },
  {
    k: "dsa",
    why: "Coding interviews still filter on it. 30 minutes a day, every day.",
    h: [
      {
        n: "Core patterns",
        w: [1, 2, 3, 4],
        s: ["Arrays and hashing", "Two pointers", "Sliding window and stack", "Binary search"],
        r: [["NeetCode roadmap", "https://neetcode.io/roadmap"]],
      },
      {
        n: "Data structures",
        w: [5, 7, 8, 9],
        s: ["Linked lists", "Trees", "Tries", "Heaps", "Graphs"],
        r: [],
      },
      { n: "Advanced", w: [10, 11, 12], s: ["Graphs II", "1-D dynamic programming", "Mixed review"], r: [] },
    ],
  },
  {
    k: "sa",
    why: "The actual job: discovery, design, cost and explaining it to a customer.",
    h: [
      { n: "Discovery", w: [9], s: ["Discovery questions", "Requirements", "Success criteria"], r: [] },
      {
        n: "Design & cost",
        w: [9, 10],
        s: ["Reference architectures for LLM apps", "Cost estimates"],
        r: [],
      },
      {
        n: "Communication",
        w: [9, 10, 11],
        s: [
          "Solution briefs",
          "Architecture diagrams",
          "Executive demo",
          "Workshops (you already run these)",
        ],
        r: [["Google technical writing", "https://developers.google.com/tech-writing"]],
      },
    ],
  },
  {
    k: "career",
    why: "Proof that a recruiter can see in 30 seconds.",
    h: [
      {
        n: "Profiles",
        w: [1, 12],
        s: ["One-page CV", "GitHub profile", "LinkedIn", "Portfolio project pages"],
        r: [],
      },
      { n: "Proof", w: [4, 5, 8, 10], s: ["3 write-ups", "Demo video", "Open-source PR"], r: [] },
      {
        n: "Applications",
        w: [11, 12],
        s: ["Why Anthropic", "STAR stories", "Mock interviews", "Applications and outreach"],
        r: [["Anthropic careers", "https://www.anthropic.com/careers"]],
      },
    ],
  },
];
const LEVELS = ["Not started", "Learning", "Can build it", "Can explain it in an interview"];

/* Daily templates. slot decides the start time. T = theory, P = practical. */
const BLOCKS = {
  dsa: { l: "Algorithms", ty: "P", slot: "morning" },
  theory: { l: "Theory", ty: "T", slot: "evening" },
  build: { l: "Build", ty: "P", slot: "evening" },
  write: { l: "Write & present", ty: "P", slot: "evening" },
  wbuild: { l: "Build", ty: "P", slot: "weekend" },
  wwrite: { l: "Write & present", ty: "P", slot: "weekend" },
  review: { l: "Review & plan", ty: "T", slot: "sunday" },
};
// index by JS weekday: 0 Sun … 6 Sat. [blockKey, minutes]
const TEMPLATE = {
  normal: {
    1: [
      ["dsa", 30],
      ["theory", 90],
      ["build", 120],
    ],
    2: [
      ["dsa", 30],
      ["theory", 60],
      ["build", 120],
      ["write", 30],
    ],
    3: [
      ["dsa", 30],
      ["theory", 90],
      ["build", 120],
    ],
    4: [
      ["dsa", 30],
      ["theory", 60],
      ["build", 120],
      ["write", 30],
    ],
    5: [
      ["dsa", 30],
      ["theory", 90],
      ["build", 120],
    ],
    6: [
      ["wbuild", 180],
      ["wwrite", 60],
    ],
    0: [["review", 90]],
  },
  light: {
    1: [
      ["dsa", 30],
      ["theory", 60],
      ["build", 60],
    ],
    2: [
      ["dsa", 30],
      ["theory", 60],
      ["build", 60],
    ],
    3: [
      ["dsa", 30],
      ["theory", 60],
      ["build", 60],
    ],
    4: [
      ["dsa", 30],
      ["theory", 60],
      ["build", 60],
    ],
    5: [
      ["dsa", 30],
      ["theory", 60],
      ["build", 60],
    ],
    6: [["wbuild", 120]],
    0: [["review", 30]],
  },
};
const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DOW_ORDER = [1, 2, 3, 4, 5, 6, 0];