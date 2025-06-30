# Launchpad UI

A new face for [launchpad.net](https://launchpad.net) built with Svelte.

## Getting Started

1. **Clone the repository**

   ```bash
   git clone git+ssh://<lp-user>@git.launchpad.net/launchpad-ui
   cd launchpad-ui
   ```

2. **Install dependencies**

   ```bash
   bun install
   ```

3. **Start development server**
   ```bash
   bun run dev
   ```

The application will be available at [http://localhost:5173](http://localhost:5173)

## Available Commands

| Command                      | Description                                      |
| ---------------------------- | ------------------------------------------------ |
| _Development_                |                                                  |
| `bun run dev`                | **Start the development server with hot reload** |
| `bun run storybook`          | **Launch Storybook for component development**   |
| _Building_                   |                                                  |
| `bun run build`              | Build the project for production                 |
| `bun run preview`            | Preview the production build locally             |
| `bun run build-storybook`    | Build Storybook for deployment                   |
| _Code Quality_               |                                                  |
| `bun run format`             | Format code                                      |
| `bun run lint`               | Run formatting and linting checks                |
| `bun run lint:fix`           | Auto-fix formatting and linting issues           |
| `bun run check`              | **Run all checks**                               |
| `bun run check:fix`          | **Run all checks and auto-fix**                  |
| `bun run check:svelte`       | Run type checks                                  |
| `bun run check:svelte:watch` | Run type checks in watch mode                    |
| _Testing_                    |                                                  |
| `bun run test`               | **Run all tests once**                           |
| `bun run test:watch`         | **Run tests in interactive watch mode**          |
| `bun run test:client`        | Run client-side tests                            |
| `bun run test:server`        | Run server-side tests                            |
| `bun run test:ssr`           | Run SSR tests                                    |
