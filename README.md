# Launchpad UI

A new face for [launchpad.net](https://launchpad.net/) built with Svelte.

## Quickstart

### Prerequisites

- [Node.js](https://nodejs.org/) (version 26 LTS or higher)
- [pnpm](https://pnpm.io/) (version 10 or higher)

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
cp .env.mock .env
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

## Storybook

Use Storybook to develop and test UI components in isolation.

```bash
pnpm storybook
```

Storybook will be available at [http://localhost:6006](http://localhost:6006).

## Other useful commands

- `pnpm check` runs typechecks + lint.
- `pnpm test` runs all tests once.
