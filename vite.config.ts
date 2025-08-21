import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
// https://vite.dev/config/
export default defineConfig({
  root: './', //根文件的目录一般不写默认就是src
  // base:'/api',//定义项目的启动路径一般不写
  publicDir: 'public', //默认静态资源在public
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    host: 'localhost',
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '')
      }
    }
  },
  //路径别名，这里用@去替代了src路径
  plugins: [react()]
})
