'use strict';

const Yargs = require('yargs');
const Hapi = require('hapi');
const Path = require('path');
const Inert = require('inert');
const FileSystem = require('fs');
const StaticEngine = require('./StaticEngine');

class StaticEngineCLI {

    /**
     * Interprets the arguments given by YARGS.
     */
    run() {

        // Get the command to execute.
        const command = Yargs.argv._.shift();
        if (!command)
            return this.usage('No command given');

        // Which command are we to process?
        switch (command) {
            case "serve":
                return this.serve();
            case "build":
                return this.build();
            default:
                return this.usage(`Unknown command [${command}]`);
        }

    }

    /**
     * Starts up a web server, that serves static files, and also processes the HTML files.
     */
    serve() {

        const publicDirectory = './public';
        const sourceDirectory = './src';

        const staticEngine = new StaticEngine();
        // staticEngine.sourceDirectory = sourceDirectory;

        const server = new Hapi.Server({
            connections: {
                routes: {
                    files: {
                        relativeTo: Path.join(__dirname, publicDirectory)
                    }
                }
            }
        });

        server.connection({ port: 3000 });

        server.register(Inert, () => {});

        server.route({
            method: 'GET',
            path: '/{param*}',
            handler: (request, reply) => {
                let filePath = request.params.param;
                if (!filePath)
                    filePath = "index.html";

                const extension = Path.extname(filePath);

                if (extension === '.html') {
                    var fullPath = Path.join(__dirname, sourceDirectory, filePath);
                    var exists = FileSystem.existsSync(fullPath);
                    if (exists) {
                        console.log(`processing ${filePath}`);
                        var contents = staticEngine.transpileFile(fullPath);
                        return reply('<h1>Poo</h1>' + contents);
                    }
                }

                console.log(filePath);
                reply.file(filePath);
            }
        });

        // server.route({
        //     method: 'GET',
        //     path: '/{param*}',
        //     handler: {
        //         directory: {
        //             path: '.',
        //             redirectToSlash: true,
        //             index: true,
        //             listing: true,

        //         }
        //     }
        // });

        server.start();

        // return this.usage('Command [serve], not yet implemented');
    }

    /**
     * Builds the HTML files, places them into the output folder.
     * The static files are also copied to the output folder.
     */
    build() {
        return this.usage('Command [build], not yet implemented');
    }

    /**
     * Prints out the usage to the console.
     */
    usage(errorMessage) {

        // Have we got an error message to display before the usage?
        if (errorMessage)
            console.log(`ERROR: ${errorMessage}`);

        // Render the usage into lines.
        const lines =
          [ ``
          , `USAGE: staticengine [command]`
          , ``
          , `Commands:`
          , ``
          , `  serve    Runs an HTTP server serving the static files and `
          , `           processing the HTML files on-the-fly.`
          , ``
          , `  build    Builds the HTML files, placing them into an output `
          , `           directory, copying the static files also.`
          , `` ];

        // Join the lines together and output.
        console.log(lines.join('\n'));

    }

}

module.exports = StaticEngineCLI;