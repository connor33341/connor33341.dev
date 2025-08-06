import * as esbuild from 'esbuild'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const isDev = process.argv.includes('--dev')
const isWatch = process.argv.includes('--watch')

const config: esbuild.BuildOptions = {
  entryPoints: ['src/index.tsx'],
  bundle: true,
  outdir: 'public/build',
  format: 'esm',
  target: 'es2020',
  platform: 'browser',
  sourcemap: isDev,
  minify: !isDev,
  splitting: true,
  metafile: true,
  define: {
    'process.env.NODE_ENV': isDev ? '"development"' : '"production"',
  },
  loader: {
    '.tsx': 'tsx',
    '.ts': 'ts',
    '.jsx': 'jsx',
    '.js': 'js',
    '.css': 'css',
    '.png': 'file',
    '.jpg': 'file',
    '.jpeg': 'file',
    '.svg': 'file',
    '.gif': 'file',
    '.woff': 'file',
    '.woff2': 'file',
    '.ttf': 'file',
    '.eot': 'file',
  },
  jsx: 'automatic',
  jsxDev: isDev,
  plugins: [
    {
      name: 'dev-server',
      setup(build) {
        if (isDev) {
          build.onEnd(result => {
            if (result.errors.length > 0) {
              console.error('❌ Build failed')
              result.errors.forEach(error => console.error(error))
            } else {
              console.log('✅ Build completed')
            }
          })
        }
      },
    },
  ],
}

if (isDev && isWatch) {
  const ctx = await esbuild.context(config)
  
  // Start dev server
  const { host, port } = await ctx.serve({
    servedir: 'public',
    port: 3000,
    host: 'localhost',
  })
  
  console.log(`🚀 Dev server running at http://${host}:${port}`)
  
  // Watch for changes
  await ctx.watch()
} else {
  // One-time build
  const result = await esbuild.build(config)
  
  if (result.metafile) {
    console.log('📊 Build analysis:')
    console.log(await esbuild.analyzeMetafile(result.metafile))
  }
  
  process.exit(0)
}