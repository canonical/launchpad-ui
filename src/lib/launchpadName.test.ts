import { describe, expect, it } from "vitest";
import { toLaunchpadName } from "./launchpadName.js";

describe("toLaunchpadName", () => {
  it.each([
    ["userl", "userl"],
    ["  userl  ", "userl"],
    ["UserL", "userl"],
    ["ubuntu-mozillateam", "ubuntu-mozillateam"],
    ["a11y+team", "a11y+team"],
    ["x.y", "x.y"],
    ["~userl", "userl"],
    ["~userl/", "userl"],
    ["https://launchpad.net/~userl", "userl"],
    ["https://launchpad.net/~userl/", "userl"],
    ["http://launchpad.net/~userl", "userl"],
    ["https://api.launchpad.net/devel/~userl", "userl"],
    ["https://launchpad.net/api/devel/~userl", "userl"],
    ["https://qastaging.launchpad.net/~userl", "userl"],
    ["https://api.qastaging.launchpad.net/devel/~userl", "userl"],
    ["https://qastaging.launchpad.net/api/devel/~userl/", "userl"],
    ["https://api.staging.launchpad.net/1.0/~userl", "userl"],
    ["http://launchpad.test/~userl", "userl"],
    ["http://launchpad.test/api/devel/~userl", "userl"],
    ["http://localhost:8085/~userl", "userl"],
    ["http://localhost:8085/api/devel/~userl/", "userl"],
    ["http://127.0.0.1:8085/api/beta/~userl", "userl"],
    ["http://[::1]:8085/api/devel/~userl", "userl"],
    ["  HTTP://LOCALHOST:8085/api/devel/~UserL/  ", "userl"],
  ])("reads %j as the name %j", (text, expected) => {
    expect(toLaunchpadName(text)).toBe(expected);
  });

  it.each([
    null,
    undefined,
    "",
    "   ",
    "User Launchpadio",
    "-userl",
    "https://launchpad.net/ubuntu",
    "http://localhost:8085/api/devel/ubuntu",
    "https://qastaging.launchpad.net/~userl/+archive",
    "http://localhost:8085/api/devel/~Bad Name",
    "https://launchpad.net/~userl?other=name",
    "https://launchpad.net/~userl#section",
    "https://launchpad.net/ubuntu?person=~userl",
    "ftp://launchpad.test/~userl",
    "http:///~userl",
    "http://bad host/~userl",
    "~",
    "https://launchpad.test/~",
  ])("finds no name in %j", (text) => {
    expect(toLaunchpadName(text)).toBeNull();
  });

  it("finds no name when called without an argument", () => {
    expect(toLaunchpadName()).toBeNull();
  });
});
