import { describe, expect, it } from "vitest";
import { createHrefClient } from "./openapi-href.js";

describe("createHrefClient", () => {
  it("should create href with path parameters", () => {
    const hrefClient = createHrefClient<{
      "/items/{item_id}": {
        get: {
          parameters: {
            path: {
              item_id: string;
            };
          };
        };
      };
    }>();

    const href = hrefClient("/items/{item_id}", { path: { item_id: "123" } });
    expect(href).toBe("/items/123");
  });

  it("should create href with query parameters", () => {
    const hrefClient = createHrefClient<{
      "/search": {
        get: {
          parameters: {
            query: {
              q: string;
            };
          };
        };
      };
    }>();

    const href = hrefClient("/search", { query: { q: "test" } });
    expect(href).toBe("/search?q=test");
  });

  it("should create href with both path and query parameters", () => {
    const hrefClient = createHrefClient<{
      "/items/{item_id}/search": {
        get: {
          parameters: {
            path: {
              item_id: string;
            };
            query: {
              q: string;
            };
          };
        };
      };
    }>();

    const href = hrefClient("/items/{item_id}/search", {
      path: { item_id: "123" },
      query: { q: "test" },
    });
    expect(href).toBe("/items/123/search?q=test");
  });

  it("should create href without parameters", () => {
    const hrefClient = createHrefClient<{
      "/status": {
        get: {
          parameters: {
            query?: {
              verbose: boolean;
            };
          };
        };
      };
    }>();

    const href = hrefClient("/status");
    expect(href).toBe("/status");
  });

  it("should create href with baseUrl", () => {
    const hrefClient = createHrefClient<{
      "/items/{item_id}": {
        get: {
          parameters: {
            path: {
              item_id: string;
            };
          };
        };
      };
    }>({ baseUrl: "https://api.example.com" });

    const href = hrefClient("/items/{item_id}", { path: { item_id: "123" } });
    expect(href).toBe("https://api.example.com/items/123");
  });
});

// TypeScript type tests
{
  // Test that href requires path parameters when they are required
  const hrefClient = createHrefClient<{
    "/items/{item_id}": {
      get: {
        parameters: {
          path: {
            item_id: string;
          };
        };
      };
    };
  }>();

  // @ts-expect-error - missing required path parameter
  hrefClient("/items/{item_id}");
}

{
  // Test that href allows optional query parameters
  const hrefClient = createHrefClient<{
    "/search": {
      get: {
        parameters: {
          query?: {
            q: string;
          };
        };
      };
    };
  }>();

  hrefClient("/search");
}

{
  // Test that href requires query parameters when they are required

  const hrefClient = createHrefClient<{
    "/search": {
      get: {
        parameters: {
          query: {
            q: string;
          };
        };
      };
    };
  }>();

  // @ts-expect-error - missing required query parameter
  hrefClient("/search");
}

{
  // Test that only `get` methods are available for href
  const hrefClient = createHrefClient<{
    "/items": {
      post: {
        parameters: {
          body: {
            name: string;
          };
        };
      };
    };
  }>();

  // @ts-expect-error - only `get` methods are available for href
  hrefClient("/items");
}

{
  // Test that `header` and `cookie` parameters are ignored for href
  const hrefClient = createHrefClient<{
    "/items": {
      get: {
        parameters: {
          header: {
            Authorization: string;
          };
          cookie: {
            session_id: string;
          };
        };
      };
    };
  }>();

  hrefClient("/items");
}

{
  // Test that unexpected parameters are disallowed
  const hrefClient = createHrefClient<{
    "/items": {
      get: {
        parameters: {
          path: {
            item_id: string;
          };
          query: {
            q: string;
          };
        };
      };
    };
  }>();

  hrefClient("/items", {
    // @ts-expect-error - unexpected parameters should be disallowed
    path: { item_id: "123", unknown: "disallowed" },
    // @ts-expect-error - unexpected parameters should be disallowed
    query: { q: "test", unknown: "disallowed" },
  });
}
