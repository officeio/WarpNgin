import { ASTElement, ASTNode, Rendering, ViewTemplate, Scope } from '../Index';

export class ContentRenderer {

    transcludedNodes: ASTNode[];

    targetElement: ASTElement;

    scope: Scope;

    template: ViewTemplate;

    constructor(transcludedNodes: ASTNode[], targetElement: ASTElement, scope: Scope, template: ViewTemplate) {
        this.transcludedNodes = transcludedNodes;
        this.targetElement = targetElement;
        this.scope = scope;
        this.template = template;
    }

    render() {

        Rendering.renderNodes(this.transcludedNodes, this.targetElement, this.scope.parent, this.template);

    }

}