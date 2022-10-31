import { query } from "./functions.js";


export const checkSigninForm = async() => {
    const userval = $("#signin-username").val();
    const passval = $("#signin-password").val();

    let founduser = await query({
        type: 'check_signin',
        params: [userval,passval]
    });

    if (founduser.result.length > 0) {
        // Logged In
        console.log("Success");
        sessionStorage.userId = founduser.result[0].id;

        $("#signin-form")[0].reset();
    } else {
        // Not Logged In
        console.log("Failure");
        sessionStorage.removeItem("userId");

        $(".warning").html("");
        setTimeout(()=>{$(".warning").html("");},3000)
    }

    checkUserId();
}


export const checkUserId = () => {
    const pages = ["#signin-page", "#signup-page", ""];

    if (sessionStorage.userId === undefined) {
        // not logged in
        if (!pages.some(p => p === window.location.hash)) {
            $.mobile.navigate("#signin-page");
        }
    } else {
        // logged in
        if (pages.some(p => p === window.location.hash)) {
            $.mobile.navigate("#recent-page");
        }
    }
}