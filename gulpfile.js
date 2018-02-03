const gulp = require('gulp');
const util = require('gulp-util');
const ts = require('gulp-typescript');
const watch = require('gulp-watch');
const empty = require('gulp-empty');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
//const less = require('gulp-less');
const connect = require('gulp-connect');
//const uglify = require('gulp-uglify');
const uglifyes = require('uglify-es');
const composer = require('gulp-uglify/composer');
const uglify = composer(uglifyes, console);

const sourcemaps = require('gulp-sourcemaps');
const buffer = require('vinyl-buffer');
//const uglifycss = require('gulp-uglifycss');
const clean = require('gulp-clean');
//const tsModuleBundler = require('gulp-typescript-module-bundler');
//const rollup = require('gulp-rollup');
//const browserify = require('gulp-browserify');
const tsify = require('tsify');
const rename = require('gulp-rename');
const browserSync = require('browser-sync');
const gulpsync = require('gulp-sync')(gulp);
const config = {
	production: !!util.env.production,
};



/*
compile typescript
use ES5 and commonJS module
*/
gulp.task('typescript', function ()
{
	const tsProject = ts.createProject(
		'./src/tsconfig.json', {
			//"module": "umd", /* Specify module code generation: 'commonjs', 'amd', 'system', 'umd' or 'es2015'. */
			//removeComments: config.production,
			//experimentalAsyncFunctions: !config.production,
			//target: config.production ? "ES5" : "es3"
		}
	);

	tsProject.src()
		.pipe(sourcemaps.init())
		.pipe(tsProject()).js
		.pipe(sourcemaps.write("."))
		.pipe(gulp.dest("obj"));
});


gulp.task('browserify', function () {
	return browserify({
			basedir: 'src',
			debug: true,
			entries: ['main.ts'],
			cache: {},
			packageCache: {}
	})
	.plugin(tsify)
	.transform('babelify', {
			presets: ['es2015'],
			extensions: ['.ts']
	})
	.bundle()
	.pipe(source('bundle.js'))
	.pipe(buffer())
	.pipe(sourcemaps.init({loadMaps: true}))
	.pipe(config.production ? uglify() : empty())
	.pipe(sourcemaps.write('./'))
	.pipe(gulp.dest('dist'))
	.pipe(browserSync.reload({ stream: true, once: true }));
	
});

gulp.task('javascript', function ()
{
	return gulp.src('src/**/*.js')
		.pipe(sourcemaps.init())
		.pipe(config.production ? uglify() : util.noop())
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('dist'));
});
/*
Web server to test app
*/
gulp.task('webserver', function ()
{
	connect.server({
		livereload: true,
		root: ['.', 'dist']
	});
});
/*
Automatic Live Reload
*/
gulp.task('livereload', function ()
{

	watch(['dist/styles/*.css', 'dist/*.js', 'dist/*.html'])
		.pipe(connect.reload());
});
/*
copy all html files and assets
*/
gulp.task('html', function ()
{
	gulp.src('src/**/*.html')
		.pipe(gulp.dest('dist'));
});

gulp.task('assets', function ()
{
	gulp.src('assets/**/*.*')
		.pipe(gulp.dest('dist/assets'));
});
/*
compile less files
gulp.task('less', function () {
	gulp.src('src/styles/style.less')
		.pipe(less())
		.pipe(sourcemaps.init())
		.pipe(config.production ? uglifycss({
			"maxLineLen": 80,
			"uglyComments": true
		}) : util.noop())
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('dist/styles'));
});
*/

/*
browserify
now is only for Javascript files
gulp.task('browserify', function () {
	browserify('./dist/js/index.js')
		.bundle()
		.pipe(source('index.js'))
		.pipe(gulp.dest('dist'));
});
*/


gulp.task('browser-sync', function ()
{
	browserSync.init(null, {
		server: {
			baseDir: "dist"
		}
	});
});
gulp.task('bs-reload', function ()
{
	browserSync.reload();
});

/*
Watch typescript and less
*/
gulp.task('watch',
	['browser-sync'],
	function ()
	{
		gulp.watch(['src/**/*.ts', 'src/**/*.tsx', 'src/tsconfig.json'], ['browserify']);
		//gulp.watch('src/styles/*.less', ['less']);
		//gulp.watch(['obj/*.js'], { delay: 2000 }, ['browserify'/*, 'browserify'*/]);
		//gulp.watch('src/**/*.js', ['javascript']);
		gulp.watch('src/**/*.html', ['html']);
		gulp.watch('assets/**/*.*', ['assets']);
		gulp.watch('dist/*.html', ['bs-reload']);
	});

gulp.task('clean', () =>
	gulp.src(['./dist', './obj'], { read: false })
		.pipe(clean())
);

gulp.on('err', function (e)
{
	console.log(e.err.stack);
});

/*
default task
*/

gulp.task('default', [/*'less',*/ 'browserify', 'html', 'assets']);


gulp.task('serve', ['default', 'watch']); 

/*
	['default', gulpsync.async(['css', 'types', 'javascript'])],
	['default', 'webserver', 'livereload', 'watch']);
*/