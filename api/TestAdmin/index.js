// copyright (c) cosmo tech corporation.
// licensed under the mit license.
module.exports = async function (context, req) {
  context.log('JavaScript HTTP trigger function processed a request.')

  context.res = {
    // status: 200, /* Defaults to 200 */
    body: 'ADMIN ROLE API CALL'
  }
}
