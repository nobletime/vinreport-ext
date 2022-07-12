function vinReportDomain() { return 'https://autocheckreport.azurewebsites.net' }
function getToken(){  return localStorage.getItem("vinreport-token")}


function getVIN() {
  //const vin = Array.from(document.querySelectorAll(".tile-body .data-list__item .data-list__label")).findIndex(e => e.innerHTML.indexOf("VIN") > -1)
  if (!document.getElementById("VIN_VehInfo")){
    document.getElementById("vinreport-account-message").innerHTML = "You have to be logged into your IAAI buyer account and have a VinReport account to use this!"
return document.querySelectorAll("#vinreport-body .tablinks")[1].click()
}

  if (document.getElementById("VIN_VehInfo").innerHTML != '')
    return document.getElementById("VIN_VehInfo").innerHTML

  if (document.getElementById("VIN_vehicleStats1")) {
    const vinSpan = document.getElementById("VIN_vehicleStats1").parentNode.getElementsByTagName("span")[1].innerHTML
    if (vinSpan.indexOf(" ") > -1)
      return vinSpan.split(" ")[0]
  else 
  return vinSpan.split("(")[0]

  }
}



function getAuctionBid(year, make, model, mileage) {

  const acution_bid_url = vinReportDomain() + `/auctionbid-ext/${year.trim()}/${make.trim()}/${model.trim()}/${mileage}`

  fetch(acution_bid_url,
    {
      method: "GET",
      headers:
      {
        "Content-Type": "application/json",
        'x-vinreport-token': getToken()
      }
    }).then(response => response.json())
    .then(bid => {
      document.getElementById('vinreport-avgbid').innerHTML = bid
    });
}

function getCarTrim(vin) {

  fetch(`${vinReportDomain()}/get-trims-ext/${vin}`,
    {
      method: "GET",
      headers:
      {
        "Content-Type": "application/json",
        'x-vinreport-token': getToken()
      }
    }).then(response => response.json())
    .then(trims => {

      let select = '<select id="trimstyle" class="form-select" aria-label="Default select example" style="border: 1px solid green; font-size:15px;  width: 100%; text-overflow: ellipsis; ">'
      const firsttrim = trims[0].styleId

      trims.forEach(e => {
        select = select + ` <option value="${e.styleId}">${e.styleName}</option>`
      });

      select = select + '</select>'

      document.querySelector('#car-trim').innerHTML = select
      document.querySelector("#car-trim #trimstyle").addEventListener("change", function (e) {
        e.preventDefault();
        chooseTrim(e)
      });

      getAppraisal(firsttrim, getMileage())

    });
}


function chooseTrim(e) {
  document.getElementById('retail-value').innerHTML = '<div class="spinner-border text-success" id="downloading-spinner"></div>'
  document.getElementById('private-party').innerHTML = `<div class="spinner-border text-success" id="downloading-spinner"></div>`
  document.getElementById('trade-in').innerHTML = `<div class="spinner-border text-success" id="downloading-spinner"></div>`

  getAppraisal(e.currentTarget.value, getMileage())
}


function getAppraisal(styleid, mileage) {
  fetch(vinReportDomain() + `/appraisal-ext/${styleid}/${mileage}`,
    {
      method: "GET",
      headers:
      {
        "Content-Type": "application/json",
        'x-vinreport-token': getToken()
      }
    }).then(response => response.json())
    .then(appraisal => {

      const retail = appraisal.tmvconditions.AVERAGE.Current.nationalBasePrice.usedTmvRetail +
        appraisal.tmvconditions.AVERAGE.Current.regionalAdjustment.usedTmvRetail +
        appraisal.tmvconditions.AVERAGE.Current.mileageAdjustment.usedTmvRetail

      const privateparty = appraisal.tmvconditions.AVERAGE.Current.nationalBasePrice.usedPrivateParty +
        appraisal.tmvconditions.AVERAGE.Current.regionalAdjustment.usedPrivateParty +
        appraisal.tmvconditions.AVERAGE.Current.mileageAdjustment.usedPrivateParty

      const tradein = appraisal.tmvconditions.AVERAGE.Current.nationalBasePrice.usedTradeIn +
        appraisal.tmvconditions.AVERAGE.Current.regionalAdjustment.usedTradeIn +
        appraisal.tmvconditions.AVERAGE.Current.mileageAdjustment.usedTradeIn

      // const  outstanding =      appraisal.tmvconditions.OUTSTANDING.Current.nationalBasePrice.usedTmvRetail + 
      //                           appraisal.tmvconditions.OUTSTANDING.Current.regionalAdjustment.usedTmvRetail + 
      //                           appraisal.tmvconditions.OUTSTANDING.Current.mileageAdjustment.usedTmvRetail;

      // const  rough =      appraisal.tmvconditions.ROUGH.Current.nationalBasePrice.usedTmvRetail + 
      // appraisal.tmvconditions.ROUGH.Current.regionalAdjustment.usedTmvRetail + 
      // appraisal.tmvconditions.ROUGH.Current.mileageAdjustment.usedTmvRetail;

      document.getElementById('retail-value').innerHTML = `$${retail.toLocaleString()}`
      document.getElementById('private-party').innerHTML = `$${privateparty.toLocaleString()}`
      document.getElementById('trade-in').innerHTML = `$${tradein.toLocaleString()}`
    });
}

function vinreport_delAuctionHistory(e){
  // ${vinReportDomain()}/delete-car-auctionhistory?id=${carbody.id}
const id =e.currentTarget.id.substring(e.currentTarget.id.lastIndexOf("-")+1)
let elem = e.currentTarget;

 fetch(`${vinReportDomain()}/del-auctionhistory-ext`,
 {
  method: "POST",
  body: JSON.stringify({id:id}),
  headers: {
    'Content-Type': "application/json",
    'x-vinreport-token': getToken()
  }
 }).then(response => response.json())
 .then(data => {
  if (data.message == 'deleted')
  elem.parentElement.parentElement.remove()

 })

}

function vinreport_addAuctionHistory() {

  const auctionDateTag = Array.from(document.querySelectorAll(".data-list.data-list--details .data-list__item .data-list__label")).find(e => e.innerHTML.indexOf("Auction Date") > -1)
  if (!auctionDateTag.parentElement.querySelector("a")) {
   document.getElementById("vinreport-report-message").innerHTML = "Vehicle cannot be added. Only vehicles with an assigned auction dates can be added to final bid list"
   document.querySelector("#vinreport-reportTab").click();
    return false;
  }
  const auction_date = new Date(auctionDateTag.parentElement.querySelector("a").textContent.split(",")[0] + " " + new Date().getFullYear())

  const car = {
    'username': document.querySelector("#vinreport-body #username").value.toLowerCase(),
    'vin': getVIN(),
    'thumbnail': document.querySelectorAll("#spacedthumbs1strow img")[0].src,
    'stockNum': document.querySelectorAll(".tile-body .data-list__item .data-list__value")[0].innerText,
    'carname': document.querySelector(".vehicle-header h1").innerHTML,
    'url' : window.location.href,
    'mileage': getMileage(),
    'auction_date' : auction_date
  }


  const url = vinReportDomain() + "/add-auction-history"
  const token = getToken()

  const header = (document.querySelector("#vinreport-body  #auction-history-header")) ?
    ``
    :
    `<div id="auction-history-header" class="list-view list-shadow">
                <div class="list-row list-header">
                    <div class="list-item list-img">
                        &nbsp;
                    </div>
                    <div class="list-item">
                        <h6>Vehicle</h6>
                    </div>
                    <div class="list-item">
                        <h6>Sale Info</h6>
                    </div>
                </div>
                </div>
                `

  fetch(url,
    {
      method: "POST",
      body: JSON.stringify(car),
      headers: {
        'Content-Type': "application/json",
        'x-vinreport-token': token
      }
    }).then(response => response.json())
    .then(data => {
      const car = data.car;

      const car_row = `
<div id="${car.id}" class="list-row preSaleScan" style="font-size: 13px;">

    <div class="list-item list-img row-space">

            <input type="hidden" id="hdnItemIdForWatch" value="44843957">
            
        <a href="${ car.url}">
       
                    <img data-original="${car.thumbnail}" height="72" width="96" onerror="this.onerror = null; this.src = '../Images/noimageavl.gif';" class="lazy" src=" ${car.thumbnail}" style="display: inline;">
        </a>

        <button type="button" class="btn btn-sm btn-primary btn-block auctionhistory-delete" id="delete-car-${car.id}" >
            Delete</button>

    </div>
    <div class="list-item row-space">
        <ul>
                <li><a href="${ car.url}" name="32877167">${car.carname}</a></li>
            
            <li>
                Stock#: ${car.stockNum}
                    <input type="hidden" value="32877167" id="JumpHere">
            </li>
            <li class="vin">VIN: ${car.vin}</li>
                <li>${car.mileage} mi </li>
        </ul>
    </div>
    <div class="list-item row-space">
    Pending
    </div>
    
</div> 
`


      if (header == "") {
        document.getElementById("auction-history-header").innerHTML = document.getElementById("auction-history-header").innerHTML + car_row

      } else {
        document.getElementById("vinreport-auction-history").innerHTML = header
        document.getElementById("auction-history-header").innerHTML = document.getElementById("auction-history-header").innerHTML + car_row
      }
    
      document.querySelector(`#vinreport-body #delete-car-${car.id}`).onclick = vinreport_delAuctionHistory(car.id)


    })
}


function vinreport_getAuctionHistory() {
  const usernme = document.querySelector("#vinreport-body #username").value.toLowerCase();
  const url = vinReportDomain() + "/get-auction-history/" + usernme
  const token = getToken()

  document.getElementById("vinreport-auction-history").innerHTML =
    `<div id="auction-history-header" class="list-view list-shadow">
                <div class="list-row list-header">
                    <div class="list-item list-img">
                        &nbsp;
                    </div>
                    <div class="list-item">
                        <h6>Vehicle</h6>
                    </div>
                    <div class="list-item">
                        <h6>Sale Info</h6>
                    </div>
                </div>
                </div>
                `

  fetch(url,
    {
      method: "GET",
      headers: {
        'Content-Type': "application/json",
        'x-vinreport-token': token
      }
    }).then(response => response.json())
    .then(data => {




      for (const carbody of data) {
        const car = JSON.parse(carbody.body)
        const car_row = `
        <div id="${carbody.id}" class="list-row preSaleScan" style="font-size: 13px;">
        
            <div class="list-item list-img row-space">
        
                    <input type="hidden" id="hdnItemIdForWatch" value="44843957">
                    
                <a href="${car.url || "#"}">
               
                            <img data-original="${car.thumbnail}" height="72" width="96" onerror="this.onerror = null; this.src = '../Images/noimageavl.gif';" class="lazy" src=" ${car.thumbnail}" style="display: inline;">
                </a>

                <button type="button" class="btn btn-sm btn-primary btn-block auctionhistory-delete" id="delete-car-${carbody.id}" >
                Delete</button>
         
            </div>
            <div class="list-item row-space">
                <ul>
                        <li><a href="${car.url || "#"}" name="32877167">${car.carname}</a></li>  
                    <li>
                        Stock#: ${car.stockNum}
                            <input type="hidden" value="32877167" id="JumpHere">
                    </li>
                    <li class="vin">VIN: ${car.vin}</li>
                        <li>${car.mileage} mi </li>
                </ul>
            </div>
            <div class="list-item row-space">
            ${carbody.status}
            </div>
            
        </div> 
        `
        document.getElementById("auction-history-header").innerHTML = document.getElementById("auction-history-header").innerHTML + car_row
      }

      for (const carbody of data) {
      document.getElementById(`delete-car-${carbody.id}`).onclick = vinreport_delAuctionHistory
      }
   
    })
}



function openTab(evt, tabName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";
}


