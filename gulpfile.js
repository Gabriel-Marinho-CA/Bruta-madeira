const gulp = require('gulp');
const { spawn } = require('child_process');
const flatten = require('gulp-flatten');


// Tarefa para minificar e mover arquivos JS
gulp.task('js', function() {
    return gulp.src('scripts/**/*.js') // sem a barra inicial
        .pipe(flatten({ includeParents: 0 }))
        .pipe(gulp.dest('assets/')); // sem a barra inicial
});

// Tarefa para monitorar alterações em arquivos SCSS e JS
gulp.task('watch', function () {
    gulp.watch('scripts/**/*.js', gulp.series('js')); // Monitora alterações no JS
    
    const themeWatchProcess = spawn('theme', ['watch', '--allow-live', '--env', 'development'], {
        stdio: 'inherit'
    });

    themeWatchProcess.on('close', (code) => {
        if (code !== 0) {
            console.error(`Theme watch process exited with code ${code}`);
        }
    });
});
