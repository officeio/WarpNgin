import { ASTElement, Rendering, Scope, ViewTemplate } from '../Index';

export class ViewRenderer {

    template: ViewTemplate;

    sourceNode: ASTElement;

    scope: Scope;

    constructor(renderingTemplate: ViewTemplate, parentScope?: Scope, variables?: any, sourceNode?: ASTElement) {

        this.template = renderingTemplate;
        this.sourceNode = sourceNode;

        var transcludedNodes = sourceNode ? sourceNode.childNodes : undefined;
        this.scope = Scope.createChild(parentScope, variables, transcludedNodes, renderingTemplate.directory);

    }

    render() {

        const root: ASTElement = <any>{
            nodeName: this.template.templateElement.nodeName,
            mode: this.template.templateElement['mode'],
            childNodes: []
        };

        Rendering.renderNodes(this.template.templateElement.childNodes, root, this.scope, this.template);

        return root;

    }

}