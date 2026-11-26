# Launchpad UI

A new face for [launchpad.net](https://launchpad.net/) built with Svelte.

## Quickstart

### Prerequisites

- [Node.js](https://nodejs.org/) (version 26 LTS or higher)
- [pnpm](https://pnpm.io/) (version 10 or higher)
- [Docker](https://docs.docker.com/engine/install/) with Compose, for the local database

### Clone and install dependencies

```bash
git clone https://git.launchpad.net/launchpad-ui
cd launchpad-ui
pnpm install
```

### Setup environment variables

Running the project against the real backend requires a populated `.env`.

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Then update the variables in `.env` as needed.

### Previewing the production build

```bash
pnpm build
pnpm preview
```

Launchpad UI will be available at [http://localhost:4173](http://localhost:4173).

### Running the development server

```bash
pnpm dev
```

Launchpad UI will be available at [http://localhost:5173](http://localhost:5173).

### Local database

`pnpm dev` first starts a local PostgreSQL 14 (`compose.yaml`) through the `predev`
script, so Docker must be running. To start only Vite, without the database, run
`pnpm exec vite dev`.

- `pnpm db:up` starts the database.
- `pnpm db:down` stops it. Data is kept in a Docker volume; remove it with
  `docker compose down -v`.

## Storybook

Use Storybook to develop and test UI components in isolation.

```bash
pnpm storybook
```

Storybook will be available at [http://localhost:6006](http://localhost:6006).

## Other useful commands

- `pnpm check` runs typechecks + lint.
- `pnpm test` runs all tests once.

## Coding standards

Read [CODING_STANDARDS.md](CODING_STANDARDS.md) for project conventions.
AI coding assistants should also follow [AGENTS.md](AGENTS.md).
