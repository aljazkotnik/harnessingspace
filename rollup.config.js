
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import babel from "rollup-plugin-babel";
import uglify from "rollup-plugin-uglify";
export default {
  input: "airfoils.js",
  output: [
		{
			file: './build/bundle.js',
			format: 'iife'
		}
	],
  plugins: [
    resolve(),
	babel({
      exclude: "node_modules/**"
    }),
    commonjs(),
	babel({
      exclude: "node_modules/**"
    }),
  ]
};