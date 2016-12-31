'use strict';

const Path = require('path');
const HtmlParser = require('parse5');
const FileSystem = require('fs');
const Engine = require('./@StaticEngine');

const TEMPLATE_TAG = "s:template";

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

        /** @type {AST.Default.DocumentFragment} */
        this.templateNode = undefined;

    }

    /**
     * @param {StaticEngineScope} parentScope
     * @returns {Node}
     */
    execute(attributes, parentScope) {

        // Has a template been loaded for us?
        if (!this.templateNode)
            throw Error("No template loaded");

        // Create the scope for this view.
        var scope = new Engine.Scope(parentScope, attributes)

        const outputFragment = {
            nodeName: this.templateNode.nodeName,
            mode: this.templateNode.mode,
            childNodes: []
        };

        this.processChildNodes(this.templateNode.childNodes, outputFragment, scope);

        // var templateHtml = HtmlParser.serialize(this.templateNode);
        // console.log("TEMPLATE: **" + templateHtml + "**");

        // var instanceHtml = HtmlParser.serialize(outputFragment);
        // console.log(outputFragment);
        // console.log("INSTANCE: **" + instanceHtml + "**");

        return outputFragment;

    }

    executeToHtml(attributes, parentScope) {
        const node = this.execute(attributes, parentScope);
        const html = HtmlParser.serialize(node);
        return html;
    }

    /**
     * @param {AST.Node} templateNode
     * @param {AST.Node} parentNode
     * @param {Scope} scope
     * @returns {AST.Node}
     */
    processElementNode(templateNode, parentNode, scope) {

        const tagName = templateNode.tagName;
        const outputElement = Engine.Syntax.createElement(tagName, parentNode, templateNode.namespaceURI);

        // Process the attributes first!
        const attributePairs = Engine.Syntax.renderAttributePairs(templateNode.attrs, scope.attributes);
        Engine.Syntax.appendAttribute(outputElement, attributePairs);

        // Is there a view associated with this element?
        const view = scope.findView(tagName);
        if (view) {
            const attributes = Engine.Syntax.getAttributeDictionary(attributePairs);
            const fragment = view.execute(attributes, scope);
            return fragment.childNodes;
        }

        // Process the children next!
        this.processChildNodes(templateNode.childNodes, outputElement, scope);

        return outputElement;

    }

    processNode(templateNode, outputParentNode, scope) {

        // Ignore the contents of directive elements.
        if (templateNode.tagName == TEMPLATE_TAG)
            return;

        // Output text nodes, with placeholders evaluated and replaced.
        if (templateNode.nodeName == '#text') {
            const value = Engine.Syntax.renderTemplatedString(templateNode.value, scope.attributes);
            const outputChildNode = Engine.Syntax.createText(value, outputParentNode);
            outputParentNode.childNodes.push(outputChildNode);
            return;
        }

        // Output typical elements, once being processed.
        if (templateNode.tagName) {
            const output = this.processElementNode(templateNode, outputParentNode, scope);
            Engine.Syntax.append(outputParentNode, output);
            return;
        }
        
    }

    /**
     * @param {Engine.Scope} scope
     */
    processChildNodes(templateChildNodes, outputParentNode, scope) {

        // Find any templates before processing the child-nodes.
        const elementNodes = templateChildNodes
            .filter(n => n.tagName == TEMPLATE_TAG);

        const registeredElementTags = [];
        for (const elementNode of elementNodes) {
            const tagName = Engine.Syntax.getAttributeValue(elementNode, 'tag');
            scope.registerTemplateElement(elementNode);
            registeredElementTags.push(tagName);
        }

        for (const templateChildNode of templateChildNodes)
            this.processNode(templateChildNode, outputParentNode, scope);

        // Unregister the element template at this level.
        // Mainly to stop confusion to the user.
        for (const registeredElementTag of registeredElementTags)
            scope.unregisterView(registeredElementTag);

    }

    /**
     * Already parsed HTML to be used for a new view.
     * 
     * @param {AST.Element} elementNode
     */
    static fromTemplateElement(elementNode) {

        const view = new Engine.View();
        view.templateNode = elementNode;
        return view;

    }

    /**
     * The HTML of which to parse.
     * 
     * @param {String} templateHtml
     */
    static fromHtml(templateHtml) {

        const view = new Engine.View();
        view.templateNode = HtmlParser.parseFragment(templateHtml);
        return view;

    }

    /**
     * Loads the page from an HTML file.
     * 
     * @param {String} filename
     */
    static fromFile(filename) {

        const view = new Engine.View();

        // Resolve the filename and absolute path.
        const absolutePath = Path.resolve(filename);
        view.filename = Path.basename(absolutePath);
        view.directory = Path.dirname(absolutePath);

        // Load the HTML from the file and parse it into a traversable DOMs.
        const templateHtml = FileSystem.readFileSync(absolutePath).toString();
        view.instanceElement = view.parse(templateHtml);

    }

}

module.exports.View = StaticEngineView;
