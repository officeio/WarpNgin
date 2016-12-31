const FileSystem = require('fs');
const Path = require('path');
const Util = require('underscore');
const Engine = require('./@StaticEngine');

/**
 * Loads/Saves and parses project files.
 * 
 * @class StaticEngineProject
 */
class StaticEngineProject {

    /**
     * Creates an instance of StaticEngineProject.
     * 
     * @memberOf StaticEngineProject
     */
    constructor() {
        this.options = {
            "pages": [
                "**/*.html", 
                "!**/_*.html"
            ],
            "includes": [
                "**/_*.html"
            ]
        };
    }

    /**
     * Merges options given with the currently set options on this project.
     * 
     * @param {any} options
     * 
     * @memberOf StaticEngineProject
     */
    set(options) {
        const newOptions = Util.extend({}, this.options, options);
        this.options = newOptions;
    }

    /**
     * Parses a JSON string into the options for the current project.
     * 
     * @param {any} content
     * 
     * @memberOf StaticEngineProject
     */
    parse(content) {
        const options = JSON.parse(content);
        this.set(options);
    }

    /**
     * Loads the file with the JSON options for this project.
     * 
     * @param {any} filename
     * 
     * @memberOf StaticEngineProject
     */
    load(filename) {
        filename = filename || Engine.Constants.PROJECT_FILENAME;

        const json = FileSystem.readFileSync(filename);
        this.parse(json);
    }

    /**
     * Save a file with the project options inside it, serialized as JSON.
     * 
     * @param {any} filename
     * 
     * @memberOf StaticEngineProject
     */
    save(filename) {
        filename = filename || Engine.Constants.PROJECT_FILENAME;

        const json = JSON.stringify(this.options, null, 4);
        FileSystem.writeFileSync(filename, json);
    }

}

module.exports.Project = StaticEngineProject;
