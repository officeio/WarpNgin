import { ASTFragment, Syntax, ASTChildren, Rendering, Scope, ViewTemplate } from '../Index';

export class ViewRenderer {

    template: ViewTemplate;

    sourceNode: ASTChildren;

    scope: Scope;

    constructor(renderingTemplate: ViewTemplate, parentScope?: Scope, variables?: any, sourceNode?: ASTChildren) {

        this.template = renderingTemplate;
        this.sourceNode = sourceNode;

        var transcludedNodes = sourceNode ? sourceNode.children : undefined;
        this.scope = Scope.createChild(parentScope, variables, transcludedNodes, renderingTemplate.directory);

    }

    render() {

        const fragment = Syntax.createFragment();

        Rendering.renderNodes(this.template.templateElement.children, fragment, this.scope, this.template);

        return fragment;

    }

}