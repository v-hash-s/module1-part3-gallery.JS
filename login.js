const url =  'https://glq7fjiy07.execute-api.us-east-1.amazonaws.com/api/login';
const form = document.getElementById('login');
const regex = /^\b([0-9A-Z])+\b$/gi

class User{
    constructor(email, password) {
        this.email = email;
        this.password = password;
    }

    checkPassword(){
        if(this.password.match(regex)) return true
        return alert("Invalid form of password")
    }
}

function getUserData(){
    let userData = {}
    return userData = {
        email: document.getElementById("userEmail").value,
        password: document.getElementById("userPassword").value,
    }
}

form.addEventListener('submit', async(event) => {
    event.preventDefault();

    let {email, password} = getUserData() 
    let user = new User(email, password)

    if(!user.checkPassword()) return;

    try {
        let response = await fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    });
        let result = await response.json();

        if(result.errorMessage) return alert(result.errorMessage)            
        
        localStorage.setItem('token', result.token)

        if(localStorage.getItem('token')){
            let time = new Date()
            localStorage.setItem('time', time.getUTCMinutes())
            document.location.replace('./gallery.html')
        }

    } catch(err){
        alert(err.message);
    }
})
