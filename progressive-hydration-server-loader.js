const { getOptions, parseQuery, stringifyRequest } = require("loader-utils");
const validateOptions = require("schema-utils");

const { resolve } = require("path");

const schema = {
  type: "object",
  properties: {}
};

module.exports = function(source, map) {
  const options = getOptions(this) || {};
  validateOptions(schema, options, "Progressive Hydration Loader");

  const actualModule = JSON.stringify(this.resourcePath); // stringifyRequest(this, this.resourcePath);
  const progressiveComponentModule = stringifyRequest(
    this,
    resolve(__dirname, "./progressive-component")
  );

  const sections = [
    `
      import createProgressiveComponent from ${progressiveComponentModule};
      import * as promise from ${actualModule};
    `,
    ...(options.exports || []).map(
      name => `
      export const ${name} = createProgressiveComponent(() => promise, x => x.${name});
    `
    ),
    options.hasDefault
      ? `
        import def from ${actualModule};
        export default createProgressiveComponent(() => def, x => x);`
      : null
  ];

  return sections.filter(Boolean).join("\n\n");
};
