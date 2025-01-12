import { defineConfig, transformWithEsbuild } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    {
      name: "load+transform-js-files-as-jsx",
      async transform(code, id) {
        if (!id.match(/src\/.*\.js$/)) {
          return null;
        }

        // Use the exposed transform from vite, instead of directly
        // transforming with esbuild
        return transformWithEsbuild(code, id, {
          loader: "jsx",
          jsx: "automatic",
        });
      },
    },
    react(),
  ],
  optimizeDeps: {
    force: true,
    esbuildOptions: {
      loader: {
        ".js": "jsx",
      },
    },
  },
  build: {
    outDir: "dist",
  },
  // define: {
  //   __APP_ENV__: process.env.VITE_OPENAI_API_KEY,
  // },
});

// // import { defineConfig } from 'vite'
// // import react from '@vitejs/plugin-react-swc'

// // // https://vite.dev/config/
// // export default defineConfig({
// //   plugins: [react()],
// //   optimizeDeps: { esbuildOptions: { force:true, loader:{ '.js': 'jsx' } } },
// // })

// import { defineConfig } from "vite";
// import reactRefresh from "@vitejs/plugin-react-refresh";
// import { resolve } from "path";
// import fs from "fs/promises";
// import react from "@vitejs/plugin-react-swc";
// // https://vitejs.dev/config/
// export default defineConfig({
//   server: {
//     port: 4200,
//   },
//   resolve: {
//     alias: {
//       src: resolve(__dirname, "src"),
//     },
//   },
//   esbuild: {
//     loader: {
//       '.js': 'jsx',
//     },
//     // include: /src\/.*\.jsx?$/,
//     include: [/\.js$/],
//     // loader: "tsx",
//     // include: /src\/.*\.[tj]sx?$/,
//     exclude: [],
//     jsx: 'automatic',
//   },
//   optimizeDeps: {
//     esbuildOptions: {
//       loader: {
//         ".js": "jsx",
//       },
//       plugins: [
//         {
//           name: "load-js-files-as-jsx",
//           setup(build) {
//             build.onLoad({ filter: /src\\.*\.js$/ }, async (args) => ({
//               // i modified the regex here
//               loader: "jsx",
//               contents: await fs.readFile(args.path, "utf8"),
//             }));
//           },
//         },
//       ],
//     },
//   },
//   plugins: [react()],
// });
