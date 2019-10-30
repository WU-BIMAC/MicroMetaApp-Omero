let gulp = require("gulp");
let PluginError = require("plugin-error");
let log = require("fancy-log");
let webpack = require("webpack");

let setProduction = done => {
	process.env.NODE_ENV = "production";
	done();
};

let setDev = done => {
	process.env.NODE_ENV = "development";
	done();
};

function webpackOnBuild(done) {
	let start = Date.now();
	return function(err, stats) {
		if (err) {
			throw new PluginError("webpack", err);
		}
		log(
			"[webpack]",
			stats.toString({
				colors: true
			})
		);
		let end = Date.now();
		log("Build Completed, running for " + (end - start) / 1000) + "s";
		if (done) {
			done(err);
		}
	};
}

let buildWebpack = cb => {
	let webpackConfig = require("./webpack.config.js");
	webpack(webpackConfig).run(webpackOnBuild(cb));
};

let watchWebpack = () => {
	let webpackConfig = require("./webpack.config.js");
	webpack(webpackConfig).watch(300, webpackOnBuild());
};

const dev = gulp.series(setDev, buildWebpack, watchWebpack);
const buildProd = gulp.series(setProduction, buildWebpack);
const buildDev = gulp.series(setDev, buildWebpack);

gulp.task("dev", dev);
gulp.task("build-prod", buildProd);
gulp.task("build-dev", buildDev);
