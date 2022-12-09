import { query } from "./functions.js"
import { makeMap, makeMarkers } from "./maps.js";
import {makeAnimalList , makeAnimalMapDescription , makeFilterList , makeAnimalProfileDescription , makeEditUserForm , makeEditAnimalForm , makeAnimalProfilePage , makeUserProfilePage , makeUserProfilePage1} from "./parts.js";


export const UserProfilePage = async() => {
    let {result:users} = await query({
        type:"user_by_id",
        params:[sessionStorage.userId]
    });
    let [user] = users;

    console.log(user)

    $("#first-page .TopMenuAllPetPageShowIcon").html(makeUserProfilePage(user))
}

export const UserShow = async() => {
    let {result:users} = await query({
        type:"user_by_id",
        params:[sessionStorage.userId]
    });
    let [user] = users;

    console.log(user)

    $("#profile-user .body").html(makeUserProfilePage1(user))
}


export const UserEditPage = async() => {
    let {result:users} = await query({
        type:"user_by_id",
        params:[sessionStorage.userId]
    });
    let [user] = users;

    $("#user-edit-page .body").html(makeEditUserForm(user));
}

export const AnimalShow = async() => {

    let {result:animals} = await query({
        type:"animal_by_show",
        params:[sessionStorage.userId]
    });

    console.log(animals)

    $("#first-page .BodyServiceTopMenuAllPetPageShowIconSearch").html(makeAnimalProfilePage(animals))
    $("#first-page .filter-bar").html(makeFilterList(animals))
}

export const AnimalProfilePage = async() => {
    let {result:animals} = await query({
        type:"hijab_by_id",
        params:[sessionStorage.animalID]
    });
    let [animal] = animals;

    $("#show-page img").html(animal.img);
    $("#show-page h2").html(animal.name);
    $("#show-page p").html(animal.body);


    $("#show-page .AllShowPageTopMenuAllPetPageShow").html(makeAnimalProfileDescription(animal));


    let {result:hijab_locations} = await query({
        type:"locations_by_hijab_id",
        params:[sessionStorage.animalID]
    });

    let valid_hijabs = hijab_locations.reduce((r,o)=>{
        o.icon = animal.img;
        if (o.lat && o.lng) r.push(o);
        return r;
    },[])


    console.log(valid_hijabs)

    let map_el = await makeMap("#show-page .map");
    makeMarkers(map_el,valid_hijabs);
}

// export const ListPage = async() => {
//
//     let {result:animals} = await query({
//         type:"animals_by_user_id",
//         params:[sessionStorage.userId]
//     });
//
//     console.log(animals)
//
//     $("#first-page .BodyServiceTopMenuAllPetPageShowIconSearch").html(makeAnimalList(animals))
//     $(".filter-bar").html(makeFilterList(animals))
// }

export const ChooseLocationPage = async() => {
    let map_el = await makeMap("#choose-location-page .map");
    makeMarkers(map_el,[]);

    map_el.data("map").addListener("click",function(e){
        console.log(e)
        $("#location-lat").val(e.latLng.lat());
        $("#location-lng").val(e.latLng.lng());
        makeMarkers(map_el,[e.latLng]);
    })
}

export const HijabAddPage = async() => {
    $("#create-hijab .body").html(makeEditAnimalForm({
        animal:{
            name:'',
            img:'',
            body:'',
            cate:'',
        },
        namespace:'hijab-add'
    }));
}

export const hijab_by_id = async() => {
    let {result:animals} = await query({
        type:"hijab_by_id",
        params:[sessionStorage.animalID]
    });
    let [animal] = animals;

    $("#hijab-edit .body").html(makeEditAnimalForm({
        animal,
        namespace:'hijab-edit'
    }));
}

export const RecentPage = async() => {
    let {result:hijab_locations} = await query({
        type:"recent_hijab_locations",
        params:[sessionStorage.userId]
    });
    console.log(hijab_locations);

    let valid_hijabs = hijab_locations.reduce((r,o)=>{
        o.icon = o.img;
        if (o.lat && o.lng) r.push(o);
        return r;
    },[])



    let map_el = await makeMap("#search-page .map");
    makeMarkers(map_el,valid_hijabs);

    map_el.data("markers").forEach((m,i)=>{
        // console.log(m)
        m.addListener("click",function(e){
            // console.log(e)
            let animal = valid_hijabs[i];
            // console.log(animal)

            // Just Navigate
            // sessionStorage.animalId = animal.animal_id;
            // $.mobile.navigate("#animal-profile-page")

            // Open Google InfoWindow
            // let {map,infoWindow} = map_el.data();
            // infoWindow.open(map, m);
            // infoWindow.setContent(makeAnimalMapDescription(animal));

            $("#map-recent-modal")
                .addClass("active")
                .find(".modal-body")
                .html(makeAnimalMapDescription(animal))
        })
    });
}