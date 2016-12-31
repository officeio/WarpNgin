const Engine = require('../@StaticEngine');

class ContentRenderer {

    constructor(transcludedNodes, targetElement, scope, template) {
        this.transcludedNodes = transcludedNodes;
        this.targetElement = targetElement;
        this.scope = scope;
        this.template = template;
    }

    render() {

        Engine.Rendering.renderNodes(this.transcludedNodes, this.targetElement, this.scope.parent, this.template);

    }

}

module.exports.Renderer = ContentRenderer;