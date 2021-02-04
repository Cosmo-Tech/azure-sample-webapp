module.exports = async function (context, req) {
  context.log('JavaScript HTTP trigger function processed a request.')
  let caller = 'No caller'
  const header = req.headers['x-ms-client-principal']
  if (header) {
    const encoded = Buffer.from(header, 'base64')
    caller = encoded.toString('ascii')
  }
  const name = (req.query.name || (req.body && req.body.name))
  let responseMessage = name
    ? 'Hello, ' + name + ' from phoenix. This HTTP triggered function executed successfully.'
    : 'This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.'
  responseMessage = responseMessage + ' API caller: ' + caller

  context.res = {
    // status: 200, /* Defaults to 200 */
    body: responseMessage
  }
}
