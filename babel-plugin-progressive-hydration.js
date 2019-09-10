module.exports = function(babel) {
    const { types: t } = babel;
  
    return {
      name: "ast-transform-38", // not required
      visitor: {
        ImportDeclaration(path, state) {
          const mod = path.node.source.value.toLowerCase();
          if (mod === "react") {
            return;
          }
  
          const components = {};
          const others = {};
  
          path.node.specifiers.forEach(s => {
            const exportName = s.imported ? s.imported.name : s.local.name;
            const importName = s.local.name;
  
            const binding = path.scope.getBinding(importName);
  
            if (binding) {
              const bindings = binding.referencePaths;
  
              if (
                bindings.length > 0 &&
                bindings.every(
                  x =>
                    x.isJSXIdentifier() && !x.parentPath.isJSXMemberExpression()
                )
              ) {
                components[exportName] = s.imported ? true : false;
              } else {
                others[exportName] = true;
              }
            }
          });
  
          if (
            Object.keys(others).length === 0 &&
            Object.keys(components).length > 0
          ) {
            const options = {
              exports: Object.keys(components).filter(n => components[n]),
              hasDefault: !!Object.keys(components).find(n => !components[n])
            };
            path.node.source.value = `progressive-hydration?${JSON.stringify(
              options
            )}!${path.node.source.value}`;
          }
        }
      }
    };
  };
  