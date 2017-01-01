// const HtmlParser:any = require('parse5')
import { ASTElement, ASTNode, ASTText } from './Index';
import * as HtmlParser from 'parse5';

export class Syntax {

    static renderAttributePairs(attributes, variables) {

        var resultPairs = [];

        for (const attribute of attributes) {
            const value = Syntax.renderTemplatedString(attribute.value, variables);
            const resultAttribute = Syntax.createAttribute(attribute.name, value);
            resultPairs.push(resultAttribute);
        }

        return resultPairs;

    }

    static getAttributeDictionary(pairs) {
        const attributeDictionary = {};

        for (const pair of pairs)
            attributeDictionary[pair.name] = pair.value;

        return attributeDictionary;
    }

    static getAttributePairs(attributeDictionary) {
        const attributes = [];

        for (const key in attributeDictionary) {

            const attribute = {
                name: key,
                value: attributeDictionary[key]
            };

            attributes.push(attribute);

        }

        return attributes;
    }

    static appendAttribute(parentElement: ASTElement, attributes: any | any[]) {
        if (attributes instanceof Array) {
            for (const attribute of attributes)
                parentElement.attrs.push(attribute);
        }
        else {
            parentElement.attrs.push(attributes);
        }
    }

    /**
     * Append nodes as children of an element.
     */
    static append(parentElement: ASTElement, children: ASTNode | ASTNode[]) {
        if (children instanceof Array) {
            for (const childNode of children)
                parentElement.childNodes.push(childNode);
        } 
        else {
            parentElement.childNodes.push(children);
        }
    }

    static getAttributeValue(elementNode: ASTElement, attributeName: string): string {

        var attribute = elementNode.attrs
            .filter(a => a.name == attributeName)
            .shift();

        if (!attribute)
            return undefined;

        return attribute.value;

    }

    static createElement(tagName: string, parentNode: ASTNode, namespaceURI: string): ASTElement {
        var node = {
            nodeName: tagName,
            tagName: tagName,
            attrs: [],
            namespaceURI: namespaceURI || 'http://www.w3.org/1999/xhtml',
            childNodes: [],
            parentNode: parentNode
        };

        return <any>node;
    }

    static createText(value: string, parentNode: ASTNode): ASTText {
        const node = {
            nodeName: '#text',
            value: value,
            parentNode: parentNode
        };

        return <any>node;
    }

    static createAttribute(name: string, value: string) {
        const attribute = {
            name: name,
            value: value
        };

        return attribute;
    }

    static renderTemplatedString(templateText: string, variables) {

        const result = templateText.replace(/\@\{([a-zA-Z0-9\_\-]*?)\}/, (replaced, name) => {

            if (variables[name] === undefined)
                return "";

            return variables[name];

        });

        return result;

    }

    static fromHtml(html: string): ASTElement {

        const root = HtmlParser.parseFragment(html);
        return <ASTElement>root;

    }

    static toHtml(node: ASTNode): string {

        const html = HtmlParser.serialize(node);
        return html;

    }

}
