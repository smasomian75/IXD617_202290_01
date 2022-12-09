import { templater } from "./functions.js";

export const makeTrashList = templater(({id,name,type,weight,img})=>`
      
`)


export const makeAnimalList = templater(({id,name,body,img})=>`
   <a href="#show-page" class="animalJump" data-id="${id}">
                <div class="BodyServiceTopMenuAllPetPageShowIconSearchPet">
                    <div class="ImageServiceTopClass">
                        <img src="${img}" alt="">
                    </div>
                    <div class="TextServiceTopClass">
                        <h1>${name}</h1>
                        <p>${body}</p>
                    </div>

                    <div class="BottomBodyServiceTopMenuAllPetPageShowIconSearchPet">
                        Show to me
                    </div>
                </div>

            </a>

`)

export const makeUserProfilePage = ({name,email,username,img})=>`
  
            <div class="TopMenuAllPetPageShowIconP">
                <p>Hello</p>
                <span>${name}</span>
            </div>

            <div class="ImgTopMenuAllPetPageShowIcon">
                <img src="${img}" alt="">
            </div>
  
`

export const makeUserProfilePage1 = ({name,email,username,img})=>`
  
            <div class="ImageShowOtherPageToUserShow">
               <a href="#user-edit-photo-page">
                <div class="imgImageShowOtherPageToUserShow">
                    <img src="${img}" alt="">
                </div>
                </a>
                <p>name : ${name}</p>
                <p>username : ${username}</p>
                <p>email : ${email}</p>
            </div>
  
`


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


export const makeAnimalProfilePage = templater(({name,body,id,img,years,gender,location,data_show})=>`
           <a href="#show-page" class="animalJump" data-id="${id}">
                <div class="BodyServiceTopMenuAllPetPageShowIconSearchPet">
                    <div class="ImageServiceTopClass">
                        <img src="${img}" alt="">
                    </div>
                    <div class="TextServiceTopClass">
                        <h1>${name}</h1>
                        <p>${body}</p>
                    </div>

                    <div class="BottomBodyServiceTopMenuAllPetPageShowIconSearchPet">
                        Show to me
                    </div>
                </div>

            </a>
            
            
`)



export const makeAnimalProfileDescription = ({name,img,body,pirce,years,gender})=>`
   <div class="ImgTopMenuAllPetPageShow1">
                <img src="${img}" alt="">
            </div>

<div id="description" class="tabcontent">
   <div class="NavTabShowToHijab">
           <div onclick="openCity(event, 'map')" class="ChildNavTabShowToHijab tablinks">Map</div>
       
           <div style="background: #7E719C; color: white" onclick="openCity(event, 'description')" class="ChildNavTabShowToHijab tablinks">Description</div>
        </div>
        
    <h1>${name}</h1>

            <div class="BodyTopMenuAllPetPageShow1">
                <h2>Description :</h2>
                <p>
                    ${body}
                </p>
            </div>
            
</div>

<div style="display:block; position: relative; height: 560px" id="map" class="tabcontent">
        <div class="NavTabShowToHijab">
           <div style="background: #7E719C; color: white" onclick="openCity(event, 'map')" class="ChildNavTabShowToHijab">Map</div>
       
           <div onclick="openCity(event, 'description')" class="ChildNavTabShowToHijab">Description</div>
        </div>
        
        <div class="map"></div>
        
          <a href="#choose-animal-page">
            <div class="AddNewLocationMap">
                <i class="icon-plus"></i>
            </div>
        </a>
</div>

       

<!--            <div class="ButtonBodyTopMenuAllPetPageShow1">-->
<!--                s-->
<!--            </div>-->
`


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

const FormControlSelect = ({namespace,name,displayname,placeholder,value}) => {
    return `<div class="form-control">
        <label class="form-label" for="${namespace}-${name}">${displayname}</label>
        <select class="form-input" id="${namespace}-${name}" data-role="none">
            <option>Headscarf</option>
            <option>Niqab</option>
            <option>Burqa</option>
            <option>Chador</option>
        </select>
    </div>`
}

export const makeEditAnimalForm = ({animal,namespace}) => {
    return `
    ${FormControlInput({
        namespace,
        name: "name",
        displayname: "Name",
        type: "text",
        placeholder: "",
        value: animal.name
    })}
   
    ${FormControlInput({
        namespace,
        name: "img",
        displayname: "Img Link",
        type: "text",
        placeholder: "",
        value: animal.img
    })}  
      
      
      ${FormControlSelect({
        namespace,
        name: "cate",
        displayname: "Category",
        type: "select",
        placeholder: "",
        value: animal.img
    })}
    
      ${FormControlTextarea({
        namespace,
        name: "body",
        displayname: "Body",
        type: "text",
        placeholder: "",
        value: animal.body
    })}
   
    `;
}



export const makeAnimalMapDescription = ({name,body,category,img}) => {
    return `<div class="animal-map-description display-flex">
        <div class="animal-map-image">
            <img src="${img}" />
        </div>
        <div class="animal-map-body">
            <h1>${name}</h1>
            <div>${body}</div>
            <div>${category}</div>
        </div>
    </div>`;
}



const filterList = (animals,type) => {
    let arr = [...(new Set(animals.map(o=>o[type])))];
    return templater(o=>o?`<div class="ChildListAndClickForCustomer" data-filter="${type}" data-value="${o}">${o}</div>`:'')(arr);
}

export const makeFilterList = (animals) => {
    return `

        <div data-filter="type" data-value="" style="border-right: 1px solid white; padding-right:  15px" class="ChildListAndClickForCustomer">All</div>

        ${filterList(animals,'category')}
       
    `
}