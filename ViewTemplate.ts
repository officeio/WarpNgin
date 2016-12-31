'use strict';

/** @typedef {{ parent: Scope, children: Scope[], attributes: any, views: ViewTemplate[], findView: (tag) => ViewTemplate }} Scope */ 

const Path = require('path');
const FileSystem = require('fs');
const Engine = require('./@StaticEngine');

/**
 * Deconstructs and stores information about an HTML file.
 * 
 * @class StaticEngineView
 */
class ViewTemplate {

    /**
     * Creates an instance of ViewTemplate.
     * 
     * @memberOf ViewTemplate
     */
    constructor() {

        /** @type {String} */
        this.filename = undefined;

        /** @type {String} */
        this.directory = undefined;

        /** @type {Element} */
        this.templateElement = undefined;

    }

    /**
     * @param {any} attributes
     * @param {Scope} parentScope
     * @param {Node[]} transcludedNodes
     * @returns {Node}
     */
    execute(attributes, parentScope, transcludedNodes) {

        // Has a template been loaded for us?
        if (!this.templateElement)
            throw Error("No template loaded");

        // Prepare the renderer.
        const renderer = new Engine.Renderers.ViewRenderer(this, parentScope, attributes);

        // Render and return.
        const output = renderer.render();
        return output;

    }

    /**
     * @param {any} attributes
     * @param {Scope} parentScope
     * @returns {String}
     */
    executeToHtml(attributes, parentScope) {
        const node = this.execute(attributes, parentScope);
        const html = Engine.Syntax.toHtml(node);
        return html;
    }

    /**
     * Already parsed HTML to be used for a new view.
     * 
     * @param {Element} templateElement
     */
    static fromTemplateElement(templateElement) {

        const view = new Engine.ViewTemplate();
        view.templateElement = templateElement;
        return view;

    }

    /**
     * The HTML of which to parse.
     * 
     * @param {String} templateHtml
     */
    static fromHtml(templateHtml) {

        const view = new Engine.ViewTemplate();
        view.templateElement = Engine.Syntax.fromHtml(templateHtml);
        return view;

    }

    /**
     * Loads the page from an HTML file.
     * 
     * @param {String} filename
     * 
     */
    static fromFile(filename) {

        // Resolve the filename and absolute path.
        const absolutePath = Path.resolve(filename);

        // Load the HTML from the file and parse it into a traversable DOMs.
        const templateHtml = FileSystem.readFileSync(absolutePath).toString();
        const view = Engine.ViewTemplate.fromHtml(templateHtml);
        view.filename = Path.basename(absolutePath);
        view.directory = Path.dirname(absolutePath);
        
        return view;

    }

}

module.exports.ViewTemplate = ViewTemplate;
