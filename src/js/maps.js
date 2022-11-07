import { checkData } from "./functions.js";


export const makeMap = async(target, center={lat:37.786038, lng:-122.399342}) => {
    await checkData(()=>window.google);

    let map_el = $(target);

    new google.maps.Map(map_el[0], {
        center,
        zoom: 12,
        disableDefaultUI: true,
    });

    return map_el;
}