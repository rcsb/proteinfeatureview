SOURCE_FILES=[
	      'js/pfv/viewer.js',
	      'js/pfv/colors.js',
        'js/pfv/draw.js',
        'js/pfv/params.js',
];

module.exports = function(grunt){

  "use strict";

  var pkg = grunt.file.readJSON('package.json');

  var BANNER = '/*! Protein Feature View. <%= pkg.name %> <%= pkg.version %>  <%= grunt.template.today("yyy-mm-dd") %> */\n';


  grunt.initConfig({
    
    pkg: pkg,

    config : {
      src: 'js/pfv/**.js',
      dist: 'build/'
    },

	  buildnumber:{
      package:{}
    },

    jshint : {

      options: {
        multistr :true,
        curly : true,
        eqeqeq : true,
        forin : true,
        maxlen: 100,
        /*freeze : true, */
        immed : true,
        latedef : true,
        undef : true,
        browser : true,
        devel : true,
        predef : [ 'define' ],
        unused : true
      },
      all: SOURCE_FILES
    },


    requirejs: {
      compile: {
        options: {
         name:'viewer',
          optimize: 'none',
          baseUrl: "js",
          mainConfigFile: "config.js",
          out: "build/<%= pkg.name %>.dbg.js",
          include:['vendor/require.js']
        }
      }
    },

    removelogging : {
      dist :  {
        src : 'build/<%= pkg.name %>.dbg.js',
        dest : 'build/<%= pkg.name %>.rel.js'
      }
    },

    uglify: {
      options : {
        banner: BANNER
      },
      build : {
        src:  'build/<%= pkg.name %>.rel.js',
        dest: 'build/<%= pkg.name %>.min.js'
      }
    },
    
    'string-replace': {
      version: {
        files: { 
           
           '<%= config.src %>' : '<%= config.dist %>/src/'
          }
        ,
        options: {
          replacements: [{
            pattern: '/{{ VERSION }}/g',
            replacement: '<%=pkg.version %>'
          },
          {
            pattern: '/{{ BUILD }}/g',
            replacement: '<%=pkg.build %>'
          }]
        }
      }
    }
  });

// Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-remove-logging');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-build-number');
  grunt.loadNpmTasks('grunt-string-replace');

// Default task(s).
  grunt.registerTask('default', [
				 'jshint', 'requirejs',  'removelogging', 'uglify','buildnumber' ,'string-replace' ,
  ]);


};