'use strict';

/** @typedef {{ parent: Scope, children: Scope[], attributes: any, views: StaticEngineView[], findView: (tag) => StaticEngineView }} Scope */ 

const Path = require('path');
const HtmlParser = require('parse5');
const FileSystem = require('fs');
const Engine = require('./@StaticEngine');

/**
 * Deconstructs and stores information about an HTML file.
 * 
 * @class StaticEngineView
 */
class StaticEngineView {

    /**
     * Creates an instance of StaticEngineView.
     * 
     * @memberOf StaticEngineView
     */
    constructor() {

        /** @type {String} */
        this.filename = undefined;

        /** @type {String} */
        this.directory = undefined;

        /** @type {Element} */
        this.templateElement = undefined;

    }

    /**
     * @param {any} attributes
     * @param {Scope} parentScope
     * @param {Node[]} transcludedNodes
     * @returns {Node}
     */
    execute(attributes, parentScope, transcludedNodes) {

        // Has a template been loaded for us?
        if (!this.templateElement)
            throw Error("No template loaded");

        // Create the scope for this view.
        var scope = new Engine.Scope(parentScope, attributes, transcludedNodes);

        const outputFragment = {
            nodeName: this.templateElement.nodeName,
            mode: this.templateElement.mode,
            childNodes: []
        };

        this.renderNodes(this.templateElement.childNodes, outputFragment, scope);

        // var templateHtml = HtmlParser.serialize(this.templateNode);
        // console.log("TEMPLATE: **" + templateHtml + "**");

        // var instanceHtml = HtmlParser.serialize(outputFragment);
        // console.log(outputFragment);
        // console.log("INSTANCE: **" + instanceHtml + "**");

        return outputFragment;

    }

    /**
     * @param {any} attributes
     * @param {Scope} parentScope
     * @returns {String}
     */
    executeToHtml(attributes, parentScope) {
        const node = this.execute(attributes, parentScope);
        const html = HtmlParser.serialize(node);
        return html;
    }

    /**
     * @param {Node} templateNode
     * @param {Element} instanceParentElement
     * @param {Scope} scope
     * @returns {Node}
     */
    processElement(templateNode, instanceParentElement, scope) {

        const tagName = templateNode.tagName;
        const outputElement = Engine.Syntax.createElement(tagName, instanceParentElement, templateNode.namespaceURI);

        // Process the attributes first!
        const attributePairs = Engine.Syntax.renderAttributePairs(templateNode.attrs, scope.attributes);
        Engine.Syntax.appendAttribute(outputElement, attributePairs);

        // Process the children next!
        this.renderNodes(templateNode.childNodes, outputElement, scope);

        return outputElement;

    }

    /**
     * @param {Node} templateNode
     * @param {Element} instanceParentElement
     * @param {Scope} scope
     */
    processNode(templateNode, instanceParentElement, scope) {

        // Output text nodes, with placeholders evaluated and replaced.
        if (templateNode.nodeName == '#text') {
            const value = Engine.Syntax.renderTemplatedString(templateNode.value, scope.attributes);
            const outputChildNode = Engine.Syntax.createText(value, instanceParentElement);
            instanceParentElement.childNodes.push(outputChildNode);
            return;
        }

        // Is this an element?
        if (templateNode.tagName) {

            // Ignore the contents of template element.
            if (templateNode.tagName === Engine.Constants.TEMPLATE_TAG)
                return;

            // Is this a content tag to be replaced with the content given to the view.
            if (templateNode.tagName === Engine.Constants.CONTENT_TAG) {
                this.renderNodes(scope.transcludedNodes, instanceParentElement, scope.parent);
                return;
            }

            // Is there a view associated with this element?
            const view = scope.findView(templateNode.tagName);
            if (view) {
                const attributePairs = Engine.Syntax.renderAttributePairs(templateNode.attrs, scope.attributes);
                const attributes = Engine.Syntax.getAttributeDictionary(attributePairs);
                const innerNodes = templateNode.childNodes;
                const viewInstance = view.execute(attributes, scope, innerNodes);
                Engine.Syntax.append(instanceParentElement, viewInstance.childNodes);
                return
            }

            // Render out recursive processing of this element.
            const outputElement = this.processElement(templateNode, instanceParentElement, scope);
            Engine.Syntax.append(instanceParentElement, outputElement);

        }
        
    }

    /**
     * @param {Node[]} templateNodes
     * @param {Element} instanceParentElement
     * @param {Engine.Scope} scope
     */
    renderNodes(templateNodes, instanceParentElement, scope) {

        const registeredElementTags = [];

        // Find any templates before processing the child-nodes.
        const elementNodes = templateNodes
            .filter(n => n.tagName == Engine.Constants.TEMPLATE_TAG);
        for (const elementNode of elementNodes) {
            const tagName = Engine.Syntax.getAttributeValue(elementNode, 'tag');
            scope.registerTemplateElement(elementNode);
            registeredElementTags.push(tagName);
        }

        // Process each one of the nodes.
        for (const templateChildNode of templateNodes)
            this.processNode(templateChildNode, instanceParentElement, scope);

        // Unregister the element template at this level.
        // Mainly to stop confusion to the user.
        for (const registeredElementTag of registeredElementTags)
            scope.unregisterView(registeredElementTag);

    }

    /**
     * Already parsed HTML to be used for a new view.
     * 
     * @param {Element} templateElement
     */
    static fromTemplateElement(templateElement) {

        const view = new Engine.View();
        view.templateElement = templateElement;
        return view;

    }

    /**
     * The HTML of which to parse.
     * 
     * @param {String} templateHtml
     */
    static fromHtml(templateHtml) {

        const view = new Engine.View();
        view.templateElement = HtmlParser.parseFragment(templateHtml);
        return view;

    }

    /**
     * Loads the page from an HTML file.
     * 
     * @param {String} filename
     * 
     */
    static fromFile(filename) {

        // Resolve the filename and absolute path.
        const absolutePath = Path.resolve(filename);

        // Load the HTML from the file and parse it into a traversable DOMs.
        const templateHtml = FileSystem.readFileSync(absolutePath).toString();
        const view = Engine.View.fromHtml(templateHtml);
        view.filename = Path.basename(absolutePath);
        view.directory = Path.dirname(absolutePath);
        
        return view;

    }

}

module.exports.View = StaticEngineView;
