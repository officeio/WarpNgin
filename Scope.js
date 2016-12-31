'use strict';

const Engine = require('./@StaticEngine');

/**
 * Constains ninforation regarding the runtime scope of an element.
 * 
 * @class StaticEngineScope
 */
class Scope {

    /**
     * @param {StaticEngineScope} parent
     * @param {Object.<String, String>} attributes
     * @param {Node[]} transcludedNodes
     */
    constructor(parent, attributes, transcludedNodes) {

        /** @type {StaticEngineScope} */
        this.parent = parent;

        /** @type {StaticEngineScope[]} */
        this.children = [];

        /** @type {Object.<String, String>} */
        this.attributes = attributes || {};

        /** @type {Object.<String, StaticEngineView>} */
        this.views = [];

        /** @type {Node[]} */
        this.transcludedNodes = transcludedNodes || [];

    }

    findView(tag) {

        let searchScope = this;
        while (searchScope !== undefined) {

            const view = searchScope.views[tag];
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
        
        this.views[tag] = view;

    }

    /**
     * @param {AST.Element} elementNode
     */
    registerTemplateElement(elementNode) {

        // Get the tag-name from the 'tag' attribute.
        const tagName = Engine.Syntax.getAttributeValue(elementNode, 'tag');
        if (tagName === undefined)
            throw Error(`<${Engine.Constants.TEMPLATE_TAG}> found without a tag name`);

        const elementView = Engine.ViewTemplate.fromTemplateElement(elementNode);

        this.registerView(tagName, elementView);

    }

    /**
     * @param {String} tagName
     */
    unregisterView(tag) {

        delete this.views[tag];

    }

}

module.exports.Scope = Scope;
