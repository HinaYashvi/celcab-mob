// Initialize your app
var $$ = Dom7;
var app = new Framework7({  
  root: '#app', // App root element
  pushState:true,  
  name: 'CELCAB',  // App Name
  //id: 'com.myapp.test',  // App id
  id: 'com.phonegap.celcabs',
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
/*var mainView = app.views.create('.view-main', {
  dynamicNavbar: true
});*/

$( document ).ready(function() {  
    document.addEventListener("deviceready", checkStorage, false); 
    document.addEventListener("backbutton", onBackKeyDown, false);
    // friz_fun();
});
function onBackKeyDown() {
       var page=app.getCurrentView().activePage; app.hidePreloader(); 
       //alert(page.name);
      if(page.name=="index"){ 
           app.confirm('Do you want to Exit !', function () {
                  navigator.app.clearHistory(); navigator.app.exitApp();
            });
       } 
       else
       { 
          $$(".back").click();
       }
}


function checkStorage()
{ 
  

 /* window.plugins.notification.local.schedule({
    title: 'My first notification',
    text: 'Thats pretty easy...',
    foreground: true,
    led: { color: '#FF00FF', on: 500, off: 500 },
    vibrate: true
});*/
 /* var pushNotification; 
  pushNotification = window.plugins.pushNotification;

if ( device.platform == 'android' || device.platform == 'Android' || device.platform == "amazon-fireos" ){
    pushNotification.register(
    successHandler,
    errorHandler,
    {
        "senderID":"846304146142",
        "badge":"true",
        "sound":"true",
        "alert":"true",
        "ecb":"onNotification"
    }); 
}
 /* window.plugins.PushbotsPlugin.initialize("5b0548471db2dc33d672ae79", {"android":{"sender_id":"846304146142"}});
// Only with First time registration
window.plugins.PushbotsPlugin.on("registered", function(token){
  console.log("Registration Id:" + token);
  alert("TOKEN ::"+token);
});

//Get user registrationId/token and userId on PushBots, with evey launch of the app even launching with notification
window.plugins.PushbotsPlugin.on("user:ids", function(data){
  console.log("user:ids" + JSON.stringify(data));
  alert("JSON ::"+JSON.stringify(data));
}); 

window.plugins.PushbotsPlugin.on("notification:received", function(data){
    console.log("received:" + JSON.stringify(data));
    alert("received:" + JSON.stringify(data));
    //iOS: [foreground/background]
    console.log("notification received from:" + data.cordova_source);
    alert("notification received from:" + data.cordova_source);
    //Silent notifications Only [iOS only]
    //Send CompletionHandler signal with PushBots notification Id
    window.plugins.PushbotsPlugin.done(data.pb_n_id);
});
 
window.plugins.PushbotsPlugin.on("notification:clicked", function(data){
    // var userToken = data.token; 
       // var userId = data.userId;
    console.log("clicked:" + JSON.stringify(data));
    alert("clicked:" + JSON.stringify(data));
});
*/
   checkConnection();
   //alert("in checkStorage func");
    var value = window.localStorage.getItem("session_mobilenum");
    //PushbotsPlugin.initialize("5b0548471db2dc33d672ae79");
 
window.plugins.notification.local.schedule({
    title: 'My first notification',
    text: 'Thats pretty easy...',
    foreground: true 
});
    if(value==null) 
    {
      //mainView.loadPage("index.html");
      app.router.navigate('/index/');
    }else{
      //mainView.loadPage("bookride.html");
      app.router.navigate('/ridehistory/');
    }
}



// --------------------------- C H E C K  I N T E R N E T  C O N N E C T I O N --------------------- //
function checkConnection() {
    var networkState = navigator.connection.type;
    //alert(networkState);
    if(networkState=='none'){  
        window.location.href="internet.html";
    }
}
// ------------------------------- D A T A B A S E  C O N N E C T I O N ------------------------------- //
function conn_db(city){
  checkConnection();
  //console.log(city);
  var url='http://128.199.226.85/mobileapp_celcabs/appcontroller/db_conn';     
    $.ajax({
      'type':'POST',
      'url':url,
      'data':{'city':city},
      success:function(data){ 
        window.localStorage.setItem("session_city", data);
      }
    }); 
}
// ------------------------------- SIGNUP : C U S T O M E R  I N F O ------------------------------- //
function getCustInfo(mob_number){
  checkConnection();
  var mob_number = $("#mob_number").val();
  var city=$(".selcity").val();
  if(mob_number.length >= 10){ 
    //console.log("phonenumber"+mob_number);
    var url='http://128.199.226.85/mobileapp_celcabs/appcontroller/getCustRegInfo';
    $.ajax({
      'type':'POST', 
      'url':url,
      'data':{'mob_number':mob_number,'city':city},
      success:function(response){ 
        var json = $.parseJSON(response); 
        var json_arr = json.getCust[0];
        //if(response!=''){
          if(json_arr!=undefined){  
            window.localStorage.setItem("reg_custid", json.getCust[0].id);
            $(".item-floating-label").css('display','none');      
            $("#cust_name").val(json.getCust[0].customer_name);
            $("#emailid").val(json.getCust[0].email);
            $("#gender").val(json.getCust[0].gender);
            $("#hidden_ctype").val("oldcust");
          }else{
            //console.log("new registration here");
            $(".item-floating-label").css('display','block');      
            $("#cust_name").val('');
            $("#emailid").val('');
            $("#gender").val('');
            $("#hidden_ctype").val("newcust");
            //var signupForm = $(".signupForm").serialize();
            //var url='http://128.199.226.85/mobileapp_celcabs/appcontroller/registerCustomer';
          }
      }
    });
  }
}
// ---------------------------- SIGNUP : S E N D  O T P  &  P A S S W O R D ---------------------------- //
function sendingPassOTP(){ 
  checkConnection();
  var sess_city = window.localStorage.getItem("session_city");
  var mob_number = $("#mob_number").val();

  var hidden_ctype=$("#hidden_ctype").val();
   
  var url='http://128.199.226.85/mobileapp_celcabs/appcontroller/getPassOTP';
  $.ajax({
      'type':'POST', 
      'url':url,
      'data':{'mob_number':mob_number,'city':sess_city},
      success:function(response){ 
        console.log(response);
        if(response){
          //alert(response+"@@@@@");
         // app.router.navigate('/verifyotp/');
        }
      }
  });

  if(hidden_ctype == 'newcust'){
    var signupForm = $(".signupForm").serialize();
    var url='http://128.199.226.85/mobileapp_celcabs/appcontroller/registerCustomer'; 
    $.ajax({
      'type':'POST', 
      'url':url,
      'data':signupForm,
      success:function(response){ 
        console.log(response);
        if(response){
          console.log(response);
          window.localStorage.setItem("reg_custid", response);
          app.router.navigate('/verifyotp/');
        }
      }
    });
  }else{
          app.router.navigate('/verifyotp/');
  } 
}  

$$(document).on('page:init', '.page[data-name="verifyotp"]', function (e) {
  checkConnection();
  //alert("Do something here when page with data-name=verifyotp attribute loaded and initialized");
  $("#otp").focus();
 /* var options = {
        delimiter : "Your OTP is ",
        length : 6,
        origin : "CELCBS"
      };      
      var success = function (otp) {
        console.log("GOT OTP", otp);
        alert("GOT OTP"+ otp);
        OTPAutoVerification.stopOTPListener();
      }
      var failure = function () {
        OTPAutoVerification.stopOTPListener();
        console.log("Problem in listening OTP");
        alert("Problem in listening OTP");
      }
      OTPAutoVerification.startOTPListener(options, success, failure); */
      //app.showIndicator();
      //app.preloader.show();
});
// ------------------------------- V E R I F Y  O T P --------------------------------- //
function verifyOTP(){
  checkConnection();
  var sess_city = window.localStorage.getItem("session_city");
  var sess_cust = window.localStorage.getItem("reg_custid");
  var otp=$('#otp').val();
  var url='http://128.199.226.85/mobileapp_celcabs/appcontroller/verifiOTP';
  $.ajax({
      'type':'POST', 
      'url':url,
      'data':{'otp':otp,'city':sess_city,'sess_cust':sess_cust},
      success:function(response){ 
        console.log(response);
        if(response == 'updated'){
          app.router.navigate('/index/');
        }else if(response == 'wrongotp'){
          var toastTop = app.toast.create({
            text: 'OTP is wrong.Please check OTP again.',
            position: 'top',
            closeTimeout: 4000,
          });
          toastTop.open();
        }
      }
  });
}

$$(document).on('page:init', '.page[data-name="index"]', function (e) {
  checkConnection();
  var sess_cust = window.localStorage.getItem("reg_custid");
  //alert(sess_cust);
  var sess_city = window.localStorage.getItem("session_city");
  if(sess_cust!=null){
    //alert("Create full-layout notification");
    var notificationFull = app.notification.create({
      //icon: '<i class="icon demo-icon">7</i>',
      title: 'CELCABS',
      titleRightText: 'now',
      subtitle: 'OTP Verified',
      text: 'OTP verification is done.Please Login using password sent with OTP.',
      closeTimeout: 5000,
    });
    //notificationFull.open();
    setTimeout(function() { 
      notificationFull.open();
    }, 2000);
  }else{
    //alert("no notification");
  }
});
// ------------------------------- LOGIN : C H E C K L O G I N ------------------------------- //
function checklogin(){
    //app.router.navigate('/bookride/');
    checkConnection();
    //mainView.loadPage("./bookride.html");
    //homeView.loadPage("bookride.html");
    var mobile_number = $("#mobile_number").val();
    var form = $(".loginForm").serialize();
    //console.log(form);
    //var base_url='http://128.199.226.85/celcabsapp/'; 
    var url='http://128.199.226.85/mobileapp_celcabs/appcontroller/chklogin';  
    $.ajax({
      'type':'POST',
      'url': url, 
      'data':form,
      success:function(data){
        //console.log(data);
        var json = $.parseJSON(data);
        var json_res = json.loggedin_user[0];
        //console.log("!!!!!!!!"+json_res);
        if(json_res!=undefined){ 
          window.localStorage.setItem("session_mobilenum", mobile_number);
          //var json = $.parseJSON(data);  
          window.localStorage.setItem("session_custname", json.loggedin_user[0].customer_name);
          window.localStorage.setItem("session_custid", json.loggedin_user[0].id);
          app.router.navigate('/bookride/');
          window.localStorage.removeItem("reg_custid");  
        }else{
          app.dialog.alert("Authentication Failed");
        }
      }
    }); 
    //var url = decodeURIComponent(base_url.replace('/proxy/', ''));
    //app.showIndicator();
          
     //app.hidePreloader(); 

}
$$(document).on('page:init', '.page[data-name="bookride"]', function (e) {
  checkConnection();
  $(".bookRide").hide();
  //app.showIndicator();
  //$(".preloader").css("display",'block');
  //app.preloader.show();
  $(".item-floating-label").css('display','block');
  var sess_city = window.localStorage.getItem("session_city");
  //app.preloader.show();
  app.dialog.preloader();
  var hourdata='';  
  hourdata='<option value="">HOUR</option>';
  for(var k=0;k<=23;k++){
    hourdata +='<option value='+k+'>'+k+'</option>';
    $('#hour').html(hourdata);
  }   

  var minsdata='';
  minsdata='<option value="">MINUTES</option>';
  for(var m=0;m<=59;m++){
    minsdata +='<option value='+m+'>'+m+'</option>';
    $('#minutes').html(minsdata);
  }
  $("#veh_count").val(1);
  var url='http://128.199.226.85/mobileapp_celcabs/appcontroller/getAll_Location';
  $.ajax({
      'type':'POST', 
      'url':url,
      'data':{'city':sess_city},
      success:function(loc_Res){ 
        //console.log(loc_Res);
        var json_array = $.parseJSON(loc_Res);
        var json_locarr = json_array.locations;
        //console.log(json_locarr);
        //console.log(json_locarr.length+" :: length");
        var pickupdata='';
        pickupdata='<option value="">PICK UP FROM</option>';
        for(var i=0;i<json_locarr.length;i++){
          var locname=json_locarr[i].area +" "+ json_locarr[i].city;
          pickupdata +='<option value='+json_locarr[i].id+'>'+locname+'</option>';
          $('#pickupfrom').html(pickupdata);
        }

        var dropoffdata='';
        dropoffdata='<option value="">DROP OFF TO</option>';
        for(var i=0;i<json_locarr.length;i++){
          var locname=json_locarr[i].area +" "+ json_locarr[i].city;
          dropoffdata +='<option value='+json_locarr[i].id+'>'+locname+'</option>';
          $('#dropoffto').html(dropoffdata);
        }
      }
  });  
  var url_vtype = 'http://128.199.226.85/mobileapp_celcabs/appcontroller/getAll_vehclass';
  $.ajax({
      'type':'POST', 
      'url':url_vtype,
      'data':{'city':sess_city},
      success:function(vclass){
        var vtype_json_array = $.parseJSON(vclass);
        var json_vclassarr = vtype_json_array.vclass;
        var vclassdata='';
        vclassdata='<option value="">VEHICLE CLASS</option>';
        for(var j=0;j<json_vclassarr.length;j++){
          //var vnameid=json_vclassarr[j].id +"_"+ json_vclassarr[j].seating;
          var vhclassid=json_vclassarr[j].id;
          var vehclass=json_vclassarr[j].celcabs_class_name;

          if(vehclass=='Comfort'){
            vehclass='Sedan';
          }else if(vehclass=='SUV'){
            vehclass='MUV';
          }
          vclassdata +='<option value='+vhclassid+'>'+vehclass+'</option>';
          $('#vehclass').html(vclassdata);
          //app.preloader.hide();
          app.dialog.close();
          $(".bookRide").fadeIn("slow");
        }        
      }
  }); 
    var stepper = app.stepper.create({
    el: '.stepper',
    on: {
      change: function (val) {
        //alert('Stepper value changed'+val);
        console.log(stepper.value);
        var vhclass = $("#vehclass").val();
        if(vhclass==''){
          alert("Please select vehicle class");
          return false;
        }/*else{

        }*/
        var passengers= stepper.value;
        if(passengers!=''){
          var sel_vclass=$('#vehclass').val();
          //alert(sel_vclass);
          if(sel_vclass == 2 || sel_vclass == 4){
            // 2 = Sedan //
            // 4 = Economy //            
            var max_seats = 4; // mulitple of 4 //
            if(passengers > max_seats){
              var veh = passengers / max_seats;
              var veh_float = veh.toFixed(2);
              var res = veh_float.split(".",2);
              var aftr_dec = res[1];
              var bfr_dec = res[0];
              if(aftr_dec > 0){
                var final_veh= parseInt(bfr_dec);
                final_veh +=1;
              }else{
                var final_veh= parseInt(bfr_dec);
              }
              $("#veh_count").val(final_veh);
            }
            else{
              $("#veh_count").val(1);
            }
          }else if(sel_vclass == 3){
            // 3 = MUV //
            var max_seats = 6; // multiple of 6 //
            if(passengers > max_seats){
              var veh = passengers / max_seats;
              var veh_float = veh.toFixed(2);
              var res = veh_float.split(".",2);
              var aftr_dec = res[1];
              var bfr_dec = res[0];
              if(aftr_dec > 0){
                var final_veh= parseInt(bfr_dec);
                final_veh +=1;
              }else{
                var final_veh= parseInt(bfr_dec);
              }
              $("#veh_count").val(final_veh);
            }
            else{
              $("#veh_count").val(1);
            }
          }
        }
      }
    }

})
  //app.preloader.hide();
  //hours();
 // minutes();
       
  //$(".preloader").css("display",'none'); 
  
 /* var today = new Date(); 
  var pickerDevice = app.picker.create({
  inputEl: '#demo-picker-device',
   //containerEl: '#demo-picker-date-container',
  value: [
    today.getMonth(),
    today.getDate(),
    today.getFullYear(),
    today.getHours(),
    today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes()
  ],
  formatValue: function (values, displayValues) {
    return values[3] + ':' + values[4];
  },
  cols: [
    // Months
    {
      values: ('0 1 2 3 4 5 6 7 8 9 10 11').split(' '),
      //displayValues: ('January February March April May June July August September October November December').split(' '),
      textAlign: 'left'
    },
    // Days
    {
      values: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
    },
    // Years
    {
      values: (function () {
        var arr = [];
        for (var i = 1950; i <= 2030; i++) { arr.push(i); }
          return arr;
      })(),
    },
    // Space divider
    {
      divider: true,
      content: '  '
    },
    // Hours
    {
      values: (function () {
        var arr = [];
        for (var i = 0; i <= 23; i++) { arr.push(i); }
          return arr;
      })(),
    },
    // Divider
    {
      divider: true,
      content: ':'
    },
    // Minutes
    {
      values: (function () {
        var arr = [];
        for (var i = 0; i <= 59; i++) { arr.push(i < 10 ? '0' + i : i); }
          return arr;
      })(),
    }
  ]
});  */


  //window.localStorage.removeItem("reg_custid"); 
});

// -------------------- B O O K  R I D E --------------------------//

function bookmyride(){
  checkConnection();
  app.router.navigate('/ridehistory/');
  //var sess_city = window.localStorage.getItem("session_city");
  /*var sess_cust = window.localStorage.getItem("session_custid");
  var sess_mobilenum = window.localStorage.getItem("session_mobilenum");
  var bookRideForm=$(".bookRide").serialize();
  //console.log(bookRideForm);
  var city = $("#city").val();

  var postdata=bookRideForm+'&city='+city+'&sess_cust='+sess_cust+'&sess_mobilenum='+sess_mobilenum;
  //console.log(postdata);
  //var stringify=JSON.stringify(postdata);
  //console.log(stringify);
  var url = 'http://128.199.226.85/mobileapp_celcabs/appcontroller/bookMyRide';
  $.ajax({
        'type':'POST', 
        'url':url,
        //'dataType':'json',
        'data':postdata,
        //'data':{'city':city,'sess_cust':sess_cust,'sess_mobilenum':sess_mobilenum},
        success:function(data){
          //alert(data);
          //console.log(data+"::");   
          if(data=='inserted'){
            /*var ridebooktoastTop = app.toast.create({
              text: 'Ride booked successfully.',
              position: 'top',
              closeTimeout: 4000,
              closeButton: true
            });*/
 /*           $('#bookRide')[0].reset();
            //ridebooktoastTop.open();
            app.dialog.alert("Ride booked successfully",function (){
              app.router.navigate('/ridehistory/');
            });
          }
        }
  });*/
}
$$(document).on('page:init', '.page[data-name="ridehistory"]', function (e) {
  checkConnection();
  var sess_city = window.localStorage.getItem("session_city");
  var sess_cust = window.localStorage.getItem("session_custid");
  var sess_mobilenum = window.localStorage.getItem("session_mobilenum");
  var upcoming_booking_url="http://128.199.226.85/mobileapp_celcabs/appcontroller/upcoming_rides";
  $.ajax({
      'type':'POST', 
      'url':upcoming_booking_url,
      'data':{'city':sess_city,'sess_cust':sess_cust,'sess_mobilenum':sess_mobilenum},
      success:function(response){ 
        if(response){
          //console.log(response);
          var upcomingride_json_array = $.parseJSON(response);
          var json_upcmride = upcomingride_json_array.upcomingrides; 
          var upcmridedata='';
          $(".tab-1").append('<span class="bgstyle badge color-green">'+json_upcmride.length+'</span>');
          //alert(json_upcmride.length+"length");
          for(var i=0;i<json_upcmride.length;i++){
            var booking_dt=json_upcmride[i].booking_dt;
            var booking_tm=json_upcmride[i].booking_time;
            var from_location=json_upcmride[i].pickup_area;
            var from_city=json_upcmride[i].pickup_city;

            var to_location=json_upcmride[i].drop_area;
            var to_city=json_upcmride[i].drop_city;

            //alert(fromto_location+"pickup");
            //alert(fromto_city+"city");
            //upcmridedata+='<li><a href="#" class="item-link item-content"><div class="item-media"><img src="img/cabs/taxi3.png" height="60" width="50"></div><div class="item-inner"><div class="item-title"><div class="item-header text-left">Ride Dt:'+booking_dt+" "+booking_tm+'</div>| John Doe</div><div class="item-after">Edit</div></div></a></li>';

            upcmridedata+='<li><a href="#" class="item-link item-content"><div class="item-media"><img src="img/cabs/taxi3.png" height="50" width="40" class="img img1"><button class="col button button-small button-outline text-pink fs-8 border-pink pinkbtn img2">SCHEDULED</button></div><div class="item-inner"><div class="item-title"><div class="item-header text-left"><i class="f7-icons color-black fs-12 mr-5 ml-3">calendar</i>'+booking_dt+'</div><img src="img/cabs/from.png" height="20" width="23" class="mr-5 mt-5"><span class="fs-12">'+from_location+" ,"+from_city+'</span><br/><img src="img/cabs/mapmarker4.png" height="20" width="23" class="mr-5 mt-5"><span class="fs-12">'+to_location+" ,"+to_city+'</span></div><div class="item-after"><!--button class="col button button-small button-outline text-pink fs-8 border-pink pinkbtn">SCHEDULED</button--></div><div class="item-after fs-12"><i class="f7-icons color-black fs-12 mr-5 mt-5">time</i>'+booking_tm+'</div></div></a></li>';            

              $("#upcomigrides").html(upcmridedata);
          }
          //window.localStorage.setItem("reg_custid", response);
          //app.router.navigate('/verifyotp/');
        }
      }
    });

    

    var past_booking_url="http://128.199.226.85/mobileapp_celcabs/appcontroller/past_rides";
    $.ajax({
      'type':'POST', 
      'url':past_booking_url,
      'data':{'city':sess_city,'sess_cust':sess_cust,'sess_mobilenum':sess_mobilenum},
      success:function(past_response){ 
        if(past_response){
          //console.log(past_response);
          var pastride_json_array = $.parseJSON(past_response);
          var json_pastride = pastride_json_array.pastrides; 
          var pstridedata='';
          $(".tab-2").append('<span class="bgstyle badge color-orange">'+json_pastride.length+'</span>');
          //alert(json_upcmride.length+"length");
          for(var j=0;j<json_pastride.length;j++){
            var booking_dt=json_pastride[j].booking_dt;
            var booking_tm=json_pastride[j].booking_time;
            var from_location=json_pastride[j].pickup_area;
            var from_city=json_pastride[j].pickup_city;

            var to_location=json_pastride[j].drop_area;
            var to_city=json_pastride[j].drop_city;

            var fare=json_pastride[j].fare;
            //alert(fare);
            if(fare!=undefined || fare!=null){
              fare='RS.'+fare;
            }else{ 
              fare='';
            }
            pstridedata+='<li><a href="#" class="item-link item-content"><div class="item-media"><img src="img/cabs/taxi3.png" height="50" width="40" class="img img1"><button class="col button button-small button-outline text-green fs-8 border-green greenbtn img2">COMPLETED</button><!--img src="img/cabs/finished-red.png" height="50" width="40" class="img img2"--></div><div class="item-inner"><div class="item-title"><div class="item-header text-left"><i class="f7-icons color-black fs-12 mr-5 ml-3">calendar</i>'+booking_dt+'</div><img src="img/cabs/from.png" height="20" width="23" class="mr-5 mt-5"><span class="fs-12">'+from_location+" ,"+from_city+'</span><br/><img src="img/cabs/mapmarker4.png" height="20" width="23" class="mr-5 mt-5"><span class="fs-12">'+to_location+" ,"+to_city+'</span></div><div class="item-after fs-12">'+fare+'</div><div class="item-after btime fs-12"><i class="f7-icons color-black fs-12 mr-5 mt-5">time</i>'+booking_tm+'</div></div></a></li>'; 
              $("#pastrides").html(pstridedata);
          }
          //window.localStorage.setItem("reg_custid", response);
          //app.router.navigate('/verifyotp/');
        }
      }
    });

});
// -------------------------------- L O G O U T ------------------------------ //
function logOut(){
  checkConnection();
  $(".popover.modal-in").css("display","none");
  $(".popover-backdrop.backdrop-in").css("visibility","hidden");
  window.localStorage.removeItem("session_city"); 
  window.localStorage.removeItem("session_custid"); 
  window.localStorage.removeItem("session_custname"); 
  window.localStorage.removeItem("session_mobilenum");
  app.router.navigate('/index/');
}