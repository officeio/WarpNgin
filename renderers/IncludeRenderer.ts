import { ASTElement, ASTNode, Rendering, Syntax, ViewTemplate, Scope } from '../Index';
import * as FileSystem from 'fs';
import * as HtmlParser from 'parse5';
const Glob = require('globule');

export class IncludeRenderer {

    sourceNode: ASTElement;

    targetElement: ASTElement;

    scope: Scope;

    template: ViewTemplate;

    constructor(sourceNode: ASTElement, targetElement: ASTElement, scope: Scope, template: ViewTemplate) {
        this.sourceNode = sourceNode;
        this.targetElement = targetElement;
        this.scope = scope;
        this.template = template;
    }

    render() {

        // Get the singular file if specified.
        const filename = Syntax.getAttributeValue(this.sourceNode, 'file');

        // Get the paths to load.
        const filesGlob = 
            Syntax.getAttributeValue(this.sourceNode, 'files')
            || filename;

        // Find the files that match the glob.
        const files = Glob.find(filesGlob, {
            srcBase: this.scope.directory, 
            destBase: this.scope.directory });

        // Did they want a specific file, and it didn't exist?
        if (filename && files.length == 0)
            throw Error(`Include failed, file "${filename}" not found`);

        for (const file of files) {

            // Load the template.
            const template = ViewTemplate.fromFile(file);

            // Render directly in-place using the current scope, not a child-scope.
            Rendering.renderNodes(template.templateElement.childNodes, this.targetElement, this.scope, template);

        }

    }

}