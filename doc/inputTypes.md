# Add a new input field in Scenario Parameters

- Open [src/components/ScenarioParameters/component/tabs/BasicTypes.js](../src/components/ScenarioParameters/components/tabs/BasicTypes.js)
- Look for the `<div>` tag directly below the `return` statement
- Add a new input respecting the following templates

## Supported input types

### Text Input
```
<BasicTextInput
  label='My Text Field'
  changeTextField={changeTextField}
  textFieldProps={textFieldProps}
/>
```

### Number Input
```
<BasicNumberInput
  label='My Number Field'
  changeNumberField={changeNumberField}
  textFieldProps={numberFieldsProps}
  inputProps={inputProps}
/>
```

### Enum Input
```
<BasicEnumTypes
  label='My Enum Field'
  changeEnumField={changeEnumField}
  textFieldProps={enumFieldProps}
  enumValues={enumValues}
/>
```

### Toggle Input
```
<BasicToggleInput
  label='My Switch type'
  changeSwitchType={changeSwitchType}
  switchProps={switchFieldProps}
/>
```

### Date Input
```
<BasicDateInput
  label='My Date Input'
  changeSelectedDate={changeSelectedDate}
  dateProps={dateProps}
/>
```

## Component properties
- The `textFieldProps` attribute expects a set of values as described below:
```
const xxxFieldsProps = {         // numberFieldsProps, textFieldProps...
    disabled: !editMode,         // Used to enable/disable, according to edit mode
    id: 'standard-required',     // As is
    defaultValue: xxx            // replace xxx with right value, according to input type
  };
```
This snippet has to be added above the return statement

- The `changeNumberField` attribute expects a function given in its props:
```
const BasicTypes = ({
  classes,
  ...
  changeMyInputField
  ...
)} => {
```

- This function has to be declared in the propsTypes, as a required function:
```
BasicTypes.propTypes = {
  classes: PropTypes.any,
  ...
  changeMyInputField: PropTypes.func.isRequired,
  ...
  editMode: PropTypes.bool.isRequired
};
```

- Open azure-sample-webapp/src/components/ScenarioParameters/ScenarioParameters.js
- Declare a state according to your input among others
```
const [myInputValue, setMyInputValue] = useState(
  getValueFromParameters('my_input_name', <default_value>));
```

- Reset accordingly your value so that discard button is effective
```
const resetParameters = () => {
  ...
  setMyInputValue(getValueFromParameters('my_input_name', <default_value>));
  ...
};
```

- Declare setter and getter in BasicTypes component
```
const scenarioParametersTabs = [
  ...
  <BasicTypes ...
    ...
    myInputField={myInputValue}
    changeMyInputField={setMyInputValue}
    ...
  />
  ..
];
```

- Declare the value to send to backend when clicking on update and launch button
```
if ([<list of run template ids that need to display the scenario parameters tab>].indexOf(runTemplateId) !== -1) {
  parametersData = parametersData.concat([
    ...
    {
      parameterId: 'my_input_name',
      varType: '<var type>',
      value: myInputValue,
      isInherited: myInputValue !== getValueFromParameters('my_input_name')
    },
    ...
  ]);
}
```


# Remove an existing tab in Scenario Parameters

Simply remove all the above lines, and don't forget to clean unused code if any.
