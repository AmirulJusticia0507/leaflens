
# Project Directory Structure

```files
leaflens/
├── apps/
│   ├── web/                    # Next.js App Router
│   │   ├── app/
│   │   │   ├── (dashboard)/   # Halaman Monitoring & History
│   │   │   ├── scan/          # Halaman Scan Daun / Kamera
│   │   │   └── api/           # Proxy routes bila diperlukan
│   │   ├── components/        # UI Components (Shadcn/Tailwind)
│   │   └── package.json
│   │
│   └── api/                    # Python FastAPI Backend
│       ├── app/
│       │   ├── api/v1/        # Endpoints (scan.py, plants.py, history.py)
│       │   ├── core/          # Config, DB connection, Ollama Client
│       │   ├── models/        # SQLModel / SQLAlchemy Models
│       │   ├── schemas/       # Pydantic Schemas
│       │   └── services/      # Ollama DeepSeek Service Logic
│       ├── main.py
│       └── pyproject.toml
│
├── packages/
│   └── shared/                # Shared TypeScript types & Constants
├── pnpm-workspace.yaml
├── README.md
└── package.json
```
