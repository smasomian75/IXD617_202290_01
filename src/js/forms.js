import { query } from "./functions.js";
import { makeAnimalList } from "./parts.js";



export const checkSignupForm = () => {
    let username = $("#signup-username").val();
    let email = $("#signup-email").val();
    let password = $("#signup-password").val();
    let confirm = $("#signup-confirm").val();
    
    if (password !== confirm) {
        // tell user to try again
        throw("password failed, show the user");
        return;
    }

    query({
        type: 'insert_user',
        params: [
            username,
            email,
            password
        ]
    }).then((data)=>{
        if (data.error) {
            throw(data.error);
            // We should show how they failed to them
        } else {
            sessionStorage.userId = data.id;
            $.mobile.navigate("#list-page");
        }
    })
}



export const checkUserEditForm = () => {
    let name = $("#user-edit-name").val();
    let username = $("#user-edit-username").val();
    let email = $("#user-edit-email").val();

    query({
        type: 'update_user',
        params: [
            name,
            username,
            email,
            sessionStorage.userId
        ]
    }).then((data)=>{
        if (data.error) {
            throw(data.error);
        } else {
            window.history.back();
        }
    })
}
export const checkPasswordEditForm = () => {
    let password = $("#password-edit-password").val();
    let confirm = $("#password-edit-confirm").val();

    if (password !== confirm) {
        // tell user to try again
        return;
    }

    query({
        type: 'update_password',
        params: [
            password,
            sessionStorage.userId
        ]
    }).then((data)=>{
        if (data.error) {
            throw(data.error);
        } else {
            window.history.go(-1);
        }
    })
}
export const checkUserEditPhotoForm = () => {
    let photo = $("#user-edit-photo-image").val();
    
    query({
        type: 'update_user_photo',
        params: [
            photo,
            sessionStorage.userId
        ]
    }).then((data)=>{
        if (data.error) {
            throw(data.error);
        } else {
            window.history.go(-1);
        }
    })
}





export const checkAnimalAddForm = () => {
    let name = $("#animal-add-name").val();
    let type = $("#animal-add-type").val();
    let breed = $("#animal-add-breed").val();
    let description = $("#animal-add-description").val();
    
    query({
        type: 'insert_animal',
        params: [
            sessionStorage.userId,
            name,
            type,
            breed,
            description
        ]
    }).then((data)=>{
        if (data.error) {
            throw(data.error);
        } else {
            window.history.back();
        }
    })
}
export const checkAnimalEditForm = () => {
    let name = $("#animal-edit-name").val();
    let type = $("#animal-edit-type").val();
    let breed = $("#animal-edit-breed").val();
    let description = $("#animal-edit-description").val();
    
    query({
        type: 'update_animal',
        params: [
            name,
            type,
            breed,
            description,
            sessionStorage.animalId
        ]
    }).then((data)=>{
        if (data.error) {
            throw(data.error);
        } else {
            window.history.back();
        }
    })
}
export const checkAnimalDeleteForm = () => {
    query({
        type:"delete_animal",
        params:[sessionStorage.animalId]
    }).then((data)=>{
        if (data.error) {
            throw(data.error);
        } else {
            window.history.back();
        }
    })
}



export const checkLocationAddForm = () => {
    let animalid = $("#location-animal-id").val();
    let lat = $("#location-lat").val();
    let lng = $("#location-lng").val();
    let description = $("#location-description").val();

    let back = +$("#location-back").val();

    
    query({
        type:"insert_location",
        params:[animalid,lat,lng,description]
    }).then((data)=>{
        if (data.error) {
            throw(data.error);
        } else {
            window.history.go(back);
        }
    })
}





export const checkListSearchForm = (search) => {
    query({
        type:"search_animals",
        params:[`%${search}%`,sessionStorage.userId]
    }).then((data)=>{
        if (data.error) {
            throw(data.error);
        } else {
            let {result} = data;
            $("#list-page .animallist").html(makeAnimalList(result))
        }
    })
}
export const checkListFilter = (filter,value) => {
    query({
        type:"filter_animals",
        params:[filter,value,sessionStorage.userId]
    }).then((data)=>{
        if (data.error) {
            throw(data.error);
        } else {
            let {result} = data;
            $("#list-page .animallist").html(makeAnimalList(result));
        }
    })
}