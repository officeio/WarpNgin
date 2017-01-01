import {
    ASTElement,
    ASTNode,
    ASTText,
    Constants,
    ContentRenderer,
    IncludeRenderer,
    Scope,
    Syntax,
    ViewRenderer,
    ViewTemplate
} from './Index';

export class Rendering {

    static renderElement(sourceNode: ASTElement, parentElement: ASTElement, scope: Scope, template: ViewTemplate) {

        const tagName = sourceNode.tagName;
        const outputElement = Syntax.createElement(tagName, parentElement, sourceNode.namespaceURI);

        // Process the attributes first!
        const attributePairs = Syntax.renderAttributePairs(sourceNode.attrs, scope.attributes);
        Syntax.appendAttribute(outputElement, attributePairs);

        // Process the children next!
        Rendering.renderNodes(sourceNode.childNodes, outputElement, scope, template);

        return outputElement;

    }

    static renderNode(sourceNode: ASTNode, parentElement: ASTElement, scope: Scope, template: ViewTemplate) {

        // Output text nodes, with placeholders evaluated and replaced.
        if (sourceNode.nodeName == '#text') {
            const sourceText = <ASTText>sourceNode;
            const value = Syntax.renderTemplatedString(sourceText.value, scope.attributes);
            const outputChildNode = Syntax.createText(value, parentElement);
            parentElement.childNodes.push(outputChildNode);
            return;
        }

        // Is this an element?
        const sourceElement = <ASTElement>sourceNode;
        if (sourceElement.tagName) {

            // Ignore the contents of template element.
            if (sourceElement.tagName === Constants.TEMPLATE_TAG)
                return;

            // Is this a content tag to be replaced with the content given to the view.
            if (sourceElement.tagName === Constants.CONTENT_TAG) {
                const renderer = new ContentRenderer(scope.transcludedNodes, parentElement, scope, template);
                renderer.render();
                return;
            }

            if (sourceElement.tagName === Constants.INCLUDE_TAG) {
                const renderer = new IncludeRenderer(sourceElement, parentElement, scope, template);
                renderer.render();
                return;
            }

            // Is there a view associated with this element?
            const view = scope.findView(sourceElement.tagName);
            if (view) {
                const attributePairs = Syntax.renderAttributePairs(sourceElement.attrs, scope.attributes);
                const attributes = Syntax.getAttributeDictionary(attributePairs);
                const renderer = new ViewRenderer(view, scope, attributes, sourceElement);
                const viewRoot = renderer.render();
                Syntax.append(parentElement, viewRoot.childNodes);
                return
            }

            // Render out recursive processing of this element.
            const outputElement = Rendering.renderElement(sourceElement, parentElement, scope, template);
            Syntax.append(parentElement, outputElement);

        }
        
    }

    static renderNodes(sourceNodes: ASTNode[], parentElement: ASTElement, scope: Scope, template: ViewTemplate) {

        const registeredElementTags = [];

        // Find any templates before processing the child-nodes.
        const elementNodes = sourceNodes
            .map(n => <ASTElement>n) 
            .filter(n => n.tagName == Constants.TEMPLATE_TAG);
        for (const elementNode of elementNodes) {
            const tagName = Syntax.getAttributeValue(elementNode, 'tag');
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