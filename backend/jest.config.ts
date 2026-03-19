import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['<rootDir>/src/**/*.spec.ts', '<rootDir>/src/**/*.test.ts'],
    verbose: true,

    reporters: [
        "default",
        [
            "jest-junit",
            {
                outputDirectory: "./", // Lưu ngay tại thư mục gốc dự án
                outputName: "junit.xml",
            },
        ],
    ],

    collectCoverage: true,
    coverageDirectory: "coverage",
    coverageReporters: ["text", "lcov", "cobertura"],
    collectCoverageFrom: [
        "src/**/*.{ts,js}",
        "!src/**/*.spec.ts",
        "!src/**/*.test.ts",
        "!src/**/*.d.ts",
        "!src/index.ts",
        "!src/interfaces/**",
        "!src/constants/**",
        "!src/map/**",
        "!src/config/**",
        "!src/routes/**",
        "!src/models/**",
        "!src/seed/**",
        "!src/validations/**",
        "!src/**/swagger.json"
    ],
};

export default config;