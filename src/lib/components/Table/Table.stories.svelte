<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { SeededRandom } from "../../../stories/utils/SeededRandom.js";
  import { DateTime } from "../DateTime/index.js";
  import { Link } from "../Link/index.js";
  import { UserChip } from "../UserChip/index.js";
  import { Table } from "./index.js";
  import type { TableSortDirection } from "./index.js";

  const { Story } = defineMeta({
    title: "Components/Table",
    tags: ["autodocs"],
    component: Table,
  });

  type FakeRow = {
    id: number;
    name: string;
    surname: string;
    city: string;
    street: string;
    birthday: Date;
    registered: Date;
    profile: string;
    balance: number;
  };

  function generateFakeTableData(count: number): FakeRow[] {
    const seededRandom = new SeededRandom(42);

    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      name: seededRandom.pick([
        "Alice",
        "Bob",
        "Charlie",
        "Dana",
        "Evan",
        "Fatima",
        "Grace",
        "Hugo",
        "Ivy",
        "Jules",
        "Kai",
        "Lena",
      ]),
      surname: seededRandom.pick([
        "Smith",
        "Johnson",
        "Williams",
        "Brown",
        "Jones",
        "Garcia",
        "Miller",
        "Davis",
      ]),
      city: seededRandom.pick([
        "New York",
        "San Francisco",
        "Chicago",
        "Austin",
        "Seattle",
        "Denver",
        "Boston",
        "Atlanta",
      ]),
      street: seededRandom.pick([
        "5th Avenue",
        "Market Street",
        "Michigan Avenue",
        "Broadway",
        "Sunset Blvd",
        "Pine Street",
        "Lake Shore Dr",
      ]),
      birthday: seededRandom.date("1975-01-01", "2005-12-31"),
      registered: seededRandom.date("2016-01-01", "2024-12-31"),
      profile: `https://example.com/${i + 1}`,
      balance: seededRandom.int(-500, 5000),
    }));
  }

  const fakeData = generateFakeTableData(30);
  const totalBalance = fakeData.reduce((sum, row) => sum + row.balance, 0);

  let sortKey = $state<keyof FakeRow>();
  let sortDirection = $state<TableSortDirection>();

  const changeSort = (key: keyof FakeRow) => {
    if (sortKey !== key) {
      sortKey = key;
      sortDirection = "ascending";
    } else if (sortDirection === "ascending") {
      sortDirection = "descending";
    } else {
      sortKey = undefined;
      sortDirection = undefined;
    }
  };

  const sortButtonLabel = (key: keyof FakeRow, column: string) => {
    if (sortKey !== key) {
      return `Sort by ${column} ascending`;
    } else if (sortDirection === "ascending") {
      return `Sort by ${column} descending`;
    } else {
      return `Remove sorting by ${column}`;
    }
  };
</script>

<Story name="Default" asChild>
  <Table style="width: 100%;">
    <caption>Static table</caption>
    <thead>
      <tr>
        <th scope="col">User</th>
        <th scope="col">Address</th>
        <th scope="col">Birthday</th>
        <th scope="col">Registered</th>
        <th scope="col">Balance</th>
      </tr>
    </thead>
    <tbody>
      {#each fakeData as row (row.id)}
        <tr>
          <th scope="row">
            <Link href={row.profile}>
              <UserChip userName={`${row.name} ${row.surname}`} size="small" />
            </Link>
          </th>
          <td>{row.street}, {row.city}</td>
          <td><DateTime date={row.birthday} absolute /></td>
          <td><DateTime date={row.registered} /></td>
          <td>
            {row.balance.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </td>
        </tr>
      {/each}
    </tbody>
    <tfoot>
      <tr>
        <th colspan="4" style="text-align: right;">Total Balance</th>
        <td>
          {totalBalance.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </td>
      </tr>
    </tfoot>
  </Table>
</Story>

<Story name="With sorting headers" asChild>
  <Table style="width: 100%;">
    <caption>Sortable table</caption>
    <thead>
      <tr>
        <Table.TH
          scope="col"
          sortDirection={sortKey === "name" ? sortDirection : undefined}
        >
          User
          {#snippet action()}
            <Table.TH.SortButton
              onclick={() => changeSort("name")}
              aria-label={sortButtonLabel("name", "User")}
            />
          {/snippet}
        </Table.TH>
        <Table.TH
          scope="col"
          sortDirection={sortKey === "street" ? sortDirection : undefined}
        >
          Address
          {#snippet action()}
            <Table.TH.SortButton
              onclick={() => changeSort("street")}
              aria-label={sortButtonLabel("street", "Address")}
            />
          {/snippet}
        </Table.TH>
        <Table.TH
          scope="col"
          sortDirection={sortKey === "birthday" ? sortDirection : undefined}
        >
          Birthday
          {#snippet action()}
            <Table.TH.SortButton
              onclick={() => changeSort("birthday")}
              aria-label={sortButtonLabel("birthday", "Birthday")}
            />
          {/snippet}
        </Table.TH>
        <Table.TH
          scope="col"
          sortDirection={sortKey === "registered" ? sortDirection : undefined}
        >
          Registered
          {#snippet action()}
            <Table.TH.SortButton
              onclick={() => changeSort("registered")}
              aria-label={sortButtonLabel("registered", "Registered")}
            />
          {/snippet}
        </Table.TH>
        <Table.TH
          scope="col"
          sortDirection={sortKey === "balance" ? sortDirection : undefined}
        >
          Balance
          {#snippet action()}
            <Table.TH.SortButton
              onclick={() => changeSort("balance")}
              aria-label={sortButtonLabel("balance", "Balance")}
            />
          {/snippet}
        </Table.TH>
      </tr>
    </thead>
    <tbody>
      {#each fakeData.toSorted((a, b) => {
        if (sortKey && sortDirection) {
          const aValue = a[sortKey];
          const bValue = b[sortKey];

          if (typeof aValue === "string" && typeof bValue === "string") {
            return sortDirection === "ascending" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
          }

          if (aValue < bValue) return sortDirection === "ascending" ? -1 : 1;
          if (aValue > bValue) return sortDirection === "ascending" ? 1 : -1;
        }
        return 0;
      }) as row (row.id)}
        <tr>
          <th scope="row">
            <Link href={row.profile}>
              <UserChip userName={`${row.name} ${row.surname}`} size="small" />
            </Link>
          </th>
          <td>{row.street}, {row.city}</td>
          <td><DateTime date={row.birthday} absolute /></td>
          <td><DateTime date={row.registered} /></td>
          <td>
            {row.balance.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </td>
        </tr>
      {/each}
    </tbody>
    <tfoot>
      <tr>
        <th colspan="4" style="text-align: right;">Total Balance</th>
        <td>
          {totalBalance.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </td>
      </tr>
    </tfoot>
  </Table>
</Story>
