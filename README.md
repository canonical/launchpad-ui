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

`TEST_OBSERVER_IMAGE_ARTIFACTS_URL` configures the server-side image endpoint.
Set it to `https://tests-api.ubuntu.com/v1/artefacts?family=image` for the
production Test Observer API. When this variable is unset or empty, image
listing and count queries use the bundled `resolute` image fixtures without
making HTTP requests, and log a warning once when the client module loads.
Other series return no fixture images. If a URL is configured, API failures are
reported rather than replaced with fixture data.

The Test Observer client caches successful responses in memory for 60 seconds
per server process. Page queries and image counts share this cache and concurrent
requests; failed requests are not cached. Filtering, sorting, and pagination are
performed by the client on the cached collection.

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

In development, series pages (for example `/ubuntu/resolute`) include an
"Images (development test)" section showing the `getSeriesImages` and
`getSeriesImageCounts` responses. Use Previous/Next to test pagination.
The section is not included in production builds.

## Storybook

Use Storybook to develop and test UI components in isolation.

```bash
pnpm storybook
```

Storybook will be available at [http://localhost:6006](http://localhost:6006).

## Other useful commands

- `pnpm check` runs typechecks + lint.
- `pnpm test` runs all tests once.
