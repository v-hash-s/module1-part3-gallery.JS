const url =  'https://glq7fjiy07.execute-api.us-east-1.amazonaws.com/api/login';
const form = document.getElementById('login');

import regex  from '/regexPassword.js'

class User{
    constructor(email, password) {
        this.email = email;
        this.password = password;
    }
}


function createUser(){
    let userEmail = document.getElementById("userEmail").value;
    let userPassword = document.getElementById("userPassword").value;

    if(userPassword.match(regex)){
        const user = new User(userEmail, userPassword);

        return user;
    } else {
        alert('Invalid form of password')

        return false;
    }

}

let submit = form.onsubmit = async(event) => {
    event.preventDefault();

    try {
        let userData = createUser();

        if(!userData){
            return false;
        }
        
        let response = await fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    });

        let result = await response.json();

        if(result.errorMessage){
            alert(result.errorMessage)
            return false;
        }
        
        let token = result.token;
        localStorage.setItem('token', token)

        if(localStorage.getItem('token')){
            let time = new Date()
            time = time.getUTCMinutes()
            localStorage.setItem('time', time)
            document.location.replace('/gallery.html')
        }

    } catch(err){
        alert(err.message);
    }

}