'use strict';

const Engine = require('./@StaticEngine');

/**
 * Constains ninforation regarding the runtime scope of an element.
 * 
 * @class StaticEngineScope
 */
class StaticEngineScope {

    /**
     * @param {StaticEngineScope} parent
     * @param {Object.<String, String>} attributes
     */
    constructor(parent, attributes) {

        /** @type {StaticEngineScope} */
        this.parent = parent;

        /** @type {StaticEngineScope[]} */
        this.children = [];

        /** @type {Object.<String, String>} */
        this.attributes = attributes || {};

        /** @type {Object.<String, StaticEngineView>} */
        this.elements = [];

    }

    findView(tag) {

        let searchScope = this;
        while (searchScope !== undefined) {

            const view = searchScope.elements[tag];
            if (view !== undefined)
                return view;

            searchScope = searchScope.parent;

        } 

    }

    /**
     * @param {String} tag
     * @param {StaticEngineView} view
     */
    registerView(tag, view) {
        
        this.elements[tag] = view;

    }

    /**
     * @param {AST.Element} elementNode
     */
    registerTemplateElement(elementNode) {

        // Get the tag-name from the 'tag' attribute.
        const tagName = Engine.Syntax.getAttributeValue(elementNode, 'tag');
        if (tagName === undefined)
            throw Error(`<${TEMPLATE_TAG}> found without a tag name`);

        const elementView = Engine.View.fromTemplateElement(elementNode);

        this.registerView(tagName, elementView);

    }

    /**
     * @param {String} tagName
     */
    unregisterView(tag) {

        delete this.elements[tag];

    }

}

module.exports.Scope = StaticEngineScope;