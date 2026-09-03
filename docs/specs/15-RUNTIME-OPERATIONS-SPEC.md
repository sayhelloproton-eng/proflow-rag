# Runtime Operations Spec

Status: DRAFT_FOR_FREEZE

## Development
Use repository-owned scripts such as `pnpm dev`, database setup/migrate scripts and tunnel lifecycle scripts. Development does not introduce launchd.

## Stable Local Hosting
After the project is stable, macOS `launchd` may call repository-owned start scripts for long-running service recovery. launchd must not own business lifecycle logic and must not modify existing `gptweb-mcp` management.

## Isolation
- Dedicated database: `proflow_rag`.
- Dedicated backend port.
- Dedicated Dev Tunnel identity and scripts.
- Dedicated logs/configuration.
- Never use broad process commands such as `killall node` or `pkill node`.

## Tunnel
Use one stable Microsoft Dev Tunnel for this project, matching the database-style namespace isolation: one project, one owned resource. The public Site depends on its HTTPS endpoint.

## Health
Runtime status must distinguish API, PostgreSQL, active snapshot, tunnel and model-service readiness.
