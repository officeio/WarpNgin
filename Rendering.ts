import { ASTElement } from './Syntax';
import {
    ASTChildren,
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

    static renderElement(sourceElement: ASTElement, parentElement: ASTChildren, scope: Scope, template: ViewTemplate) {

        const outputElement = Syntax.createElement(sourceElement.name);

        // Process the attributes first!
        const attributes = Syntax.renderAttributes(sourceElement.attribs, scope.attributes);
        Syntax.addAttributes(outputElement, attributes);

        // Process the children next!
        Rendering.renderNodes(sourceElement.children, outputElement, scope, template);

        return outputElement;

    }

    static renderNode(sourceNode: ASTNode, parentElement: ASTChildren, scope: Scope, template: ViewTemplate) {

        // Output text nodes, with placeholders evaluated and replaced.
        if (sourceNode.type == 'text') {
            const sourceText = <ASTText>sourceNode;
            const value = Syntax.renderTemplatedString(sourceText.data, scope.attributes);
            const outputChildNode = Syntax.createText(value);
            parentElement.children.push(outputChildNode);
            return;
        }

        // Is this an element?
        const sourceElement = <ASTElement>sourceNode;
        if (sourceElement.name) {

            // Ignore the contents of template element.
            if (sourceElement.name === Constants.TEMPLATE_TAG)
                return;

            // Is this a content tag to be replaced with the content given to the view.
            if (sourceElement.name === Constants.CONTENT_TAG) {
                const renderer = new ContentRenderer(scope.transcludedNodes, parentElement, scope, template);
                renderer.render();
                return;
            }

            if (sourceElement.name === Constants.INCLUDE_TAG) {
                const renderer = new IncludeRenderer(sourceElement, parentElement, scope, template);
                renderer.render();
                return;
            }

            // Is there a view associated with this element?
            const view = scope.findView(sourceElement.name);
            if (view) {
                const attributes = Syntax.renderAttributes(sourceElement.attribs, scope.attributes);
                const renderer = new ViewRenderer(view, scope, attributes, sourceElement);
                const viewRoot = renderer.render();
                Syntax.append(parentElement, viewRoot.children);
                return
            }

            // Render out recursive processing of this element.
            // debugger;
            const outputElement = Rendering.renderElement(sourceElement, parentElement, scope, template);
            Syntax.append(parentElement, outputElement);

        }
        
    }

    static renderNodes(sourceNodes: ASTNode[], parent: ASTChildren, scope: Scope, template: ViewTemplate) {

        const registeredElementTags = [];

        // Find any templates before processing the child-nodes.
        const elementNodes = <ASTElement[]>sourceNodes
            .filter(node => node.type == 'tag')
            .filter(element => (<ASTElement>element).name == Constants.TEMPLATE_TAG);

        for (const elementNode of elementNodes) {
            const tagName = Syntax.getAttributeValue(elementNode, 'tag');
            scope.registerTemplateElement(elementNode);
            registeredElementTags.push(tagName);
        }

        // Process each one of the nodes.
        for (const sourceNode of sourceNodes)
            Rendering.renderNode(sourceNode, parent, scope, template);

        // // Unregister the element template at this level.
        // // Mainly to stop confusion to the user.
        // for (const registeredElementTag of registeredElementTags)
        //     scope.unregisterView(registeredElementTag);

    }

}

module.exports.Rendering = Rendering;