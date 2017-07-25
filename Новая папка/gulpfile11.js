var gulp       = require('gulp'), // ���������� Gulp
    less         = require('gulp-less'), //���������� less �����,
    browserSync  = require('browser-sync'), // ���������� Browser Sync
    concat       = require('gulp-concat'), // ���������� gulp-concat (��� ������������ ������)
    uglify       = require('gulp-uglifyjs'), // ���������� gulp-uglifyjs (��� ������ JS)
    cssnano      = require('gulp-cssnano'), // ���������� ����� ��� ����������� CSS
    rename       = require('gulp-rename'), // ���������� ���������� ��� �������������� ������
    del          = require('del'), // ���������� ���������� ��� �������� ������ � �����
    imagemin     = require('gulp-imagemin'), // ���������� ���������� ��� ������ � �������������
//  pngquant     = require('imagemin-pngquant'), // ���������� ���������� ��� ������ � png
// cache        = require('gulp-cache'), // ���������� ���������� �����������
    autoprefixer = require('gulp-autoprefixer');// ���������� ���������� ��� ��������������� ���������� ���������           npm install gulp-uglifyjs --save-dev

// ���� ��� �������� html
gulp.task('html:build', function () {
    gulp.src(path.src.html) //������� ����� �� ������� ����
        .pipe(rigger()) //�������� ����� rigger
        .pipe(gulp.dest(path.build.html)) //�������� �� � ����� build
        .pipe(connect.reload()) //� ������������ ��� ������ ��� ����������
});

gulp.task('less', function(){ // ������� ���� less
    return gulp.src('app/less/**/*.less') // ����� ��������
        .pipe(less()) // ����������� less � CSS ����������� gulp-less
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) // ������� ��������
        .pipe(gulp.dest('app/css')) // ��������� ���������� � ����� app/css
        .pipe(browserSync.reload({stream: true})) // ��������� CSS �� �������� ��� ���������
});

gulp.task('browser-sync', function() { // ������� ���� browser-sync
    browserSync({ // ��������� browserSync
        server: { // ���������� ��������� �������
            baseDir: 'app' // ���������� ��� ������� - app
        },
        notify: false // ��������� �����������
    });
});

gulp.task('scripts', function() {
    return gulp.src([ // ����� ��� ����������� ����������
        'app/libs/jquery/dist/jquery.min.js', // ����� jQuery
        //'app/libs/magnific-popup/dist/jquery.magnific-popup.min.js' // ����� Magnific Popup
    ])
        .pipe(concat('libs.min.js')) // �������� �� � ���� � ����� ����� libs.min.js
        .pipe(uglify()) // ������� JS ����
        .pipe(gulp.dest('app/js')); // ��������� � ����� app/js
});

gulp.task('css-libs', ['less'], function() {
    return gulp.src('app/css/libs.css') // �������� ���� ��� �����������
        .pipe(cssnano()) // �������
        .pipe(rename({suffix: '.min'})) // ��������� ������� .min
        .pipe(gulp.dest('app/css')); // ��������� � ����� app/css
});

gulp.task('watch', ['browser-sync', 'css-libs', 'scripts'], function() {
    gulp.watch('app/less/**/*.less', ['less']); // ���������� �� less ������� � ����� less
    gulp.watch('app/*.html', browserSync.reload); // ���������� �� HTML ������� � ����� �������
    gulp.watch('app/js/**/*.js', browserSync.reload);   // ���������� �� JS ������� � ����� js
});

gulp.task('clean', function() {
    return del.sync('dist'); // ������� ����� dist ����� �������
});

gulp.task('img', function() {
    return gulp.src('app/img/**/*') // ����� ��� ����������� �� app
        .pipe(cache(imagemin({  // ������� �� � ���������� ����������� � ������ �����������
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('dist/img')); // ��������� �� ���������
});

gulp.task('build', ['clean', 'img', 'less', 'scripts'], function() {

    var buildCss = gulp.src([ // ��������� ���������� � ���������
        'app/css/main.css',
        'app/css/libs.min.css'
    ])
        .pipe(gulp.dest('dist/css'))

    var buildFonts = gulp.src('app/fonts/**/*') // ��������� ������ � ���������
        .pipe(gulp.dest('dist/fonts'))

    var buildJs = gulp.src('app/js/**/*') // ��������� ������� � ���������
        .pipe(gulp.dest('dist/js'))

    var buildHtml = gulp.src('app/*.html') // ��������� HTML � ���������
        .pipe(gulp.dest('dist'));

});

gulp.task('clear', function () {
    return cache.clearAll();
})

gulp.task('default', ['watch']);