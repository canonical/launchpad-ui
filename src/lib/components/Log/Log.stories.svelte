<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { Log } from "./index.js";

  const { Story } = defineMeta({
    title: "Components/Log",
    tags: ["autodocs"],
    component: Log,
  });

  const fakeLogs = [
    {
      timestamp: "2024-10-27T10:00:00.000Z",
      level: "info",
      message: "Initializing build agent v4.2.0...",
    },
    {
      timestamp: "2024-10-27T10:00:00.150Z",
      level: "info",
      message:
        "Loading configuration from s3://bucket-configs/prod/manifest.json",
    },
    {
      timestamp: "2024-10-27T10:00:00.420Z",
      level: "info",
      message:
        " /$$$$$$$$                  /$$             /$$$$$$$$                 /$$                 /$$\n|__  $$__/                 | $$            | $$_____/                | $$                | $$\n   | $$  /$$$$$$   /$$$$$$$| $$   /$$      | $$       /$$$$$$$   /$$$$$$$  /$$$$$$   /$$$$$$$\n   | $$ |____  $$ /$$_____/| $$  /$$/      | $$$$$   | $$__  $$ /$$__  $$ /$$__  $$ /$$__  $$\n   | $$  /$$$$$$$|  $$$$$$ | $$$$$$/       | $$__/   | $$  \\ $$| $$  | $$| $$$$$$$$| $$  | $$\n   | $$ /$$__  $$ \\____  $$| $$_  $$       | $$      | $$  | $$| $$  | $$| $$_____/| $$  | $$\n   | $$|  $$$$$$$ /$$$$$$$/| $$ \\  $$      | $$$$$$$$| $$  | $$|  $$$$$$$|  $$$$$$$|  $$$$$$$\n   |__/ \\_______/|_______/ |__/  \\__/      |________/|__/  |__/ \\_______/ \\_______/ \\_______/",
    },
    {
      timestamp: "2024-10-27T10:00:00.800Z",
      level: "debug",
      message:
        "Environment variables loaded: NODE_ENV=production, AWS_REGION=us-east-1, CI=true",
    },
    {
      timestamp: "2024-10-27T10:00:01.200Z",
      level: "info",
      message:
        "Cloning repository https://example.com/acme-corp/monolith-frontend.git...",
    },
    {
      timestamp: "2024-10-27T10:00:02.500Z",
      level: "info",
      message:
        "Repository cloned. HEAD is at commit 8f9a2b1 (Merge pull request #402 from feature/auth-fix)",
    },
    {
      timestamp: "2024-10-27T10:00:02.800Z",
      level: "info",
      message: "Starting dependency installation...",
    },
    {
      timestamp: "2024-10-27T10:00:03.100Z",
      level: "debug",
      message: "Yarn version: 1.22.19",
    },
    {
      timestamp: "2024-10-27T10:00:03.400Z",
      level: "info",
      message: "[1/4] Resolving packages...",
    },
    {
      timestamp: "2024-10-27T10:00:04.200Z",
      level: "info",
      message: "[2/4] Fetching packages...",
    },
    {
      timestamp: "2024-10-27T10:00:04.900Z",
      level: "info",
      message:
        "Downloading binary from https://example.com/sass/node-sass/releases/download/v4.14.1/linux-x64-72_binding.node",
    },
    {
      timestamp: "2024-10-27T10:00:05.500Z",
      level: "warning",
      message:
        'warning " > @testing-library/user-event@13.5.0" has unmet peer dependency "@testing-library/dom@>=7.21.4".',
    },
    {
      timestamp: "2024-10-27T10:00:06.100Z",
      level: "warning",
      message:
        'warning "react-scripts > eslint-config-react-app > eslint-plugin-flowtype@8.0.3" has unmet peer dependency "@babel/plugin-syntax-flow@^7.14.5".',
    },
    {
      timestamp: "2024-10-27T10:00:07.500Z",
      level: "info",
      message: "[3/4] Linking dependencies...",
    },
    {
      timestamp: "2024-10-27T10:00:10.200Z",
      level: "info",
      message: "[4/4] Building fresh packages...",
    },
    {
      timestamp: "2024-10-27T10:00:12.800Z",
      level: "info",
      message: "Done in 9.45s.",
    },
    {
      timestamp: "2024-10-27T10:00:13.000Z",
      level: "info",
      message: "Executing post-install scripts...",
    },
    {
      timestamp: "2024-10-27T10:00:13.500Z",
      level: "debug",
      message: "Running 'husky install'...",
    },
    {
      timestamp: "2024-10-27T10:00:14.000Z",
      level: "info",
      message: "Running linting checks...",
    },
    {
      timestamp: "2024-10-27T10:00:15.200Z",
      level: "error",
      message: "Linting failed on src/utils/legacy/parser.ts",
    },
    {
      timestamp: "2024-10-27T10:00:15.300Z",
      level: "error",
      message:
        "Error: Maximum call stack size exceeded\n    at Object.traverse (/app/node_modules/@babel/traverse/lib/index.js:64:12)\n    at NodePath.visit (/app/node_modules/@babel/traverse/lib/path/context.js:88:33)\n    at TraversalContext.visitQueue (/app/node_modules/@babel/traverse/lib/context.js:103:16)\n    at TraversalContext.visitSingle (/app/node_modules/@babel/traverse/lib/context.js:77:19)\n    at TraversalContext.visit (/app/node_modules/@babel/traverse/lib/context.js:131:19)\n    at Function.traverse.node (/app/node_modules/@babel/traverse/lib/index.js:82:17)\n    at traverse (/app/node_modules/@babel/traverse/lib/index.js:62:12)\n    at NodePath.visit (/app/node_modules/@babel/traverse/lib/path/context.js:88:33)",
    },
    {
      timestamp: "2024-10-27T10:00:15.500Z",
      level: "info",
      message: "Attempting to autofix linting errors...",
    },
    {
      timestamp: "2024-10-27T10:00:16.800Z",
      level: "info",
      message: "Autofix successful. 2 files modified.",
    },
    {
      timestamp: "2024-10-27T10:00:17.000Z",
      level: "info",
      message: "Starting Unit Tests...",
    },
    {
      timestamp: "2024-10-27T10:00:17.500Z",
      level: "info",
      message: "PASS src/components/Button.test.js (1.234s)",
    },
    {
      timestamp: "2024-10-27T10:00:18.000Z",
      level: "info",
      message: "PASS src/components/Header.test.js (0.845s)",
    },
    {
      timestamp: "2024-10-27T10:00:19.200Z",
      level: "info",
      message: "PASS src/utils/helpers.test.js (2.100s)",
    },
    {
      timestamp: "2024-10-27T10:00:20.000Z",
      level: "debug",
      message: "Generating coverage report...",
    },
    {
      timestamp: "2024-10-27T10:00:20.500Z",
      level: "info",
      message:
        "|-----------------------------------|\n| File         | % Stmts | % Branch |\n|--------------|---------|----------|\n| All files    |   85.4  |    78.2  |\n|  src         |   90.1  |    82.5  |\n|  src/utils   |   75.3  |    60.0  |\n|-----------------------------------|",
    },
    {
      timestamp: "2024-10-27T10:00:21.000Z",
      level: "info",
      message: "Compiling TypeScript...",
    },
    {
      timestamp: "2024-10-27T10:00:22.500Z",
      level: "info",
      message: "Building production bundle...",
    },
    {
      timestamp: "2024-10-27T10:00:23.000Z",
      level: "debug",
      message:
        "Webpack config: mode=production, devtool=source-map, minimization=true",
    },
    {
      timestamp: "2024-10-27T10:00:24.500Z",
      level: "info",
      message:
        "Hash: a1b2c3d4e5f6\nVersion: webpack 5.75.0\nTime: 2450ms\nBuilt at: 10/27/2024 10:00:24 AM\n \nAsset       Size  Chunks             Chunk Names\nmain.js  1.2 MiB    main  [emitted]  main\nmain.css  45 KiB    main  [emitted]  main",
    },
    {
      timestamp: "2024-10-27T10:00:25.000Z",
      level: "warning",
      message:
        "Asset size limit exceeded: 'main.js' is 1.2 MiB. Suggested limit is 500 KiB.",
    },
    {
      timestamp: "2024-10-27T10:00:25.500Z",
      level: "info",
      message: "Uploading artifacts to S3...",
    },
    {
      timestamp: "2024-10-27T10:00:26.000Z",
      level: "debug",
      message:
        "S3 Upload: src=./build/main.js dst=s3://bucket-assets/v1.2.3/main.js",
    },
    {
      timestamp: "2024-10-27T10:00:26.500Z",
      level: "debug",
      message:
        "S3 Upload: src=./build/main.css dst=s3://bucket-assets/v1.2.3/main.css",
    },
    {
      timestamp: "2024-10-27T10:00:27.000Z",
      level: "info",
      message:
        "Upload complete. Public URL: https://example.com/assets/v1.2.3/",
    },
    {
      timestamp: "2024-10-27T10:00:27.500Z",
      level: "info",
      message: "Starting Docker build...",
    },
    {
      timestamp: "2024-10-27T10:00:28.000Z",
      level: "info",
      message: "Step 1/10 : FROM node:18-alpine",
    },
    {
      timestamp: "2024-10-27T10:00:28.200Z",
      level: "info",
      message: "Step 2/10 : WORKDIR /app",
    },
    {
      timestamp: "2024-10-27T10:00:28.400Z",
      level: "info",
      message: "Step 3/10 : COPY package*.json ./",
    },
    {
      timestamp: "2024-10-27T10:00:29.000Z",
      level: "info",
      message: "Step 4/10 : RUN npm install --production",
    },
    {
      timestamp: "2024-10-27T10:00:35.000Z",
      level: "info",
      message: 'Step 10/10 : CMD ["node", "server.js"]',
    },
    {
      timestamp: "2024-10-27T10:00:36.000Z",
      level: "info",
      message: "Successfully built 8f9a2b1c3d",
    },
    {
      timestamp: "2024-10-27T10:00:36.500Z",
      level: "info",
      message: "Pushing image to registry...",
    },
    {
      timestamp: "2024-10-27T10:00:40.000Z",
      level: "info",
      message: "Pushed: registry.example.com/monolith:latest",
    },
    {
      timestamp: "2024-10-27T10:00:41.000Z",
      level: "info",
      message: "Triggering Kubernetes deployment...",
    },
    {
      timestamp: "2024-10-27T10:00:41.500Z",
      level: "debug",
      message: "Applying manifest: deployment.yaml",
    },
    {
      timestamp: "2024-10-27T10:00:42.000Z",
      level: "info",
      message: "Waiting for rollout to complete...",
    },
    {
      timestamp: "2024-10-27T10:00:45.000Z",
      level: "info",
      message: "Rollout status: 1 of 3 updated replicas are available...",
    },
    {
      timestamp: "2024-10-27T10:00:48.000Z",
      level: "info",
      message: "Rollout status: 2 of 3 updated replicas are available...",
    },
    {
      timestamp: "2024-10-27T10:00:51.000Z",
      level: "info",
      message:
        'Rollout status: deployment "frontend-app" successfully rolled out.',
    },
    {
      timestamp: "2024-10-27T10:00:52.000Z",
      level: "info",
      message: "Running database migrations...",
    },
    {
      timestamp: "2024-10-27T10:00:53.000Z",
      level: "info",
      message: "Migrating: 20241027100000_add_users_table.js",
    },
    {
      timestamp: "2024-10-27T10:00:53.500Z",
      level: "info",
      message: "Migrating: 20241027100010_add_permissions.js",
    },
    {
      timestamp: "2024-10-27T10:00:54.000Z",
      level: "info",
      message: "Migration complete.",
    },
    {
      timestamp: "2024-10-27T10:00:54.500Z",
      level: "info",
      message: "Verifying service health...",
    },
    {
      timestamp: "2024-10-27T10:00:55.000Z",
      level: "debug",
      message: "GET https://internal-api.cluster.local/health 200 OK",
    },
    {
      timestamp: "2024-10-27T10:00:55.500Z",
      level: "info",
      message: "Service is healthy.",
    },
    {
      timestamp: "2024-10-27T10:00:56.000Z",
      level: "info",
      message: "Cleaning up workspace...",
    },
    {
      timestamp: "2024-10-27T10:00:56.500Z",
      level: "debug",
      message: "Removing temp directories /tmp/build-12345",
    },
    {
      timestamp: "2024-10-27T10:00:57.000Z",
      level: "info",
      message:
        " _   _      _ _       \n| | | |    | | |      \n| |_| | ___| | | ___  \n|  _  |/ _ \\ | |/ _ \\ \n| | | |  __/ | | (_) |\n\\_| |_/\\___|_|_|\\___/",
    },
    {
      timestamp: "2024-10-27T10:00:57.500Z",
      level: "info",
      message: "Build #1024 completed successfully.",
    },
    {
      timestamp: "2024-10-27T10:00:58.000Z",
      level: "info",
      message: "Sending notifications to Slack channel #deployments...",
    },
    {
      timestamp: "2024-10-27T10:00:58.500Z",
      level: "debug",
      message:
        'Payload: {"status": "success", "version": "v1.2.3", "author": "devops-bot"}',
    },
    {
      timestamp: "2024-10-27T10:00:59.000Z",
      level: "info",
      message: "Job finished. Archiving logs.",
    },
    {
      timestamp: "2024-10-27T10:00:59.200Z",
      level: "info",
      message: "Log file saved to /var/log/builds/build-1024.log",
    },
    {
      timestamp: "2024-10-27T10:00:59.300Z",
      level: "debug",
      message: "Closing connection to agent.",
    },
    {
      timestamp: "2024-10-27T10:00:59.400Z",
      level: "info",
      message: "Disconnecting...",
    },
    {
      timestamp: "2024-10-27T10:00:59.500Z",
      level: "info",
      message: "Connection closed.",
    },
    {
      timestamp: "2024-10-27T10:01:00.500Z",
      level: "error",
      message:
        "Simulated stack trace for a database connection timeout:\njava.sql.SQLTimeoutException: Connection timed out\n\tat com.zaxxer.hikari.pool.HikariPool.getConnection(HikariPool.java:180)\n\tat com.zaxxer.hikari.HikariDataSource.getConnection(HikariDataSource.java:100)\n\tat com.example.app.DatabaseService.connect(DatabaseService.java:45)\n\tat com.example.app.Main.main(Main.java:23)\nCaused by: java.net.SocketTimeoutException: connect timed out\n\tat java.net.PlainSocketImpl.socketConnect(Native Method)\n\tat java.net.AbstractPlainSocketImpl.doConnect(AbstractPlainSocketImpl.java:350)\n\tat java.net.AbstractPlainSocketImpl.connectToAddress(AbstractPlainSocketImpl.java:206)\n\tat java.net.AbstractPlainSocketImpl.connect(AbstractPlainSocketImpl.java:188)\n\tat java.net.SocksSocketImpl.connect(SocksSocketImpl.java:392)\n\tat java.net.Socket.connect(Socket.java:589)",
    },
    {
      timestamp: "2024-10-27T10:01:01.000Z",
      level: "info",
      message: "Recovering from error... Retrying connection.",
    },
    {
      timestamp: "2024-10-27T10:01:01.500Z",
      level: "info",
      message: "Retry 1/3 successful.",
    },
    {
      timestamp: "2024-10-27T10:01:02.000Z",
      level: "info",
      message: "Continuing execution.",
    },
    {
      timestamp: "2024-10-27T10:01:02.500Z",
      level: "info",
      message: "Generating static site...",
    },
    {
      timestamp: "2024-10-27T10:01:03.000Z",
      level: "info",
      message: "Processing 1500 markdown files...",
    },
    {
      timestamp: "2024-10-27T10:01:05.000Z",
      level: "info",
      message: "Images optimized: 450/450",
    },
    {
      timestamp: "2024-10-27T10:01:06.000Z",
      level: "info",
      message: "Scripts minified.",
    },
    {
      timestamp: "2024-10-27T10:01:07.000Z",
      level: "info",
      message: "Styles autoprefixed.",
    },
    {
      timestamp: "2024-10-27T10:01:08.000Z",
      level: "info",
      message: "HTML generation complete.",
    },
    {
      timestamp: "2024-10-27T10:01:08.500Z",
      level: "info",
      message: "Manifest generated at /dist/manifest.json",
    },
    {
      timestamp: "2024-10-27T10:01:09.000Z",
      level: "info",
      message: "Syncing to Content Delivery Network...",
    },
    {
      timestamp: "2024-10-27T10:01:09.500Z",
      level: "debug",
      message: "CDN Cache Invalidation request sent: ID #998877",
    },
    {
      timestamp: "2024-10-27T10:01:10.000Z",
      level: "info",
      message: "Waiting for invalidation...",
    },
    {
      timestamp: "2024-10-27T10:01:12.000Z",
      level: "info",
      message: "Invalidation complete.",
    },
    {
      timestamp: "2024-10-27T10:01:12.500Z",
      level: "info",
      message: "Site is live at https://example.com",
    },
    {
      timestamp: "2024-10-27T10:01:13.000Z",
      level: "info",
      message: "Checking SSL certificate...",
    },
    {
      timestamp: "2024-10-27T10:01:13.200Z",
      level: "debug",
      message: "Certificate valid. Expires in 89 days.",
    },
    {
      timestamp: "2024-10-27T10:01:13.500Z",
      level: "info",
      message: "Running integration tests on live site...",
    },
    {
      timestamp: "2024-10-27T10:01:14.000Z",
      level: "info",
      message: "Test: Homepage loads (200 OK)",
    },
    {
      timestamp: "2024-10-27T10:01:14.500Z",
      level: "info",
      message: "Test: Login flow works",
    },
    {
      timestamp: "2024-10-27T10:01:15.000Z",
      level: "info",
      message: "Test: API endpoints respond",
    },
    {
      timestamp: "2024-10-27T10:01:15.500Z",
      level: "info",
      message: "All live checks passed.",
    },
    {
      timestamp: "2024-10-27T10:01:16.000Z",
      level: "info",
      message: "Marking deployment as STABLE.",
    },
    {
      timestamp: "2024-10-27T10:01:16.500Z",
      level: "info",
      message: "Updating dashboard...",
    },
    {
      timestamp: "2024-10-27T10:01:17.000Z",
      level: "info",
      message: "Process complete.",
    },
    {
      timestamp: "2024-10-27T10:01:17.500Z",
      level: "info",
      message: "Exiting with code 0",
    },
  ] as const;
</script>

<Story name="Default">
  {#snippet template({ children: _, ...args })}
    <Log {...args} style="max-height: 600px;" tabindex={0}>
      {#each fakeLogs as { message, ...rest }, i (i)}
        <Log.Line line={i + 1} {...rest}>
          {message}
        </Log.Line>
      {/each}
    </Log>
  {/snippet}
</Story>
