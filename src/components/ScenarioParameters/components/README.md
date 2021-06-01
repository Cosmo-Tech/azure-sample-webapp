# Add a new input field in Scenario Parameters

- Open *app_folder*/src/components/ScenarioParameters/component/BasicTypes.js
- Look for the `<div>` tag directly below the `return` statement
- Add a new input respecting the following templates

## Text Input
```
<BasicTextInput
  classes={classes}
  label='My Text Field'
  changeTextField={changeTextField}
  textFieldProps={textFieldProps}
/>
```

## Number Input
```
<BasicNumberInput
  classes={classes}
  label='My Number Field'
  changeNumberField={changeNumberField}
  textFieldProps={numberFieldsProps}
  inputProps={inputProps}
/>
```

## Enum Input
```
<BasicEnumTypes
  classes={classes}
  label='My Enum Field'
  changeEnumField={changeEnumField}
  textFieldProps={enumFieldProps}
  enumValues={enumValues}
/>
```

## Toggle Input
```
<BasicToggleInput
  classes={classes}
  label='My Switch type'
  changeSwitchType={changeSwitchType}
  switchProps={switchFieldProps}
/>
```

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

- The real function is defined and called in the file azure-sample-webapp/src/components/ScenarioParameters/ScenarioParameters.js
```
<TabPanel value="basic_types" index={0} className={classes.tabPanel}>
  <BasicTypes
    ...
    changeMyInputField={setMyInputValue}
    editMode={editMode}
  />
</TabPanel>
```

- And finally, the `setMyInput` function is just a setter declared with a getter, before the return statement, as follow:
```
// use the right init value, according to the input type
const [myInputValue, setMyInputValue] = useState("Default value"); 
```

# Remove an existing tab in Scenario Parameters

Simply remove all the above lines, and don't forget to clean unused code if any.
