const fetch = require('node-fetch')

module.exports = async function (context, req) {
  context.log('JavaScript HTTP function RunSimulation has been triggered')
  // Check REST API configuration from Azure Function parameters sent by user
  let error = checkClientParametersApiConfig(context, req)
  if (error !== undefined) {
    context.res = { status: 400, body: error }
    context.done()
    return
  }
  // Check REST API configuration from environment variables
  error = checkServerApiConfig(context)
  if (error !== undefined) {
    context.res = {
      status: 500,
      body: 'API server function is not configured correctly, please contact ' +
        'an administrator'
    }
    throw error
  }

  // Process the request
  const url = forgeUrl(req.query.simulator, req.query.simulation)
  const res = await fetch(url,
    { method: 'POST', headers: { Accept: 'application/json' } })
  // Check if the call succeeded
  if (!res.ok) {
    context.log.error('Simulation run request failed with status ' +
      res.status + ':' + res.statusText)
    context.res = {
      status: res.status,
      body: { error: res.statusText }
    }
  } else {
    const data = await res.json()
    context.res = {
      status: res.status,
      body: data
    }
  }
  context.done()
}

function checkClientParametersApiConfig (context, req) {
  let msg
  // Mandatory parameters
  if (req.query.simulator === undefined || req.query.simulator.length === 0) {
    msg = 'Simulator parameter is empty or undefined, can\'t run simulation'
  }
  if (req.query.simulation === undefined || req.query.simulation.length === 0) {
    msg = 'Scenario name parameter is empty or undefined, can\'t run simulation'
  }
  // Log error message to context if needed
  if (msg !== undefined) {
    context.log.error(msg)
  }
  return msg
}

function checkServerApiConfig (context) {
  const url = process.env.REST_API_URL
  const key = process.env.REST_API_KEY
  const amqpConsumer = process.env.REST_API_AMQP_CONSUMER
  // Check mandatory parameters
  let msg
  if (url === undefined || url.length === 0) {
    msg = 'REST API url is empty or undefined, can\'t run simulation'
  }
  if (key === undefined || key.length === 0) {
    msg = 'REST API key is empty or undefined, can\'t run simulation'
  }
  if (amqpConsumer === undefined || amqpConsumer.length === 0) {
    msg = 'AMQP parameter is empty or undefined, can\'t run simulation'
  }
  // Log error message to context if needed
  if (msg !== undefined) {
    context.log.error(msg)
  }
  return msg
}

function forgeUrl (simulator, simulation) {
  const newSimEndpoint = 'simulations/new'
  let url = process.env.REST_API_URL + '/' + newSimEndpoint + '?'
  // Mandatory REST API key & simulator parameters
  url += 'key=' + process.env.REST_API_KEY
  url += '&simulator=' + simulator
  // Mandatory simulator runArgs
  const simulatorRunArgs = []
  simulatorRunArgs.push('--input')
  simulatorRunArgs.push(simulation)
  simulatorRunArgs.push('--amqp-consumer')
  simulatorRunArgs.push(process.env.REST_API_AMQP_CONSUMER)
  for (const i in simulatorRunArgs) {
    url += '&runArgs=' + simulatorRunArgs[i]
  }
  return url
}
