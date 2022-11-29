import { query } from "./functions.js"
import { makeMap, makeMarkers } from "./maps.js";
import { makeAnimalList, makeAnimalMapDescription, makeAnimalProfileDescription, makeEditAnimalForm, makeEditUserForm, makeFilterList, makeUserProfilePage } from "./parts.js";


export const RecentPage = async() => {
    let {result:animal_locations} = await query({
        type:"recent_animal_locations",
        params:[sessionStorage.userId]
    });
    console.log(animal_locations);

    let valid_animals = animal_locations.reduce((r,o)=>{
        o.icon = o.img;
        if (o.lat && o.lng) r.push(o);
        return r;
    },[])

    let map_el = await makeMap("#recent-page .map");
    makeMarkers(map_el,valid_animals);

    map_el.data("markers").forEach((m,i)=>{
        // console.log(m)
        m.addListener("click",function(e){
            // console.log(e)
            let animal = valid_animals[i];
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

export const ListPage = async() => {

    let {result:animals} = await query({
        type:"animals_by_user_id",
        params:[sessionStorage.userId]
    });

    console.log(animals)

    $("#list-page .animallist").html(makeAnimalList(animals))
    $(".filter-bar").html(makeFilterList(animals))
}

export const UserProfilePage = async() => {
    let {result:users} = await query({
        type:"user_by_id",
        params:[sessionStorage.userId]
    });
    let [user] = users;

    console.log(user)

    $("#user-profile-page .body").html(makeUserProfilePage(user))
}

export const AnimalProfilePage = async() => {
    let {result:animals} = await query({
        type:"animal_by_id",
        params:[sessionStorage.animalId]
    });
    let [animal] = animals;

    $(".animal-profile-top").css({"background-image":`url(${animal.img})`})
    $("#animal-profile-page h1").html(animal.name);
    $("#animal-profile-page .section-description").html(makeAnimalProfileDescription(animal));

    let {result:locations} = await query({
        type:"locations_by_animal_id",
        params:[sessionStorage.animalId]
    });
    console.log(locations)

    let map_el = await makeMap("#animal-profile-page .map");
    makeMarkers(map_el,locations);
}

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




export const UserEditPage = async() => {
    let {result:users} = await query({
        type:"user_by_id",
        params:[sessionStorage.userId]
    });
    let [user] = users;

    $("#user-edit-page .body").html(makeEditUserForm(user));
}
export const UserEditPhotoPage = async() => {
    let {result:users} = await query({
        type:"user_by_id",
        params:[sessionStorage.userId]
    });
    let [user] = users;

    $("#user-edit-photo-page .body").css({
        "background-image": `url('${user.img}')`
    });
}





export const AnimalAddPage = async() => {
    $("#animal-add-page .body").html(makeEditAnimalForm({
        animal:{
            name:'',
            type:'',
            breed:'',
            description:'',
        },
        namespace:'animal-add'
    }));
}
export const AnimalEditPage = async() => {
    let {result:animals} = await query({
        type:"animal_by_id",
        params:[sessionStorage.animalId]
    });
    let [animal] = animals;

    $("#animal-edit-page .body").html(makeEditAnimalForm({
        animal,
        namespace:'animal-edit'
    }));
}