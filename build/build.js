import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import banner from './banner.js';

export default {
  output: {
    banner,
    name: 'Anets',
  },
  plugins: [resolve(), commonjs(), typescript()],
};
