# Datasets in the webapp

## Context

Let's start with some context. When using the Cosmo Tech platform, users can define resources of type Organization,
Workspace, Solution, Runner, ... Similarly, there exists a "**Dataset**" resource type, whose main goal is to carry the
metadata of external data sources (e.g. files or databases).

In the webapp, datasets are mainly used for two purposes:

- "**cold data**" for scenarios: when input data is common to multiple scenarios, we can use the **_base_ datasets** of
  Runner objects to let the simulator where the data is stored
- scenario **parameters**: for cases when data change more frequently (and when the data type is not a simple value),
  we can use the Runner's **_parameter_ dataset**

**Parameter datasets** are transparent for end-users, they can be edited in the Scenario view, like the other types of
scenario parameters.

Managing **base datasets**, on the other hand, can be trickier. When creating a new webapp for your project, you must
decide if you want users to be able to create their own base datasets, or if this step must restricted to specific
operators. In the first case, you can enable an optional view in your webapp: the **Dataset Manager** (see
[this section](#the-dataset-manager-feature) for more details). In the second case, your solution experts can create
datasets by calling directly the Cosmo Tech API, without using the webapp.

## Visibility of runners' base datasets in the webapp

Base datasets of runners are used in two locations in the webapp: in the **dataset manager**, and in the
**scenario creation pop-up**. Yet by default, a dataset created directly by calling the Cosmo Tech API will not be
shown in these two screens. The reason for that is that we don't want to show all existing datasets in these screens,
the datasets are thus filtered based on flags stored in their `additionalData` field.

The webapp automatically sets these flags when webapp users create datasets, but when you create datasets in scripts or
with the Cosmo Tech API, you will have to set these flags:

- set `additionalData.webapp.visible.datasetManager` to `true` to make the dataset visible in the dataset manager
- set `additionalData.webapp.visible.scenarioCreation` to `true` to make the dataset visible in the scenario creation dialog

## Compatibility notes

> **Warning**
>
> The webapp users **must have at least the role `user` in the Workspace** resource to be able to create datasets

Changes related to the version of the Cosmo Tech API:

- since `v5` of the Cosmo Tech API, the dataset resources are **stored under the Workspace level** (they were previously
  under the Organization)
- since `v3` of the Cosmo Tech API, datasets are protected by to _Role-Based Access Control_, meaning that
  datasets created by someone won't necessarily be visible by the other users. Also, if your project contains legacy
  datasets created prior to API v3.0, you may want to check and update their field `security` (using the Cosmo Tech API)
  to prevent accidental changes or removal by the webapp users.

## The "Dataset Manager" feature

The _dataset manager_ view is an optional view of the webapp, whose goal is to
**let end-users manage datasets directly in the webapp**. These datasets can then be used when creating new scenarios.

From the dataset manager view, users will be able to:

- **list** the existing datasets
- **preview** a dataset content
- **create** datasets based on the data sources enabled in the workspace
- **share** datasets with the other users
- **edit** datasets and their metadata
- **update** existing datasets by launching associated ETL scripts with modified parameters
- **delete** datasets

The view can be enabled or disabled **for each workspace**. In order to enable it in a given workspace, patch the
workspace configuration to define `additionalData.webapp.datasetManager`: when this entry is a **non-empty object**, the
dataset manager tab becomes visible in the webapp.

The sections below describe how to fill this entry to customize the default behavior of the dataset manager, and adapt
it to your use cases.

### Data sources

The Dataset manager **natively supports two options to create datasets**: empty datasets and file upload.

In addition to these native data sources, it is possible to develop **custom ETL scripts** to create datasets and make
these scripts available in the webapp.

A guide to create and configure your own ETL scripts can be found in the page _[Data source configuration](datasetManager_dataSources.md)_.

### Dataset overview

Once a dataset has been created, users can have a preview of their content in the "**_dataset overview_**", where
**KPIs, details by content type, and preview tables** can be displayed. These elements are configured from the workspace
description.

The configuration of the dataset overview is documented in the page
_[Dataset overview configuration](datasetManager_datasetOverview.md)_.
