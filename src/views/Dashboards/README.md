# Configure Dashboards view

The Dashboards view allows to embed multiple [PowerBI](https://powerbi.microsoft.com/fr-fr/getting-started-with-power-bi/) reports in the app.

## Dashboard entries structure
To add an entry in the Dashboards view menu:
- Open *webapp_folder*/src/Dashboards.js
- Add a new object in the existing DASHBOARDS_LIST_CONFIG array, respecting the following pattern:
```
  {
    title: '<title object>',              // Dashboard's title that appears in left tabs (e.g. {en: 'title in English', fr: 'Titre en français' } )
    reportId: <report unique id>,         // You can get the report Id in PowerBI
    settings: '<settings object>',        // a settings object see https://github.com/microsoft/powerbi-models/blob/0d326572c4253fd9f89b73a0d8df1ae46318a860/src/models.ts#L1070
    staticFilters?: <filters array>,      // an array of PowerBIReportEmbedSimpleFilter and/or PowerBIReportEmbedMultipleFilter from @cosmotech/core dependency         
    dynamicFilters?: <filters array>,     // an array of PowerBIReportEmbedSimpleFilter and/or PowerBIReportEmbedMultipleFilter from @cosmotech/core dependency                    
    pageName: {
      en:                                 // The report section that you want to display when current language is English
      fr:                                 // The report section that you want to display when current language is French
    }
  }
```
## How to get the information for embedding with PowerBI
* Everything is available in PowerBI service URL
* You get the embedded report URL `MyReportURL`
* In PowerBI online, look at the end of your report's URL to get the section name. It should look like `/ReportSection`
* The values you need to use for `reportId` key and `pageName` key are then: `MyReportURL?reportId=<reportId>&pageName=<pageName>`

## How to use filters on the current scenario (dynamic Filter)

### PowerBIReportEmbedSimpleFilter

You can filter a particular field on a value using the PowerBIReportEmbedSimpleFilter class.
For example, you want to filter the SimulationRun column of StockProbe table on the current scenario last simulation run id.
You can add the following filter in the dynamicFilters array:
```javascript
new PowerBIReportEmbedSimpleFilter('StockProbe', 'SimulationRun', POWER_BI_FIELD_ENUM.SCENARIO_CSM_SIMULATION_RUN)
```

Here is the list of all available scenario filters:
- SCENARIO_ID                       // The current scenario id
- SCENARIO_CSM_SIMULATION_RUN       // The current last run scenario id
- SCENARIO_STATE                    // The current scenario state
- SCENARIO_NAME                     // The current scenario name
- SCENARIO_MASTER_ID                // The current scenario master id (the id of the corresponding root scenario in the scenario tree)
- SCENARIO_PARENT_ID                // The current scenario parent id (the id of the direct parent scenario in the scenario tree)
- SCENARIO_OWNER_ID                 // The current scenario owner id
- SCENARIO_SOLUTION_ID              // The current scenario solution id


### PowerBIReportEmbedMultipleFilter

You can filter a particular field on values the PowerBIReportEmbedMultipleFilter class.
For example, you want to filter the id column of Simulation table on the current scenario id, parent id or master id.
You can add the following filter in the dynamicFilters array:
```javascript
new PowerBIReportEmbedMultipleFilter('Simulation', 'id', [POWER_BI_FIELD_ENUM.SCENARIO_ID,POWER_BI_FIELD_ENUM.SCENARIO_PARENT_ID,POWER_BI_FIELD_ENUM.SCENARIO_MASTER_ID])
```

### Custom filters
If you want to add a custom filter (neither PowerBIReportEmbedSimpleFilter nor PowerBIReportEmbedMultipleFilter) in staticFilters or dynamicFilters fields, you can but need to follow the [syntax compatible with embedded reports](https://github.com/microsoft/powerbi-models/blob/0d326572c4253fd9f89b73a0d8df1ae46318a860/src/models.ts#L338).
For example, you can add a [IRelativeDateTimeFilter](https://github.com/microsoft/powerbi-models/blob/0d326572c4253fd9f89b73a0d8df1ae46318a860/src/models.ts#L373) following this pattern:
``` javascript
{
    $schema: string,
    target: IFilterGeneralTarget,
    filterType: FilterType,
    displaySettings?: IFilterDisplaySettings,
    operator: RelativeDateOperators,
    timeUnitsCount?: number,
    timeUnitType: RelativeDateFilterTimeUnit,
}
```
See [PowerBI models](https://github.com/microsoft/powerbi-models) for further details


## How to use static filters

The static filters are based on the same mechanism that dynamic filters.
The only exception is that they are not relative to the current scenario.
It's recommended to use them when you have a constant value that you want to use for a specific column.
For example, let us create a dummy one that filter on Simulation with exact id to 5. If you want to do that, you can add the following filter in the staticFilters array:
```javascript
new PowerBIReportEmbedSimpleFilter('Simulation', 'id', 5)
```

## Complete example
```js
[
  {
    title: {
      fr: 'Exemple de rapport 1',
      en: 'Report sample 1'
    },
    reportId: '608b7bef-f5e3-4aae-b8db-19bbb38325d5',
    settings: {
      navContentPaneEnabled: false,  // hides the pages bottom pane
      panes: {
        filters: {
          expanded: true,             // expands the filter right pane
          visible: true               // shows the filter right pane
        }
      }
    },
    staticFilters: [
      new PowerBIReportEmbedMultipleFilter('Bar', 'id', ['MyBar', 'MyBar2'])
    ],
    dynamicFilters: [
      new PowerBIReportEmbedSimpleFilter('StockProbe', 'SimulationRun', POWER_BI_FIELD_ENUM.SCENARIO_CSM_SIMULATION_RUN)
    ],
    pageName: {
      en: 'ReportSection',
      fr: 'ReportSection'
    }
  }
]
```
