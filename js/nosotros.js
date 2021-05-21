const db = firebase.firestore();

const menu = document.getElementById('menu');

firebase.auth().onAuthStateChanged(user => {
    var user = firebase.auth().currentUser;
    if (user) {
        console.log(user.email);
        document.getElementById("inicio").style.display = 'none';
      //  document.getElementById("registrar").style.display = 'none';
        menu.innerHTML += `
             <a href="#" id="cuenta"><img src="${user.photoURL}" id="imgUser"> Inisiaste con: ${user.displayName}</a>
             <a href="#" id="salir">Salir de sesión</a>
        `;
        const salir = document.getElementById('salir');
        salir.addEventListener("click", (e) => {
            e.preventDefault();
            firebase.auth().signOut().then(() => {
                console.log("signup out");
                window.location.href = "index.html";
            });
        });
    }
})
const googleButton = document.querySelector("#googleLogin");

googleButton.addEventListener("click", (e) => {
  e.preventDefault();
  //signInForm.reset();
  //$("#signinModal").modal("hide");

  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider).then((result) => {
    console.log(result);
    console.log("google sign in");
    window.location.href = "index.html";
  })
    .catch(err => {
      console.log(err);
      if(err.code=="auth/account-exists-with-different-credential"){
      alert("Ya existe cuenta con la misma direccion electronica, talvez ya iniciaste con facebook");
      }
    })
});

const facebookButton = document.querySelector('#facebookLogin');

facebookButton.addEventListener('click', e => {
  e.preventDefault();
 // signInForm.reset();
 // $("#signinModal").modal("hide");

  const provider = new firebase.auth.FacebookAuthProvider();
  auth.signInWithPopup(provider).then((result) => {
    console.log(result);
    console.log("facebook sign in");
    window.location.href = "index.html";
  })
    .catch(err => {
      console.log(err);
      if(err.code=="auth/account-exists-with-different-credential"){
      alert("Ya existe cuenta con la misma direccion electronica, talvez ya iniciaste con google");
      }
    })

})