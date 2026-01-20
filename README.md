# Launchpad UI

A new face for [launchpad.net](https://launchpad.net/) built with Svelte.

## Quickstart

### Prerequisites

- [Bun](https://bun.sh/) (version 1.3 or higher)

### Clone and install dependencies

```bash
git clone https://git.launchpad.net/launchpad-ui
cd launchpad-ui
bun install
```

### Setup environment variables

Running the project against the real backend requires a populated `.env`.

Create a `.env` file in the project root:

```bash
cp .env.mock .env
```

Then update the variables in `.env` as needed.

### Previewing the production build

```bash
bun run build
bun run preview
```

Launchpad UI will be available at [http://localhost:4173](http://localhost:4173).

### Running the development server

```bash
bun run dev
```

Launchpad UI will be available at [http://localhost:5173](http://localhost:5173).

## Job Manager mocking

The app can be run against a local mock server based on the Job Manager OpenAPI schema.

### Mock server workflow

`bun run dev:mock` uses [`.env.mock`](.env.mock) instead of `.env` to point the UI at the local mock server.

Terminal A (mock API):

```bash
bun run mock-server
```

Terminal B (UI):

```bash
bun run dev:mock
```

If you want the mock server to generate dynamic responses instead of always returning examples, use:

```bash
bun run mock-server:dynamic
```

The mock server reads the OpenAPI schema from [`.api-spec/job-manager.yaml`](.api-spec/job-manager.yaml).

## Job Manager OpenAPI

This repo keeps the Job Manager API contract in sync in two ways:

- [`.api-spec/job-manager.yaml`](.api-spec/job-manager.yaml) is the OpenAPI schema used for mocking.
- [`src/lib/api/job-manager/types.ts`](src/lib/api/job-manager/types.ts) is generated TypeScript types used by the client, based on the schema.

### Updating schema + types

Run this to download the latest schema from the Job Manager repo and regenerate types:

```bash
bun run openapi:update
```

The schema download step supports environment variable overrides:

- `JOB_MANAGER_REPO` (default: `job-manager`)
- `JOB_MANAGER_BRANCH` (default: `main`)

Example: update schema/types from `my-branch` in fork `~lp-user/job-manager`:

```bash
JOB_MANAGER_REPO=~lp-user/job-manager JOB_MANAGER_BRANCH=my-branch bun run openapi:update
```

This is useful even when you want to validate and regenerate types against an API branch before it lands.

## Storybook

Use Storybook to develop and test UI components in isolation.

```bash
bun run storybook
```

Storybook will be available at [http://localhost:6006](http://localhost:6006).

## Other useful commands

- `bun run check` runs typechecks + lint.
- `bun run test` runs all tests once.
