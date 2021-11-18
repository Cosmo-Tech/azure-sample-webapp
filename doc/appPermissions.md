# App permissions configuration

## Edit configuration files

The file [src/config/AppPermissions.js](../src/config/AppPermissions.js) defines constants specific to the application permissions: 
you will need to change these values if you want to customize visualisations regarding user permissions.

- **APP_ROLES** defines the mapping between roles application (defined in core Enterprise Application) and WebApp roles
- **PERMISSIONS** defines all permissions in WebApp
- **PROFILES** defines all profiles in WebApp

**_N.B:_** 
- If the connected user has a role that is not define in **APP_ROLES**, the user will have no permission by default
- If the connected user has several roles assigned, the permissions applied will be the concatenation of all roles permissions
