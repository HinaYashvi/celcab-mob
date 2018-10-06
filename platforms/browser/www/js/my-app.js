// Initialize your app
var $$ = Dom7;
var app = new Framework7({  
  root: '#app', // App root element
  pushState: true,
  //popupCloseByOutside:true,
  name: 'CELCAB',  // App Name
  //id: 'com.myapp.test',  // App id
  id: 'com.phonegap.celcabs',
  panel: {
    //swipe: 'left', // Enable swipe panel
    closeByBackdropClick : true,    
  },
  //theme:'material',
  //material: true, //enable Material theme
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
var port = 9013;    
//var base_url = 'http://128.199.226.85:'+port+'/mobileapp_celcabs/';   // TEST SERVER //
var base_url = 'http://182.18.160.210/mobileapp_celcabs/';   // LIVE SERVER //
$( document ).ready(function() {  
    document.addEventListener("deviceready", checkStorage, false); 
    document.addEventListener("backbutton", onBackKeyDown, false);
});
function onBackKeyDown() {  
  if(app.views.main.router.history.length==2 || app.views.main.router.url=='/'){
    app.dialog.confirm('Do you want to Exit ?', function () {
      navigator.app.clearHistory(); navigator.app.exitApp();
    });
  }else{ 
    $$(".back").click();
  }
}
function checkStorage(){  
  checkConnection();  
  var sess_mobilenum = window.localStorage.getItem("session_mobilenum");
  if(sess_mobilenum==null){
    app.router.navigate('/');
  }else{
    app.router.navigate('/bookride/'); 
  } 
}
// --------------------------- C H E C K  I N T E R N E T  C O N N E C T I O N --------------------- //
function checkConnection() {
    var networkState = navigator.connection.type;
    //alert(networkState);
    if(networkState=='none'){  
        app.router.navigate('/internet/'); 
    }
}
// ------------------------------- D A T A B A S E  C O N N E C T I O N ------------------------------- //
function conn_db(city){ 
  //var city = city.trim();
  checkConnection();
  //alert(city);
  var url=base_url+'appcontroller/db_conn';     
    $.ajax({
      'type':'POST',
      'url':url,
      'data':{'city':city},
      success:function(data){ 
        var data=data.trim();
        window.localStorage.setItem("session_city",data);
      }
    }); 
}
// ------------------------------- SIGNUP : C U S T O M E R  I N F O ------------------------------- //
function getCustInfo(mob_number){
  checkConnection();
  var mob_number = $("#mob_number").val();
  var city=$(".selcity").val();
  if(mob_number.length >= 10){ 
    var url=base_url+'appcontroller/getCustRegInfo';
    $.ajax({
      'type':'POST', 
      'url':url,
      'data':{'mob_number':mob_number,'city':city},
      success:function(response){ 
        var json = $.parseJSON(response); 
        var json_arr = json.getCust[0];
        //if(response!=''){
          if(json_arr!=undefined){  
            alert("old registration");
            window.localStorage.setItem("reg_custid", json.getCust[0].id);
            $(".item-floating-label").css('display','none');      
            $("#cust_name").val(json.getCust[0].customer_name);
            $("#emailid").val(json.getCust[0].email);
            $("#gender").val(json.getCust[0].gender);
            $("#hidden_ctype").val("oldcust");
          }else{
            alert("new registration here");
            $(".item-floating-label").css('display','block');      
            $("#cust_name").val('');
            $("#emailid").val('');
            $("#gender").val('');
            $("#hidden_ctype").val("newcust");
            //var signupForm = $(".signupForm").serialize();
            //var url=base_url+'appcontroller/registerCustomer';
          }
      }
    });
  }
}
// ---------------------------- SIGNUP : S E N D  O T P  &  P A S S W O R D ---------------------------- //
function sendingPassOTP(){ 
  checkConnection();
  if (!$$('#signupForm')[0].checkValidity()) { 
       // alert('Check Validity!');
       // console.log('Check Validity!');
  }else{
    var sess_city = window.localStorage.getItem("session_city");
    var mob_number = $("#mob_number").val();
    var hidden_ctype=$("#hidden_ctype").val();     
    var url=base_url+'appcontroller/getPassOTP';
    if(hidden_ctype == 'newcust'){
      var signupForm = $(".signupForm").serialize();
      var url=base_url+'appcontroller/registerCustomer'; 
      $.ajax({
        'type':'POST', 
        'url':url,
        'data':signupForm,
        success:function(response){ 
          console.log(response);
          if(response){
            console.log(response);
            window.localStorage.setItem("reg_custid",response.trim());
            app.router.navigate('/verifyotp/');
          }
        }
      });
    }/*else{
            app.router.navigate('/verifyotp/');
    } */
    else if(hidden_ctype == 'oldcust'){
      var emailid = $("#emailid").val();
      var sess_city = window.localStorage.getItem("session_city");
      var mob_number = $("#mob_number").val();
      var hidden_ctype=$("#hidden_ctype").val();     
      var url=base_url+'appcontroller/getPassOTP';
      $.ajax({
        'type':'POST', 
        'url':url,
        'data':{'mob_number':mob_number,'city':sess_city,'emailid':emailid},
        success:function(response){ 
          console.log(response);
          if(response){           
            app.router.navigate('/verifyotp/');
          }
        }
      });
    }
  }
}  
function changePwd(){
  $("#success-badge").css("display","none");
  app.router.navigate('/changepwd/');  
}
function BookRide(){
  app.router.navigate('/bookride/');  
}
$$(document).on('page:init', '.page[data-name="changepwd"]', function (e) {
  checkConnection();
  $(".match-text").css("display",'none');
  $(".unmatch-text").css("display",'none');
  var sess_city=window.localStorage.getItem("session_city");
  var sess_mobilenum = window.localStorage.getItem("session_mobilenum");  
  var session_custid = window.localStorage.getItem("session_custid");
  if(sess_mobilenum!=''){    
    $(".mobile_no").val(sess_mobilenum); 
  }
  if(sess_city!=''){    
    $(".hidden_city").val(sess_city); 
  }
  if(session_custid!=''){    
    $(".hidden_cid").val(session_custid); 
  }
  $("#retype_pwd").keyup(validate);
});
function validate() {
  var password1 = $("#new_pwd").val();
  var password2 = $("#retype_pwd").val();
  if(password1 == password2) {
    $(".unmatch-text").css("display",'none');
    $(".match-text").css("display",'block');
    $(".match-text").text("Passwords match.");        
  }
  else{
    $(".match-text").css("display",'none');
    $(".unmatch-text").css("display",'block');
    $(".unmatch-text").text("Passwords do not match!");  
  }    
}
function changePass(){
  var changePwdForm = $(".changePwdForm").serialize();
  var sess_city=window.localStorage.getItem("session_city");
  var url=base_url+'appcontroller/changePassWord';
  $.ajax({
    'type':'POST', 
    'url':url,
    'data':changePwdForm,
    success:function(response){ 
      var res=response.trim();
      if(res){
        if(res == 'updated'){
          app.dialog.alert("Password changed successfully."); 
        }else if(res == 'wrongoldpwd'){
          app.dialog.alert("Entered OldPassword is incorrect.");
        }
      }
    }
  }); 
  $("#old_pwd").val('');
  $("#new_pwd").val('');
  $("#retype_pwd").val('');
  $(".match-text").css("display",'none');
  $(".unmatch-text").css("display",'none');
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
  var city = sess_city.trim();
  var url=base_url+'appcontroller/verifiOTP';
  $.ajax({
      'type':'POST',  
      'url':url,
      'data':{'otp':otp,'city':city,'sess_cust':sess_cust},
      success:function(response){ 
        console.log(response);
        var res = response.trim();
        if(res=='updated'){
          if(window.localStorage.getItem("reg_custid")!=null){
            var checkreg_status = base_url+"appcontroller/checkRegStatus";
            $.ajax({
                'type':'POST',  
                'url':checkreg_status,
                'data':{'city':sess_city,'sess_cust':sess_cust},
                success:function(reg_response){
                  var Verified = reg_response.trim();
                  var OTPVerified=window.localStorage.setItem("OTPVerified", Verified);
                  if(sess_cust!=null && Verified == 'Verified'){                    
                    app.dialog.alert("OTP verification is done.Please Login using password sent with OTP.");
                    app.router.navigate('/index/');
                  }else{
                    //alert("no notification");
                  }
                }
            });
          }
          //app.router.navigate('/index/');
        }else if(res == 'wrongotp'){
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
});
// ------------------------------- LOGIN : C H E C K L O G I N ------------------------------- //
function checklogin(){
    checkConnection();
      if (!$$('#loginForm')[0].checkValidity()) { 
       // alert('Check Validity!');
       // console.log('Check Validity!');
      } else { 
        //ajax request here
        var mobile_number = $("#mobile_number").val();
        var form = $(".loginForm").serialize(); 
        var url=base_url+'appcontroller/chklogin';  
        $.ajax({
          'type':'POST',
          'url': url, 
          'data':form, 
          success:function(data){
            //alert(data); 
            //console.log(data);
            var json = $.parseJSON(data);
            var json_res = json.loggedin_user[0];
            if(json_res!=undefined){ 
              window.localStorage.setItem("session_mobilenum",mobile_number);
              //var json = $.parseJSON(data);  
              window.localStorage.setItem("session_custname",json.loggedin_user[0].customer_name);
              window.localStorage.setItem("session_custid",json.loggedin_user[0].id);
              app.router.navigate('/bookride/');
              window.localStorage.removeItem("reg_custid");
              //window.localStorage.removeItem("OTPVerified"); 
            }else{
              app.dialog.alert("Authentication Failed!");
              $(".city").val('');
              $("#mobile_number").val(''); 
              $("#password").val('');
            }
        }
    }); 
       // return false;
  } 
} 
$$(document).on('page:init', '.page[data-name="bookride"]', function (e) {
  checkConnection();
  app.preloader.show();
  var sess_city = window.localStorage.getItem("session_city");
  var sess_mobilenum = window.localStorage.getItem("session_mobilenum");
  var sess_custname = window.localStorage.getItem("session_custname");
  var panel_menus='';  
  panel_menus = '<li class=""><a class="list-button item-link fs-12" href="#" onclick="BookRide()">Book Ride</a></li><li class="" ><a class="list-button item-link panel-close fs-12" href="#" onclick="changePwd()">Change Password</a></li><li class="comprep" ><a class="list-button item-link panel-close fs-12" href="#" onclick="myProfile()">My Profile</a></li><li class="compmonthrep"><a class="list-button item-link panel-close fs-12" href="#" onclick="gotoRideHistory()">Ride History</a></li><li class="" ><a class="list-button item-link panel-close fs-12" href="#" onclick="logOut()">Logout</a></li>';  
  $("#panel_menus").html(panel_menus);
  $("#userCity").html(sess_city);
  $("#userName").html(sess_custname);
  $("#userMo").html('Mob NO : [ '+sess_mobilenum+' ]');
  $(".item-floating-label").css('display','block');
  if(sess_city!=''){
    $("#city option[value="+sess_city+"]").attr("selected","selected");
  }
  if(sess_mobilenum!=''){
    $("#mobile_no").val(sess_mobilenum); 
  }  
  
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
  var url=base_url+'appcontroller/getAll_Location';
  $.ajax({
      'type':'POST', 
      'url':url,
      'data':{'city':sess_city},
      success:function(loc_Res){ 
        var json_array = $.parseJSON(loc_Res);
        var json_locarr = json_array.locations;
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
  var url_vtype = base_url+'appcontroller/getAll_vehclass';
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
          var vhclassid=json_vclassarr[j].id;
          var vehclass=json_vclassarr[j].celcabs_class_name;
          if(vehclass=='Comfort'){
            vehclass='Sedan';
          }else if(vehclass=='SUV'){
            vehclass='MUV';
          }
          vclassdata +='<option value='+vhclassid+'>'+vehclass+'</option>';
          $('#vehclass').html(vclassdata);
          app.preloader.hide();
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
        //console.log(stepper.value);
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
          /*if(sel_vclass == 2 || sel_vclass == 4){
            // 2 = Sedan - OLD // 
            // 4 = Economy - OLD //    

            var max_seats = 4; // mulitple of 4 //
            if(passengers > max_seats){
              var veh = passengers / max_seats;
              var veh_float = veh.toFixed(2);
              var res = veh_float.split(".",2);
              var aftr_dec = res[1];alert(aftr_dec);
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
            // 3 = MUV - OLD //
            var max_seats = 6; // multiple of 6 //
            if(passengers > max_seats){
              var veh = passengers / max_seats;
              var veh_float = veh.toFixed(2);
              var res = veh_float.split(".",2);
              var aftr_dec = res[1];alert(aftr_dec);
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
          }*/
          if(sel_vclass==3 || sel_vclass==2){
          	// 3 - Sedan //
          	// 2 - Economy //
          	console.log("Sedan - Economy");
          	var max_seats = 4; // mulitple of 4 //
          	if(passengers > max_seats){
          		var veh = passengers / max_seats;
          		var veh_float = veh.toFixed(2);
          		var res = veh_float.split(".",2);              	
              	var bfr_dec = res[0];
              	var aftr_dec = res[1];
              	if(aftr_dec > 0){
              		var final_veh= parseInt(bfr_dec);
                	final_veh = final_veh + 1;
              	}else{
              		var final_veh= parseInt(bfr_dec);
              	}
              	$("#veh_count").val(final_veh);
          	}else{    
          		$("#veh_count").val(1);      		
          	}
          }else if(sel_vclass==4){
          	// 4 - MUV //
          	console.log("MUV");
          	var max_seats = 6; // multiple of 6 //
          	if(passengers > max_seats){
          		var veh = passengers / max_seats;
          		var veh_float = veh.toFixed(2);
          		var res = veh_float.split(".",2);
              	var bfr_dec = res[0];
              	var aftr_dec = res[1];
              	if(aftr_dec > 0){
              		var final_veh= parseInt(bfr_dec);
                	final_veh = final_veh + 1;
              	}else{
              		var final_veh= parseInt(bfr_dec);
              	}
              	$("#veh_count").val(final_veh);
          	}else{ 
          		$("#veh_count").val(1);         		
          	}
          }
        }
      }
    }
  })  
});
// -------------------------------------- B O O K  R I D E --------------------------------------------//
function bookmyride(){
  checkConnection(); 
  if (!$$('#bookRide')[0].checkValidity()) { 
       // alert('Check Validity!');
       // console.log('Check Validity!');
  }else{
    app.router.navigate('/ridehistory/');
    //var sess_city = window.localStorage.getItem("session_city");
    var sess_cust = window.localStorage.getItem("session_custid");
    var sess_mobilenum = window.localStorage.getItem("session_mobilenum");
    var bookRideForm=$(".bookRide").serialize();
    var city = $("#city").val();
    var postdata=bookRideForm+'&city='+city+'&sess_cust='+sess_cust+'&sess_mobilenum='+sess_mobilenum;
    var url = base_url+'appcontroller/bookMyRide';
    $.ajax({
          'type':'POST', 
          'url':url,
          //'dataType':'json',
          'data':postdata,
          //'data':{'city':city,'sess_cust':sess_cust,'sess_mobilenum':sess_mobilenum},
          success:function(data){      
            if(data=='inserted'){
              $('#bookRide')[0].reset();
                app.dialog.alert("Ride booked successfully",function (){
                  app.router.navigate('/ridehistory/');
              });
            }
          }
    });
  }
}
$$(document).on('page:init', '.page[data-name="ridehistory"]', function (e) {
  checkConnection();
  var i=0;
  if(i==0){
    rideHistoryPage();
  }
  i++; 
  //setInterval(function(){
  //  rideHistoryPage();
  //},5000); 
});
function rideHistoryPage(){
  checkConnection();
  var sess_city = window.localStorage.getItem("session_city");
  var sess_cust = window.localStorage.getItem("session_custid");
  var sess_mobilenum = window.localStorage.getItem("session_mobilenum");
  var upcoming_booking_url=base_url+"appcontroller/upcoming_rides";
  var droped_cust_url=base_url+"appcontroller/dropedcusturl";
  $.ajax({
      'type':'POST', 
      'url':upcoming_booking_url,
      'data':{'city':sess_city,'sess_cust':sess_cust,'sess_mobilenum':sess_mobilenum},
      success:function(response){ 
        if(response){  
          var upcomingride_json_array = $.parseJSON(response);
          var json_upcmride = upcomingride_json_array.upcomingrides;
          console.log("json_upcmride-------"+upcomingride_json_array) 
          var upcmridedata='';
          $(".tab-1").append('<span class="bgstyle badge color-green">'+json_upcmride.length+'</span>');
          for(var i=0;i<json_upcmride.length;i++){
            var booking_dt=json_upcmride[i].booking_dt;
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
            var at_pickup_id=json_upcmride[i].at_pickup_id;
            var pass_pkup=json_upcmride[i].pass_pkup;

            if(terminated_id==null && status_id == call_status_id) {
             //var pnrno=json_upcmride[i].id; // OLD //
             var pnrno=json_upcmride[i].celcabs_pickup_id; // NEW //
              var driver_detbtn="<button onclick='getDriver("+pnrno+","+sess_cust+")' class='col button button-small button-outline fs-8 text-drvdet-btn fs-8 border-drvdet-btn drvbtn ml-20 login-screen-open' data-login-screen='.login-screen'>DRIVER DETAILS</button>";
            }else{
              //var driver_detbtn='<span class="text-capitalize fs-10 text-bold text-grey"><em>Driver not assigned.</em></span>';
              var driver_detbtn='';
            }
            if(status_id==null && call_status_id == terminated_id){ 
              //var pnrno=json_upcmride[i].id; // OLD //
             var pnrno=json_upcmride[i].celcabs_pickup_id; // NEW //
              var payment_btn="<button onclick='getPayment("+pnrno+","+sess_cust+")' class='col button button-small button-outline fs-8 text-payment-btn fs-8 border-payment-btn pymntbtn ml-20 login-screen-open link popup-open' data-popup='.popup-payment'>PAYMENT DETAILS</button>";
              //var payment_btn="<button onclick='getPayment("+pnrno+","+sess_cust+")' class='col button button-small button-outline fs-8 text-drvdet-btn fs-8 border-drvdet-btn drvbtn ml-20 login-screen-open' data-login-screen='.login-screen'>PAYMENT DETAILS</button>";
            }else{
              //var driver_detbtn='<span class="text-capitalize fs-10 text-bold text-grey"><em>Driver not assigned.</em></span>';
              var payment_btn='';
            }
            if(terminated_id==null && status_id == null && at_pickup_id == call_status_id){
              var at_pickupbtn='<div class="doorstep"><span class="col button button-small button-outline fs-8 border-atpkup-btn atpkup ml-20 color-orange button-fill">Driver at doorstep</span></div>';
              setInterval(function(){
                $('.doorstep').fadeOut(600);
                $('.doorstep').fadeIn(600);
              },1000);
            }else{
              var at_pickupbtn='';
            }
            
            if(status_id==null && terminated_id==null && at_pickup_id==null && call_status_id == pass_pkup){
              var pass_pickup='<div class="passpkup"><span class="col button button-small button-outline fs-8 border-atpkup-btn atpkup ml-20 color-green button-fill">On going ride</span></div>';
              setInterval(function(){
                $('.passpkup').fadeOut(600);
                $('.passpkup').fadeIn(600);
              },1000);             
            }else{
              var pass_pickup='';
            }             
            //upcmridedata+='<li><a href="#" class="item-link item-content"><div class="item-media"><img src="img/cabs/taxi3.png" height="60" width="50"></div><div class="item-inner"><div class="item-title"><div class="item-header text-left">Ride Dt:'+booking_dt+" "+booking_tm+'</div>| John Doe</div><div class="item-after">Edit</div></div></a></li>';
            upcmridedata+='<li id="ongoing"><a href="#" class="item-link item-content"><div class="item-media"><img src="img/cabs/taxi3.png" height="50" width="40" class="img img1"><button class="col button button-small button-outline text-pink fs-8 border-pink pinkbtn img2">SCHEDULED</button></div><div class="item-inner"><div class="item-title"><div class="item-header text-left"><i class="f7-icons color-black fs-12 mr-5 ml-3">calendar</i>'+rpt_dt+'</div><img src="img/cabs/from.png" height="20" width="23" class="mr-5 mt-5"><span class="fs-12">'+from_location+" ,"+from_city+'</span><br/><img src="img/cabs/mapmarker4.png" height="20" width="23" class="mr-5 mt-5"><span class="fs-12">'+to_location+" ,"+to_city+'</span><br/>'+driver_detbtn+" "+payment_btn+" "+at_pickupbtn+" "+pass_pickup+'</div><div class="item-after"><!--button class="col button button-small button-outline text-pink fs-8 border-pink pinkbtn">SCHEDULED</button--></div><div class="item-after fs-12"><i class="f7-icons color-black fs-12 mr-5 mt-5">time</i>'+rpt_tm+'</div></div></a></li>'; 
             $("#upcomigrides").html(upcmridedata);
          }
          //window.localStorage.setItem("reg_custid", response);
          //app.router.navigate('/verifyotp/');
        }
      }
    });    

    var past_booking_url=base_url+"appcontroller/past_rides";
    $.ajax({
      'type':'POST', 
      'url':past_booking_url,
      'data':{'city':sess_city,'sess_cust':sess_cust,'sess_mobilenum':sess_mobilenum},
      success:function(past_response){ 
        if(past_response){
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
            pstridedata+='<li><a href="#" class="item-link item-content"><div class="item-media"><img src="img/cabs/taxi3.png" height="50" width="40" class="img img1"><button class="col button button-small button-outline text-green fs-8 border-green greenbtn img2">COMPLETED</button><!--img src="img/cabs/finished-red.png" height="50" width="40" class="img img2"--></div><div class="item-inner"><div class="item-title"><div class="item-header text-left"><i class="f7-icons color-black fs-12 mr-5 ml-3">calendar</i>'+booking_dt+'</div><img src="img/cabs/from.png" height="20" width="23" class="mr-5 mt-5"><span class="fs-12">'+from_location+" ,"+from_city+'</span><br/><img src="img/cabs/mapmarker4.png" height="20" width="23" class="mr-5 mt-5"><span class="fs-12">'+to_location+" ,"+to_city+'</span></div><div class="item-after fs-12 ml-8 text-bold">'+fare+'</div><div class="item-after btime fs-12 ml-8"><i class="f7-icons color-black fs-12 mr-5 mt-p-3">time</i>'+booking_tm+'</div></div></a></li>';  
              $("#pastrides").html(pstridedata);
          }
          //window.localStorage.setItem("reg_custid", response);
          //app.router.navigate('/verifyotp/');
        }
      }
    });
}
function getPayment(pnrno,sess_cust){
  var sess_city = window.localStorage.getItem("session_city");
  var sess_cust = window.localStorage.getItem("session_custid");
  var sess_mobilenum = window.localStorage.getItem("session_mobilenum");
  var payment_url=base_url+"appcontroller/paymentDet";
  $.ajax({ 
    'type':'POST', 
    'url':payment_url,
    'data':{'city':sess_city,'sess_cust':sess_cust,'sess_mobilenum':sess_mobilenum,'pnr':pnrno},
    success:function(pay_response){
      var pymnt_array = $.parseJSON(pay_response);
      console.log(pay_response)
      var json_payment = pymnt_array.paymentdet;
      var from_location=json_payment[0].pickup_area;
      var from_city=json_payment[0].pickup_city;
      var to_location=json_payment[0].drop_area;
      var to_city=json_payment[0].drop_city;
      var actual_collection=json_payment[0].actual_collection;
      var booking_dt=json_payment[0].booking_dt;
      var booking_tm=json_payment[0].booking_time;
      var paydet='';
      paydet='<center><li class="item-content item-input"><div class="item-inner"><div class="item-input-wrap item-input-wrap text-pink text-uppercase letterspace fs-14 lh-30 text-bold">booking dt : '+booking_dt+'</div></div></li><li class="item-content item-input"><div class="item-inner"><div class="item-input-wrap item-input-wrap text-pink text-uppercase letterspace fs-14 lh-30 text-bold">booking time : '+booking_tm+'</div></div></li><li class="item-content item-input"><div class="item-inner"><div class="item-input-wrap item-input-wrap text-pink text-uppercase letterspace fs-14 lh-30 text-bold">PICK UP : '+from_location+", "+from_city+'</div></div></li><li class="item-content item-input"><div class="item-inner"><div class="item-input-wrap item-input-wrap text-pink text-uppercase letterspace fs-14 lh-30 text-bold">DROP OF : '+to_location+", "+to_city+'</div></div></li><li class="item-content item-input"><div class="item-inner"><div class="item-input-wrap item-input-wrap text-pink text-uppercase letterspace fs-14 lh-30 text-bold">Total amount : '+actual_collection+'</div></div></li></center>';
      $('.paymentdet').html(paydet);
    }
  });
}
function getDriver(pnrno,sess_cust){
  var sess_city = window.localStorage.getItem("session_city");
  var pushnotification_url = base_url+"appcontroller/send_enroute_push";
  var driverdetail_url = base_url+"appcontroller/getDriverdetail";
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
            var json_drvmob = push_drv_array.driver_mob;//alert("****"+json_drvmob);
            var driver_name=json_drvrno[0].driver_name;
            var vid = json_drvrno[0].celcabs_vehicle_id;//alert(vid);
            var vehicle_no = json_drvrno[0].license_plate;
            var driver_photo =  json_drvrno[0].driver_photo;
            var driver_mobile = json_drvmob[0].alt_phone_number;
            //var driver_mobile ='9624658122';
            //var driver_mobile = '1111111111'; // dummy //
              if(driver_mobile!='' && driver_mobile!=undefined){
                var mob_driver = driver_mobile;
              }else{
                var mob_driver = '';
              }
              if(driver_photo!=null && driver_photo!=undefined){
              var split_drvpic=driver_photo.split("/");
              //alert("split_drvpic"+split_drvpic[0]+"****"+split_drvpic[1]);
              if(split_drvpic[1]==''){ // no photo found. //                
                var d_pictr='<div class="row center"><div class="col-100 tablet-33"><center><img src="img/cabs/male-circle-512.png" class="ml-100"  width=150 ></center></div></div>';
              }else{ // photo found. //                
                var d_pictr='';
              }
            }else{
              var d_pictr='<div class="row center"><div class="col-100 tablet-33"><center><img src="img/cabs/male-circle-512.png" class="ml-100"  width=150 ></center></div></div>'; // dummy pic //
              //var d_pictr='';
            }
              dt1 = new Date(todaydate); 
              dt2 = new Date(pickdt);
              var approx_ETA=diff_minutes(dt1, dt2);
              var driver_info = d_pictr+'<center><li class="item-content item-input"><div class="item-inner"><div class="item-input-wrap item-input-wrap text-pink text-uppercase letterspace fs-14 lh-30 text-bold">'+driver_name+'</div></div></li><li class="item-content item-input"><div class="item-inner"><div class="item-input-wrap text-pink text-uppercase letterspace fs-14 lh-30">vid: '+vid+'</div></div></li><li class="item-content item-input"><div class="item-inner"><div class="item-input-wrap text-pink text-uppercase letterspace fs-14 lh-30">mob: '+mob_driver+'</div></div></li><li class="item-content item-input"><div class="item-inner"><div class="item-input-wrap text-pink text-uppercase letterspace fs-14 lh-30">vehicle: '+vehicle_no+'</div></div></li><li class="item-content item-input"><div class="item-inner"><div class="item-input-wrap text-pink text-uppercase letterspace fs-14 lh-30">approx. eta: '+approx_ETA+' min</div></div></li><li class="item-content item-input"><div class="item-inner"><div class="item-input-wrap text-pink text-uppercase letterspace fs-14 lh-30"><a href="#" class="col button color-signup text-white no-radius mt-p-5 new-wd" onclick="call_driver('+"'"+mob_driver+"'"+')">CALL DRIVER</a></div></div></li></center></div>';
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
function timeConvert(n){
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
function myProfile(){
  checkConnection();
  app.router.navigate('/profile/'); 
}
$$(document).on('page:init', '.page[data-name="profile"]', function (e) {  
  checkConnection(); 
  var sess_city = window.localStorage.getItem("session_city");
  var session_custid = window.localStorage.getItem("session_custid"); 
  var session_mobilenum = window.localStorage.getItem("session_mobilenum");
    var url=base_url+'appcontroller/getCustinfo';
    $.ajax({
      'type':'POST', 
      'url':url,
      'data':{'session_custid':session_custid,'city':sess_city},
      success:function(response){ 
        var json = $.parseJSON(response); 
        var json_arr = json.getCustinfo[0];
        console.log(json_arr);
        //if(response!=''){
          if(json_arr!=undefined){              
            $(".item-floating-label").css('display','none');  
            $("#mob_number").val(session_mobilenum);    
            $("#cust_name").val(json.getCustinfo[0].customer_name);
            if(json.getCustinfo[0].email!=null || json.getCustinfo[0].email!=undefined){
             $("#emailid").val(json.getCustinfo[0].email);
            }else{
              $("#emailid").show();
            }
            $("#gender").val(json.getCustinfo[0].gender);      
            $("#hidden_cid").val(json.getCustinfo[0].id);      
          }else{
            //console.log("new registration here");
            $(".item-floating-label").css('display','block');  
            $("#mob_number").val('');    
            $("#cust_name").val('');
            $("#emailid").val('');
            $("#gender").val('');           
          }
      }
    });
});
// -------------------------------- U P D A T E  P R O F I L E ------------------------------ //
function updateProfile(){
  var sess_city = window.localStorage.getItem("session_city");
  var hidden_cid = $("#hidden_cid").val();
  var cust_name = $("#cust_name").val();
  var gender = $("#gender").val();
  var emailid = $("#emailid").val();
  var updt_url=base_url+'appcontroller/updateCustinfo';
  $.ajax({
    'type':'POST', 
    'url':updt_url,
    'data':{'hidden_cid':hidden_cid,'city':sess_city,'cust_name':cust_name,'gender':gender,'emailid':emailid},
    success:function(response){ 
      var trimed =response.trim();
      if(trimed=='updated'){
        app.dialog.alert("Profile Updated successfully!");
      }
    }
  });
  app.router.navigate('/ridehistory/'); 
}
// -------------------------------- L O G O U T ------------------------------ //
function logOut(){
  checkConnection();
  window.localStorage.removeItem("session_city"); 
  window.localStorage.removeItem("session_custid"); 
  window.localStorage.removeItem("session_custname"); 
  window.localStorage.removeItem("session_mobilenum");
  window.localStorage.removeItem("OTPVerified");
  app.router.navigate('/index/');
}