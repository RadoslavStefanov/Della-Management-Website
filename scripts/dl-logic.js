const observerLeft = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if(entry.isIntersecting){
            entry.target.classList.add("show-left");
        }
        else{
            entry.target.classList.remove("show-left");
        }
    })
})

const observerRight = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if(entry.isIntersecting){
            entry.target.classList.add("show-right");
        }
        else{
            entry.target.classList.remove("show-right");
        }
    })
})

const hiddenElementsLeft = document.querySelectorAll(".dl-hidden-left");
hiddenElementsLeft.forEach((el) => observerLeft.observe(el));

const hiddenElementsRight = document.querySelectorAll(".dl-hidden-right");
hiddenElementsRight.forEach((el) => observerRight.observe(el));



// Cookie popUp logic
    /* Javascript to show and hide cookie banner using localstorage */
    /* Shows the Cookie banner */
    
    function showCookieBanner()
    {
        let cookieBanner = document.getElementById("cb-cookie-banner");
        cookieBanner.style.display = "block";
    }

    /* Hides the Cookie banner and saves the value to localstorage */
    function hideCookieBanner()
    {
        localStorage.setItem("nova_isCookieAccepted", "yes");
        let cookieBanner = document.getElementById("cb-cookie-banner");
        cookieBanner.style.display = "none";
        document.querySelector("footer").style.paddingBottom = "0rem"
    }

    /* Checks the localstorage and shows Cookie banner based on it. */
    function initializeCookieBanner()
    {
        let isCookieAccepted = localStorage.getItem("nova_isCookieAccepted");
        if(isCookieAccepted === null)
        {
            localStorage.setItem("nova_isCookieAccepted", "no");
            showCookieBanner();
        }
            if(isCookieAccepted === "no"){
            showCookieBanner();
        }
    }

    initializeCookieBanner();

    function clearSiteCookies()
    {
        var cookies = document.cookie.split("; ");
        for (var c = 0; c < cookies.length; c++) {
            var d = window.location.hostname.split(".");
            while (d.length > 0) {
                var cookieBase = encodeURIComponent(cookies[c].split(";")[0].split("=")[0]) + '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; domain=' + d.join('.') + ' ;path=';
                var p = location.pathname.split('/');
                document.cookie = cookieBase + '/';
                while (p.length > 0) {
                    document.cookie = cookieBase + p.join('/');
                    p.pop();
                };
                d.shift();
            }
        }
        localStorage.removeItem("nova_isCookieAccepted");
    }
// Cookie popUp logic END