const db = firebase.firestore();

const taskForm = document.getElementById('task-form');

const storageRef = firebase.storage().ref();
/*
const saveTask = (nombre, especie, raza, ubi, fecha, hora, tam, blanco, negro, cafe, gris, edad, imagen, descrip) =>
    db.collection('mascotas').doc().set({
        nombre,
        especie,
        raza,
        ubi,
        fecha,
        hora,
        tam,
        blanco,
        negro,
        cafe,
        gris,
        edad,
        imagen,
        descrip
    });
*/
var lat=0;
var lng=0;
function iniciarMap() {
    lat=0;
    lng=0;
    var coord = { lat: -16.5, lng: -68.13 };
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: coord
    });

    var primera = true;
    map.addListener("click", (e) => {
        if (primera) {
            placeMarkerAndPanTo(e.latLng, map);
            primera = false;
        }
    });
 /*   var hoy = new Date();
    var fecha = hoy.getFullYear()+ '-' + (hoy.getMonth() + 1) + '-' + hoy.getDate() ;
    var hora=+' '+hoy.getHours()+':'+hoy.getMinutes();
    var taskForm1 = document.getElementById('task-form');
    taskForm1['hora'].value=hora;
    taskForm1['fecha'].value=fecha;
*/
}

function placeMarkerAndPanTo(latLng, map) {

    new google.maps.Marker({
        position: latLng,
        map: map,
    });
    map.panTo(latLng);
    lat=latLng.lat();
    lng=latLng.lng();
    //  console.log(latLng.lat());
}


taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nombre = taskForm['nombre'].value;
    const perro = taskForm['radiop'].checked;
    var especie = ""
    var raza = "";
    if (perro) {
        especie = "perro";
        raza = taskForm['razap'].value;
    }
    const gato = taskForm['radiog'].checked;
    if (gato) {
        especie = "gato";
        raza = taskForm['razag'].value;
    }
    const macho = taskForm['macho'].checked;
    const hembra = taskForm['hembra'].checked;
    var sexo = ""
    if (macho) {
        sexo = "Macho"
    }
    if (hembra) {
        sexo = "Hembra"
    }
    const ubi = taskForm['ubicacion'].value;
    const fecha = taskForm['fecha'].value;
    const hora = taskForm['hora'].value;
    const tam = taskForm['tam'].value;
    const blanco = taskForm['blanco'].checked;
    const negro = taskForm['negro'].checked;
    const cafe = taskForm['cafe'].checked;
    const gris = taskForm['gris'].checked;
    const naranja = taskForm['naranja'].checked;
    const edad = taskForm['edad'].value;
    //  const imagen = taskForm['imagen'].value;
    const titulo = taskForm['titulo'].value;
    const descrip = taskForm['descrip'].value;
    /*    
            console.log(nombre);
            console.log(especie);
            console.log(raza);
            console.log(ubi);
            console.log(fecha);
            console.log(hora);
            console.log(tam);
            console.log(blanco);
            console.log(negro);
            console.log(cafe);
            console.log(gris);
            console.log(edad);
            console.log(imagen);
            console.log(descrip);
    */

    var user = firebase.auth().currentUser;
    console.log(user.email);
    const idPublicador = user.uid;
    const emailPublicador = user.email;
    //   const nombrePublicador=user.displayName;
    //........................................................................
    const imagen = document.getElementById('imagen');
    var imagenASubir = imagen.files[0];

    /* var uploadTask = storageRef.child('imagenes/' + imagenASubir.name).put(imagenASubir);
     
     uploadTask.on('state_changed',
         function (snapshot) {
             console.log('Subiendo');
         },
         function (error) {
             console.log('Se ha encontrado un error');
         },
         function () {
             var downloadURL= uploadTask.snapshot.downloadURL;
             console.log("#####"+downloadURL);
             imgURL=downloadURL;         
            
         });
         */
    var metadata = {
        contentType: 'image/jpeg'
    };
    var imageRef;
    try{
         imageRef = storageRef.child('imagenes/' + imagenASubir.name+Math.random().toString(36).substring(0,5))
    }catch(IOexception ){
        alert("No subio ninguna imagen")
    }
    
    imageRef.put(imagenASubir, metadata)
        .then(snapshot => {
            console.log("### " + imageRef.getDownloadURL());
            if(lat==0 && lng==0){
                alert("No marco la ubicación de extravio");
             
            }else
            return imageRef.getDownloadURL()
                .then(async (url) => {
                    // url is the download URL
                    var imgURL = url + "";
                    console.log(imgURL)
                    const response = await db.collection('mascotas').doc().set({
                        nombre,
                        especie,
                        raza,
                        sexo,
                        ubi,
                        fecha,
                        hora,
                        tam,
                        blanco,
                        negro,
                        cafe,
                        gris,
                        naranja,
                        edad,
                        //  imagen,
                        titulo,
                        descrip,
                        emailPublicador,
                        //    nombrePublicador,
                        idPublicador,
                        imgURL,
                        lat,
                        lng
                    })
                    taskForm.reset();
                    window.location.href = "index.html";
                    console.log(response);
                })
        })
        .catch(error => {
            // deal any errors
        })
    //........................................................................



});



 //console.log("agregar js funcionando");