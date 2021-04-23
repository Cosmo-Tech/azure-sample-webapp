// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import JSONscenario from './GetScenariosTree.json'

const getScenarioTree = () => {
  JSONscenario.sort()
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

const ScenarioUtils = {
  getScenarioTree
}

export default ScenarioUtils
