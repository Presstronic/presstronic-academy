# Services

Independently deployable backend services live here once they are justified by
deployment, scaling, or operational boundaries.

- `code-runner`: isolated code execution
- `notifications`: notification delivery
- `billing`: billing integration

These directories are placeholders until accepted OpenSpec proposals activate
them. Production behavior starts in `apps/api` or `apps/worker` unless a service
proposal defines an independent deployment boundary.
