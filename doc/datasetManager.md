# Dataset manager view

## Introduction

The _dataset manager_ view is an optional view of the webapp, where datasets can be
**browsed, created, previewed, edited and deleted**. The goal of this view is to let end-users
**create datasets directly in the webapp**. These datasets can then be used when creating new scenarios.

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

## Features

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

### Dataset management

From the dataset manager view, users will be able to perform several actions related to dataset management:

- **create** datasets based on the data sources enabled in the workspace
- **share** datasets with the other users
- **edit** datasets and their metadata
- **update** existing datasets by launching associated ETL scripts with modified parameters
- **delete** datasets
