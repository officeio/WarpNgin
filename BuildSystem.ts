import { Project, ViewRenderer, ViewTemplate, Syntax, Constants } from './Index';
import * as Path from 'path';
import * as FileSystem from 'fs';
// import * as Globule from 'globule';
const Glob = require('globule');

export class BuildSystem {

    project: Project;

    constructor(project?: Project) {
        this.project = project;
    }

    // getTargetFilename(sourceFilename: string, targetDirectory: string) {
    //     const targetFilename = Path.join(targetDirectory, sourceFilename);
    //     return targetFilename;
    // }

    /**
     * Find files inside one parent directory up to the next, collecting files.
     * The ones closest to the root will come first.
     */
    findParentFiles(relativePath: string, pattern: string) {

        const foundFilePaths: string[] = [];
        const options = this.project.options;

        // Resolve the relative path to an absolute one.
        const rootPath = Path.resolve(options.rootDirectory);
        const sourcePath = Path.join(rootPath, relativePath);

        // Loop from one parent up to the next, collecting files.
        // The ones closest to the root will come first.
        let searchDirectory = Path.dirname(sourcePath);
        while (searchDirectory.length >= rootPath.length) {

            // Find files in the directory that match the pattern.
            const searchDirectoryFileNames:string[] = Glob.find(pattern, { srcBase: searchDirectory });

            // Get the full path of the filename.
            const absoluteFilePaths = searchDirectoryFileNames.map(fileName => Path.join(searchDirectory, fileName));

            // Get the paths converted to ones that are relative to the root-directory.
            const relativeFilePaths = absoluteFilePaths.map(absoluteFilePath => Path.relative(rootPath, absoluteFilePath));

            // Add these to the start of the list.
            foundFilePaths.unshift.apply(foundFilePaths, relativeFilePaths);
            
            // Goto the next search-directory. 
            // Make sure we don't loop forever more.
            const nextDirectory = Path.dirname(searchDirectory);
            if (searchDirectory == nextDirectory)
                break;
            searchDirectory = nextDirectory;

        }

        return foundFilePaths;

    }

    build() {

        const options = this.project.options;

        // Find all the pages to be compiled.
        const relativePaths = Glob.find(options.pages, { srcBase: options.rootDirectory });

        // Find the pages we are to build.
        for (const relativePath of relativePaths) {

            // console.log(pageFilePath);
            this.buildPageFile(relativePath);

        }

    }

    buildPageFile(relativePath: string) {

        const options = this.project.options;

        // ViewTemplate.

        // TODO: Find the start file.
        const startFilePaths = this.findParentFiles(relativePath, Constants.START_FILENAME_PATTERN);
        for (const startFilePath in startFilePaths) {
            // ViewTemplate.fromFile();
        }
        
        // Work out the source and target file-paths.
        const sourceFilePath = Path.join(options.rootDirectory, relativePath);
        const targetFilePath = Path.join(options.outDirectory, relativePath);

        // Load the template and render to HTML.
        const template = ViewTemplate.fromFile(sourceFilePath);
        const renderer = new ViewRenderer(template);
        const nodes = renderer.render();
        const html = Syntax.toHtml(nodes);

        // Does the target directory exist?
        const targetDirectoryPath = Path.dirname(targetFilePath);
        if (!FileSystem.existsSync(targetDirectoryPath))
            FileSystem.mkdirSync(targetDirectoryPath);

        // Write the target file.
        FileSystem.writeFileSync(targetFilePath, html);

    }

}
