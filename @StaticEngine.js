module.exports.ViewTemplate = require('./ViewTemplate').ViewTemplate;
module.exports.Scope = require('./Scope').Scope;
module.exports.Syntax = require('./HtmlSyntax').HtmlSyntax;
module.exports.Constants = require('./Constants').Constants;
module.exports.Project = require('./Project').Project;
module.exports.Build = require('./BuildSystem').Build;
module.exports.Renderers = {
    ViewRenderer: require('./Renderers/ViewRenderer').Renderer,
    IncludeRenderer: require('./Renderers/IncludeRenderer').Renderer,
    ContentRenderer: require('./Renderers/ContentRenderer').Renderer
};
module.exports.Rendering = require('./Rendering').Rendering;