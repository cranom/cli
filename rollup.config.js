import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
  output: {
    file: 'bin/index.js',
    format: 'cjs'
  },
  plugins: [typescript()]
};