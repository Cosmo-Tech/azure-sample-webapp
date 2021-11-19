# Profiles configuration

## Edit configuration files

The file [src/config/Profiles.js](../src/config/Profiles.js) defines constants specific to the application permissions: 
you will need to change these values if you want to customize visualizations regarding user permissions.

- **PROFILES** defines all profiles in WebApp

**_N.B:_** 
- If the connected user has a role that is not defined in **PROFILES**, the user will have no permission by default
- If the connected user has several roles assigned, the permissions applied will be the concatenation of all roles permissions

## Permissions

Here is the list of existing permissions:
- **canCreateScenario**: allow connected user to create a scenario (show "Create Scenario" button in Scenario view)
- **canDeleteScenario**: allow connected user to delete a scenario (show "Delete" icon in ScenarioManager screen)
- **canEditOrLaunchScenario**: allow connected user to edit and launch a scenario (show "Edit" and "Launch" buttons in Scenario view)

**_N.B:_**

Profiles configuration is based on user roles definition in the core Enterprise Application.
