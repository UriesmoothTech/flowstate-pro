import type { Config } from "jest";

const config: Config = {
  testEnvironment: "node",
  clearMocks: true,
  roots: ["<rootDir>/tests"],
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: {
          module: "commonjs",
        },
      },
    ],
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
};

export default config;
