<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import type { Snippet } from "svelte";
  import Line from "./Line.svelte";

  const { Story } = defineMeta({
    title: "Components/Log/Line",
    tags: ["autodocs"],
    component: Line,
    args: {
      timestamp: "2024-10-27T10:00:59.400Z",
      level: "info",
      children: "Disconnecting..." as unknown as Snippet<[]>,
      line: 140,
    },
  });
</script>

<Story name="Default" />

<Story name="With multiline message">
  {#snippet template({ children: _, ...rest })}
    <!-- prettier-ignore -->
    <Line {...rest}>Simulated stack trace for a database connection timeout:
java.sql.SQLTimeoutException: Connection timed out
    at com.zaxxer.hikari.pool.HikariPool.getConnection(HikariPool.java:180)
    at com.zaxxer.hikari.HikariDataSource.getConnection(HikariDataSource.java:100)
    at com.example.app.DatabaseService.connect(DatabaseService.java:45)
    at com.example.app.Main.main(Main.java:23)
    at java.net.SocketTimeoutException: connect timed out
    at java.net.PlainSocketImpl.socketConnect(Native Method)
    at java.net.AbstractPlainSocketImpl.doConnect(AbstractPlainSocketImpl.java:350)
    at java.net.AbstractPlainSocketImpl.connectToAddress(AbstractPlainSocketImpl.java:206)
    at java.net.AbstractPlainSocketImpl.connect(AbstractPlainSocketImpl.java:188)
    at java.net.SocksSocketImpl.connect(SocksSocketImpl.java:392)
    at java.net.Socket.connect(Socket.java:589)</Line>
  {/snippet}
</Story>
