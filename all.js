getLocation();
getweek();
//寫入星期幾
var _date = new Date();
getweek(_date.getDay());
function getweek(d) {
  var str = "";
  if (d == 1) {
    str = "一";
  } else if (d == 2) {
    str = "二";
  } else if (d == 3) {
    str = "三";
  } else if (d == 4) {
    str = "四";
  } else if (d == 5) {
    str = "五";
  } else if (d == 6) {
    str = "六";
  } else if (d == 7) {
    str = "日";
  }
  document.querySelector(".week").textContent = str;
}
//寫入日期
timeData();
function timeData() {
  var _thisDay =
    _date.getFullYear() + "-" + (1 + _date.getMonth()) + "-" + _date.getDate();
  document.querySelector(".date").textContent = _thisDay;
}
//導入資料
getdata();
var data;
function getdata() {
  var xhr = new XMLHttpRequest();
  xhr.open(
    "get",
    "https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json"
  );
  xhr.send();
  xhr.onload = function () {
    data = JSON.parse(xhr.responseText);
    getCity();
  };
}
//抓出縣市
var cityAry = "";
var select = document.querySelector(".select");
var list = document.querySelector(".list");
function getCity() {
  var ary = data.features;
  var str = new Array();
  for (var i = 0; i < ary.length; i++) {
    str[i] = ary[i].properties.county;
  }
  cityAry = [...new Set(str)].filter((d) => d);
  var citystr = "";
  for (var i = 0; i < cityAry.length; i++) {
    citystr += '<option value="' + cityAry[i] + '">' + cityAry[i] + "</option>";
  }
  select.innerHTML = '<option value=“請選擇地區">請選擇地區</option>' + citystr;
}
//抓出區域
select.addEventListener("change", changeList);
var area = document.querySelector(".area");
function changeList(e) {
  var city = e.target.value;
  var ary = data.features;
  var str = new Array();
  for (var i = 0; i < ary.length; i++) {
    if (city == ary[i].properties.county) {
      str[i] = ary[i].properties.town;
    }
  }
  //去除重複
  townAry = [...new Set(str)].filter((d) => d);
  var townstr = "";
  for (var i = 0; i < townAry.length; i++) {
    townstr += '<option value="' + townAry[i] + '">' + townAry[i] + "</option>";
  }
  area.innerHTML = '<option value=“請選擇區域">請選擇區域</option>' + townstr;

}
//show資料
area.addEventListener("change", showdata);
function showdata(e) {
  var area = e.target.value;
  var str = "";
  var ary = data.features;
  for (i = 0; i < ary.length; i++) {
    if (area == ary[i].properties.town) {
      map.setView([ary[i].geometry.coordinates[1], ary[i].geometry.coordinates[0]], 16);
      str +=
        '<li><a href="#" data-lat="'+ary[i].geometry.coordinates[1]+'" data-lng="'+ary[i].geometry.coordinates[0]+'" >'+ary[i].properties.name +'</a><p>地址：' +
        ary[i].properties.address + '/p><p>電話：' +ary[i].properties.phone +'</p><div class="mask"><div class="adultMask"><p><div>成人口罩：</div><div>' +
        ary[i].properties.mask_adult +'</div></p></div><div class="childMask"><p><div>兒童口罩：</div><div>' +ary[i].properties.mask_child +'</div></p></div></div></li>';
    }
    list.innerHTML = str;
  }
}
//取得位置資訊  //   地圖載入
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  }
}
var map;
function showPosition(position) {
  map = L.map("map", {
    center: [position.coords.latitude, position.coords.longitude],
    zoom: 18
  });
  
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
  var ary=data.features;
  var markers = new L.MarkerClusterGroup().addTo(map);;
  var greenIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
var greyIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

var orangeIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
  for(var i=0; i<ary.length;i++){
    var mask = '';
    if( ary[i].properties.mask_adult === 0 && ary[i].properties.mask_child === 0){
        mask = greyIcon;
    } else if(ary[i].properties.mask_adult === 0 && ary[i].properties.mask_child !== 0){
        mask = orangeIcon;
    }
    else{
        mask = greenIcon;
    } 
    markers.addLayer(L.marker([ary[i].geometry.coordinates[1],ary[i].geometry.coordinates[0]],{icon: mask})
        .bindPopup( "<li><h2>" +
        ary[i].properties.name +
        "</h2><p>地址：" +
        ary[i].properties.address +
        "</p><p>電話：" +
        ary[i].properties.phone +
        '</p><div class="mask"><div class="adultMask"><p><div>成人口罩：</div><div>' +
        ary[i].properties.mask_adult +
        '</div></p></div><div class="childMask"><p><div>兒童口罩：</div><div>' +
        ary[i].properties.mask_child +
        "</div></p></div></div></li>")
        );
      }
      map.addLayer(markers);
}

function showError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      x.innerHTML = "User denied the request for Geolocation."
      break;
    case error.POSITION_UNAVAILABLE:
      x.innerHTML = "Location information is unavailable."
      break;
    case error.TIMEOUT:
      x.innerHTML = "The request to get user location timed out."
      break;
    case error.UNKNOWN_ERROR:
      x.innerHTML = "An unknown error occurred."
      break;
  }
}
// 收縮功能
test();
function test(obj) {
  var div1 = document.getElementById("div2");
  if (div1.style.display == "block") {
    div1.style.display = "none";
    obj.src = "https://img.icons8.com/color/48/000000/align-justify.png";
  } else {
    div1.style.display = "block";
  }
}
//點擊藥局 show出地圖
list.addEventListener('click',moveOn);
function moveOn(e){
if(e.target.nodeName=="A"){
  map.setView([e.target.dataset.lat, e.target.dataset.lng], 30);
}
}
