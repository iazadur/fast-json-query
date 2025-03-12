import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import filesize from 'rollup-plugin-filesize';

const createConfig = (format, filename) => ({
  input: 'src/index.ts',
  output: {
    file: filename,
    format,
    sourcemap: true,
    exports: 'named',
  },
  external: ['react'],
  plugins: [
    typescript({
      tsconfig: './tsconfig.json',
      declaration: format === 'cjs',
      declarationDir: format === 'cjs' ? 'dist' : undefined,
    }),
    terser({
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
      },
    }),
    filesize(),
  ],
});

export default [
  // Main bundle
  createConfig('cjs', 'dist/index.js'),
  createConfig('esm', 'dist/index.esm.js'),
  // React hooks bundle
  {
    input: 'src/hooks/index.ts',
    output: [
      {
        file: 'dist/hooks/index.js',
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: 'dist/hooks/index.esm.js',
        format: 'esm',
        sourcemap: true,
      },
    ],
    external: ['react', '../index'],
    plugins: [
      typescript({
        tsconfig: './tsconfig.json',
      }),
      terser(),
      filesize(),
    ],
  },
]; 