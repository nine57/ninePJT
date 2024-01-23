var mapContainer = document.getElementById("map"), // 지도를 표시할 div
  mapOption = {
    // center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
    center: new kakao.maps.LatLng(37.58, 126.97), // 지도의 중심좌표
    level: 5, // 지도의 확대 레벨
  };

var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다
