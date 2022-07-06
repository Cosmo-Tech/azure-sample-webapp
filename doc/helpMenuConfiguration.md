# Help menu configuration
Help menu contains information related to webapp functioning and maintenance. 
- **APP_VERSION** is the webapp version number which automatically fetched from package.json at deployment.
- **SUPPORT_URL** is the url (expressed as a string) of the support page that can be get in the help menu symbolysed by a "?".
  If this value is set to null, the item is disabled and not displayed.
- **DOCUMENTATION_URL** is either the relative path to the documentation file from the 'public' folder, located at the project's root
or a URL to your documentation resources.  