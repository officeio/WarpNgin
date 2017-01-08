#!/usr/bin/env node
const Glob = require('globule');
import * as Yargs from 'yargs';
import * as Hapi from 'hapi';
import * as Inert from 'inert';
import * as FileSystem from 'fs';
import * as Path from 'path';
import * as Util from 'underscore';
import { Project, BuildSystem } from './Index';

export class CLI {

    params: { 
        [index:string]: any,
        _: any,
        project: string
    };

    constructor() {
        this.params = Util.clone(Yargs.argv);
    }

    /**
     * Create the CLI class and run with the arguments.
     */
    static run() {

        // Create the CLI class and run with the arguments.
        var engine = new CLI();
        engine.execute();

    }

    /**
     * Interprets the arguments given by YARGS.
     */
    execute() {

        // Get the command to execute.
        const command = this.params._.shift();
        if (!command)
            return this.usage('No command given');

        // Any remaining non-switches are files.
        const files = this.params._;
       
        // Which command are we to process?
        switch (command) {
            // case "serve":
            //     return this.serve();
            case "build":
                return this.build();
            default:
                return this.usage(`Unknown command [${command}]`);
        }

    }

    // /**
    //  * Starts up a web server, that serves static files, and also processes the HTML files.
    //  */
    // serve() {

    //     const publicDirectory = './public';
    //     const sourceDirectory = './src';

    //     const staticEngine = new StaticEngine();
    //     // staticEngine.sourceDirectory = sourceDirectory;

    //     const server = new Hapi.Server({
    //         connections: {
    //             routes: {
    //                 files: {
    //                     relativeTo: Path.join(__dirname, publicDirectory)
    //                 }
    //             }
    //         }
    //     });

    //     server.connection({ port: 3000 });

    //     server.register(Inert, () => {});

    //     server.route({
    //         method: 'GET',
    //         path: '/{param*}',
    //         handler: (request, reply) => {
    //             let filePath = request.params.param;
    //             if (!filePath)
    //                 filePath = "index.html";

    //             const extension = Path.extname(filePath);

    //             if (extension === '.html') {
    //                 var fullPath = Path.join(__dirname, sourceDirectory, filePath);
    //                 var exists = FileSystem.existsSync(fullPath);
    //                 if (exists) {
    //                     console.log(`processing ${filePath}`);
    //                     var contents = staticEngine.transpileFile(fullPath);
    //                     return reply('<h1>Poo</h1>' + contents);
    //                 }
    //             }

    //             console.log(filePath);
    //             reply.file(filePath);
    //         }
    //     });

    //     // server.route({
    //     //     method: 'GET',
    //     //     path: '/{param*}',
    //     //     handler: {
    //     //         directory: {
    //     //             path: '.',
    //     //             redirectToSlash: true,
    //     //             index: true,
    //     //             listing: true,

    //     //         }
    //     //     }
    //     // });

    //     server.start();

    //     // return this.usage('Command [serve], not yet implemented');
    // }

    /**
     * Builds the HTML files, places them into the output folder.
     * The static files are also copied to the output folder.
     */
    build() {

        // Load the project file.
        var project = new Project();
        if (this.params.project)
            project.load(this.params.project);

        // Create the build-system.
        var buildSystem = new BuildSystem(project);
        buildSystem.on('message', (msg) => console.log(msg));

        // Perform the build.
        buildSystem.build();

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
          , `USAGE: warngin [command]`
          , ``
          , `Commands:`
        //   , ``
        //   , `  serve    Runs an HTTP server serving the static files and `
        //   , `           processing the HTML files on-the-fly.`
          , ``
          , `  build    Builds the HTML files, placing them into an output `
          , `           directory, copying the static files also.`
          , `` ];

        // Join the lines together and output.
        console.log(lines.join('\n'));

    }

}

CLI.run();