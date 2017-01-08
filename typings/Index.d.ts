declare module 'warpngin' {
    
    export class BuildSystem {
        project: Project;
        constructor(project?: Project);
        build(): void;
        buildPageFile(relativePath: string): void;
    }

    export interface IProjectOptions {
        pages?: string | string[];
        rootDirectory?: string;
        outDirectory?: string;
    }

    export class Project {
        options: IProjectOptions;
        constructor();
        set(options: IProjectOptions): void;
        parse(content: string): void;
        load(filename: string): void;
        save(filename?: string): void;
    }

    export class ViewTemplate {
        static fromHtml(templateHtml: string): ViewTemplate;
        static fromFile(filePath: string): ViewTemplate;
    }

}