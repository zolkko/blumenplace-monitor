function settingsPlugin (ctx) {
    var t = ctx.types;

    var path = require("path");

    var sourceDir = path.resolve(path.join(__dirname, "..", "src", "js"));
    var settingsPath = path.join(sourceDir, "settings.dev");

    return {
        visitor: {
            ImportDeclaration(path) {
                var module = path.node.source;
                if (module && module.type === "StringLiteral" && module.value === "settings") {
                    console.log("substitute settings module import in file", this.file.opts.filename);
                    path.replaceWith(t.importDeclaration(path.node.specifiers, t.stringLiteral(settingsPath)));
                }
            },

            CallExpression(path) {
                function isRequireExpression (node) {
                    return t.isIdentifier(node.callee, {name: "require"}) ||
                        (t.isMemberExpression(node.callee) && t.isIdentifier(node.callee.object, {name: "require"}));
                }

                if (isRequireExpression(path.node)) {
                    var module = path.node.arguments[0];
                    if (module && module.type === "StringLiteral" && module.value === "settings") {
                        console.log("substitute settings module require expression in file", this.file.opts.filename);
                        path.replaceWith(t.callExpression(
                            path.node.callee, [t.stringLiteral(settingsPath)]
                        ));
                    }
                }
            }
        }
    };
}


require("babel-register")({
    presets: ["es2015", "stage-0", "react"],
    plugins: [settingsPlugin]
});


module.exports = {
    "monitor tests": {
        environment: "node",
        rootPath: "../",
        sources: [],
        tests: [
            "test/utils-test.js"
        ]
    }
};
