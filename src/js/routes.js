import { query } from "./functions.js"
import { makeAnimalList, makeAnimalProfileDescription, makeUserProfilePage } from "./parts.js";


export const RecentPage = async() => {}

export const ListPage = async() => {

    let {result:animals} = await query({
        type:"animals_by_user_id",
        params:[sessionStorage.userId]
    });

    console.log(animals)

    $("#list-page .animallist").html(makeAnimalList(animals))
}

export const UserProfilePage = async() => {
    let {result:users} = await query({
        type:"user_by_id",
        params:[sessionStorage.userId]
    });
    let [user] = users;

    console.log(user)

    $("#user-profile-page [data-role='main']").html(makeUserProfilePage(user))
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
}