# Writing Cypress tests with stubbing

## Overview

All stubbed tests rely on a central `Stubbing` class (singleton `stub`) in
`cypress/commons/services/stubbing.js`. When stubbing is active, the webapp
never hits the real API; every HTTP call is intercepted and answered from the
in-memory state the test controls.

---

## File layout

```
cypress/
  e2e/brewery/          ← test files (*.cy.js)
  commons/
    actions/            ← UI helper functions (click, type, assert)
      generic/          ← framework-agnostic helpers
        ScenarioParameters.js   launch(), save(), expand accordion …
        Scenarios.js            createScenario(), selectRunTemplate …
        ScenarioSelector.js     selectScenario()
        DatasetManager.js       switchToDatasetManagerView(), selectDatasetById(),
                                ignoreDatasetTwingraphQueries(), getDownloadETLLogsButton() …
      brewery/
        BreweryParameters.js    domain-specific parameter inputs
      index.js          ← barrel re-export of all actions
    constants/
      generic/TestConstants.js  API_ENDPOINT, API_REGEX, ROLES, PERMISSIONS …
    services/
      stubbing.js        Stubbing class + `stub` singleton
    utils/
      apiUtils.js        cy.intercept wrappers (interceptUpdateSimulationRunner …)
      index.js           barrel re-export
  fixtures/stubbing/
    default/            ← shared default fixtures (DO NOT MODIFY)
      index.js          ← exports everything below
      runners.js        DEFAULT_SIMULATION_RUNNER, DEFAULT_ETL_RUNNER, DEFAULT_RUNNERS …
      solutions.js      DEFAULT_SOLUTION, DEFAULT_SOLUTIONS
      runTemplates.js   RUN_TEMPLATE_EXAMPLE, BREWERY_PARAMETERS_RUN_TEMPLATE …
      runTemplateParameters.js   PARAMETERS dict
      runTemplateParameterGroups.js  PARAMETER_GROUPS dict
      datasets.js
      workspaces.js     DEFAULT_WORKSPACE, WORKSPACE_WITH_… variants
      organizations.js  DEFAULT_ORGANIZATION, DEFAULT_ORGANIZATION_PERMISSIONS
      users.js          USER_EXAMPLE
    DatasetManager/     ← Dataset Manager fixtures
      index.js
      datasets.js       DATASETS (includes FILE datasets, ETL_DATASET, SUBDATASET …)
      runners.js        RUNNERS_FOR_ETL_DATASETS
      workspaces.js     WORKSPACE, WORKSPACE_WITHOUT_CONFIG
      organizations.js  ORGANIZATION_WITH_DEFAULT_ROLE_USER
    <TestName>/         ← per-test fixture folder (optional)
      index.js
      scenarios.js
      solutions.js
```

---

## Minimal test skeleton

```js
// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { Login, ScenarioParameters, ScenarioSelector, Scenarios } from '../../commons/actions';
import { stub } from '../../commons/services/stubbing';
import { apiUtils } from '../../commons/utils';
import { DEFAULT_SIMULATION_RUNNER, DEFAULT_SOLUTION } from '../../fixtures/stubbing/default';

describe('My feature', () => {
  before(() => stub.start());          // enables ALL stub types

  beforeEach(() => {
    Login.login();                     // authenticates (stubbed), lands on default workspace
    // OR, to open a specific workspace:
    Login.login({ url: '/W-myWorkspaceId', workspaceId: 'W-myWorkspaceId' });

    stub.setRunners([...]);            // override runner list for this test
    stub.setSolutions([...]);          // override solution (optional)
  });

  afterEach(() => stub.reset());       // resets in-memory resources, keeps stubs enabled
  after(() => stub.stop());            // disables all stubs

  it('does something', () => { ... });
});
```

`stub.start()` with no argument enables **all** stub types. You can also pass a
subset, e.g. `stub.start({ GET_SCENARIOS: true, LAUNCH_SCENARIO: true })`.

---

## Stub API — most useful methods

### Resource setters (call in beforeEach or before each it)

| Method | Description |
|--------|-------------|
| `stub.setRunners(runners)` | Replace the full runner list |
| `stub.setSolutions(solutions)` | Replace the solution list |
| `stub.setWorkspaces(workspaces)` | Replace the workspace list |
| `stub.setDatasets(datasets)` | Replace the dataset list |
| `stub.setOrganizations(orgs)` | Replace the organization list |
| `stub.patchRunner(id, patch)` | Merge patch into one runner |
| `stub.setRunnerRunOptions(opts)` | Configure fake run duration / final status / poll count |
| `stub.setRunnerRuns(runs)` | Replace the full runner-run list (used by run-state polling stubs) |
| `stub.patchRunnerRun(runId, patch)` | Merge patch into one runner run |
| `stub.getRunnerRunById(runId)` | Look up a runner run by id |

`stub.reset()` restores defaults for all resources without disabling stubs —
call it in `afterEach`, not `afterAll`.

### Run options

```js
stub.setRunnerRunOptions({
  runDuration: 1000, // ms the run stays "Running" before finishing
  finalStatus: 'Successful', // 'Successful' | 'Failed' | 'Unknown'
  expectedPollsCount: 2, // number of GET .../status calls to intercept
  startTime: new Date(), // null to force no startTime in the response
});
```

---

## apiUtils — intercept helpers

All helpers return an **alias string** that you pass to `apiUtils.waitAliases`.
Register intercepts **before** the UI action that triggers the request.

```js
import { apiUtils } from '../../commons/utils';

// Intercept a runner PATCH (save)
const saveAlias = apiUtils.interceptUpdateSimulationRunner({
  scenarioId, // optional — restricts to this runner id
  validateRequest: (req) => {
    // optional — runs assertions on request body
    expect(req.body.parametersValues).to.have.length(1);
  },
  customScenarioPatch: { lastUpdate: new Date().toISOString() }, // optional extra patch
});

// Wait for it
apiUtils.waitAliases([saveAlias], { timeout: 10_000 });
```

Other helpers: `interceptStartRunner`, `interceptGetRunnerRunState`,
`interceptCreateSimulationRunner`, `interceptDeleteRunner`,
`interceptCreateDataset`, `interceptUpdateDataset`, `interceptStopRunner`,
`interceptGetETLRunLogs`.

---

## actions/generic/ScenarioParameters — key helpers

### `launch(options)`

Clicks the Launch button and waits for all intercepted requests.

```js
ScenarioParameters.launch({
  scenarioId, // runner id — used when saveAndLaunch is true
  runOptions: {
    runDuration: 1000,
    finalStatus: 'Successful',
    expectedPollsCount: 2,
  },
  saveAndLaunch: true, // set true when a PATCH is expected before the POST /start
  // (user dirty form OR forceUpdate logic in the webapp)
  getLaunchButtonTimeout: 180, // seconds to wait for launch button to be enabled
});
```

`saveAndLaunch: false` (the default) means `launch()` does **not** register a
PATCH intercept. If the webapp does try to save anyway, the call goes through
untracked — which is the intended use for "no save expected" test cases.

### `save(options)`

Clicks the Save button and waits for the PATCH.

```js
ScenarioParameters.save({
  updateOptions: { validateRequest, customScenarioPatch },
});
```

### Other helpers

```js
ScenarioParameters.expandParametersAccordion();
ScenarioParameters.discard(); // discard + confirm
ScenarioParameters.waitForScenarioRunEnd(300); // seconds timeout
ScenarioParameters.getLaunchButton(); // returns cy element (not clicked)
```

---

## Customising the solution / run templates

When a test needs parameters or run templates that don't exist in the default
solution, **patch inline in the test file** — do not modify
`cypress/fixtures/stubbing/default/`.

```js
import {
  DEFAULT_SOLUTION,
  RUN_TEMPLATE_EXAMPLE,
} from '../../fixtures/stubbing/default';

// 1. Define parameters (plain objects — no DEFAULT_RUN_TEMPLATE_PARAMETER, it is
//    NOT exported from the default index)
const MY_PARAM = { id: 'my_param', labels: { en: 'My param' }, varType: 'int', defaultValue: '0' };

// 2. Define a parameter group
const MY_GROUP = { id: 'my_group', labels: { en: 'My group' }, parameters: [MY_PARAM.id] };

// 3. Define a run template (spread RUN_TEMPLATE_EXAMPLE for boilerplate fields)
const MY_RUN_TEMPLATE = {
  ...RUN_TEMPLATE_EXAMPLE,
  id: 'my_run_template',
  name: 'My run template',
  description: 'My run template',
  tags: ['my_run_template'],
  parameterGroups: [MY_GROUP.id],
};

// 4. Extend the default solution (spread + append, don't replace)
const MY_SOLUTION = {
  ...DEFAULT_SOLUTION,
  parameters:     [...DEFAULT_SOLUTION.parameters,     MY_PARAM],
  parameterGroups:[...DEFAULT_SOLUTION.parameterGroups,MY_GROUP],
  runTemplates:   [...DEFAULT_SOLUTION.runTemplates,   MY_RUN_TEMPLATE],
};

// 5. Inject in beforeEach
beforeEach(() => {
  Login.login();
  stub.setSolutions([MY_SOLUTION]);
  stub.setRunners([...]);
});
```

If the test needs an entirely separate fixture folder (e.g. for large or
reused fixture data), create `cypress/fixtures/stubbing/<TestName>/` with
`index.js`, `scenarios.js`, `solutions.js` (see `DatesAndTimezones/` as a
reference).

---

## Customising runners

Use `DEFAULT_SIMULATION_RUNNER` for scenario runners and `DEFAULT_ETL_RUNNER`
for ETL (dataset import) runners. Both are exported from `default/`.

```js
import { DEFAULT_SIMULATION_RUNNER, DEFAULT_ETL_RUNNER } from '../../fixtures/stubbing/default';

const MY_RUNNER = {
  ...DEFAULT_SIMULATION_RUNNER,
  id: 'r-myTestRunner', // must start with 'r-'
  name: 'Cypress - My runner',
  runTemplateId: MY_RUN_TEMPLATE.id,
  runTemplateName: MY_RUN_TEMPLATE.name,
  parametersValues: [{ parameterId: 'my_param', varType: 'int', value: '42', isInherited: false }],
  parentId: null, // set to parent runner id for child scenarios
  rootId: null,
};

// For an ETL runner (dataset import), spread DEFAULT_ETL_RUNNER instead:
const MY_ETL_RUNNER = {
  ...DEFAULT_ETL_RUNNER,
  id: 'r-myEtlRunner',
  name: 'Cypress - My ETL runner',
  runTemplateId: 'my_etl_run_template',
  lastRunInfo: { lastRunId: 'run-myLastRun', lastRunStatus: 'Successful' },
  security: { default: 'admin', accessControlList: [] },
};
```

`parametersValues` drives the **forceUpdate** logic in the webapp
(`src/hooks/ScenarioParametersHooks.js`):

- `forceUpdate = true` when `parametersValues` is empty/null **or** when at least
  one parameter id of the current run template is absent from `parametersValues`.
- `forceUpdate = true` also triggers when the run template uses hidden metadata
  parameters (ScenarioName, ScenarioId, …) or enum parameters without a
  defaultValue.
- When `forceUpdate = true`, the webapp automatically sends a PATCH (save) before
  the POST (start) when the user clicks Launch.

---

## Checking whether a PATCH was or was not called

**Expect a PATCH (save) to be called:**

```js
const saveAlias = apiUtils.interceptUpdateSimulationRunner({ scenarioId, validateRequest });
ScenarioParameters.launch({ scenarioId, runOptions, saveAndLaunch: true });
apiUtils.waitAliases([saveAlias], { timeout: 10_000 });
```

**Expect NO PATCH (save):**

```js
let saveWasCalled = false;
cy.intercept({ method: 'PATCH', url: /\/runners\/(r|R)-\w+$/ }, (req) => {
  saveWasCalled = true;
  req.continue();
});
ScenarioParameters.launch({ scenarioId, runOptions, saveAndLaunch: false });
ScenarioParameters.waitForScenarioRunEnd();
cy.then(() => expect(saveWasCalled).to.be.false);
```

---

## Validating the request body of a PATCH

```js
const validateRequest = (req) => {
  const savedParamIds = req.body.parametersValues.map((pv) => pv.parameterId);
  expect(savedParamIds).to.include('my_expected_param');
  expect(savedParamIds).not.to.include('unexpected_param');
  expect(req.body.parametersValues.find((pv) => pv.parameterId === 'my_param').value).to.equal('42');
};
apiUtils.interceptUpdateSimulationRunner({ scenarioId, validateRequest });
```

---

## Existing reference tests

| Test file | What it demonstrates |
|-----------|----------------------|
| `ScenarioViewDashboard.cy.js` | Clean `before/beforeEach/afterEach/after` stub lifecycle; `saveAndLaunch: true`; `stub.setWorkspaces` |
| `ScenarioMetadataParameters.cy.js` | `apiUtils.interceptUpdateSimulationRunner` used directly with `validateRequest`; `stub.setSolutions` |
| `DatesAndTimezones.cy.js` | Separate fixture folder; custom solution + custom runners; `stub.setSolutions` + `stub.setRunners` in `beforeEach` |
| `ScenarioParameters-additional-advanced.cy.js` | Inline runner overrides with `rfdc` clone; `saveAndLaunch: true` with runOptions |
| `DiscardAndContinue.cy.js` | `stub.setRunners` in `before`, reset between tests with `beforeEach` re-set |
| `ResultsDashboards-DisplayDisabled.cy.js` | `saveAndLaunch: false` (run template with no parameters → no PATCH expected) |
| `ScenarioParameters_ForcedUpdateOnLaunch.cy.js` | Full inline resource patching; forced-save intercept; no-save spy pattern |
| `DatasetManager.cy.js` | Dataset Manager view; `stub.setDatasets`; `stub.setRunners` with ETL runners; `DatasetManager` actions |
| `DatasetManager_ETLLogsDownload.cy.js` | Download logs button enabled/disabled state; `interceptGetETLRunLogs` |

---

## Common pitfalls

- **`DEFAULT_RUN_TEMPLATE_PARAMETER` is NOT exported from `default/index.js`.**
  Define parameters as plain objects inline.
- Always register `cy.intercept` calls **before** the UI action that triggers
  the request, not after.
- `stub.reset()` restores resources to defaults but does not disable stubs. Call
  it in `afterEach`. To fully disable stubs call `stub.stop()` in `after`.
- When `saveAndLaunch: true` is passed to `launch()`, the helper registers one
  extra PATCH intercept automatically. Do not also call
  `apiUtils.interceptUpdateSimulationRunner` separately for the same action or
  you will register two competing intercepts.
- Runner ids must match the regex `(r|R)-[\w]+` (used in `API_REGEX.RUNNER`).
- `stub.setRunners` and `stub.setSolutions` called in `beforeEach` overwrite the
  values set in `before`, so the order matters. Prefer `beforeEach` for
  per-test customisation and `before` for test-suite-wide setup.
