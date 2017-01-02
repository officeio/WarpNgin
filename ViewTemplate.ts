import { Constants } from './Constants';
import { ASTFragment, ASTChildren, ASTNode, Syntax, Scope, ViewRenderer } from './Index';
import * as Path from 'path';
import * as FileSystem from 'fs';

/**
 * Deconstructs and stores information about an HTML file.
 */
export class ViewTemplate {

    filename: string;

    directory: string;

    templateElement: ASTChildren;

    execute(attributes: any, parentScope?: Scope, transcludedNodes?: ASTNode[]) {
        // Has a template been loaded for us?
        if (!this.templateElement)
            throw Error("No template loaded");

        // Prepare the renderer.
        const renderer = new ViewRenderer(this, parentScope, attributes);

        // Render and return.
        const output = renderer.render();
        return output;
    }

    executeToHtml(attributes?: any, parentScope?: Scope): string {
        const node = this.execute(attributes, parentScope);
        const html = Syntax.toHtml(node);
        return html;
    }

    /**
     * Already parsed HTML to be used for a new view.
     */
    static fromTemplateElement(templateElement: ASTChildren) {

        const view = new ViewTemplate();
        view.templateElement = templateElement;
        view.directory = process.cwd();
        return view;

    }

    /**
     * The HTML of which to parse.
     */
    static fromHtml(templateHtml: string) {

        const view = new ViewTemplate();
        view.templateElement = Syntax.fromHtml(templateHtml);
        view.directory = process.cwd();
        return view;

    }

    /**
     * Loads the page from an HTML file.
     */
    static fromFile(filePath: string) {

        // Resolve the filename and absolute path.
        const absolutePath = Path.resolve(filePath);

        // Load the HTML from the file and parse it into a traversable DOMs.
        const templateHtml = FileSystem.readFileSync(absolutePath).toString();
        const view = ViewTemplate.fromHtml(templateHtml);
        view.filename = Path.basename(absolutePath);
        view.directory = Path.dirname(absolutePath);
        
        return view;

    }

}
