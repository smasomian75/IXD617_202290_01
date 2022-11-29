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
    <div class="user-profile-image"><a href="#user-edit-photo-page"><img src="${img}"></a></div>
    <div class="user-profile-body">
        <div class="user-profile-name">${name}</div>
        <div class="user-profile-breed">@${username}</div>
        <div class="user-profile-email">${email}</div>
    </div>
</div>
`

export const makeAnimalProfileDescription = ({name,type,breed})=>`
<h2>${name}</h2>
<div>${type}</div>
<div>${breed}</div>
`


export const makeAnimalMapDescription = ({name,type,breed,img}) => {
    return `<div class="animal-map-description display-flex">
        <div class="animal-map-image">
            <img src="${img}" />
        </div>
        <div class="animal-map-body">
            <h1>${name}</h1>
            <div>${type}</div>
            <div>${breed}</div>
        </div>
    </div>`;
}



export const makeEditUserForm = ({name,username,email}) => {
    
    return `<div class="form-control">
        <label class="form-label" for="user-edit-username">Username</label>
        <input class="form-input" type="text" id="user-edit-username" data-role="none" placeholder="Type your Username" value="${username}">
    </div>
    <div class="form-control">
        <label class="form-label" for="user-edit-name">Name</label>
        <input class="form-input" type="text" id="user-edit-name" data-role="none" placeholder="Type your Name" value="${name}">
    </div>
    <div class="form-control">
        <label class="form-label" for="user-edit-email">Email</label>
        <input class="form-input" type="text" id="user-edit-email" data-role="none" placeholder="Type your Email" value="${email}">
    </div>`
}




const FormControlInput = ({namespace,name,displayname,type,placeholder,value}) => {
    return `<div class="form-control">
        <label class="form-label" for="${namespace}-${name}">${displayname}</label>
        <input class="form-input" type="${type}" id="${namespace}-${name}" data-role="none" placeholder="${placeholder}" value="${value}">
    </div>`
}
const FormControlTextarea = ({namespace,name,displayname,placeholder,value}) => {
    return `<div class="form-control">
        <label class="form-label" for="${namespace}-${name}">${displayname}</label>
        <textarea class="form-input" id="${namespace}-${name}" data-role="none" placeholder="${placeholder}">${value}</textarea>
    </div>`
}


export const makeEditAnimalForm = ({animal,namespace}) => {
    return `
    ${FormControlInput({
        namespace,
        name: "name",
        displayname: "Name",
        type: "text",
        placeholder: "Type a Name",
        value: animal.name
    })}
    ${FormControlInput({
        namespace,
        name: "type",
        displayname: "Type",
        type: "text",
        placeholder: "Type a Type",
        value: animal.type
    })}
    ${FormControlInput({
        namespace,
        name: "breed",
        displayname: "Breed",
        type: "text",
        placeholder: "Type a Breed",
        value: animal.breed
    })}
    ${FormControlTextarea({
        namespace,
        name: "description",
        displayname: "Description",
        placeholder: "Type a Description",
        value: animal.description
    })}
    `;
}





const filterList = (animals,type) => {
    let arr = [...(new Set(animals.map(o=>o[type])))];
    return templater(o=>o?`<span data-filter="${type}" data-value="${o}">${o}</span>`:'')(arr);
}


export const makeFilterList = (animals) => {
    return `
        <span data-filter="type" data-value="">All</span>
        |
        ${filterList(animals,'type')}
        |
        ${filterList(animals,'breed')}
    `
}