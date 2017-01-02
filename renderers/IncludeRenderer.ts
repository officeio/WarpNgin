import { ASTElement } from '../Syntax';
import { ASTChildren, ASTNode, Rendering, Syntax, ViewTemplate, Scope } from '../Index';
import * as FileSystem from 'fs';
import * as Path from 'path';
const Glob = require('globule');

export class IncludeRenderer {

    sourceElement: ASTElement;

    targetElement: ASTChildren;

    scope: Scope;

    template: ViewTemplate;

    constructor(sourceElement: ASTElement, targetElement: ASTChildren, scope: Scope, template: ViewTemplate) {
        this.sourceElement = sourceElement;
        this.targetElement = targetElement;
        this.scope = scope;
        this.template = template;
    }

    render() {

        if (!this.scope.directory)
            throw Error("Template has no directory, cannot resolve template path");

        // Get the singular file if specified.
        const path = Syntax.getAttributeValue(this.sourceElement, 'path');

        // Get the pattern glob.
        const pattern = Syntax.getAttributeValue(this.sourceElement, 'pattern');

        // Get the paths to load.
        const filesGlob = pattern || path;

        // Find the files that match the glob.
        const files = Glob
            .find(filesGlob, { srcBase: this.scope.directory })
            .map(filePath => Path.resolve(this.scope.directory, filePath));
        
        // Did they want a specific file, and it didn't exist?
        if (path && files.length == 0)
            throw Error(`Include failed, file "${path}" not found`);

        for (const file of files) {

            // Load the template.
            const template = ViewTemplate.fromFile(file);

            // Render directly in-place using the current scope, not a child-scope.
            Rendering.renderNodes(template.templateElement.children, this.targetElement, this.scope, template);

        }

    }

}