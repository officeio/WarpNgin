const Engine = require('../@StaticEngine');
const Glob = require('globule');
const FileSystem = require('fs');

class IncludeRenderer {

    constructor(sourceNode, targetElement, scope, template) {
        this.sourceNode = sourceNode;
        this.targetElement = targetElement;
        this.scope = scope;
        this.template = template;
    }

    render() {

        const filename = Engine.Syntax.getAttributeValue(this.sourceNode, 'file');

        // Get the paths to load.
        const filesGlob = 
            Engine.Syntax.getAttributeValue(this.sourceNode, 'files')
            || Engine.Syntax.getAttributeValue(this.sourceNode, 'file');

        // Find the files that match the glob.
        const files = Glob.find(filesGlob, {
            srcBase: this.scope.directory, 
            destBase: this.scope.directory });

        // Did they want a specific file, and it didn't exist?
        if (filename && files.length == 0)
            throw Error(`Include failed, no file found ${filename}`);

        for (const file of files) {

            // Load the template.
            const template = Engine.ViewTemplate.fromFile(file);

            // Render directly in-place using the current scope, not a child-scope.
            Engine.Rendering.renderNodes(template.templateElement.childNodes, this.targetElement, this.scope, template);

        }

    }

}

module.exports.Renderer = IncludeRenderer;