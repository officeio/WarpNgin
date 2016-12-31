const Engine = require('../@StaticEngine');

class ViewRenderer {

    constructor(renderingTemplate, parentScope, variables, sourceNode) {

        this.template = renderingTemplate;
        this.sourceNode = sourceNode;

        var transcludedNodes = sourceNode ? sourceNode.childNodes : undefined;
        this.scope = Engine.Scope.createChild(parentScope, variables, transcludedNodes, renderingTemplate.directory);

    }

    render() {

        const root = {
            nodeName: this.template.templateElement.nodeName,
            mode: this.template.templateElement.mode,
            childNodes: []
        };

        Engine.Rendering.renderNodes(this.template.templateElement.childNodes, root, this.scope, this.template);

        return root;

    }

}

module.exports.Renderer = ViewRenderer;