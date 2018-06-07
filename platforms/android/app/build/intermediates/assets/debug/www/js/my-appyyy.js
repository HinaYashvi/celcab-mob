// Initialize your app
var $$ = Dom7;
var app = new Framework7({  
  root: '#app', // App root element
  pushState:true,  
  name: 'My App',  // App Name
  id: 'com.myapp.test',  // App id
  panel: {
    swipe: 'left', // Enable swipe panel
  },
  routes: routes,
  clicks: {
    externalLinks: '.external',
  },
  picker: {
    rotateEffect: true,
    openIn: 'popover',
  },
  // Hide and show indicator during ajax requests
    onAjaxStart: function (xhr) {
        app.showIndicator();
    },
    onAjaxComplete: function (xhr) {
        app.hideIndicator();
    }
}); 
var mainView = app.views.create('.view-main');

//-------- CHECK INTERNET CONNECTION ------------
function checkConnection() {
    var networkState = navigator.connection.type;
    //alert(networkState);
    if(networkState=='none') 
    {  
        //mainView.loadPage("internet.html");
        window.location.href="internet.html";
    }

}

function conn_db(){
  
  var city=$("#city").val();
  
  var base_url='http://128.199.226.85/mobileapp_celcabs/appcontroller/db_conn';   
    $.ajax({
      'type':'POST',
      'url':base_url,
      'data':{'city':city},
      success:function(data){ 
        alert(data);
      }
    }); 
}

//================= LOGIN PAGE ==============
function checklogin(){
 // alert("called");
  //router.navigate("bookride.html");
    checkConnection();
    //mainView.loadPage("./bookride.html");

    //homeView.loadPage("bookride.html");

    var form = $(".loginForm").serialize();
    //console.log(form);
    //var base_url='http://128.199.226.85/celcabsapp/'; 
    var base_url='http://starprojects.in/Rego_CRM/'; 
    $.ajax({
      'type':'POST',
      'url':base_url,
      'data':form,
      success:function(data){
        alert(data);
      }
    }); 
    //var url = decodeURIComponent(base_url.replace('/proxy/', ''));
    //app.showIndicator();
          
     //app.hidePreloader(); 

}