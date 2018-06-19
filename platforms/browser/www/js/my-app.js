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
 
//var mainView = app.views.create('.view-main');
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
  checkConnection();  
  var sess_mobilenum = window.localStorage.getItem("session_mobilenum");
  if(sess_mobilenum==null) 
  {
    //mainView.loadPage("index.html");
    app.router.navigate('/index/');
  }else{
    //mainView.loadPage("bookride.html");
    app.router.navigate('/ridehistory/');
  }
  /*var sess_city = window.localStorage.getItem("session_city");
  var sess_cust = window.localStorage.getItem("session_custid");

  var upcoming_booking_url="http://128.199.226.85/mobileapp_celcabs/appcontroller/upcoming_rides_enroute";

  var pushnotification_url = "http://128.199.226.85/mobileapp_celcabs/appcontroller/send_enroute_push";

  var driverno_url = "http://128.199.226.85/mobileapp_celcabs/appcontroller/getDriverno";

  //var push_url = "http://128.199.226.85/mobileapp_celcabs/appcontroller/sendPushMsg";
  var sms_url = "http://128.199.226.85/mobileapp_celcabs/appcontroller/sendEnrouteSMS";

  $.ajax({ 
    'type':'POST', 
      'url':upcoming_booking_url,
      'data':{'city':sess_city,'sess_cust':sess_cust,'sess_mobilenum':sess_mobilenum},
      success:function(response){ 
          if(response){
            console.log(response);
            var upcomingride_json_array = $.parseJSON(response);
            var json_upcmride_enrt = upcomingride_json_array.upcomingrides_enroute;
              for(var i=0;i<json_upcmride_enrt.length;i++){
                var pnr=json_upcmride_enrt[i].id;
                var callbook_cust_id=json_upcmride_enrt[i].customer_master_id;
                //console.log(pnr);


                $.ajax({ 
                  'type':'POST', 
                  'url':pushnotification_url,
                  'data':{'city':sess_city,'pnr':pnr,'sess_cust':sess_cust},
                  success:function(push_response){ 
                    if(push_response){
                      //console.log(push_response);  
                      var push_json_array = $.parseJSON(push_response);
                      var json_pushnotify = push_json_array.notifypush;
                      //console.log(json_pushnotify);
                      for(var j=0;j<json_pushnotify.length;j++){
                        var celcabs_vehicle_id = json_pushnotify[j].celcabs_vehicle_id;
                        var customer_phone1=json_pushnotify[j].phone_no1;
                        var customer_phone2=json_pushnotify[j].phone_no2;
                        var eatdate=json_pushnotify[j].eatdate;
                        var pickuptime=json_pushnotify[j].pickuptime;
                        $.ajax({ 
                          'type':'POST', 
                          'url':driverno_url,
                          'data':{'city':sess_city,'celcabs_vehicle_id':celcabs_vehicle_id},
                          success:function(drvno_response){
                              var push_drv_array = $.parseJSON(drvno_response);
                              var json_drvrno = push_drv_array.driver_ph; 
                              //console.log(json_drvrno+"===="+json_drvrno.length);
                              for(var k=0;k<json_drvrno.length;k++){
                                //alert(json_drvrno[k].alt_phone_number);
                                var driver_phone=json_drvrno[k].alt_phone_number;
                              
                              if(customer_phone1!='' || customer_phone2!=''){
                                //alert(callbook_cust_id +"=="+ sess_cust); 
                                if(callbook_cust_id == sess_cust){
                                  $.ajax({ 
                                      'type':'POST', 
                                      //'url':push_url, // FOR PUSH NOTIFICATION //
                                      'url':sms_url,  
                                      'data':{'city':sess_city,'celcabs_vehicle_id':celcabs_vehicle_id,'customer_phone1':customer_phone1,'customer_phone2':customer_phone2,'driver_phone':driver_phone,'eatdate':eatdate,'pickuptime':pickuptime,'sess_cust':sess_cust,'customer_master_id':callbook_cust_id},
                                        success:function(push_response){
                                          //console.log(push_response);
                                          //alert(push_response);    
                                        }
                                  });
                                }
                              }
                            }
                          }
                        });
                      }
                    }
                  }  
                });

              }
          }
      }
  }); */

  //var value = window.localStorage.getItem("session_mobilenum"); 
  /*var notificationOpenedCallback = function(jsonData) {
    console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
  };*/
  /* window.plugins.OneSignal.startInit("00601283-97fa-455d-ae71-0e064926d8e2").handleNotificationOpened(notificationOpenedCallback).endInit(); */

  
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
  var sess_cust = window.localStorage.getItem("session_custid");
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
            $('#bookRide')[0].reset();
            //ridebooktoastTop.open();
              app.dialog.alert("Ride booked successfully",function (){
                app.router.navigate('/ridehistory/');
            });
          }
        }
  });
}
$$(document).on('page:init', '.page[data-name="ridehistory"]', function (e) {
  checkConnection();
  $(".popover.modal-in").css("display","none");
  $(".popover-links").css("display",'none');
  $(".popover-backdrop.backdrop-in").css("visibility","hidden");
  var sess_city = window.localStorage.getItem("session_city");
  var sess_cust = window.localStorage.getItem("session_custid");
  var sess_mobilenum = window.localStorage.getItem("session_mobilenum");
  var upcoming_booking_url="http://128.199.226.85/mobileapp_celcabs/appcontroller/upcoming_rides";
  var droped_cust_url="http://128.199.226.85/mobileapp_celcabs/appcontroller/dropedcusturl";
  $.ajax({
      'type':'POST', 
      'url':upcoming_booking_url,
      'data':{'city':sess_city,'sess_cust':sess_cust,'sess_mobilenum':sess_mobilenum},
      success:function(response){ 
        if(response){
          console.log(response);
          var upcomingride_json_array = $.parseJSON(response);
          var json_upcmride = upcomingride_json_array.upcomingrides; 
          var upcmridedata='';
          $(".tab-1").append('<span class="bgstyle badge color-green">'+json_upcmride.length+'</span>');
          //alert(json_upcmride.length+"length");
          for(var i=0;i<json_upcmride.length;i++){
            var booking_dt=json_upcmride[i].booking_dt;
            //alert(booking_dt);
            var rpt_dt = json_upcmride[i].rpt_dt;
            var booking_tm=json_upcmride[i].booking_time;
            var rpt_tm = json_upcmride[i].rpt_time;
            var from_location=json_upcmride[i].pickup_area;
            var from_city=json_upcmride[i].pickup_city;

            var to_location=json_upcmride[i].drop_area;
            var to_city=json_upcmride[i].drop_city;
            var status_id=json_upcmride[i].sid;
            var call_status_id=json_upcmride[i].call_status_id;
            var terminated_id=json_upcmride[i].terminated_id;
            //alert(status_id);
            //if(status_id!= null && status_id == 7) {
            //if(status_id!= null && status_id == call_status_id) {
            if(terminated_id==null && status_id == call_status_id) {
             var pnrno=json_upcmride[i].id;
             //alert(pnrno);
              var driver_detbtn="<button onclick='getDriver("+pnrno+","+sess_cust+")' class='col button button-small button-outline fs-8 text-drvdet-btn fs-8 border-drvdet-btn drvbtn ml-20 login-screen-open' data-login-screen='.login-screen'>DRIVER DETAILS</button>";
            }else{
              var driver_detbtn='';
            }
            if(status_id==null && call_status_id == terminated_id){
              var pnrno=json_upcmride[i].id;
              //alert(pnrno);
              //onclick='getPayment("+pnrno+","+sess_cust+")'
              var payment_btn="<button onclick='getPayment("+pnrno+","+sess_cust+")' class='col button button-small button-outline fs-8 text-payment-btn fs-8 border-payment-btn pymntbtn ml-20 login-screen-open link popup-open' data-popup='.popup-payment'>PAYMENT DETAILS</button>";
              //var payment_btn="<button onclick='getPayment("+pnrno+","+sess_cust+")' class='col button button-small button-outline fs-8 text-drvdet-btn fs-8 border-drvdet-btn drvbtn ml-20 login-screen-open' data-login-screen='.login-screen'>PAYMENT DETAILS</button>";
            }else{
              var payment_btn='';
            }
            
            /*if(status_id!=null && status_id== 10){

            }*/

        /*    $.ajax({
              'type':'POST', 
              'url':droped_cust_url,
              'data':{'city':sess_city,'sess_cust':sess_cust,'sess_mobilenum':sess_mobilenum},
              success:function(response_drop){
                console.log(response_drop);*/
                
                /*if(call_status_id_droped!= null && call_status_id_droped == terminated_id) {
                  var pnrno=json_upcmride[i].id;
                  var payment_detbtn="<button onclick='getPayment("+pnrno+","+sess_cust+")' class='col button button-small button-outline fs-8 text-drvdet-btn fs-8 border-drvdet-btn drvbtn ml-20 login-screen-open' data-login-screen='.login-screen'>PAYMENT DETAILS</button>";
                }else{
                  var payment_detbtn='';
                }*/
             /* }
            });*/
           // alert(driver_detbtn);
            //
            //alert(fromto_location+"pickup");
            //alert(fromto_city+"city");
            //upcmridedata+='<li><a href="#" class="item-link item-content"><div class="item-media"><img src="img/cabs/taxi3.png" height="60" width="50"></div><div class="item-inner"><div class="item-title"><div class="item-header text-left">Ride Dt:'+booking_dt+" "+booking_tm+'</div>| John Doe</div><div class="item-after">Edit</div></div></a></li>';
           upcmridedata+='<li><a href="#" class="item-link item-content"><div class="item-media"><img src="img/cabs/taxi3.png" height="50" width="40" class="img img1"><button class="col button button-small button-outline text-pink fs-8 border-pink pinkbtn img2">SCHEDULED</button></div><div class="item-inner"><div class="item-title"><div class="item-header text-left"><i class="f7-icons color-black fs-12 mr-5 ml-3">calendar</i>'+rpt_dt+'</div><img src="img/cabs/from.png" height="20" width="23" class="mr-5 mt-5"><span class="fs-12">'+from_location+" ,"+from_city+'</span><br/><img src="img/cabs/mapmarker4.png" height="20" width="23" class="mr-5 mt-5"><span class="fs-12">'+to_location+" ,"+to_city+'</span><br/>'+driver_detbtn+" "+payment_btn+'</div><div class="item-after"><!--button class="col button button-small button-outline text-pink fs-8 border-pink pinkbtn">SCHEDULED</button--></div><div class="item-after fs-12"><i class="f7-icons color-black fs-12 mr-5 mt-5">time</i>'+rpt_tm+'</div></div></a></li>'; 
             $("#upcomigrides").html(upcmridedata);

            // }
            //});
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
function showBackdrop(){
  $(".popover.modal-in").css("display","block");
  $(".popover-links").css("display",'block');
  $(".popover-backdrop.backdrop-in").css("visibility","visible");
}
function getPayment(pnrno,sess_cust){
  //alert(pnrno); 
  var sess_city = window.localStorage.getItem("session_city");
  var sess_cust = window.localStorage.getItem("session_custid");
  var sess_mobilenum = window.localStorage.getItem("session_mobilenum");
  //alert(sess_city+sess_cust+sess_mobilenum);
  var payment_url="http://128.199.226.85/mobileapp_celcabs/appcontroller/paymentDet";
  $.ajax({ 
    'type':'POST', 
    'url':payment_url,
    'data':{'city':sess_city,'sess_cust':sess_cust,'sess_mobilenum':sess_mobilenum,'pnr':pnrno},
    success:function(pay_response){
      //alert("^^^^"+pay_response);
      //console.log(pay_response+"======");
      var pymnt_array = $.parseJSON(pay_response);
      var json_payment = pymnt_array.paymentdet;
      var from_location=json_payment[0].pickup_area;
      var from_city=json_payment[0].pickup_city;
      var to_location=json_payment[0].drop_area;
      var to_city=json_payment[0].drop_city;
      var actual_collection=json_payment[0].actual_collection;
      var booking_dt=json_payment[0].booking_dt;
      var booking_tm=json_payment[0].booking_time;
      var paydet='';
      //paydt="hello";
      paydet='<center><li class="item-content item-input"><div class="item-inner"><div class="item-input-wrap item-input-wrap text-pink text-uppercase letterspace fs-14 lh-30 text-bold">booking dt : '+booking_dt+'</div></div></li><li class="item-content item-input"><div class="item-inner"><div class="item-input-wrap item-input-wrap text-pink text-uppercase letterspace fs-14 lh-30 text-bold">booking time : '+booking_tm+'</div></div></li><li class="item-content item-input"><div class="item-inner"><div class="item-input-wrap item-input-wrap text-pink text-uppercase letterspace fs-14 lh-30 text-bold">PICK UP : '+from_location+", "+from_city+'</div></div></li><li class="item-content item-input"><div class="item-inner"><div class="item-input-wrap item-input-wrap text-pink text-uppercase letterspace fs-14 lh-30 text-bold">DROP OF : '+to_location+", "+to_city+'</div></div></li><li class="item-content item-input"><div class="item-inner"><div class="item-input-wrap item-input-wrap text-pink text-uppercase letterspace fs-14 lh-30 text-bold">Total amount : '+actual_collection+'</div></div></li></center>';
      $('.paymentdet').html(paydet);
    }
  });

}
function getDriver(pnrno,sess_cust){
  var sess_city = window.localStorage.getItem("session_city");
  var pushnotification_url = "http://128.199.226.85/mobileapp_celcabs/appcontroller/send_enroute_push";
  var driverdetail_url = "http://128.199.226.85/mobileapp_celcabs/appcontroller/getDriverdetail";
  $.ajax({ 
    'type':'POST', 
    'url':pushnotification_url,
    'data':{'city':sess_city,'pnr':pnrno,'sess_cust':sess_cust},
    success:function(push_response){  
      if(push_response){
        var push_json_array = $.parseJSON(push_response);
        var json_pushnotify = push_json_array.notifypush;
        var celcabs_vehicle_id = json_pushnotify[0].celcabs_vehicle_id;
        var todaydate = json_pushnotify[0].todaydate;
        var pickdt = json_pushnotify[0].pickdt;
        var curr_time = todaydate;
        var pickuptime = pickdt;
        $.ajax({ 
          'type':'POST', 
          'url':driverdetail_url,
          'data':{'city':sess_city,'celcabs_vehicle_id':celcabs_vehicle_id},
          success:function(drvno_response){ 
            var push_drv_array = $.parseJSON(drvno_response);
            var json_drvrno = push_drv_array.driver_det; 
            var json_drvmob = push_drv_array.driver_mob;
            var driver_name=json_drvrno[0].driver_name;
            var vid = json_drvrno[0].celcabs_vehicle_id;
            var vehicle_no = json_drvrno[0].license_plate;
            var driver_photo =  json_drvrno[0].driver_photo;
            //var driver_mobile = json_drvmob[0].alt_phone_number;
            var driver_mobile ='9624658122';
              if(driver_mobile!='' && driver_mobile!=undefined){
                var mob_driver = driver_mobile;
              }else{
                var mob_driver = '';
              }
              var split_drvpic=driver_photo.split("/");
              if(split_drvpic[1]==''){
                // no photo found. //
                var d_pictr='<div class="row center"><div class="col-100 tablet-33"><center><img src="img/cabs/male-circle-512.png" class="w-45"  width=50 ></center></div></div>';
              }else{
                // photo found. //
                var d_pictr='';
              }
              dt1 = new Date(todaydate); 
              dt2 = new Date(pickdt);
              var approx_ETA=diff_minutes(dt1, dt2);

              var driver_info = d_pictr+'<center><li class="item-content item-input"><div class="item-inner"><div class="item-input-wrap item-input-wrap text-pink text-uppercase letterspace fs-14 lh-30 text-bold">'+driver_name+'</div></div></li><li class="item-content item-input"><div class="item-inner"><div class="item-input-wrap text-pink text-uppercase letterspace fs-14 lh-30">vid: '+vid+'</div></div></li><li class="item-content item-input"><div class="item-inner"><div class="item-input-wrap text-pink text-uppercase letterspace fs-14 lh-30">mob: '+mob_driver+'</div></div></li><li class="item-content item-input"><div class="item-inner"><div class="item-input-wrap text-pink text-uppercase letterspace fs-14 lh-30">vehicle: '+vehicle_no+'</div></div></li><li class="item-content item-input"><div class="item-inner"><div class="item-input-wrap text-pink text-uppercase letterspace fs-14 lh-30">approx. eta: '+approx_ETA+' min</div></div></li><li class="item-content item-input"><div class="item-inner"><div class="item-input-wrap text-pink text-uppercase letterspace fs-14 lh-30"><a href="#" class="col button color-signup text-white no-radius mt-p-5" onclick="call_driver('+"'"+mob_driver+"'"+')">CALL DRIVER</a></div></div></li></center></div>';
              //var driver_info = d_pictr+'<center><li class="item-content item-input"><div class="item-inner"><div class="item-input-wrap item-input-wrap text-pink text-uppercase letterspace fs-14 lh-30 text-bold">'+driver_name+'</div></div></li><li class="item-content item-input"><div class="item-inner"><div class="item-input-wrap text-pink text-uppercase letterspace fs-14 lh-30">vid: '+vid+'</div></div></li></center>';

              $(".driverdetails").html(driver_info);

            }
          //} 
        });
      }
    }
  });
}
function call_driver(mob_driver){
  //alert("called"+mob_driver);
  //window.location.href = "tel:9624658122";
  window.plugins.CallNumber.callNumber(onSuccess, onError, mob_driver, true);
  //window.plugins.CallNumber.callNumber(onSuccess, onError, '9624658122', true);
}
function onSuccess(result){
  console.log("Success:"+result);
} 
function onError(result) {
  console.log("Error:"+result);
}
function diff_minutes(dt2, dt1){
  var diff =(dt2.getTime() - dt1.getTime()) / 1000;
  diff /= 60;
  var divdesec = Math.abs(Math.round(diff));
  var tm=timeConvert(divdesec);
  return tm;
}
function timeConvert(n) {
  var num = n;
  var hours = (num / 60);
  var rhours = Math.floor(hours);
  var minutes = (hours - rhours) * 60;
  var rminutes = Math.round(minutes);
  //return num + " minutes = " + rhours + " hour(s) and " + rminutes + " minute(s).";
  //return num + " minutes = " + rhours + " hour(s) and " + rminutes + " minute(s).";
  return rem_time = rhours +":"+rminutes;
}
function gotoRideHistory(){
    checkConnection();
    app.router.navigate('/ridehistory/');   
}
function showbackdrop(){ 
  $(".popover.modal-in").css("display","block");
  $(".popover-links").css("display","block");
  $(".popover-backdrop.backdrop-in").css("visibility","visible");
}
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