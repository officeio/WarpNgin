class HtmlSyntax {

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