'use strict';

// check if gulp dist was called
if (process.argv.indexOf('dist') !== -1) {
  // add ship options to command call
  process.argv.push('--ship');
}

const path = require('path');
const gulp = require('gulp');
const build = require('@microsoft/sp-build-web');
const gulpSequence = require('gulp-sequence');
const fs = require('fs');

build.addSuppression(`Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`);

// increment package-solution.json version
gulp.task('bump-version', () => {
  const packageSolution = JSON.parse(fs.readFileSync("config/package-solution.json"));
  var now = new Date();
  const buildNumber = now.getFullYear().toString().substr(2, 2) + "." + String(now.getMonth()).padStart(2, '0') + "." + String(now.getDate()).padStart(2, '0') + "." + String(now.getHours()).padStart(2, '0') + "" + String(now.getMinutes()).padStart(2, '0')
  packageSolution.solution.version = buildNumber;

  fs.writeFile("config/package-solution.json", JSON.stringify(packageSolution, null, 2), err => {
    console.log(`Latest version: ${packageSolution.solution.version}`);
  });
});

// Create clean distrubution package
gulp.task('dist', gulpSequence('bump-version', 'clean', 'bundle', 'package-solution'));
// Create clean development package
gulp.task('dev', gulpSequence('bump-version', 'clean', 'bundle', 'package-solution'));

/**
 * Webpack Bundle Anlayzer
 * Reference and gulp task
 */
if (process.argv.indexOf('--analyze') !== -1 ||
  process.argv.indexOf('dist') !== -1 ||
  process.argv.indexOf('dev') !== -1) {

  const bundleAnalyzer = require('webpack-bundle-analyzer');

  build.configureWebpack.mergeConfig({

    additionalConfiguration: (generatedConfiguration) => {
      const lastDirName = path.basename(__dirname);
      const dropPath = path.join(__dirname, 'temp', 'stats');
      generatedConfiguration.plugins.push(new bundleAnalyzer.BundleAnalyzerPlugin({
        openAnalyzer: false,
        analyzerMode: 'static',
        reportFilename: path.join(dropPath, `${lastDirName}.stats.html`),
        generateStatsFile: true,
        statsFilename: path.join(dropPath, `${lastDirName}.stats.json`),
        logLevel: 'error'
      }));

      return generatedConfiguration;
    }

  });
}


/**
 * StyleLinter configuration
 * Reference and custom gulp task
 */
const stylelint = require('gulp-stylelint');

/* Stylelinter sub task */
let styleLintSubTask = build.subTask('stylelint', (gulp) => {

  console.log('[stylelint]: By default style lint errors will not break your build. If you want to change this behaviour, modify failAfterError parameter in gulpfile.js.');

  return gulp
    .src('src/**/*.scss')
    .pipe(stylelint({
      failAfterError: false,
      reporters: [{
        formatter: 'string',
        console: true
      }]
    }));
});
/* end sub task */

build.rig.addPreBuildTask(styleLintSubTask);

/**
 * Custom Framework Specific gulp tasks
 */


/**
 *  fast-serve
 */

const useCustomServe = build.rig.getYargs().argv['custom-serve'];
const writeFileSync = require("fs").writeFileSync;
const workbenchApi = require("@microsoft/sp-webpart-workbench/lib/api");

if (useCustomServe) {
  build.tslintCmd.enabled = false;

  const ensureWorkbenchSubtask = build.subTask('ensure-workbench-task', function (gulp, buildOptions, done) {
    this.log('Creating workbench.html file...');
    try {
      workbenchApi.default["/workbench"]();
    } catch (e) { }

    done();
  });

  const saveConfigTask = build.subTask('save-webpack-config', (gulp, config, done) => {
    const serveAdditionalConfig = (generatedConfiguration) => {
      writeFileSync("./temp/_webpack_config.json", JSON.stringify(generatedConfiguration, null, 2));
      return generatedConfiguration;
    }

    if (!build.configureWebpack.taskConfig.additionalConfiguration) {
      build.configureWebpack.mergeConfig({
        additionalConfiguration: serveAdditionalConfig
      });
    } else {
      const oldConfigFunc = build.configureWebpack.taskConfig.additionalConfiguration;
      build.configureWebpack.mergeConfig({
        additionalConfiguration: (generatedConfiguration) => {
          generatedConfiguration = oldConfigFunc(generatedConfiguration);

          return serveAdditionalConfig(generatedConfiguration);
        }
      });
    }

    done();
  });

  build.rig.addPostTypescriptTask(saveConfigTask);
  build.rig.addPostBuildTask(build.task('ensure-workbench', ensureWorkbenchSubtask));
}

/**
 * End of fast-serve
 */

build.initialize(require('gulp'));

