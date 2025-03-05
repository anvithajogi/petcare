document.getElementById("signinForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission

    // Simulate successful sign-in
    localStorage.setItem("userSignedIn", "true");

    // Redirect to the Sell page after signing in
    window.location.href = "sell.html";
});
