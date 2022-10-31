import { templater } from "./functions.js";


export const makeAnimalList = templater(({id,name,type,breed,img})=>`
<a class="animallist-item animal-jump" href="#animal-profile-page" data-id="${id}">
    <div class="animallist-image"><img src="${img}"></div>
    <div class="animallist-body">
        <div class="animallist-name">${name}</div>
        <div class="animallist-type">${type}</div>
        <div class="animallist-breed">${breed}</div>
    </div>
</a>
`)

export const makeUserProfilePage = ({name,email,username,img})=>`
<div>
    <div class="user-profile-image"><img src="${img}"></div>
    <div class="user-profile-body">
        <div class="user-profile-name">${name}</div>
        <div class="user-profile-breed">@${username}</div>
        <div class="user-profile-email">${email}</div>
    </div>
    <a href="#" class="js-logout">Log out</a>
</div>
`

export const makeAnimalProfileDescription = ({name,type,breed})=>`
<h2>${name}</h2>
<div>${type}</div>
<div>${breed}</div>
`