# Scenario parameters customization

This document describes advanced methods to customize the scenario parameters view (custom parameters input, custom
tabs). It will require basic skills in React, and some knowledge of the webapp structure.

If you want to only apply minimal changes on the layout that is automatically generated, please refer to the
[scenario parameters configuration](./scenarioParametersConfiguration.md) section.

## Structure & concepts

### ScenarioParameters state structure

One of the challenges to automatically generate the scenario parameters tabs and to fill them with input components is
to handle the state for all these components. The data required to generate the user interface can be divided in three
parts: the **parameters metadata**, a **reference to the parameters values**, and some **rendering data** to represent
the parameters values in input components.

#### Metadata

The parameters metadata are obtained by merging data from the **solution description** (the webapp receives them on
initialization) and from the **configuration overrides** in the folder _src/config/overrides_. These data are not meant
to change during the
user session, they can thus be memorized in the React component to prevent unnecessary computations during each render.

The parameters metadata are stored in the variable `parametersMetadata` in the ScenarioParameters component, declared
thanks to the `useMemo` hook.

Some examples of parameters metadata are their `varType`, default value, min and max values, and translation labels.

#### Reset values

The `parametersValuesForReset` object represents a buffer for the data received by the Cosmo API, or that will be sent to the
Cosmo API. Although the API uses strings to exchange parameters values, the parameters values reference store these
values after having cast them to a more specific JS type when possible (e.g. a parameter with a `varType` "int" will be
stored as a JS number). These data are stored in the variable `parametersValuesForReset` in the ScenarioParameters
component by using the `useMemo` hook.

#### Rendering data

The rendering data represent the actual state of the parameters values, that is used in the React components responsible
for the scenario parameters edition. Every change in this state will trigger a re-render of the input components,
allowing users to edit the parameters values.

Since v5.0.0, these data are stored by react-hook-form, and can be accessed and modified _via_ the `useFormContext`
hook, that provides the functions `getValues` and `setValue`.

### Tabs and inputs components

In ScenarioParameters.js file all parameters data are rendered with a `ScenarioParametersTabsWrapper` component that
generates generic and custom tabs by calling the corresponding component. Tab components have the following props:

- `parametersGroupData`: the metadata of the parameters group
- `userAppRoles`: an array containing the user application roles (e.g. `Platform.Admin`); these roles are used to restrict access to some tabs when `[parametersGroup].options.authorizedRoles` is defined
- `context`: a context object to pass all additional information; this object contains:
  - editMode: a boolean defining whether the edition mode is enabled (to disable user input if required)
  - isDarkTheme: a boolean defining whether or not the dark theme is enabled (can be used to adapt components to the
    webapp current theme)

Each tab component will use the parameters group metadata to generate the actual **scenario parameters input**, by
rendering a `ScenarioParameterInput` component, which will redirect to the actual React component for the specified
parameter type. Scenario parameters input components have the following props:

- `parameterData`: the metadata of the parameter
- `context`: the context object
- `parameterValue`: the current value of the scenario parameter
- `setParameterValue`: a function to change the scenario parameter value

Generic tabs and inputs components are provided to support the file parameters and the basic types, but the next section
will describe how you can create your own components to customize the scenario parameters panel.

## Customization

### Define a custom `varType`

Although basic standard types (enum, string, int, number, bool, date) and file parameters are already supported, you
may want to define scenario parameters with your own custom types to change the default handling of a type. For each new
`varType` you want to define, there are four pieces of information to provide:

- a **default value** for this type of parameter (used when a user creates a new scenario)
- a **serialization function** to convert this type to string (used when sending the parameters values to the API)
- a **deserialization function** to convert this type from a string (used when receiving the parameters values from the API)
- a **React component** that will be used for user input for all parameters with this type

These data must be defined in predefined dicts, with your `varType` as key, in the following files:

- [src/utils/scenarioParameters/custom/DefaultValues.js](../src/utils/scenarioParameters/custom/DefaultValues.js)
- [src/utils/scenarioParameters/custom/ConversionFromString.js](../src/utils/scenarioParameters/custom/ConversionFromString.js)
- [src/utils/scenarioParameters/custom/ConversionToString.js](../src/utils/scenarioParameters/custom/ConversionToString.js)
- [src/utils/scenarioParameters/custom/VarTypesComponentsMapping.js](../src/utils/scenarioParameters/custom/VarTypesComponentsMapping.js)

You will then be able to declare parameters with your custom `varType` in the YAML solution description, and the webapp
will automatically generate the associated components.

### Extended `varType`

In some cases you may want to define a `subType` to have a distinction between several parameters with the same
`varType`. For instance, the specific `varType` `%DATASETID%` is used for all dataset parts, but you may need to display
different component in the webapp for some file parameters (e.g; a file upload vs. a table that users can edit).

To define an extended var type, you must set the `options.subType` property in your parameter configuration.

Example:

```yaml
parameters:
  - id: 'volume_unit'
    labels:
      en: 'Volume unit'
      fr: 'Unité de volume'
    varType: 'enum'
    defaultValue: 'LITRE'
    options:
      enumValues:
        - key: 'LITRE'
          value: 'L'
        - key: 'BARREL'
          value: 'bl'
        - key: 'CUBIC_METRE'
          value: 'm³'
      subType: 'RADIO'
```

This `subType` will be concatenated after the `varType` value. For instance, if the `varType` of a parameter is
`%DATASETID%` and its `subType` is `TABLE`, then the extended `varType` for this parameter will be `%DATASETID%-TABLE`.

You will then be able to use this extended `varType` in the four mapping files (see section "Define a custom
`varType`"). For any of those files, if the extended `varType` of a parameter is not found in the mapping dict, the
webapp will fall back on its `varType`. This means that if you want to keep the same behavior for an extended `varType`
as for the original `varType`, you can omit to declare the extended varType in the mapping dicts.

### Create custom input components

Creating your own input components can be useful if you want to replace the existing components for basic types, or if
you want to add your own custom `varType`.

1. first you will need to create a React component to define the input UI and behavior (example:
   [BasicNumberInput](https://github.com/Cosmo-Tech/webapp-component-ui/blob/main/src/inputs/BasicInputs/BasicNumberInput/BasicNumberInput.js))
2. then you must define an input component that will connect the parameter data to the props of your component (example: [GenericNumberInput](../src/components/ScenarioParameters/components/ScenarioParametersInputs/GenericNumberInput.js))
3. you can then import and use this component in the [custom varTypes components mapping file](../src/utils/scenarioParameters/custom/VarTypesComponentsMapping.js) of your application (you can override the default components by adding
   generic types in the custom mapping dict)

### Create custom scenario parameters tabs

If you want to customize the layout of generated tabs, you can create your own tab component.
You can add a specific behavior based on the id of the parameter group if you want a custom tab for only
one parameter group. The ScenarioParametersTabsWrapper component calls a custom tabs component if the parameters group id is declared in
`CUSTOM_PARAMETERS_GROUPS_COMPONENTS_MAPPING` in [src/utils/scenarioParameters/custom/ParametersGroupsComponentsMapping.js](../src/utils/scenarioParameters/custom/ParametersGroupsComponentsMapping.js). If your custom tab
needs other information than generic one, you can pass it through ScenarioParametersTabsWrapper component via `context` prop.
