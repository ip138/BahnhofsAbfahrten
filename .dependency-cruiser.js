module.exports = {
  forbidden: [
    {
      name: 'not-from-common',
      severity: 'warn',
      from: {
        path: 'src/client/Common',
      },
      to: {
        path: 'src/client/(Abfahrten|Routing)',
      },
    },
    {
      name: 'Routing-to-Abfahrten',
      severity: 'warn',
      from: {
        path: 'src/client/Routing',
      },
      to: {
        path: 'src/client/Abfahrten',
      },
    },
    {
      name: 'Abfahrten-to-Routing',
      severity: 'warn',
      from: {
        path: 'src/client/Abfahrten',
      },
      to: {
        path: 'src/client/Routing',
      },
    },
    /* rules from the 'recommended' preset: */
    {
      name: 'no-circular',
      severity: 'warn',
      comment: "Warn in case there's circular dependencies",
      from: {},
      to: {
        circular: true,
      },
    },
    {
      name: 'no-orphans',
      severity: 'info',
      comment: "Inform in case there's orphans hiding in the code base",
      from: {
        orphan: true,
        path: 'src/(client|server)',
        pathNot: '\\.d\\.ts$',
      },
      to: {},
    },
    {
      name: 'no-deprecated-core',
      comment: 'Warn about dependencies on deprecated core modules.',
      severity: 'warn',
      from: {},
      to: {
        dependencyTypes: ['core'],
        path: '^(punycode|domain|constants|sys|_linklist)$',
      },
    },
    {
      name: 'no-deprecated-npm',
      comment: 'These npm modules are deprecated - find an alternative.',
      severity: 'warn',
      from: {},
      to: {
        dependencyTypes: ['deprecated'],
      },
    },
    {
      name: 'no-non-package-json',
      severity: 'error',
      comment: "Don't allow dependencies to packages not in package.json",
      from: {},
      to: {
        dependencyTypes: ['npm-no-pkg', 'npm-unknown'],
      },
    },
    {
      name: 'not-to-unresolvable',
      comment:
        "Don't allow dependencies on modules dependency-cruiser can't resolve to files on disk (which probably means they don't exist)",
      severity: 'error',
      from: {},
      to: {
        couldNotResolve: true,
      },
    },
    {
      name: 'no-duplicate-dep-types',
      comment:
        "Warn if a dependency you're actually using occurs in your package.json more than once (technically: has more than one dependency type)",
      severity: 'warn',
      from: {},
      to: {
        moreThanOneDependencyType: true,
      },
    },

    /* rules you might want to tweak for your specific situation: */
    {
      name: 'not-to-test',
      comment: "Don't allow dependencies from outside the test folder to test",
      severity: 'error',
      from: {
        pathNot: '^(test|spec)',
      },
      to: {
        path: '^(test|spec)',
      },
    },
    {
      name: 'not-to-spec',
      comment:
        "Don't allow dependencies to (typescript/ javascript/ coffeescript) spec files",
      severity: 'error',
      from: {},
      to: {
        path: '\\.spec\\.(js|ts|ls|coffee|litcoffee|coffee\\.md)$',
      },
    },
    {
      name: 'not-to-dev-dep',
      severity: 'error',
      comment:
        "Don't allow dependencies from src/app/lib to a development only package",
      from: {
        path: '^(src|app|lib)',
        pathNot:
          '(\\.spec\\.(js|ts|ls|coffee|litcoffee|coffee\\.md)$|src/server/middleware/webpackDev.ts)',
      },
      to: {
        dependencyTypes: ['npm-dev'],
        pathNot: '^node_modules/idx/lib/idx.js$',
      },
    },
    {
      name: 'optional-deps-used',
      severity: 'info',
      comment:
        "Inform when using an optional dependency. It might not be wrong - but it's not typicaly either",
      from: {},
      to: {
        dependencyTypes: ['npm-optional'],
      },
    },
    {
      name: 'peer-deps-used',
      comment:
        "Warn when using a peer dependency - which might not be wrong - but it's not typicaly either",
      severity: 'warn',
      from: {},
      to: {
        dependencyTypes: ['npm-peer'],
      },
    },
  ],
  options: {
    /* conditions specifying which files not to follow further when encountered:
           - path: a regular expression to match
           - dependencyTypes: see https://github.com/sverweij/dependency-cruiser/blob/develop/doc/rules-reference.md#dependencytypes
             for a complete list
        */
    doNotFollow: {
      // path: 'node_modules',
      dependencyTypes: [
        'npm',
        'npm-dev',
        'npm-optional',
        'npm-peer',
        'npm-bundled',
        'npm-no-pkg',
      ],
    },

    /* pattern specifying which files to exclude (regular expression) */
    // , exclude : ''

    /* pattern specifying which files to include (regular expression)
           dependency-cruiser will skip everything not matching this pattern
        */
    // , includeOnly : ''

    /* list of module systems to cruise */
    // , moduleSystems: ['amd', 'cjs', 'es6', 'tsd']

    /* prefix for links in html and svg output (e.g. https://github.com/you/yourrepo/blob/develop/) */
    // , prefix: ''

    /* if true detect dependencies that only exist before typescript-to-javascript compilation */
    // , tsPreCompilationDeps: false

    /* if true combines the package.jsons found from the module up to the base
           folder the cruise is initiated from. Useful for how (some) mono-repos
           manage dependencies & dependency definitions.
         */
    // , combinedDependencies: false

    /* if true leave symlinks untouched, otherwise use the realpath */
    // , preserveSymlinks: false

    /* Typescript project file ('tsconfig.json') to use for
           (1) compilation and
           (2) resolution (e.g. with the paths property)

           The (optional) fileName attribute specifies which file to take (relative to
           dependency-cruiser's current working directory). When not provided
           defaults to './tsconfig.json'.
         */
    tsConfig: {
      fileName: './tsconfig.json',
    },

    /* Webpack configuration to use to get resolve options from.

          The (optional) fileName attribute specifies which file to take (relative to dependency-cruiser's
          current working directory. When not provided defaults to './webpack.conf.js'.

          The (optional) `env` and `args` attributes contain the parameters to be passed if
          your webpack config is a function and takes them (see webpack documentation
          for details)
         */
    webpackConfig: {
      fileName: './webpack.config.js',
      //, env: {}
      //, args: {}
    },

    /* How to resolve external modules - use "yarn-pnp" if you're using yarn's Plug'n'Play.
           otherwise leave it out (or set to the default, which is 'node_modules')
        */
    // , externalModuleResolutionStrategy: 'node_modules'
  },
};
// generated: dependency-cruiser@4.16.1 on 2019-04-28T18:30:44.331Z