# Solution and workspace data validation

When application is rendered, solution and workspace objects are validated against a schema created with [Zod](https://zod.dev/) library. If
it contains some unknown keys, a warning will be displayed in browser console. For example, a typo in configuration keys - _subtype_ instead of _subType_:

```yaml
parameters:
  - id: 'parameter1'
    options:
      subtype: 'TABLE'
```

will trigger this type of warning: _Parameter with id 'parameter1' contains unknown keys: 'subtype', please check your solution_.

If your solution or workspace configuration contains some customized options, you can add its keys in arrays for custom options to avoid triggering warnings every time your web app is opened.

- options in `parameters` section of the solution must be enumerated in `CUSTOM_SCENARIO_PARAMETERS_OPTIONS` array in [src/utils/schemas/custom/customSolutionOptions.js](../src/utils/schemas/custom/customSolutionOptions.js)
- options in `parameterGroups` section of the solution must be enumerated in `CUSTOM_PARAMETER_GROUPS_OPTIONS` array in [src/utils/schemas/custom/customSolutionOptions.js](../src/utils/schemas/custom/customSolutionOptions.js)
- options in `webApp` section of the workspace configuration must be enumerated in `CUSTOM_WEB_APP_OPTIONS` array in [src/utils/schemas/custom/customWorkspaceOptions.js](../src/utils/schemas/custom/customWorkspaceOptions.js)

Example:

_Solution.yaml_

```yaml
parameters:
  - id: 'parameter2'
    options:
      customOption: 'option1'
      anotherCustomOption: 'option2'
parameterGroups:
  - id: 'parameterGroup1'
    options:
      customOption: 'option1'
```

_customSolutionOptions.js_

```javascript
export const CUSTOM_SCENARIO_PARAMETERS_OPTIONS = ['customOption', 'anotherCustomOption'];
export const CUSTOM_PARAMETER_GROUPS_OPTIONS = ['customOption'];
```
