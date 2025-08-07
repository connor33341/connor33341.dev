import * as esbuild from 'esbuild'
import { readFileSync, existsSync } from 'fs'
import { resolve, join, extname } from 'path'
import { createServer, request } from 'http'
import { parse } from 'url'
import tailwindcss from '@tailwindcss/postcss'
import autoprefixer from 'autoprefixer'
import postcss from 'postcss'
import postcssScss from 'postcss-scss'
import * as sass from 'sass'

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
    '.scss': 'css',
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
      name: 'scss-processor',
      setup(build) {
        build.onLoad({ filter: /\.scss$/ }, async (args) => {
          try {
            // First compile SCSS to CSS with proper import paths
            const result = sass.compile(args.path, {
              style: 'expanded',
              sourceMap: isDev,
              loadPaths: ['node_modules'],
            })
            
            // Then process with PostCSS/Tailwind
            const postcssResult = await postcss([
              tailwindcss,
              autoprefixer,
            ]).process(result.css, {
              from: args.path,
              map: isDev ? { inline: false } : false,
            })
            
            return {
              contents: postcssResult.css,
              loader: 'css',
            }
          } catch (error) {
            console.error('SCSS compilation error:', error)
            return {
              errors: [{
                text: error.message,
                location: null,
              }]
            }
          }
        })
      },
    },
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
  
  // Start esbuild dev server
  const result = await ctx.serve({
    servedir: 'public',
    port: 8080, // esbuild server on different port
    host: 'localhost',
  })
  
  console.log(`📦 esbuild server running on port ${result.port}`)
  
  // Create custom HTTP server with SPA fallback
  const server = createServer((req, res) => {
    const url = parse(req.url || '/', true)
    const pathname = url.pathname || '/'
    
    // Proxy request to esbuild server
    const proxyReq = request({
      hostname: 'localhost',
      port: result.port,
      path: pathname,
      method: req.method,
      headers: req.headers,
    }, (proxyRes) => {
      if (proxyRes.statusCode === 404 && !extname(pathname)) {
        // If it's a 404 and the path doesn't have an extension (likely a route),
        // serve index.html instead
        const indexReq = request({
          hostname: 'localhost',
          port: result.port,
          path: '/index.html',
          method: 'GET',
        }, (indexRes) => {
          res.writeHead(200, { 'Content-Type': 'text/html' })
          indexRes.pipe(res)
        })
        indexReq.end()
      } else {
        // Forward the response from esbuild server
        res.writeHead(proxyRes.statusCode || 200, proxyRes.headers)
        proxyRes.pipe(res)
      }
    })
    
    proxyReq.on('error', (err) => {
      console.error('Proxy error:', err)
      res.writeHead(500, { 'Content-Type': 'text/plain' })
      res.end('Internal Server Error')
    })
    
    req.pipe(proxyReq)
  })
  
  const port = 3000
  server.listen(port, () => {
    console.log(`🚀 Dev server running at http://localhost:${port}`)
  })
  
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