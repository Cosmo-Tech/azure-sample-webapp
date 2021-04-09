// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

module.exports = async function (context, req) {
  context.log('getScenarioListAction HTTP trigger function.')
  context.res = {
    // status: 200, /* Defaults to 200 */
    body: {
      list: [
        {
          id: '1',
          name: 'Scenario1'
        },
        {
          id: '2',
          name: 'Scenario2'
        }
      ]
    }
  }
}
