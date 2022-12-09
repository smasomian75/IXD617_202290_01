import {
    RecentPage,
    hijab_by_id,
    HijabAddPage,
    AnimalProfilePage,
    AnimalShow,
    UserProfilePage,
    UserShow, UserEditPage , ChooseLocationPage
} from "./routes.js";
import { checkSigninForm, checkUserId } from "./signin.js";
import { checkUpload, query } from "./functions.js";
import { checkAnimalAddForm, checkAnimalDeleteForm, checkHijabEditForm, checkListFilter, checkListSearchForm, checkLocationAddForm, checkPasswordEditForm, checkSignupForm, checkUserEditForm, checkUserEditPhotoForm } from "./forms.js";

//Document Ready
$(() => {

    checkUserId();

    $(document)

        .on("pagecontainerbeforeshow", function(event, ui){

            // PAGE ROUTES
            switch(ui.toPage[0].id){
                case "first-page": UserProfilePage(); break;
                case "create-hijab": HijabAddPage(); break;
                case "hijab-edit": hijab_by_id(); break;
                case "user-edit-page": UserEditPage(); break;
            }
        })

        .on("pagecontainerbeforeshow", function(event, ui){

            // PAGE ROUTES
            switch(ui.toPage[0].id){
                case "first-page": AnimalShow(); break;
                case "profile-user": UserShow(); break;
                case "show-page": AnimalProfilePage(); break;
                case "search-page": RecentPage(); break;
                case "choose-location-page": ChooseLocationPage(); break;
            }
        })


        .on("submit", "#list-search-form", function(e) {
            e.preventDefault();
            let search = $(this).find("input").val();
            checkListSearchForm(search);
        })

        //EVENT DELEGATION
        .on("submit", "#signin-form", function(e){
            e.preventDefault();
            checkSigninForm();
        })


        .on("change", ".imagepicker input", function(e) {
            checkUpload(this.files[0])
                .then((d) => {
                    console.log(d);
                    let filename = `uploads/${d.result}`;
                    $(this).parent().prev().val(filename);
                    $(this).parent().css({
                        "background-image": `url('${filename}')`
                    })
                })
        })

        .on("click", ".js-submit-user-edit-form", function(e) {
            checkUserEditForm();
        })

        .on("click", ".js-submit-password-edit-form", function(e) {
            checkPasswordEditForm();
        })

        .on("click", ".js-submit-location-add-form", function(e) {
            checkLocationAddForm();
        })

        .on("click", ".js-submit-user-edit-photo-form", function(e) {
            checkUserEditPhotoForm();
        })

        .on("click", "[data-filter]", function(e){
            let {filter,value} = $(this).data();
            if (value!=="") checkListFilter(filter,value);
            else AnimalShow();
        })

        .on("submit", "#signup-form", function(e) {
            console.log("signup", e)
            e.preventDefault();
            checkSignupForm();
        })

        .on("click", ".js-submit-animal-add-form", function(e) {
            checkAnimalAddForm();
        })

        .on("click", ".animalJump", function(e){
            let id = $(this).data("id");

            sessionStorage.animalID = id;
        })


        .on("click", ".js-submit-hijab-edit-form", function(e) {
            checkHijabEditForm();
        })

        .on("click", ".animal-jump", function(e) {
            let id = $(this).data("id");

            sessionStorage.animalId = id;
        })



        .on("click", ".location-jump", function(e) {
            let id = $(this).data("id");

            sessionStorage.locationId = id;
        })

        .on("click", ".js-animal-delete", function(e) {
            checkAnimalDeleteForm();
        })

        .on("click", ".js-choose-animal-for-location", function(e) {
            $("#location-animal-id").val(sessionStorage.animalID);
            $("#location-back").val(-2);
        })


        .on("click", ".js-logout", function(e){
            sessionStorage.removeItem("userId");
            checkUserId();
        })

        .on("click", ".location-jump", function(e){
            let id = $(this).data("id");

            sessionStorage.locationId = id;
        })

        .on("click", ".nav-link", function(e) {
            let id = $(this).index();
            $(this).parent().next().children().eq(id)
                .addClass("active")
                .siblings().removeClass("active");
            $(this).addClass("active")
                .siblings().removeClass("active");
        })

        //ACTIVATE TOOLS
        .on("click", "[data-activate]", function(e){
            const target = $(this).data("activate");
            $(target).addClass("active");
        })

        .on("click", "[data-deactivate]", function(e){
            const target = $(this).data("deactivate");
            $(target).removeClass("active");
        })

        .on("click", "[data-toggle]", function(e){
            const target = $(this).data("toggle");
            $(target).toggleClass("active");
        })

        .on("click", "[data-activateone]", function(e){
            const target = $(this).data("activateone");
            $(target).toggleClass("active")
                .siblings().removeClass("active");
        })


});


