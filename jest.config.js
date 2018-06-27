module.exports = {
    "automock": false,
    "moduleFileExtensions": [
      "js",
      "json",
      "ts",
      "tsx"
    ],
    "rootDir": "src",
    "testRegex": "\.spec.ts$",
    "transform": {
      "^.+\\.(t|j)s$": "ts-jest"
    },
    "globals": {
      "ts-jest": {
        "ignoreCoverageForAllDecorators": true,
        "ignoreCoverageForDecorators": true
      }
    },
    "coverageDirectory": "../coverage",
    "collectCoverageFrom": [
      "**/*.ts",
      "!main.ts",
      "!main.hmr.ts",
      "!**/*.module.ts",
      "!**/*.temp.ts",
      "!**/*.model.ts",
      "!config/environments/**/*"
    ]

}