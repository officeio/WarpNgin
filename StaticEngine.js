// const Path = require('path');
// const DomRuntime = require('cheerio');
// const FileSystem = require('fs');
// const StaticEngineProject = require('./StaticEngineProject');
// const Glob = require('globule');

// class StaticEngine {

//     constructor() {
//         this.hasInitialized = false;
//         this.project = new StaticEngineProject();
//         this.pageFiles = [];
//         this.includeFiles = [];
//         this.sourceDirectory = './src';
//         this.elementExtension = 'html';
//     }

//     /**
//      * Will initialize the engine, but will not bother if already initialized.
//      * 
//      * @returns {StaticEngine}
//      * 
//      * @memberOf StaticEngineB
//      */
//     initialize() {
//         if (hasInitialized)
//             return;

//         this.pageFiles = this.findPageFiles();
//         this.includeFiles =  this.findIncludeFiles();

//         this.hasInitialized = true;

//         return this;
//     }

//     /**
//      * Finds all the pages as part of the project.
//      * These are the root files to be compiled.
//      * 
//      * @returns {StaticEngine}
//      * 
//      * @memberOf StaticEngine
//      */
//     findPageFiles() {
//         var patterns = this.project.options.pages;
//         var files = Glob.find(patterns);

//         return files;
//     }

//     findIncludeFiles() {
//         var patterns = this.project.options.pages;
//         var files = Glob.find(patterns);

//         return files;
//     }

//     getElementPath(tagName, dirPath) {
//         this.initialize();

//         dirPath = dirPath || this.sourceDirectory;

//         // Workout what the file-name would be.
//         const fileName = `${tagName}.${this.elementExtension}`;
//         const filePath = Path.join(dirPath, fileName);
//         console.log(`getElementPath: filePath=${filePath}`);

//         return filePath;
//     }

//     isTagTemplated(tagName, dirPath) {
//         this.initialize();

//         const filePath = this.getElementPath(tagName, dirPath);

//         // Does the file exist?
//         if (!FileSystem.existsSync(filePath))
//             return false;

//         return true;
//     }

//     /**
//      * @param templateDom {CheerioStatic}
//      * @param templateElement {Cheerio}
//      */
//     compileChildren(templateDom, templateElement, dirPath) {
//         this.initialize();

//         // const compileUnit = Dom.load(input);
//         var childElements = templateElement
//             .children()
//             .toArray()
//             .map(x => templateDom(x));

//         var outputElement = templateDom("<div></div>");

//         for (const childElement of childElements) {
//         // elements.each((index, element) => {

//             // console.log(`EL: ${childElement.tagName}`)
//             if (!this.isTagTemplated(childElement.get(0).tagName, dirPath)) {
//                 outputElement.append(childElement.clone());
//                 continue;
//             }

//             console.log(`EL: ${childElement.get(0).tagName}`)
//             const replacedElement = this.replaceElement(childElement, dirPath);
//             outputElement.append(replacedElement);
//             // element.replaceWith(transpiledElement)

//         }

//         return outputElement.children();
        
//         // const transpiledHtml = compileUnit.html();
//         // return transpiledHtml;

//     }

//     /**
//      * Transpiles an element.
//      * @param compileElement {Cheerio}
//      */
//     replaceElement(templateElement, dirPath) {
//         this.initialize();

//         const innerElements = templateElement
//             .children()
//             .toArray()
//             .map(x => templateDom(x));

//         const tagName = templateElement.get(0).tagName;
//         const filePath = this.getElementPath(tagName, dirPath);

//         const transpiledHtml = this.transpileFile(filePath, innerHtml);
//         return transpiledHtml;

//     }

//     /**
//      * @param templateDom {CheerioStatic}
//      * @param templateElement {Cheerio}
//      */
//     compileElement(templateElement, templateDom, dirPath) {
//         this.initialize();

//         const innerElements = templateElement
//             .children()
//             .toArray()
//             .map(x => templateDom(x));

//         const tagName = templateElement.get(0).tagName;
//         if (tagName == "contents") {

//         }

//         const isReplaced = this.isTagTemplated(tagName, dirPath);

//         if (isReplaced) {
//             const filePath = this.getElementPath(tagName, dirPath);
//         }

//     }

//     /**
//      * @param filePath {String}
//      * @param innerElements {Cheerio[]}
//      */
//     compileFile(filePath, innerElements) {
//         this.initialize();

//         const dirPath = Path.dirname(filePath);
//         const templateHtml = FileSystem.readFileSync(filePath);
//         const templateDom = DomRuntime.load(templateHtml);
//         const templateElement = templateDom.root();
//         const instanceElement = compileElement(templateElement, templateDom, dirPath);
//         return instanceElement;
//     }

//     transpileFile(filePath) {
//         this.initialize();

//         // const dirPath = Path.dirname(filePath);
//         // const templateHtml = FileSystem.readFileSync(filePath);
//         // const templateDom = Dom.load(templateHtml);
//         // const templateElement = templateDom.root();
//         // // templateElements.each((j,e) => console.log(e.tagName));
//         // const transpiledHtml = this.compileChildren(templateDom, templateElement);
//         const instanceElement = compileFile(filePath);
//         const transpiledHtml = instanceElement.html();
//         return templateHtml; // transpiledHtml;

//     }

// }

// module.exports = StaticEngine;