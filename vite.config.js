import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: path.resolve(__dirname, '/src/index.js'),
      name: 'VueWhitebox',
      fileName: (format) => `vue-whitebox.${format}.js`
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['vue', 'mikser-whitebox-core'],
      output: {
        exports: 'named',
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: 'Vue',
          'mikser-whitebox-core': 'MikserWhiteboxCore'
        }
      }
    }
  }
})
