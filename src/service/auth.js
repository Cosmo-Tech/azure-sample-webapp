import { Auth, AuthDev } from '@cosmotech/core'
import { AuthAAD } from '@cosmotech/azure'

// Register the providers used in the application
Auth.addProvider(AuthDev)
Auth.addProvider(AuthAAD)
