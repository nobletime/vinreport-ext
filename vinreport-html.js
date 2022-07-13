function addBodyHtml(){
    const vinreport = `
    <div class="tile tile--data" style="marin-top:10px"><div class="tile-header vinreport-title">
    <img id="vinreport-logo" alt="vinreport-logo" style="border-radius:25px; width:40px; border:2px solid black; margin-right:10px">
        <h2 class="data-title">TheVinReport</h2>
      
    </div>

<div class="tile-body" id="vinreport-body"> 

<div class="tab">
    <button class="tablinks" id="vinreport-reportTab" >Report</button>
    <button class="tablinks" >Account</button>   
    <button class="tablinks" >Final Bids</button>
  </div>
  
  <div id="Report" class="tabcontent">
  <div id="vinreport-report-message" style="color:red;
  font-weight:bold; 
  text-align:center; 
  margin: 10px;
  color: red;
  border: 1px solid #e8e8e8;  
  "></div>


  <ul class="data-list data-list--details">     

  <li class="data-list__item">
      <span class="data-list__label">Trim:</span>
      <span class="data-list__value" id="car-trim"></span>
  </li>
  
  <li class="data-list__item">
      <span class="data-list__label">Average Bid:</span>
      <span class="data-list__value"><strong id="vinreport-avgbid"></strong></span>
  </li>
  <li class="data-list__item">
      <span class="data-list__label">Retail Value:</span>
      <img id="vinreport-loading" alt="loading-img" style="width:100px">
      <span class="data-list__value" id="retail-value"></span>
  </li>
  
  <li class="data-list__item">
      <span class="data-list__label">Private Party:</span>
      <span class="data-list__value" id="private-party"></span>
  </li>
  
  <li class="data-list__item">
      <span class="data-list__label">Trade-in Value:</span>
      <span class="data-list__value" id="trade-in"></span>
  </li>
  </ul>
  
  <div style="display:flex;justify-content:center">
  <button type="button" id="vinReportBtn" class="btn btn-md btn-main btn-block" style="width:80%;margin-top:10px" >Autocheck Report</button>
 </div>
 
  </div>
  
  <div id="Account" class="tabcontent">
  <div id="vinreport-account-message" style="color:red;
  font-weight:bold; 
  text-align:center; 
  margin: 10px;
  color: red;
  border: 1px solid #e8e8e8;  
  "></div>
  Username:   <input type="text"  id="username" name="username" placeholder="username" required="" style="width:70%">
  Password: <input id="password" type="password"  name="password" placeholder="password" required="" style="width:70%;margin-top:5px">

  <div style="display:flex;justify-content:center">
  <button type="button" id="vinReportSignInBtn" class="btn btn-md btn-main btn-block" style="width:60%;margin-top:10px" >Sign In</button>
 </div>

 <div style="display:flex;justify-content:center;margin-top:10px">
 <span>Not a member? <a href="https://thevinreport.com/signin#signup" target="_blank" style="color:blue; font-size:18px">Sign up here</a></span>
</div>

  </div>

  <div id="vinreport-auction-history" class="tabcontent" style="display: block; overflow-y: auto; height: 500px;">

  </div>

</div>`

let target = document.querySelector("#dvTransportationDetails") || document.querySelector("#vdActionInfo")  

if (target == null) {
    target = document.querySelectorAll(".tile.tile--data")[3]
};

target.insertAdjacentHTML('beforebegin', vinreport);

 document.getElementById("vinReportBtn").onclick = vinReportBtn 
 document.getElementById("vinReportSignInBtn").onclick = vinReportSignInBtn 
 document.getElementById("vinreport-logo").src = chrome.runtime.getURL("images/page-logo.png");
 document.getElementById("vinreport-loading").src = chrome.runtime.getURL("images/loading.gif");

document.querySelectorAll("#vinreport-body .tab .tablinks")[0].addEventListener("click", function(e) {
    e.preventDefault();
    openTab(e, 'Report')
});

document.querySelectorAll("#vinreport-body .tab .tablinks")[1].addEventListener("click", function(e) {
    e.preventDefault();
    openTab(e, 'Account')
});

document.querySelectorAll("#vinreport-body .tab .tablinks")[2].addEventListener("click", function(e) {
    e.preventDefault();
    openTab(e, 'vinreport-auction-history')
});



document.getElementById("vinreport-reportTab").click();

document.getElementById("username").value = localStorage.getItem("vinreport-username")
document.getElementById("password").value = localStorage.getItem("vinreport-password")


// bind add to auction history to reveal final bids on cars
document.getElementById("btnwatch").addEventListener("click", function(e) {
    e.preventDefault();
    vinreport_addAuctionHistory()
});

//document.getElementById("btnwatch").setAttribute("onclick", document.getElementById("btnwatch").getAttribute("onclick") + ";vinreport_addToWatch()") 

}



