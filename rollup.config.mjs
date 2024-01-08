import typescript from '@rollup/plugin-typescript'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

/** @type import('rollup') */
export default {
  input: 'lib/index.ts',
  output: [
    {
      file: 'dist/index.mjs',
      format: 'esm',
    },
    {
      file: 'dist/index.cjs',
      format: 'cjs',
    },
  ],
  external: [],
  plugins: [
    commonjs(),
    nodeResolve(),
    typescript({ exclude: ['**/__tests__/**'] }),
  ],
}
