# Add a new tab in Scenario Parameters

- Open azure-sample-webapp/src/components/ScenarioParameters/ScenarioParameters.js
- Look for the `<TabContext>` tag
- Add a new `<Tab>` in the `<TabList>`

```
<TabContext value={value}>
  <TabList
    ...
    </Tab>
    <Tab label={t('commoncomponents.tab.scenario.parameters.newtab', 'New tab')}
      value="new_tab"
      className={classes.tab}
    />
  </TabList>
```

- Add a new `<TabPanel>`

```
    ...
  </TabList>
  <TabPanel>
    ...
  </TabPanel>
  <TabPanel value="new_tab" index={0} className={classes.tabPanel}>
    Fill this with components
  </TabPanel>
</TabContext>
```

Note: both `value=new_tab` attributes must be identical.

If you want to add a translation, complete every translation file as the following example:

"commoncomponents": {
  "tab": {
    "scenario": {
      "parameters": {
        "newtab": "New tab"
      }
    }
  }
}

Note: in the translation files, you may have to merge your "newtab" with other tab name translations, in case there are other tabs.

# Remove

Simply remove the undesired `<Tab>` and `<TabPanel>` tags within  the `<TabContext>` one.

Note: don't forget to clean the several translation files if any, as well as the unnecessary imports due to removing the tab if any.