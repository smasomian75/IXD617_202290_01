
// Document Ready
$(() => {

    checkUserId();

    // EVENT DELEGATION
    $(document)

    .on("submit", "#signin-form", function(e) {
        e.preventDefault();
        checkSigninForm();
    })
});