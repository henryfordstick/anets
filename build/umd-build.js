import build from './build';

export default ([
  {
    input: "src/index.ts",
    output: Object.assign({}, build.output, {
      file: 'dist/Anets.js',
      format: 'umd'
    })
  }
]).map(config => {
  const buildCopy = {...build};
  return Object.assign(buildCopy, config);
})