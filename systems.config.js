/**
 * System configuration for Angular samples
 * Adjust as necessary for your application needs.
 */
(function (sdf, sdf2) {
    System.config({
        paths: {
            // paths serve as alias
            'npm:': 'node_modules/',
            'rxjs': 'node_modules/rxjs',
        },
        // map tells the System loader where to look for things
        map: {
            // our app is within the app folder
            app: 'src',
            // angular bundles
            '@angular/core': 'npm:@angular/core/bundles/core.umd.js',
            '@angular/common': 'npm:@angular/common/bundles/common.umd.js',
            '@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
            '@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
            '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
            '@angular/http': 'npm:@angular/http/bundles/http.umd.js',
            '@angular/router': 'npm:@angular/router/bundles/router.umd.js',
            '@angular/forms': 'npm:@angular/forms/bundles/forms.umd.js',
            // other libraries
            'rxjs':                      'npm:rxjs',
            'angular-in-memory-web-api': 'npm:angular-in-memory-web-api',
            'angular-pipes': 'npm:angular-pipes/src', //非得手动去修改src 下面的index.js 文件引用其他的文件内容后面加上index
            'angular2-data-table': 'node_modules/angular2-data-table/release',
            'angular2-color-picker': 'node_modules/angular2-color-picker',
        },
        // packages tells the System loader how to load when no filename and/or no extension
        packages: {
            app: {
                main: './main.js',
                defaultExtension: 'js'
            },
            rxjs: {
                // defaultExtension: 'js'
                'rxjs': { main: 'bundles/Rx.min.js', defaultExtension: 'js' }
            },
            'angular-in-memory-web-api': {
                main: './index.js',
                defaultExtension: 'js'
            },
            'angular2-data-table': {
                main: './index.js',
                defaultExtension: 'js'
            },
            'angular2-color-picker': {
                main: './index.js',
                defaultExtension: 'js'
            },
            'angular-pipes': {
                main: './index.js',
                defaultExtension: 'js'
            },
        }
    });
})(this);