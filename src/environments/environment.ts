export const environment = {
  production: false,

  name: 'desenvolvimento',
  portalURL: 'http://localhost:4000',
  helpURL: '',

  // =================================== Msal Module ====================================
  clientId: '{App_Client_Id}',
  endpoints: {
    graphApiUri: 'https://graph.microsoft.com',
    loginApiUri: 'https://login.microsoftonline.com/{App_Hash_API-Endpoint}'
  },
  popUp: false,
  consentScopes: [
    'User.Read',
    'User.Read.All',
    'Group.Read.All'
  ],
  graphConsentScopes: [
    'User.Read',
    'User.Read.All',
    'Group.Read.All'
  ]
  // =====================================================================================
};
