const { Project, SyntaxKind } = require("ts-morph");

const project = new Project({
  tsConfigFilePath: "tsconfig.json",
});

const sourceFiles = project.getSourceFiles("src/**/*.tsx");
let changedCount = 0;

for (const sourceFile of sourceFiles) {
  let changed = false;

  sourceFile.forEachDescendant((node) => {
    if (node.getKind() === SyntaxKind.TypeReference) {
      const typeName = node.getTypeName().getText();
      if (typeName === "JSX.Element") {
        node.getTypeName().replaceWithText("React.JSX.Element");
        changed = true;
      }
    }
  });

  if (changed) {
    const hasReactImport = sourceFile.getImportDeclarations().some((imp) => {
      const moduleSpecifier = imp.getModuleSpecifierValue();
      if (moduleSpecifier === "react") {
        const defaultImport = imp.getDefaultImport();
        const namespaceImport = imp.getNamespaceImport();
        if (defaultImport && defaultImport.getText() === "React") return true;
        if (namespaceImport && namespaceImport.getText() === "React") return true;
        
        // Also check if type React is imported
        const namedImports = imp.getNamedImports();
        for (const named of namedImports) {
          if (named.getName() === "React") return true;
        }
      }
      return false;
    });

    if (!hasReactImport) {
      sourceFile.addImportDeclaration({
        isTypeOnly: true,
        namespaceImport: "React",
        moduleSpecifier: "react",
      });
    }

    sourceFile.saveSync();
    changedCount++;
  }
}

console.log("Files updated:", changedCount);
