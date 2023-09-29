let buttons = document.querySelectorAll(".service-controlls button");

buttons.forEach(x => x.addEventListener('click', showServices));

function showServices(e)
{
    let target = e.currentTarget;

    if( !target.classList.contains("active") )
    {
        document.querySelector(".service-controlls button.active").classList.remove("active");

        if( target.id === "corpBtn" )
        {
            target.classList.add("active");
            document.querySelector("#corpServices").style.display = "block";
            document.querySelector("#privateServices").style.display = "none";
        }

        if( target.id === "privateBtn" )
        {
            target.classList.add("active");
            document.querySelector("#corpServices").style.display = "none";
            document.querySelector("#privateServices").style.display = "block";
        }
    }
}