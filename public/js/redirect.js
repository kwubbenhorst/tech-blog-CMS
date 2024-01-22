// File to achieve redirect when non logged in user is trying to click on links other than login from landing page.

document.addEventListener("DOMContentLoaded", function () {
    const loginLink = document.getElementById("loginLink");
    const dashboardLink = document.getElementById("dashboardLink");

    if (loginLink) {
        loginLink.addEventListener("click", function (event) {
            event.preventDefault();
            window.location.href = "/login";
        });
    }

    if (dashboardLink) {
        dashboardLink.addEventListener("click", function (event) {
            // Prevent the default behavior (following the link)
            event.preventDefault();

            // Check if the user is not logged in (use a variable provided by your server-side template engine)
            const userLoggedIn = dashboardLink.getAttribute("data-logged-in") === "true";
            
            if (!userLoggedIn) {
                // Redirect to the login page
                window.location.href = "/login";
            } else {
                // If the user is logged in, allow navigation to the dashboard
                window.location.href = "/dashboard";
            }
        });
    }
});


