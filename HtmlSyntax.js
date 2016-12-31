class HtmlSyntax {

    static renderAttributePairs(attributes, variables) {

        var resultPairs = [];

        for (const attribute of attributes) {
            const value = HtmlSyntax.renderTemplatedString(attribute.value, variables);
            const resultAttribute = HtmlSyntax.createAttribute(attribute.name, value);
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

    static appendAttribute(parentElement, attributes) {
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
     * 
     * @static
     * @param {Element} parentElement
     * @param {(Node|Node[])} children
     * 
     * @memberOf HtmlSyntax
     */
    static append(parentElement, children) {
        if (children instanceof Array) {
            for (const childNode of children)
                parentElement.childNodes.push(childNode);
        } 
        else {
            parentElement.childNodes.push(children);
        }
    }

    /**
     * @param {Element} elementNode
     * @param {String} attributeName
     * @returns {String}
     */
    static getAttributeValue(elementNode, attributeName) {

        var attribute = elementNode.attrs
            .filter(a => a.name == attributeName)
            .shift();

        if (!attribute)
            return undefined;

        return attribute.value;

    }

    static createElement(tagName, parentNode, namespaceURI) {
        var node = {
            nodeName: tagName,
            tagName: tagName,
            attrs: [],
            namespaceURI: namespaceURI || 'http://www.w3.org/1999/xhtml',
            childNodes: [],
            parentNode: parentNode
        };

        return node;
    }

    static createText(value, parentNode) {
        const node = {
            nodeName: '#text',
            value: value,
            parentNode: parentNode
        };

        return node;
    }

    static createAttribute(name, value) {
        const attribute = {
            name: name,
            value: value
        };

        return attribute;
    }

    /**
     * @param {String} templateText
     * @param {Object} variables
     */
    static renderTemplatedString(templateText, variables) {

        const result = templateText.replace(/\{\{([a-zA-Z0-9\_\-]*?)\}\}/, (replaced, name) => {

            if (variables[name] === undefined)
                return "";

            return variables[name];

        });

        return result;

    }

}

module.exports.HtmlSyntax = HtmlSyntax;