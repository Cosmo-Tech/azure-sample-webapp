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
  const url = forgeUrl()
  const body = forgeBody(req.query.simulator, req.query.simulation)
  const res = await fetch(url,
    { method: 'POST', headers: { Accept: 'application/json' }, body: JSON.stringify(body) })
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
    msg = 'Simulation name parameter is empty or undefined, can\'t run simulation'
  }
  // Log error message to context if needed
  if (msg !== undefined) {
    context.log.error(msg)
  }
  return msg
}

function checkServerApiConfig (context) {
  // API
  const url = process.env.REST_API_URL
  const key = process.env.REST_API_KEY
  // ADT
  const adtInstanceUrl = process.env.REST_ADT_INSTANCE_URL
  const azureTenantId = process.env.REST_AZURE_TENANT_ID
  const azureClientId = process.env.REST_AZURE_CLIENT_ID
  const azureClientSecret = process.env.REST_AZURE_CLIENT_SECRET
  // Event Hub
  const amqpConsumer = process.env.REST_API_AMQP_CONSUMER
  const amqpUser = process.env.REST_API_AMQP_CONSUMER_USER
  const amqpKey = process.env.REST_API_AMQP_CONSUMER_PASSWORD
  // Check mandatory parameters
  let msg
  if (url === undefined || url.length === 0) {
    msg = 'REST API url is empty or undefined, can\'t run simulation'
  }
  if (key === undefined || key.length === 0) {
    msg = 'REST API key is empty or undefined, can\'t run simulation'
  }
  if (adtInstanceUrl === undefined || adtInstanceUrl.length === 0) {
    msg = 'REST ADT instance url is empty or undefined, can\'t run simulation'
  }
  if (azureTenantId === undefined || azureTenantId.length === 0) {
    msg = 'REST tenant ID is empty or undefined, can\'t run simulation'
  }
  if (azureClientId === undefined || azureClientId.length === 0) {
    msg = 'REST client ID is empty or undefined, can\'t run simulation'
  }
  if (azureClientSecret === undefined || azureClientSecret.length === 0) {
    msg = 'REST client secret is empty or undefined, can\'t run simulation'
  }
  if (amqpConsumer === undefined || amqpConsumer.length === 0) {
    msg = 'AMQP url is empty or undefined, can\'t run simulation'
  }
  if (amqpUser === undefined || amqpUser.length === 0) {
    msg = 'AMQP user is empty or undefined, can\'t run simulation'
  }
  if (amqpKey === undefined || amqpKey.length === 0) {
    msg = 'AMQP key is empty or undefined, can\'t run simulation'
  }
  // Log error message to context if needed
  if (msg !== undefined) {
    context.log.error(msg)
  }
  return msg
}

function forgeUrl () {
  const newSimEndpoint = 'simulations/new'
  let url = process.env.REST_API_URL + '/' + newSimEndpoint + '?'
  // Mandatory REST API key
  url += 'subscription-key=' + process.env.REST_API_KEY
  return url
}

function forgeBody(simulator, simulation) {
  // API
  const url = process.env.REST_API_URL
  const key = process.env.REST_API_KEY
  // ADT
  const adtInstanceUrl = process.env.REST_ADT_INSTANCE_URL
  const azureTenantId = process.env.REST_AZURE_TENANT_ID
  const azureClientId = process.env.REST_AZURE_CLIENT_ID
  const azureClientSecret = process.env.REST_AZURE_CLIENT_SECRET
  // Event Hub
  const amqpConsumer = process.env.REST_API_AMQP_CONSUMER
  const amqpUser = process.env.REST_API_AMQP_CONSUMER_USER
  const amqpKey = process.env.REST_API_AMQP_CONSUMER_PASSWORD

  const body = {
    "init": {
      "envVars": {
        "ADT_INSTANCE_URL": adtInstanceUrl,
        "AZURE_TENANT_ID": azureTenantId,
        "AZURE_CLIENT_ID": azureClientId,
        "AZURE_CLIENT_SECRET": azureClientSecret
      },
      "image": "csmphoenix.azurecr.io/azure-digital-twins-simulator-connector"
    },
    "main": {
      "envVars": {
        "CSM_AMQPCONSUMER_USER": amqpUser,
        "CSM_AMQPCONSUMER_PASSWORD": amqpKey
      },
      "image": simulator,
      "runArgs": [
        "-i",
        simulation,
        "--amqp-consumer",
        amqpConsumer
      ]
    }
  }

  return body
}
