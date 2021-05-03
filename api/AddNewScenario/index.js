// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const scenario = (req.query.scenario || (req.body && req.body.scenario));
    
    let body = 'Scenario ' + scenario + ' saved';
    
    //////////////////////////////////////////////////////////////////////////
    // Remove after API implementation
    const fs = require('fs');
    fs.writeFile('AddNewScenario/' + scenario + '.json', body, function(err) {
      if (err) {
          console.log(err);
      }
    });
    //////////////////////////////////////////////////////////////////////////

    console.log(scenario);
    context.res = {
        // status: 200, /* Defaults to 200 */
        body: body
    };
}