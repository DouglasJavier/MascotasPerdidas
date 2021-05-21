const db = firebase.firestore();

const espacioDetalle = document.getElementById('contenedor-detalle');
const espacioBaja = document.getElementById('darBaja');
const menu = document.getElementById('menu');
const contenedorCard = document.getElementById("contenedor-card");
const adiComen = document.getElementById("adi-comen");


const getMascota = (id) => db.collection("mascotas").doc(id).get();

const onGetComen = (callback) => db.collection("comentarios").orderBy("fecha").onSnapshot(callback);

const deleteComen = (id) => db.collection("comentarios").doc(id).delete();

const deletePubli = (id) => db.collection("mascotas").doc(id).delete();

const getComen = (id) => db.collection("comentarios").doc(id).get();

const updateTask = (id, updatedTask) => db.collection('comentarios').doc(id).update(updatedTask);

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

const saveComen = (usuario, comentario, fecha, idPublicacion) =>
    db.collection("comentarios").doc().set({
        usuario,
        comentario,
        fecha,
        idPublicacion
    });
let editStatus = false;
var Lat = 0;
var Lng = 0;
var id = getParameterByName("id");
console.log(id);
var idComent = "";
/*var idUser = "";

var authEmail = "";*/

var idEmail = "";
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        idEmail = user.email + "";
    }
});
console.log("###### " + idEmail + " ####");

window.addEventListener('DOMContentLoaded', async (e) => {

    //var user =  await firebase.auth().currentUser;
    //console.log(user.email);

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            console.log(user.email);
            document.getElementById("inicio").style.display = 'none';
            // document.getElementById("registrar").style.display = 'none';

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

    try {
        const doc = await getMascota(id);
        const datos = doc.data();

        var colores = ""
        if (datos.blanco) { colores = colores + "blanco "; }
        if (datos.negro) { colores = colores + "negro "; }
        if (datos.cafe) { colores = colores + "cafe "; }
        if (datos.gris) { colores = colores + "gris "; }
        if (datos.naranja) { colores = colores + "naranja "; }
        Lat = datos.lat;
        Lng = datos.lng;

        console.log("### " + Lat + " " + Lng);

        espacioDetalle.innerHTML += `
        
        <div>
            <h2>${datos.titulo}</h2><br>
            <table>
            <tr>
            <td><b>Publicado por: </b></td><td>${datos.emailPublicador}</td>
            </tr>
            <tr>
            <td><b>Nombre de la Mascota: </b></td><td>${datos.nombre}</td>
            </tr>
            <tr>
            <td><b>Especie: </b></td><td>${datos.especie}</td>
            </tr>
            <tr>
            <td><b>Edad: </b></td><td>${datos.edad}</td>
            </tr>
            <tr>
            <td><b>Raza: </b></td><td>${datos.raza}</td>
            </tr>
            <tr>
            <td><b>Fecha de extravio: </b></td><td>${datos.fecha}</td>
            </tr>
            <tr>
            <td><b>Hora de extravio: </b></td><td>${datos.hora}</td>
            </tr>
            <tr>
            <td><b>Tamaño de la mascota: </b></td><td>${datos.tam}</td>
            </tr>
            <tr>
            <td><b>Colores de la mascota: </b></td><td>${colores}</td>
            </tr>
           <tr> 
            <td colspan="2"><b>Descripción detallada de la mascota y las circunstancias de su extravio: </b></td>
            </tr>
            <tr>
            <td colspan="2">${datos.descrip}</td>
            </tr>
            </table>
        </div>
        <div>
        <img src="${datos.imgURL}" id="img">
        </div>
        
        `
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                if (user.uid == datos.idPublicador) {
                    espacioBaja.innerHTML += `
                    <botton id="elimPubli">Dar de baja la publicación</botton>
                    `;
                    const publiDelete = document.getElementById("elimPubli");

                    publiDelete.addEventListener('click', async (e) => {
                        var conf = confirm("¿Estas segur@ que quieres eliminar esta publicación? Una vez eliminada no la podrás recuperar")
                        if (conf == true) {
                            try {
                                await deletePubli(id);
                                window.location.href = "index.html";
                            } catch (error) {
                                console.log(error);
                            }
                        } else {
                            alert("Se cancelo la operación");
                        }
                    });
                }
            }
        });

    } catch (error) {
        console.log(error);
    }
    //MEQUEDE AQUI Falta COMO MOSTRAR COMENTARIOS Y AGREGAR COMENTARIOS


    onGetComen((querySnapshot) => {
        contenedorCard.innerHTML = "";


        querySnapshot.forEach((doc) => {
            const comen = doc.data();
            if (comen.idPublicacion == id) {
                if (comen.usuario == idEmail) {
                    contenedorCard.innerHTML += `<div class="present3">
                            <h3 class="h5">${comen.usuario}</h3>
    
                            ${comen.fecha}
                             <p>${comen.comentario}</p>
                             <div>
                              <button class="btn btn-primary btn-delete" data-id="${doc.id}">
                              🗑 Delete
                               </button>
                              <button class="btn btn-secondary btn-edit" data-id="${doc.id}">
                            🖉 Edit
                             </button>
                              </div></div>`;
                } else {
                    contenedorCard.innerHTML += `<div class="present3">
                    <h3 class="h5">${comen.usuario}</h3>

                    ${comen.fecha}
                     <p>${comen.comentario}</p>
                     </div>`
                }
            }
        });
        const btnsDelete = contenedorCard.querySelectorAll(".btn-delete");
        btnsDelete.forEach((btn) =>
            btn.addEventListener("click", async (e) => {
                const doc = await getComen(e.target.dataset.id);
                const task = doc.data();
                if (task.usuario == idEmail) {
                    console.log(e.target.dataset.id);
                    editStatus = false;
                    try {
                        await deleteComen(e.target.dataset.id);
                    } catch (error) {
                        console.log(error);
                    }
                } else {
                    alert("Solo puedes eliminar tus comentarios");
                }
            })
        );

        const btnsEdit = contenedorCard.querySelectorAll(".btn-edit");
        btnsEdit.forEach((btn) => {
            btn.addEventListener("click", async (e) => {
                console.log("id comentario = " + e.target.dataset.id);
                try {
                    const doc = await getComen(e.target.dataset.id);
                    const task = doc.data();
                    if (task.usuario == idEmail) {
                        adiComen["comentario"].value = task.comentario;
                        adiComen["usuario"].value = task.usuario;
                        editStatus = true;
                        idComent = doc.id;
                        //   adiComen=doc.emailPublicador;
                        adiComen["subir-comen"].innerText = "Update";
                    } else {
                        alert("Solo puedes editar tus comentarios")
                    }
                } catch (error) {
                    console.log(error);
                }
            });
        });


    });



});

/*
firebase.auth().onAuthStateChanged(async user => {
    adiComen.addEventListener("submit", async (e) => {
        e.preventDefault();

        const comentario = adiComen["comentario"];

        if (user) {
            var hoy = new Date();
            var fecha = hoy.getDate() + '-' + (hoy.getMonth() + 1) + '-' + hoy.getFullYear();
            console.log(user.email);
            try {
                if (!editStatus && idComent == "") {
                    await saveComen(user.email, comentario.value, fecha, id);
                } else {
                    const doc = await getComen(idComent);
                    const datos = doc.data();
                    if (datos.usuario == user.email) {
                        console.log(" editar if :" + datos.usuario + " " + user.email);
                        console.log("id comentario " + idComent);
                        await updateTask(idComent, {
                            usuario: datos.usuario,
                            comentario: comentario.value,
                            fecha: fecha,
                            idPublicacion: id,
                        })

                    } else {
                        alert("Solo puedes editar tus comentarios");
                    }

                    editStatus = false;
                    idComent = '';
                    adiComen['subir-comen'].innerText = 'Subir comentario';
                }
                adiComen.reset();
                comentario.focus();
            } catch (error) {
                console.log(error);
            }
        }
    });
});
*/


adiComen.addEventListener("submit", async (e) => {
    e.preventDefault();
    const comentario = adiComen["comentario"];
    const usr = adiComen["usuario"];
    var hoy = new Date();
    var fecha = hoy.getDate() + '-' + (hoy.getMonth() + 1) + '-' + hoy.getFullYear() + ' ' + hoy.getHours() +
        ':' + hoy.getMinutes() + ':' + hoy.getSeconds();
    if (idEmail != "") {
        if (comentario.value != "") {
            try {

                if (!editStatus) {
                    console.log("usuario " + idEmail);
                    await saveComen(idEmail, comentario.value, fecha, id);
                } else {

                    await updateTask(idComent, {
                        usuario: usr.value,
                        comentario: comentario.value,
                        fecha: fecha,
                        idPublicacion: id,
                    })

                    editStatus = false;
                    idComent = '';
                    adiComen['subir-comen'].innerText = 'Subir comentario';
                }
                adiComen.reset();
                comentario.focus();
            } catch (error) {
                console.log(error);
            }
        } else {
            alert("No lleno la caja de comentarios")
        }
    } else {
        alert("Para comentar primero debes iniciar sesión");
    }
});

function iniciarMap() {
    var id = getParameterByName("id");
    window.addEventListener('DOMContentLoaded', async (e) => {
        try {
            const doc = await getMascota(id);
            const datos = doc.data();
            Lat = datos.lat;
            Lng = datos.lng;
            var coord = { lat: Lat, lng: Lng };
            var map = new google.maps.Map(document.getElementById('map'), {
                zoom: 15,
                center: coord
            });
            var marker = new google.maps.Marker({
                position: coord,
                map: map

            });
        } catch (error) {
            console.log(error);
        }
    });
}

const googleButton = document.querySelector("#googleLogin");

googleButton.addEventListener("click", (e) => {
    e.preventDefault();
    //signInForm.reset();
    //$("#signinModal").modal("hide");

    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).then((result) => {
        console.log(result);
        console.log("google sign in");
        window.location.href = "#";
    })
        .catch(err => {
            console.log(err);
            if (err.code == "auth/account-exists-with-different-credential") {
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
        window.location.href = "#";
    })
        .catch(err => {
            console.log(err);
            if (err.code == "auth/account-exists-with-different-credential") {
                alert("Ya existe cuenta con la misma direccion electronica, talvez ya iniciaste con google");
            }
        })

})


