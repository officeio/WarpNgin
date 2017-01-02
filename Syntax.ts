// import { treeAdapters } from 'parse5/lib';
import { ASTElement, ASTNode, ASTText, ASTAttributes, Constants } from './Index';
import * as HtmlParser from 'htmlparser2';
const HtmlRender = require('htmlparser-to-html');

export interface ASTNode {
    type: 'text' | 'comment' | 'tag' | 'directive' | 'script' | 'fragment';
}

export interface ASTText extends ASTNode {
    data: string;
}

export interface ASTElement extends ASTNode, ASTChildren {
    name: string;
    attribs: ASTAttributes;
}

export interface ASTChildren {
    children: ASTNode[]    
}

export interface ASTFragment extends ASTNode, ASTChildren {
}

export type ASTAttributes = { [name:string]:string };

export class Syntax {

    static prependIncludes(parent: ASTChildren, paths: string[]) {

        // Create include elements for each path.
        const includeElements = paths
            .map(path => Syntax.createElement(Constants.INCLUDE_TAG, { path: path }));

        // Prepend the include elements to the template.
        parent.children.unshift.apply(parent.children, includeElements);
        
    }

    static renderAttributes(attributes: ASTAttributes, variables: ASTAttributes): ASTAttributes {
        var resultAttributes = {};

        for (const attributeKey in attributes) {
            const attributeValue = attributes[attributeKey];
            const resultValue = Syntax.renderTemplatedString(attributeValue, variables);
            resultAttributes[attributeKey] = resultValue;
        }

        return resultAttributes;
    }

    static addAttributes(parentElement: ASTElement, attributes: ASTAttributes) {

        for (const attributeKey in attributes) 
            parentElement[attributeKey] = attributes[attributeKey];

    }

    /**
     * Append nodes as children of an element.
     */
    static append(parentElement: ASTChildren, children: ASTNode | ASTNode[]) {
        if (children instanceof Array) {
            for (const childNode of children)
                parentElement.children.push(childNode);
        } 
        else {
            parentElement.children.push(children);
        }
    }

    static getAttributeValue(element: ASTElement, attributeName: string): string {

        const value = element.attribs[attributeName];
        return value;

    }

    static createFragment(nodes?: ASTNode[]): ASTFragment {
        const fragment: ASTFragment = {
            type: 'fragment',
            children: nodes || []
        };

        return fragment;
    }

    static createElement(tagName: string, attributes?: ASTAttributes): ASTElement {
        var element: ASTElement = {
            type: 'tag',
            name: tagName,
            attribs: attributes || {},
            children: []
        };

        return element;
    }

    static createText(value: string): ASTText {
        const node: ASTText = {
            type: 'text',
            data: value
        };

        return <any>node;
    }

    static renderTemplatedString(templateText: string, variables: ASTAttributes) {

        const result = templateText.replace(/\@\{([a-zA-Z0-9\_\-]*?)\}/, (replaced, name) => {

            if (variables[name] === undefined)
                return "";

            return variables[name];

        });

        return result;

    }

    static removeCircularReferences(nodes) {

        if (!nodes || !(nodes instanceof Array))
            return;

        for (const node of nodes) {
            delete node.parents;
            delete node.next;
            delete node.prev;
            Syntax.removeCircularReferences(node.children)
        }

    }

    static fromHtml(html: string): ASTFragment {
        let nodes = null;
        let parseError = null;

        // Setup the handler.
        const handler = new HtmlParser['DomHandler'](function (error, dom) {
            if (error) {
                parseError = error;
                return;
            }
            
            nodes = dom;
        });

        // Run the parser.
        const parser = new HtmlParser.Parser(handler);
        parser.write(html);
        parser.done();

        // Get rid of parent, next and prev properties.
        Syntax.removeCircularReferences(nodes);

        // Create a fragment to return.
        const fragment = Syntax.createFragment(nodes);

        return fragment;
    }

    static toHtml(nodes: ASTNode | ASTNode[]): string {

        // Is this a fragment?
        const fragment = <ASTFragment>nodes; 
        if (fragment.type && fragment.type == 'fragment')
            nodes = fragment.children;
        
        // Push the singular into an array of nodes.
        if (fragment.type)
            nodes = <ASTNode[]>[nodes];

        // Render the nodes into HTML.
        var html = HtmlRender(nodes);
        return html;

    }

}
