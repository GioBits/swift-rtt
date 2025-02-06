import { defineConfig } from "cypress"
import dotenvPlugin from "cypress-dotenv"

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      const updatedConfig = dotenvPlugin(config, null, true)
      // continue loading other plugins
      return updatedConfig
    },
    specPattern: "cypress/integration/**/*.spec.js",
  },
});
