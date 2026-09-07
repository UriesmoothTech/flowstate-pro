import type { Config } from "jest";

const config: Config = {
  testEnvironment: "node",
  clearMocks: true,
  roots: ["<rootDir>/tests"]
};

export default config;
