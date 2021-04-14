const findAllScenarioSampleTest = require('./FindAllScenarios.json')
// TODO remove the mock response and use the ScenarioAPI when it's ready
module.exports = async function (context, req) {
  context.log('FindAllScenarios HTTP trigger function.')
  context.res = {
    body: findAllScenarioSampleTest
  }
}
