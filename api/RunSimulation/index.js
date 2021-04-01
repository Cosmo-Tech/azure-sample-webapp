// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
const fetch = require('node-fetch')
const jwt = require('jsonwebtoken')
const jwksClient = require('jwks-rsa')

module.exports = async function (context, req) {
  context.log('JavaScript HTTP function RunSimulation has been triggered')
  const accessToken = req.headers['csm-authorization']
  const authorizationHeader = 'Bearer ' + accessToken
  context.log('Bearer Token: ' + accessToken)
  const client = jwksClient({
    jwksUri: 'https://login.microsoftonline.com/common/discovery/keys'
  })
  function getKey (header, callback) {
    client.getSigningKey(header.kid, function (err, key) {
      if (err) {
        const error = 'Error while getting JWKS signing keys with kid: ' + header.kid + ' - token: ' + accessToken + ' - error: ' + err
        context.log(error)
        context.res = { status: 500, body: error }
        context.done()
        return
      }
      const signingKey = key.publicKey || key.rsaPublicKey
      callback(null, signingKey)
    })
  }

  const options = {
    audience: '3ae79982-a3dd-471b-9a9e-268b4ff0d5a6'
  }

  jwt.verify(accessToken, getKey, options, function (err, decoded) {
    context.log('errors: ' + err)
    context.log('decoded: ' + JSON.stringify(decoded))
  })

  // Correlation ID for Application Insights Tracing
  const traceParentHeader = req.headers.traceparent
  const traceStateHeader = req.headers.tracestate
  const requestIdHeader = req.headers['request-id']
  const requestContextHeader = req.headers['request-context']

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
  context.log(body)
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: authorizationHeader
  }
  if (traceParentHeader) {
    headers.traceparent = traceParentHeader
  }
  if (traceStateHeader) {
    headers.tracestate = traceStateHeader
  }
  if (requestIdHeader) {
    headers['request-id'] = requestIdHeader
  }
  if (requestContextHeader) {
    headers['request-context'] = requestContextHeader
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(body)
  })
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

    context.log(data)
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
  const amqpUser = process.env.REST_CSM_AMQPCONSUMER_USER
  const amqpKey = process.env.REST_CSM_AMQPCONSUMER_PASSWORD
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

function forgeBody (simulator, simulation) {
  // ADT
  const adtInstanceUrl = process.env.REST_ADT_INSTANCE_URL
  const azureTenantId = process.env.REST_AZURE_TENANT_ID
  const azureClientId = process.env.REST_AZURE_CLIENT_ID
  const azureClientSecret = process.env.REST_AZURE_CLIENT_SECRET
  // Event Hub
  const amqpConsumer = process.env.REST_API_AMQP_CONSUMER
  const amqpUser = process.env.REST_CSM_AMQPCONSUMER_USER
  const amqpKey = process.env.REST_CSM_AMQPCONSUMER_PASSWORD

  const body = {
    init: {
      envVars: {
        ADT_INSTANCE_URL: adtInstanceUrl,
        AZURE_TENANT_ID: azureTenantId,
        AZURE_CLIENT_ID: azureClientId,
        AZURE_CLIENT_SECRET: azureClientSecret
      },
      image: 'csmphoenix.azurecr.io/azure-digital-twins-simulator-connector'
    },
    main: {
      envVars: {
        CSM_AMQPCONSUMER_USER: amqpUser,
        CSM_AMQPCONSUMER_PASSWORD: amqpKey
      },
      image: simulator,
      runArgs: [
        '-i',
        simulation,
        '--amqp-consumer',
        amqpConsumer
      ]
    }
  }

  return body
}
