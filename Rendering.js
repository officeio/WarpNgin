const Engine = require('./@StaticEngine');

class Rendering {

    /**
     * @param {Node} sourceNode
     * @param {Element} parentElement
     * @returns {Node}
     */
    static renderElement(sourceNode, parentElement, scope, template) {

        const tagName = sourceNode.tagName;
        const outputElement = Engine.Syntax.createElement(tagName, parentElement, sourceNode.namespaceURI);

        // Process the attributes first!
        const attributePairs = Engine.Syntax.renderAttributePairs(sourceNode.attrs, scope.attributes);
        Engine.Syntax.appendAttribute(outputElement, attributePairs);

        // Process the children next!
        Rendering.renderNodes(sourceNode.childNodes, outputElement, scope, template);

        return outputElement;

    }

    /**
     * @param {Node} sourceNode
     * @param {Element} parentElement
     */
    static renderNode(sourceNode, parentElement, scope, template) {

        // Output text nodes, with placeholders evaluated and replaced.
        if (sourceNode.nodeName == '#text') {
            const value = Engine.Syntax.renderTemplatedString(sourceNode.value, scope.attributes);
            const outputChildNode = Engine.Syntax.createText(value, parentElement);
            parentElement.childNodes.push(outputChildNode);
            return;
        }

        // Is this an element?
        if (sourceNode.tagName) {

            // Ignore the contents of template element.
            if (sourceNode.tagName === Engine.Constants.TEMPLATE_TAG)
                return;

            // Is this a content tag to be replaced with the content given to the view.
            if (sourceNode.tagName === Engine.Constants.CONTENT_TAG) {
                const renderer = new Engine.Renderers.ContentRenderer(scope.transcludedNodes, parentElement, scope, this.template);
                renderer.render();
                return;
            }

            if (sourceNode.tagName === Engine.Constants.INCLUDE_TAG) {
                const renderer = new Engine.Renderers.IncludeRenderer(sourceNode, parentElement, scope, this.template);
                renderer.render();
                return;
            }

            // Is there a view associated with this element?
            const template = scope.findView(sourceNode.tagName);
            if (template) {
                const attributePairs = Engine.Syntax.renderAttributePairs(sourceNode.attrs, scope.attributes);
                const attributes = Engine.Syntax.getAttributeDictionary(attributePairs);
                const renderer = new Engine.Renderers.ViewRenderer(template, scope, attributes, sourceNode);
                const viewRoot = renderer.render();
                Engine.Syntax.append(parentElement, viewRoot.childNodes);
                return
            }

            // Render out recursive processing of this element.
            const outputElement = Rendering.renderElement(sourceNode, parentElement, scope, template);
            Engine.Syntax.append(parentElement, outputElement);

        }
        
    }

    /**
     * @param {Node[]} sourceNodes
     * @param {Element} parentElement
     */
    static renderNodes(sourceNodes, parentElement, scope, template) {

        const registeredElementTags = [];

        // Find any templates before processing the child-nodes.
        const elementNodes = sourceNodes
            .filter(n => n.tagName == Engine.Constants.TEMPLATE_TAG);
        for (const elementNode of elementNodes) {
            const tagName = Engine.Syntax.getAttributeValue(elementNode, 'tag');
            scope.registerTemplateElement(elementNode);
            registeredElementTags.push(tagName);
        }

        // Process each one of the nodes.
        for (const templateChildNode of sourceNodes)
            Rendering.renderNode(templateChildNode, parentElement, scope, template);

        // Unregister the element template at this level.
        // Mainly to stop confusion to the user.
        for (const registeredElementTag of registeredElementTags)
            scope.unregisterView(registeredElementTag);

    }

}

module.exports.Rendering = Rendering;