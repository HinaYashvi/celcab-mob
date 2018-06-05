var routes = [
  // Index page
  {
    path: '/index/',
    url: './index.html',
    name: 'index',
  },
  // Components
  /*{
    path: '/accordion/',
    url: './pages/accordion.html',
  },*/
  {
    path: '/signup/',
    url: './signup.html',
  },
  {
    path: '/verifyotp/',
    url: './verifyotp.html',
    name: 'verifyotp',
  },
  {
    path: '/bookride/',
    url: './bookride.html',
   // name: 'bookride',
  },
  {
    path: '/ridehistory/',
    url: './ridehistory.html',
    name: 'ridehistory',
  },
  
 /*{
      path: '/bookride/',
      url: './bookride.html',
      name: 'bookride'
      },*/
  /*{
    path: '/action-sheet/',
    componentUrl: './pages/action-sheet.html',
  },*/
  // Default route (404 page). MUST BE THE LAST
  {
    path: '(.*)',
    url: './404.html',
  },
];
