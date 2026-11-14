import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  presets: ['@pandacss/preset-base', '@pandacss/preset-panda'],
  preflight: true,
  // フロントエンドのコードだけを走査する（src/api は Worker 側）
  include: ['./src/main.tsx', './src/{routes,features,components}/**/*.{ts,tsx}'],
  exclude: [],
  globalCss: {
    body: {
      minH: 'screen',
      bgGradient: 'to-b',
      gradientFrom: 'slate.50',
      gradientTo: 'indigo.50',
      bgAttachment: 'fixed',
    },
  },
  outdir: 'styled-system',
  outExtension: 'ts',
})
