const db = firebase.firestore();
const contenedorCard = document.getElementById('contenedor');
const menu = document.getElementById('menu');
const contenedorCard1 = document.getElementById('contenedor1');
const espacioDetalle=document.getElementById('contenedor-detalle');
const getTask = () => db.collection('mascotas').orderBy("fecha", "desc").get();

let editStatus = false;
let id = '';

window.addEventListener('DOMContentLoaded', async (e) => {
    const querySnapshot = await getTask();
    querySnapshot.forEach(doc => {
        console.log(doc.data())
        const datos = doc.data();
        datos.id = doc.id;
        var idUsuario = ""
        var user = firebase.auth().currentUser;
        if (user) {
            idUsuario = user.uid;
        }

        if (datos.idPublicador == idUsuario) {
            contenedorCard1.innerHTML += `
        <div class="card"> 
        <img src="${datos.imgURL}">
        <h4>${datos.titulo}</h4>
        <p> Nombre: ${datos.nombre} <br>
            edad: ${datos.edad} <br>
            sexo: ${datos.sexo} <br>
            raza: ${datos.raza} <br>
            fecha de extravio: ${datos.fecha}<br>
            hora de extravio : ${datos.hora}<br>
            lugar de extravio: ${datos.ubi}<br>
        </p> 
        <form action="detalle.html" method="get">
            <input type="hidden" name="id"value="${datos.id}">
            <input type="submit" value="Leer más" class="boton">
        </form>
        </div>`
        } else {
            contenedorCard.innerHTML += `
        <div class="card"> 
        <img src="${datos.imgURL}">
        <h4>${datos.titulo}</h4>
        <p> Nombre: ${datos.nombre} <br>
            edad: ${datos.edad} <br>
            sexo: ${datos.sexo} <br>
            raza: ${datos.raza} <br>
            fecha de extravio: ${datos.fecha}<br>
            hora de extravio : ${datos.hora}<br>
            lugar de extravio: ${datos.ubi}<br>
        </p> 
        <form action="detalle.html" method="get">
            <input type="hidden" name="id"value="${datos.id}">
            <input type="submit" value="Leer más" class="boton">
        </form>
        </div>`
        }


    })
    var user = firebase.auth().currentUser;
    if (user) {
        console.log(user.email);
        document.getElementById("inicio").style.display = 'none';
      //  document.getElementById("registrar").style.display = 'none';
        menu.innerHTML += `
             <a href="#" id="cuenta"><img src="${user.photoURL}" id="imgUser" class="nav-a bye"> Inisiaste con: ${user.displayName}</a>
             <a href="#" id="salir" class="nav-a bye">Salir de sesión</a>
        `;
        const salir = document.getElementById('salir');
        salir.addEventListener("click", (e) => {
            e.preventDefault();
            firebase.auth().signOut().then(() => {
                console.log("signup out");
                window.location.href = "index.html";
            });
        });
    } else {
        document.getElementById("agre").style.display = 'none';
        contenedorCard1.innerHTML += `<h2>Para que puedas publicar primero debes iniciar sesión</h2>`
    }
});

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