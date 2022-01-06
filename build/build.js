import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import json from '@rollup/plugin-json';
import banner from './banner.js';

export default {
  output: {
    banner,
    name: 'Anets',
  },
  external: ['html2canvas'],
  plugins: [resolve(), commonjs(), typescript(), json()],
};
