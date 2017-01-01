export * from './ViewTemplate';
export * from './Syntax';
export * from './Rendering';
export * from './Scope';
export * from './Constants';
export * from './Project';
export * from './BuildSystem';
export * from './Renderers/ViewRenderer';
export * from './Renderers/ContentRenderer';
export * from './Renderers/IncludeRenderer';

import { AST } from 'parse5';
export type ASTNode = AST.Default.Node;
export type ASTElement = AST.Default.Element;
export type ASTText = AST.Default.TextNode;

// #!/usr/bin/env node
// const StaticEngineCLI = require('./StaticEngineCLI');

// // Create the CLI class and run with the arguments.
// StaticEngineCLI.run();