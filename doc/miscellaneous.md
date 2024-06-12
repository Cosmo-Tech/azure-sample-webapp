# Miscellaneous

## Dataset filter

In order to filter datasets in scenario creation dialog (for scenario master only), there are two options:

- API (Recommended)
- Dataset filter (Deprecated)

### API (Recommended)

All datasets that are needed to be selectable in dataset list must be linked to the matching workspace by using `workspace/link` or `dataset/link` API endpoint.
In the same way, datasets that are needed not to be visible must be unlinked from the workspace by using `workspace/unlink` or `dataset/unlink` API endpoint.

This consists of using **_workspace/dataset_** `/link` - `/unlink` API endpoint

### Dataset Filter workspace option (Deprecated)

Datasets included in the `[workspace].webApp.options.datasetFilter` array attribute will be added in the datasets list in addition to to datasets. So it is recommended to set this attribute to _null_

<details>
<summary>JSON Workspace file example</summary>

```json
{
  "webApp": {
    "url": "https://sample.app.cosmotech.com",
    "iframes": null,
    "options": {
      "datasetFilter": ["d-77w1eq1mmd5"]
    }
  }
}
```

</details>

> **Warning**
>
> **Potential weird behavior**: If a dataset is set in both attributes, it will be displayed twice
