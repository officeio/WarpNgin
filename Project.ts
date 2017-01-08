import { Constants } from './Index';
import * as FileSystem from 'fs';
import * as Path from 'path';
import * as Util from 'underscore';

/**
 * Describes how the project is made and how it should be built.
 */
export interface IProjectOptions {
    pages?: string | string[];
    rootDirectory?: string;
    outDirectory?: string
}

/**
 * Loads/Saves and parses project files.
 */
export class Project {

    options: IProjectOptions;

    /**
     * Creates an instance of StaticEngineProject.
     */
    constructor() {
        this.options = {
            "pages": [
                "**/*.html", 
                "!**/_*.html",
                "!node_modules/**",
                "!bower_components/**"
            ],
            "rootDirectory": ".",
            "outDirectory": "out"
        };
    }

    /**
     * Merges options given with the currently set options on this project.
     */
    set(options: IProjectOptions) {
        const newOptions = Util.extend({}, this.options, options);
        this.options = newOptions;
    }

    /**
     * Parses a JSON string into the options for the current project.
     */
    parse(content: string) {
        const options = JSON.parse(content);
        this.set(options);
    }

    /**
     * Loads the file with the JSON options for this project.
     */
    load(filename: string) {
        filename = filename || Constants.PROJECT_FILENAME;

        const json = FileSystem.readFileSync(filename).toString();
        this.parse(json);
    }

    /**
     * Save a file with the project options inside it, serialized as JSON.
     * 
     * @param {any} filename
     * 
     * @memberOf StaticEngineProject
     */
    save(filename?: string) {
        filename = filename || Constants.PROJECT_FILENAME;

        const json = JSON.stringify(this.options, null, 4);
        FileSystem.writeFileSync(filename, json);
    }

}
