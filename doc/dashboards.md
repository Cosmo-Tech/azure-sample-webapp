# Configure Dashboards view

In the web application, the *Scenario* and *Dashboards* pages allow you to embed [PowerBI](https://powerbi.microsoft.com/fr-fr/getting-started-with-power-bi/) reports.

The Scenario view will allow a single report, that is supposed to display the results of the currently selected
scenario, after it has run. The Dashboards view offers a menu to let users switch between several reports, that can
typically be used for in-depth results analysis or to compare the results of several scenarios.

## Dashboards configuration
You can configure the dashboards to be used in your webapp by exporting the constants ***SCENARIO_DASHBOARD_CONFIG***
(for the Scenario view) and ***DASHBOARDS_LIST_CONFIG*** (for the Dashboards view) in the file
[src/config/Dashboards.js](../src/config/Dashboards.js). Both of these constants must be lists, but the
*SCENARIO_DASHBOARD_CONFIG* is expected to have only one element.

Configuration objects inside these lists are similar for the Scenario view and for the Dashboards view:
```
  {
    title: {                              // report title in the Dashboards view (data not used for Scenario view)
      en: <english title>,
      fr: <french title>
    },
    reportId: <report unique id>,         // report Id can be found in PowerBI, in the URL of your report
    settings: '<settings object>',        // a settings object (see https://github.com/microsoft/powerbi-models/blob/0d326572c4253fd9f89b73a0d8df1ae46318a860/src/models.ts#L1070)
    staticFilters?: <filters array>,      // an array of PowerBIReportEmbedSimpleFilter and/or PowerBIReportEmbedMultipleFilter from @cosmotech/core dependency         
    dynamicFilters?: <filters array>,     // an array of PowerBIReportEmbedSimpleFilter and/or PowerBIReportEmbedMultipleFilter from @cosmotech/core dependency                    
    pageName: {
      en: <english report section id>     // the report section that you want to display when current language is English
      fr: <french report section id>      // the report section that you want to display when current language is French
    }
  }
```

## How to get the information for embedding with PowerBI
Everything is available in PowerBI service URL:
* you get the embedded report URL `MyReportURL`
* in PowerBI online, look at the end of your report's URL to get the section name. It should look like `/ReportSection`
* the values you need to use for `reportId` key and `pageName` key are then:\
  `MyReportURL?reportId=<reportId>&pageName=<pageName>`

## Report page size recommendation for Scenario View iframe
* Select option: View > fit to page
* Select Format > Page size > Custom
  * Width: 1580 px
  * Height: 350 px

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
      en: 'Report sample 1'
      fr: 'Exemple de rapport 1',
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
