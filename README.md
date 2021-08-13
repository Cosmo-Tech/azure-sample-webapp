# Azure Sample Webapp

The ***Azure Sample Webapp*** aims to be an example of a Cosmo Tech web application based on Azure cloud technology.\
This project demonstrates how to setup a web application with authentication, scenario management features and BI tools.
It thus provides a fully configured solution **based on a brewery model** to illustrate the possible features.

You can use this project as a base to build a front-end for your own Cosmo Tech solution.

# Getting Started

## Clone this project

The instructions below explain how to clone this project to build your own customized front-end for a Cosmo Tech
solution.

First, from the GitHub interface, [create a new repository](https://github.com/new/import) by importing the
azure-sample-webapp repository.

![Create a new repository in GitHub by importing the project "https://github.com/Cosmo-Tech/azure-sample-webapp"](doc/assets/github_project_import.png)

This will allow you to develop your own front-end using git, and still be able to receive the new features of the
azure-sample-webapp project.

You can now use the commands below to clone and configure your github project:
```
# Replace by the URL of your own repository (e.g. my-org/my-project.git)
git clone git@github.com:<YOUR_GITHUB_REPOSITORY_URL>  
cd <YOUR REPOSITORY_NAME>
git remote add upstream git@github.com:Cosmo-Tech/azure-sample-webapp.git
git remote set-url upstream --push "NO"
git fetch upstream
```

## Configure the webapp

Please refer to [Webapp configuration](doc/config.md)

## Start the webapp locally

First, you have to start your Azure Functions, that are required for the PowerBI embed reports to work correctly, with the commands below:
```
cd api
yarn install
yarn start
```

In another terminal, you can then start the webapp with:
```
yarn install
yarn start
```

Please note that the `yarn install` command is only necessary if the dependencies have not been installed, you do not
need to use this command every time.

## Available Scripts

### React scripts
This application has been created with *create-react-app*, that provides some scripts directly in the project directory.

#### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

#### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

#### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### Other scripts
#### `i18next`
We have defined our own i18next-parser.config.js file.

Once you had launched the command `yarn install`, you'll be able to run the command `i18next` in the project root folder.
This command will :
- look for react-i18next usage within the __src/__ folder
- get all keys defined
- add all keys into translation files (by default __public/locales/en/translation.json__ and __public/locales/fr/translation.json__)
Feel free to add new supported languages or change the parser configuration. ( See [react-i18next](https://github.com/i18next/react-i18next) and [i18next-parser](https://github.com/i18next/i18next-parser) )
