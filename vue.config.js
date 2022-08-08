const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    server: {
      type: 'https'
    },
    client: {
      webSocketURL: 'auto://localhost:8080/ws'
    },
    allowedHosts: 'all'
  }
})
