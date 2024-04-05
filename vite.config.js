import path from 'path'
import glob from 'fast-glob'
import { defineConfig } from 'vite'

import devMode from './vite-plugins/dev-mode.js'

const ROOT_PATH = './'
const SRC_DIR = 'frontend'
const ASSETS_DIR = 'assets'
const SCRIPTS_DIR = 'scripts'
const STYLES_DIR = 'styles'

const entries = [
  path.join(ROOT_PATH, SRC_DIR, STYLES_DIR, '*'),
  path.join(ROOT_PATH, SRC_DIR, SCRIPTS_DIR, '*')
].map(pattern => glob.sync(pattern, { onlyFiles: true }))

const input = [].concat(...entries)

export default defineConfig({
  plugins: [
    devMode()
  ],
  base: './',
  publicDir: false,
  server: {
    hmr: true
  },
  build: {
    sourcemap: true,
    target: 'ES2015',
    outDir: path.join(ROOT_PATH, ASSETS_DIR),
    assetsDir: '',
    emptyOutDir: false,
    rollupOptions: {
      input,
      output: {
        entryFileNames: '[name].js',
        assetFileNames: '[name].[ext]'
      }
    }
  },
  resolve: {
    alias: {
      '~': path.resolve(ROOT_PATH, SRC_DIR),
      '@': path.resolve(ROOT_PATH, SRC_DIR)
    }
  }
})
