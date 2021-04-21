// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import JSONscenario from './GetScenariosTree.json'

JSONscenario.sort()
const GetScenarioTree = () => {
  const scenarioTree = []
  for (const scParent of JSONscenario) {
    if (scParent.parentId === undefined) {
      scenarioTree.push(scParent)
    }
    scParent.children = []
    for (const scChild of JSONscenario) {
      if (scChild.parentId === scParent.id) {
        scParent.children.push(scChild)
      }
    }
  }
  return scenarioTree
}

export default GetScenarioTree
