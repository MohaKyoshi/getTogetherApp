
const form = document.getElementById("myform")
const userInput = document.getElementById("inputUser")


form.addEventListener("submit", async event =>{
    event.preventDefault()

    if (userInput.value != ""){

        const user = {
            username:userInput.value.trim().toLowerCase(),
            temporary:''
        }

        try {
             await fetch("/submit",{
                method:"POST",
                headers:{
                    "Content-Type": "application/json"
                },
                    body: JSON.stringify(user)
                })

                sessionStorage.setItem('data', JSON.stringify(user))

                location.href = "/chat"


        } catch (error) {
            console.log("There is an Error on Fetch Sending messages : " + error)
        }



    }

});