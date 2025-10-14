
const form = document.getElementById("myform")
const userInput = document.getElementById("inputUser")


form.addEventListener("submit", async event =>{
    event.preventDefault()


    if (userInput.value != ""){

        const user = {
            username:userInput.value.trim().toLowerCase()
        }

        const res = await fetch("/submit",{
            method:"POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        })

    }

    location.href = "/chat"
});