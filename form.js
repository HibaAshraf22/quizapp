// signup function
function signUp(){
    var email = document.getElementById("signupEmail").value;
    var password = document.getElementById("signupPassword").value;

    firebase.auth().createUserWithEmailAndPassword(email , password)

.then(function(){
    alert("SIGNUP SUCCESSFUL");
    window.location.href = "quiz.html";
})

.catch(function(error){
    alert(error.message);
})
}

// login function
function login(){
    var email = document.getElementById("loginEmail").value;
    var password = document.getElementById("loginPassword").value;

    firebase.auth().signInWithEmailAndPassword(email , password)

    .then(function(){
        alert("LOGIN SUCCESSFUL");
        window.location.href = "quiz.html";
    })

    .catch(function(error){
        alert("Wrong email or password");
    })
}