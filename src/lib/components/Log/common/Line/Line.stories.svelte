<script module lang="ts">
  import { Link } from "@canonical/svelte-ds-app-launchpad";
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { setLogContext } from "../../context.js";
  import { Log } from "../../index.js";
  import Line from "./Line.svelte";

  const { Story } = defineMeta({
    title: "Components/Log/Line",
    tags: ["autodocs"],
    component: Line,
    args: {
      timestamp: "2024-10-27T10:00:59.400Z",
      level: "info",
      line: 140,
    },
    argTypes: {
      children: { control: { disable: true } },
    },
  });
</script>

<script lang="ts">
  setLogContext({
    timeZone: "UTC",
    hideTimestamp: false,
    wrapLines: false,
  });
</script>

<Story name="Default">
  {#snippet template({ children: _, ...args })}
    <Log>
      <Log.Line {...args}>Disconnecting...</Log.Line>
    </Log>
  {/snippet}
</Story>

<Story name="With multiline message">
  {#snippet template({ children: _, ...args })}
    <Log>
      <!-- prettier-ignore -->
      <Log.Line {...args}>Simulated stack trace for a database connection timeout:
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
    at java.net.Socket.connect(Socket.java:589)</Log.Line>
    </Log>
  {/snippet}
</Story>

<Story
  name="With link as line number"
  argTypes={{ line: { control: { disable: true } } }}
>
  {#snippet template({ children: _, line: __, ...args })}
    <Log>
      <Log.Line id="line-140" {...args}>
        {#snippet line()}
          <Link href="#line-140" soft>140</Link>
        {/snippet}
        User login failed due to invalid credentials.
      </Log.Line>
    </Log>
  {/snippet}
</Story>
