# Add a new tab in Scenario Parameters

- Open <path_to_your_app>/src/components/ScenarioParameters/ScenarioParameters.js
- Add your component in the array `scenarioParametersTabs` (look for the following variable: `const scenarioParametersTabs = [`)

```
const scenarioParametersTabs = [
  ...
  <MyComponent
    key="42" // The index is important, must be unique, and incremental
    ...
  />
  ...
];
```

- Open <path_to_your_app>/src/config/ScenarioParameters.js
- Add the config associated to your new tab

```
{
  id: 42,                                               // Same as your key
  translationKey:
    'commoncomponents.tab.scenario.parameters.mytab',   // See Note 2 below
  label: 'My tab',                                      // The tab's title
  value: 'my_component',
  runTemplateIds: ['2', '3']                            // The template IDs that have to display your component
}
```
**Note #1:** if you inserted your component in an existing ones, don't forget to update the keys of the other components in `scenarioParametersTabs`, as well as the ids in the src/config/ScenarioParameters.js file, accordingly.

**Note #2:** *both* `key` from `<MyComponent>` *and* `id` in src/config/ScenarioParameters.js must have the same value (here 42).

**Note #3:** If you want to add a translation, complete every translation file as the following example:
```
"commoncomponents": {
  "tab": {
    "scenario": {
      "parameters": {
        "mytab": "My tab "
      }
    }
  }
}
```

**Note #4:** in the translation files, you may have to merge your "newtab" with other tab name translations, in case there are other tabs.


# Remove a tab from Scenario Parameters
- Open <path_to_your_app>/src/components/ScenarioParameters/ScenarioParameters.js
- Remove your component
- Open <path_to_your_app>/src/config/ScenarioParameters.js
- Remove the config of your tab
- Clean imports in ScenarioParameters, and the code no longer needed
- Remove the keys from the translation files no longer used
