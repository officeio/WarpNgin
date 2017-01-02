import { ASTNode, ViewTemplate, Constants, Syntax } from './Index';

/**
 * Constains information regarding the runtime scope of an element.
 */
export class Scope {

    parent: Scope;

    children: Scope[] = [];

    attributes: any = {};

    views: { [index: string]: ViewTemplate } = {};

    transcludedNodes: ASTNode[] = [];

    directory: string;

    constructor(parent, attributes, transcludedNodes, directory) {
        this.parent = parent;
        this.attributes = attributes || this.attributes;
        this.transcludedNodes = transcludedNodes || this.transcludedNodes;
        this.directory = directory;
    }

    static createChild(parentScope, attributes, transcludedNodes, directory) {
        directory = directory || (parentScope ? parentScope.directory : undefined);
        const childScope = new Scope(parentScope, attributes, transcludedNodes, directory);
        return childScope;
    }

    findView(tag) {

        let searchScope: Scope = this;
        while (searchScope) {

            // console.log(searchScope);
            const view = searchScope.views[tag];
            if (view)
                return view;

            searchScope = searchScope.parent;

        } 

    }

    registerView(tag, view) {
        
        this.views[tag] = view;

    }

    registerTemplateElement(elementNode) {

        // Get the tag-name from the 'tag' attribute.
        const tagName = Syntax.getAttributeValue(elementNode, 'tag');
        if (tagName === undefined)
            throw Error(`<${Constants.TEMPLATE_TAG}> found without a tag name`);

        const elementView = ViewTemplate.fromTemplateElement(elementNode);

        this.registerView(tagName, elementView);

    }

    unregisterView(tag) {

        delete this.views[tag];

    }

}
