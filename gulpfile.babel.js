import del from "del";
import gulp from "gulp";
import gpug from "gulp-pug";
import browserSync from "browser-sync";
import image from "gulp-image";
import ssass from "sass";
import gsass from "gulp-sass";
const sass = gsass(ssass);
const reload = browserSync.reload;

const routes = {
  pug: {
    watch: "src/**/*.pug",
    src: "src/*.pug",
    dest: "build",
  },
  img: {
    src: "src/img/*",
    dest: "build/img",
  },
  scss: {
    watch: "src/scss/**/*.scss",
    src: "src/scss/styles.scss",
    dest: "build",
  },
};

const pug = () =>
  gulp
    .src(routes.pug.src)
    .pipe(gpug())
    .pipe(gulp.dest(routes.pug.dest))
    .pipe(reload({ stream: true }));

const clean = () => del(["build"]);

const devServer = () => {
  browserSync.init({
    server: {
      baseDir: "build",
    },
  });
  watch();
};

const img = () =>
  gulp.src(routes.img.src).pipe(image()).pipe(gulp.dest(routes.img.dest));

const styles = () =>
  gulp
    .src(routes.scss.src)
    .pipe(sass().on("error", sass.logError))
    .pipe(gulp.dest(routes.scss.dest))
    .pipe(reload({ stream: true }));

const watch = () => {
  gulp.watch(routes.pug.watch, pug);
  gulp.watch(routes.img.src, img);
  gulp.watch(routes.scss.watch, styles);
};

const prepare = gulp.series([clean, img]);

const assets = gulp.series([pug, styles]);

const postDev = gulp.series([devServer]);

export const dev = gulp.series([prepare, assets, postDev]);
