import { checkData } from "./functions.js";


export const makeMap = async(target, center={lat:37.786038, lng:-122.399342}) => {
    await checkData(()=>window.google);

    let map_el = $(target);

    if (!map_el.data("map")) map_el.data({
        map: new google.maps.Map(map_el[0], {
            center,
            zoom: 12,
            disableDefaultUI: true,
            styles: mapstyles,
        }),
        infoWindow: new google.maps.InfoWindow({content:''})
    });

    return map_el;
}


export const makeMarkers = (map_el,marker_locs=[]) => {
    let {map,markers} = map_el.data();

    if (markers) markers.forEach((marker) => marker.setMap(null));

    markers = [];

    marker_locs.forEach((location)=>{
        let marker = new google.maps.Marker({
            position: location,
            map,
            icon: {
                url:location.icon,
                scaledSize: {
                    width:40,
                    height:40,
                }
            }
        });
        markers.push(marker);
    });

    map_el.data({markers});
    setTimeout(()=>setMapBounds(map_el,marker_locs), 700);
}


export const setMapBounds = (map_el,marker_locs=[]) => {
    let {map} = map_el.data();
    let zoom = 14;

    if (marker_locs.length === 1) {
        map.setCenter(marker_locs[0]);
        map.setZoom(zoom);
    } else if (marker_locs.length === 0) {
        if (window.location.protocol !== "https:") return;
        else {
            navigator.geolocation.getCurrentPosition(p=>{
                let pos = {
                    lat:p.coords.latitude,
                    lng:p.coords.longitude,
                };
                map.setCenter(pos);
                map.setZoom(zoom);
            },(...args)=>{
                console.log(args);
            },{
                enableHighAccuracy: false,
                timeout: 5000,
                maximumAge: 0,
            });
        }
    } else {
        let bounds = new google.maps.LatLngBounds(null);
        marker_locs.forEach(l => {
            bounds.extend(l);
        });
        map.fitBounds(bounds);
    }
}





const mapstyles = [
    {
        "featureType": "all",
        "elementType": "all",
        "stylers": [
            {
                "saturation": "32"
            },
            {
                "lightness": "-3"
            },
            {
                "visibility": "on"
            },
            {
                "weight": "1.18"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "landscape.man_made",
        "elementType": "all",
        "stylers": [
            {
                "saturation": "-70"
            },
            {
                "lightness": "14"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "saturation": "100"
            },
            {
                "lightness": "-14"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            },
            {
                "lightness": "12"
            }
        ]
    }
];