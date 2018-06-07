// Initialize your app
var $ = Dom7;
var app = new Framework7({
  // App root element
  root: '#app',

  pushState:true,
  // App Name
  name: 'My App',
  // App id
  id: 'com.myapp.test',
  // Enable swipe panel
  panel: {
    swipe: 'left',
  },
  routes: routes,
  clicks: {
    externalLinks: '.external',
  },
  // Add default routes
  /*routes: [
    {
      path: './signup/', 
      pageName: 'signup',
    },
  ],*/
  /*routes: [
    {
      path: '/signup/',
      el: document.querySelector('.page[data-name="signup"]'),
    },
  ],*/
  // ... other parameters
//}); 
//var $$ = Dom7;
 
//var mainView = app.views.create('.view-main');
/*var mainView = app.views.create('.view-main', {
  on: {
    pageInit: function () {
      console.log('page init')
    }
  },
  /*routes: [
    {
      path: '/signup/',
      pageName: 'signup',
    },
  ], */
}); 
/*function signup(){
    //mainView.loadPage("signup.html");
   //window.location.href = 'signup.html';
   //router.navigate("signup.html");
   //var homeView = app.views.signup;
   app.views.get('signup.html');
} */
// Dom7
/*var $ = Dom7;

// Theme
var theme = 'auto';
if (document.location.search.indexOf('theme=') >= 0) {
  theme = document.location.search.split('theme=')[1].split('&')[0];
}

// Init App
var app = new Framework7({
  id: 'io.framework7.testapp',
  root: '#app',
  theme: theme,
  data: function () {
    return {
      user: {
        firstName: 'John',
        lastName: 'Doe',
      },
    };
  },
  methods: {
    helloWorld: function () {
      app.dialog.alert('Hello World!');
    },
  },
  routes: routes,
  vi: {
    placementId: 'pltd4o7ibb9rc653x14',
  },
});*/
