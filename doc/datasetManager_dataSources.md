# Data sources

## Introduction

The Dataset manager **natively supports two options to create datasets**:

- an option to create **empty datasets** (this can be useful when using externals scripts to add content to the datasets)
- a simple **file upload** creating a dataset part of type File

In addition to these native data sources, as a solution integrator, you can declare run templates to run your own
**custom ETL scripts** and create datasets from external sources (e.g. Azure Storage, ADT, uploaded files). These run
templates must be added in your simulator image, and their parameters can be configured in the solution description.

Similarly, you can also provide run templates to **generate _subdatasets_** by applying filters on the content
of an existing dataset.

For configuration purposes, all data sources are identified by a unique id. These ids can be used in the workspace
configuration to:

- [filter which data sources](#data-source-filters) will be shown to end-users in the webapp
- define custom labels, tooltips and default values for [native data sources](#native-data-sources)

## Dataset creation

### Native data sources

In order to let users create their own dataset, the webapp provides some datasources by default. They will be identified
with these keys:

- `FileUploadToDataset`: load data from a local file uploaded by a webapp user, creating a new dataset, with a dataset part of type File
- `None`: creates an empty dataset, that can later be filled by using the Cosmo Tech API

For native data sources with parameters, you can specify **custom tooltips and default values** for these data sources:
they will be displayed in the dataset creation wizard to help users fill the data source parameters. These tooltips and
values can be configured in the workspace property `additionalData.webapp.datasetManager.datasourceParameterHelpers`.

The value of `datasourceParameterHelpers` must be an **array of objects**, where each object represents a datasource.
Each datasource must have two keys: `id` (containing one of the data source identifiers listed above), and a
`parameters` property containing a list of objects. Each object represents a parameter: it must have an `id` property,
and can have the properties `defaultValue` (string) and `tooltipText` (dictionary of translation, with language codes as
keys, and labels as values).

<details>
<summary>JSON example</summary>

```json
{
  "additionalData": {
    "webapp": {
      "datasetManager": {
        "datasourceParameterHelpers": [
          {
            "id": "FileUploadToDataset",
            "parameters": [
              {
                "id": "file",
                "tooltipText": {
                  "en": "Upload a local file to create a File dataset part",
                  "fr": "Envoyer un fichier local pour créer un fragment de dataset de type File"
                }
              }
            ]
          }
        ]
      }
    }
  }
}
```

</details>

<details>
<summary>YAML example</summary>

```yaml
additionalData:
  webapp:
    datasetManager:
      datasourceParameterHelpers:
        - id: FileUploadToDataset
          parameters:
            - id: file
              tooltipText:
                en: Upload a local file to create a File dataset part
                fr: >-
                  Envoyer un fichier local pour créer un fragment de dataset de type
                  File
```

</details>

### Custom ETL scripts

#### Introduction

In addition to the native data sources, **you can develop your own ETL scripts** and make them available from the
dataset manager. These ETLs are actually defined as **run templates** (similar to those used to run scenarios), that
**must be identified with a specific tag**: `datasource`.

The same way simulation run templates can have parameters, **it is possible to define parameters for these ETLs**.
Currently, the only supported `varType`s for the ETL data sources are:

- `string`
- `enum`
- `list`
- `%DATASETID%`

For these types, the configuration of parameters is mostly identical to the configuration of scenario parameters
(see [Scenario Parameters configuration](scenarioParametersConfiguration.md)).

#### Visibility in the webapp

All run templates defined with the tag `datasource` will be selectable as source type for dataset creation (in the
Dataset Manager view), and will be hidden in the scenario creation dialog (in the Scenario view).

To learn how to filter the list of visibile data sources, please refer to the section
[Data source filters](#data-source-filters).

#### Webapp vs. ETL scripts - Technical details & guidelines

In order to help integrators write ETL scripts, this section provides more details about how the webapp creates
datasets, and how you can find these datasets from the run template point of view.

##### 1. Dataset creation

When users confirm a dataset creation with a custom data source, **the webapp creates a new Dataset object** with the
Cosmo Tech API, and **immediately creates a new Runner object** to drive the ETL run template. It is important
to understand that, in the Dataset Manager view, the state of the dataset and its representation depend of these two
objects: **a Dataset and a Runner**.

The Dataset object is mainly a container for other resources (i.e. _dataset parts_), but it contains some metadata such
as the dataset name, tags, description and access restrictions. From the API point of view,
**a dataset does NOT have a status**. This is why the Runner will hold the status information, based on whether the data
processing has succeeded or failed.

The Runner object is the important part, it defines the context in which your ETL script will run. This Runner points to
**a specific run template**, it can have **parameter values** and **base datasets**. In addition, it also has the usual
metadata (name, tags, description, security), but these parts of the Runner object cannot be directly edited from the
webapp.

To persist the link between the dataset and the runner,
**the webapp will always set the dataset id as the first value in the runner's base datasets**. This means that inside
the code of your custom ETL, you can find the id of the dataset whose content must be generated in the Runner object, in
`datasets.bases[0]`.

To persist the values of the ETL parameters, the webapp will save them in the runner, in `parametersValues`, when the
runner is created. When users edit an existing dataset in the webapp, the new `parametersValues` will be saved.

##### 2. ETL start and run

After the creation of the dataset and the runner, the webapp will start the ETL runner, by calling the `/start` endpoint
of the Cosmo Tech API. The ETL run templates are thus called exactly like the simulation run templates.

It is important to note that **the status of the runner** defines how the associated dataset will be displayed in the
webapp:

- when it is `Running`, a spinner will be shown in the dataset list, and a placeholder will replace the dataset overview
- when it is `Failed`, an error icon will be shown, and the placeholder will show a button to download the ETL logs
- when it has been `Successful`, the dataset overview will be displayed, with the dataset KPI cards and data preview
  (see [Dataset overview configuration](datasetManager_datasetOverview.md)).

_Note: the Dataset Manager view does not expect ETL runners with the status `NotStarted` or `Unknown`, it may lead to
undefined behavior._

##### 3. ETL output

Keep in mind that the datasets created by your ETL will usually be used as base datasets for simulation run templates.
You are free to decide how you want to organize the dataset parts, their names and types, but
**the output of the ETL run templates must be consistent with the input expected by the simulation run templates**.

Depending on how you configured the workspace, the webapp may also expect that when the ETL has run successfully, the
associated dataset contains one or several dataset parts of type `DB`
(see [Dataset overview configuration](datasetManager_datasetOverview.md)). Make sure that
**the dataset part names in the workspace configuration match the names of the dataset parts created by the ETL**.

##### 4. Error management in ETL scripts

When writing ETL scripts that will be called from the webapp, keep in mind that:

- when your ETL receives invalid data, you must **make sure that the runner ends with the `Failed` status**, e.g. by
  throwing an exception
- **logs are important**: the terminal output of your ETL can later be downloaded by the webapp end-users to help them
  undestand what was wrong in their input data; provide them with clear error messages, pointing to the exact source of
  the error when it is possible (e.g. with a file name and a line number)

#### Custom data source configuration examples

<details>
<summary>Solution.json example</summary>

```json
{
  "runTemplates": [
    {
      "id": "etl_with_azure_storage",
      "labels": {
        "fr": "Brewery (.csv) depuis Azure Storage",
        "en": "Brewery (.csv) from Azure Storage"
      },
      "parameterGroups": ["etl_param_group_bar_parameters", "etl_param_group_azure_storage"],
      "tags": ["datasource"]
    }
  ]
}
```

</details>

<details>
<summary>Solution.yaml example</summary>

```yaml
runTemplates:
  - id: etl_with_azure_storage
    labels:
      fr: Brewery (.csv) depuis Azure Storage
      en: Brewery (.csv) from Azure Storage
    parameterGroups:
      - etl_param_group_bar_parameters
      - etl_param_group_azure_storage
    tags:
      - datasource
```

</details>

## Subdataset creation

### Introduction

The dataset creation scripts described in the previous section are useful to create datasets from external data sources.
Yet in some cases, you may want to create new datasets simply by filtering an existing dataset, already accessible from
the webapp. _Sub-datasources_ are a specific type of data sources that aim to do exactly this: **create a subdataset**
from an existing dataset.

The webapp does not provide any native data sources for sub-datasets, but you can create your own custom ETL scripts and
make them available in the Dataset Manager view.

### Visibility in the webapp

Data sources for subdatasets can be declared by defining run templates with the tag `subdatasource` in your solution
description.

From the webapp interface, the button to create subdatasets will only be available when a dataset is selected:
**the currently selected dataset will be the _parent_ of the new subdataset**.

### Webapp vs. ETL scripts - Technical details & guidelines

The parameters constraints and configuration are the same as for the dataset creation scripts. The only difference is
that for sub-data sources, **the property `datasetList` of the runner contains two elements**:

- the first one is still the id of the dataset created by the webapp
- the second element of the list indicates **the id of the parent dataset**

## Data source filters

In some cases, you may want to hide some of the default transformation scripts, or show different ETLs based on the
selected workspace. In your workspace configuration, you can set the option
`additionalData.webapp.datasetManager.datasourceFilter` to list which data sources will be available in the webapp.

The expected value is a **list of unique ids**, in which you can mix:

- run template ids for your custom ETL scripts
- the ids of the native data sources you want to keep (`FileUploadToDataset`, `None`)

If `datasourceFilter` is not defined, then all the native data sources and all the run templates with the tag
`datasource` are shown in the dataset creation wizard.

A identical option exists to **filter subdataset creation ETLs**: `additionalData.webapp.datasetManager.subdatasourceFilter`.
When this option is not defined, all run templates with the tag `subdatasource` are shown when creating subdatasets.

<details>
<summary>JSON example</summary>

```json
{
  "additionalData": {
    "webapp": {
      "datasetManager": {
        "datasourceFilter": ["FileUploadToDataset", "my_dataset_etl"],
        "subdatasourceFilter": ["my_subdataset_etl"]
      }
    }
  }
}
```

</details>

<details>
<summary>YAML example</summary>

```yaml
additionalData:
  webapp:
    datasetManager:
      datasourceFilter:
        - FileUploadToDataset
        - my_dataset_etl
      subdatasourceFilter:
        - my_subdataset_etl
```

</details>

## Troubleshooting

### Overriding the workspace configuration

Updating the workspace configuration via the Cosmo Tech API (with restish or swagger) can be a slow, cumbersome and
error-prone process. A simpler way to iterate on the dataset manager configuration during development is to use the file
[src/config/overrides/Workspaces.js](../src/config/overrides/Workspaces.js). This file can be used to override the
configuration of any workspace, by patching the workspace data sent by the Cosmo Tech API.

Open the file and modify the `WORKSPACES` constant, that contains an array of workspace objects. These objects must
contain an `id` property, that will be used to patch the matching workspace sent by the API.

Here is an example of how to override the `datasetManager` configuration via the
[src/config/overrides/Workspaces.js](../src/config/overrides/Workspaces.js) file:

```js
export const WORKSPACES = [
  {
    id: 'w-000000000', // replace this id by your workspace id
    additionalData: {
      webapp: {
        datasetManager: {
          kpiCards: [],
          categories: [],
          queries: [],
        },
      },
    },
  },
];
```

This configuration will then be used when **running your webapp locally**, to let you iterate quickly and test different
configurations of the dataset manager. You can even commit these changes in your webapp repository to
keep using this "configuration patch" in **deployed webapps** (it can be useful for "feature preview" environments).
