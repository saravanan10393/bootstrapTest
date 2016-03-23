module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
        },
        build: {
          src: 'public_html/js/*.js',
          dest: 'public_html/dest/js/<%= pkg.name %>.min.js'
        }
        },
        cssmin: {
         target: {
          files: [{
            expand: true,
            cwd: 'public_html/css',
            src: ['*.css', '!*.min.css'],
            dest: 'public_html/dest/css',
            ext: '.min.css'
            }]
          }
          },
          connect:{
            server:{
              options:{
                port:8000,
                open:true,
                hostname:'0.0.0.0',
                keepalive:true,
                useAvailablePort:true,
                base:'public_html'
              }
            }
          }
          });

  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.loadNpmTasks('grunt-contrib-connect');

  grunt.loadNpmTasks('grunt-contrib-cssmin');

  // Default task(s).
  grunt.registerTask('default', ['uglify','cssmin','connect']);

};