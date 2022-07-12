addBodyHtml()
vinreport();




function vinReportBtn() {


  // let headers = new Headers();
  // headers.set('Authorization', 'Basic ' + btoa(username + ":" + password));
  //headers.set('Content-Type', "application/x-www-form-urlencoded");

  const url = vinReportDomain() + "/vinreport-ext"  //https://thevinreport.com/
  const vin = getVIN();
  const token = getToken()
  // if (!token) {
  //   document.querySelectorAll("#vinreport-body .tablinks")[1].click()
  //   document.getElementById("vinreport-account-message").innerHTML = "Please Enter your VinReport credential!"
  //   return false; 
  // }
  const email = '';
  var status;

  fetch(url,
    {
      method: "POST",
      credentials: 'include',
      body: `username=${username}&password=${password}&email=${email}&vin=${vin}`,
      headers: {
        'Content-Type': "application/x-www-form-urlencoded",
        'x-vinreport-token' : token
       // 'Authorization': 'Basic ' + btoa(username + ":" + password)
      }
    }).then(response => {
      status = response.status
      response.text().then(re => {
        if (status == 401 || status == 403) {
          document.getElementById("vinreport-account-message").innerHTML = "Wrong credential or session expired. Please re-login!"    ;
          localStorage.removeItem("vinreport-token")     
          document.querySelectorAll("#vinreport-body .tablinks")[1].click()

        } else if (status == 302 || status == 405) {
          document.getElementById("vinreport-report-message").innerHTML = JSON.parse(re).message 
          localStorage.removeItem("vinreport-token")   

        } else {
          let params = [
            'toolbar=no',
            'location=no',
            'resizable=yes',
            'height=' + screen.height,
            'width=' + screen.width,
            'fullscreen=yes' // only works in IE, but here for completeness
          ].join(',');
  
          var win = window.open('', "Report", params);
          win.document.write(JSON.parse(re).pagedata);
        }
      })
    })

}

function vinReportSignInBtn(){
  const url = vinReportDomain() + "/signin-ext"  //https://thevinreport.com/
  const username = document.getElementById("username").value
  const password = document.getElementById("password").value
  if (username.trim() == '' || password.trim() == '')
          {
           // document.querySelectorAll("#vinreport-body .tablinks")[1].click()
            document.getElementById("vinreport-account-message").innerHTML = "Please Enter your VinReport credential!"
            return false;
          }
  localStorage.setItem("vinreport-username", username)
  localStorage.setItem("vinreport-password", password)
  let status = ""
  const body = JSON.stringify({
    username: username,
    password: password,
  })

  fetch(url,
    {
      method: "POST",
      body: body,
      headers: {
        "Content-Type": "application/json",
      }
    }).then(response => response.json())
      .then(data=>{
        if (Number(data.status) == 403 ) {
          document.getElementById("vinreport-account-message").innerHTML = data.message     ;
          localStorage.removeItem("vinreport-token")     
        } else {
          localStorage.setItem("vinreport-token", data.token)
          document.getElementById("vinreport-account-message").innerHTML = '<span style="color:green"> Sucessfully logged in </span>  ' 
          vinreport();
        }
      })
   
  
}

function getMileage() {
  const index = Array.from(document.querySelectorAll(".tile-body .data-list__item .data-list__label")).findIndex(e => e.innerHTML.indexOf("Odometer") > -1)
  const mileageInnerText = document.querySelectorAll(".tile-body .data-list__item")[index].getElementsByClassName("data-list__value")[0].innerText
  return Number(mileageInnerText.match(/\d+/g).join(""));
}

function vinreport() {
  const year_make_model = document.querySelector(".vehicle-header h1").innerHTML.split(" ")
  const year = year_make_model[0]
  const make = year_make_model[1]
  const model = year_make_model[2]

  getAuctionBid(year, make, model, getMileage())
  getCarTrim(getVIN())
  vinreport_getAuctionHistory();

}