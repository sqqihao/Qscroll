module.exports = function (grunt) {
    grunt.initConfig({
        pkg : grunt.file.readJSON('package.json'),
        connect: {
            options: {
                port: 9000,
                hostname: '127.0.0.1', //默认就是这个值，可配置为本机某个 IP，localhost 或域名
                livereload: 35729  //声明给 watch 监听的端口
            },
            server: {
                options: {
                    open: false, //自动打开网页 http://
                    base: [
                        ''  //主目录
                    ]
                }
            }
        },
        less: {
            production : {
                options: {
                },
                files: {

                }
            }
        },
        watch : {
            options: {
                livereload: 35729 // this port must be same with the connect livereload port
            },
            scripts: {
                files:  ['*.html',"style/*.less"],
                tasks: ["lessTask"],
                options: {
                    livereload: true
                }
            }
        }
    });
    grunt.registerTask("lessTask",["less"]);
    grunt.registerTask('default',["connect","less","watch"]);
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks("grunt-contrib-less");
};