 var nodes = null;
 var edges = null;
 var network = null;

 var vertices = [];
 var aristas_origen = [];
 var aristas_llegada = [];
 var peso = [];
 var mAdyacencia = [];
 var mCaminos = [];




 var data = getScaleFreeNetwork(25);
 var seed = 2;
 var defaultLocal = navigator.language;
 var select = document.getElementById('locale');

 function destroy() {
     if (network !== null) {
         network.destroy();
         network = null;
     }
 }
/* funcion entregada por vis */
 function draw() {
     destroy();
     nodes = [];
     edges = [];
     var container = document.getElementById('resultado');
     var options = {
         layout: { randomSeed: seed },
         locale: document.getElementById('locale').value,
         manipulation: {
             addNode: function(data, callback) { /* agregar botones  */
                 document.getElementById('node-operation').innerHTML = "Agregar Vértice";
                 editNode(data, clearNodePopUp, callback);
             },
             editNode: function(data, callback) {
                 document.getElementById('node-operation').innerHTML = "Editar Vértice";
                 editNode(data, cancelNodeEdit, callback);
             },
             addEdge: function(data, callback) {
                 if (data.from == data.to) {
                     var r = confirm("Si conectas el vertice a si mismo crearas un bucle, ¿esta seguro de la operacion? ");
                     r.className = ("alert alert-warning text-center");
                     if (r != true) {
                         callback(null);
                         return;
                     }
                 }
                  /*  aqui es la seleccion del tipo de grafo si es dirigido,  */
                 var tipoGrafo = document.querySelector("#tipoGrafo").value; // se obtiene con query el valor del click
                 if (tipoGrafo === 'Dirigido') {
                     var options = {
                         edges: {
                             arrows: 'to',   // agrega la flecha de la aristA
                         }
                     }
                     network.setOptions(options);
                 }
                 document.getElementById('edge-operation').innerHTML = "Agregar Arista";
                 editEdgeWithoutDrag(data, callback);
             },
             editEdge: {
                 editWithoutDrag: function(data, callback) {
                     document.getElementById('edge-operation').innerHTML = "Editar Arista";
                     editEdgeWithoutDrag(data, callback);
                 }
             }

         }
     };
     network = new vis.Network(container, data, options);

 }
 /* configuracion de cancelacion de los  click de nodos  */
 function editNode(data, cancelAction, callback) {
     document.getElementById('node-label').value = data.label;
     document.getElementById('node-saveButton').onclick = saveNodeData.bind(this, data, callback);
     document.getElementById('node-cancelButton').onclick = cancelAction.bind(this, callback);
     document.getElementById('node-popUp').style.display = 'block';
 }

 function clearNodePopUp() {
     document.getElementById('node-saveButton').onclick = null;
     document.getElementById('node-cancelButton').onclick = null;
     document.getElementById('node-popUp').style.display = 'none';
 }

 function cancelNodeEdit(callback) {
     clearNodePopUp();
     callback(null);
 }

 function saveNodeData(data, callback) {
     data.id = document.getElementById('node-id').value;
     data.label = document.getElementById('node-id').value;
     vertices.push(data.id);
     clearNodePopUp();
     callback(data);
 }

 function editEdgeWithoutDrag(data, callback) {
     document.getElementById('edge-saveButton').onclick = saveEdgeData.bind(this, data, callback);
     document.getElementById('edge-cancelButton').onclick = cancelEdgeEdit.bind(this, callback);
     document.getElementById('edge-popUp').style.display = 'block';
 }

 function clearEdgePopUp() {
     document.getElementById('edge-saveButton').onclick = null;
     document.getElementById('edge-cancelButton').onclick = null;
     document.getElementById('edge-popUp').style.display = 'none';
 }

 function cancelEdgeEdit(callback) {
     clearEdgePopUp();
     callback(null);
 }

 function saveEdgeData(data, callback) {
     if (typeof data.to === 'object')
         data.to = data.to.id;

     if (typeof data.from === 'object')
         data.from = data.from.id;

     data.label = document.getElementById('edge-label').value;
     aristas_origen.push(data.from);
     aristas_llegada.push(data.to);
     peso.push(data.label);

     clearEdgePopUp();
     callback(data);
 }
/* todo arriba entregado por vis, y la trata de los botones  */
 function init() {
     setDefaultLocale();
     draw();
 }

/*  aqui para seleccionar el tipo de grafo, y el tipo de arista por consiguiente */
 function buscar(columna, fila) {
     var tipoGrafo = document.querySelector("#tipoGrafo").value;
     for (let i = 0; i < (aristas_origen.length); i++) {
         if (tipoGrafo === 'Dirigido') {
             if (columna === aristas_origen[i] && fila === aristas_llegada[i])
                 return 1;
         } else {
             if (columna === aristas_origen[i] && fila === aristas_llegada[i] || columna === aristas_llegada[i] && fila === aristas_origen[i])
                 return 1;
         }
     }
 }

//apartado de funciones 

 function MatrizAdyacencia() {
     var mAdyacencia = []
     var col = [];
     for (let i = 0; i < vertices.length; i++) {
         for (let j = 0; j < vertices.length; j++) {
             if (buscar(vertices[i], vertices[j]) !== 1) {
                 col.push(0);
             } else {
                 col.push(1);
             }
         }
         mAdyacencia[i] = col;
         col = [];
     }
     return mAdyacencia;
 }

 function Suma_De_Matrices(MatrizA, MatrizB, MatrizC) {
     var MatrizAux = [];
     for (let i = 0; i < vertices.length; i++) {
         for (let j = 0; j < vertices.length; j++) {
             MatrizAux.push(MatrizA[i][j] + MatrizB[i][j]);
         }
         MatrizC[i] = MatrizAux;
         MatrizAux = [];

     }
 }


 function Multiplicacion_de_Matriz(MatrizA, MatrizB, MatrizC) {
     var resultado = 0,
         MatrizAux = [];
     for (let i = 0; i < vertices.length; i++) {
         for (let j = 0; j < vertices.length; j++) {
             for (let k = 0; k < vertices.length; k++) {
                 resultado += MatrizA[i][k] * MatrizB[j][k];
             }
             MatrizAux.push(resultado);
             resultado = 0;
         }
         MatrizC[i] = MatrizAux;
         MatrizAux = [];

     }
 }

 function matrizConexa(MatrizA) {
     let contador = 0;
     for (let i = 0; i < vertices.length; i++) {
         for (let j = 0; j < vertices.length; j++) {
             if (MatrizA[i][j] != 0) {
                 contador++;
             } else {
                 return false;
             }
         }

     }
     if (contador != 0)
         return true;
 }

 


 function MatrizCaminos(mAdyacencia) {
     var multiplicada = [],
         mCaminos = [],
         aux = [],
         sumada = [] = mAdyacencia,
         aux = mAdyacencia;
     for (let i = 0; i < ((vertices.length) - 1); i++) {
         Multiplicacion_de_Matriz(mAdyacencia, aux, multiplicada);
     }
     Suma_De_Matrices(multiplicada, sumada, mCaminos);
     aux = multiplicada;

     return mCaminos;
 }


 function drawMatriz(matriz) {
     var tablaS = document.createElement('table');   //variables
     var fila = document.createElement('tr');
     var primero = document.createElement('td');
     primero.textContent = "M";    //estilo
     primero.style.backgroundColor = "#CDA434";
     primero.style.textAlign = "center";
     primero.style.width = "30px";
     primero.style.height = "30px";
     primero.style.borderColor = "#1F1F1F";
     fila.appendChild(primero);
     for (let i = 0; i < vertices.length; i++) {
         var p_fila = document.createElement('td');
         p_fila.style.width = "30px";
         p_fila.style.height = "30px";
         p_fila.style.textAlign = "center";
         p_fila.style.backgroundColor = "#CDA434";
         p_fila.style.borderColor = "#1F1F1F";
         p_fila.textContent = vertices[i];
         fila.appendChild(p_fila);
     }
     tablaS.appendChild(fila);  //el diseño y largo de de la table

     for (let k = 0; k < matriz.length; k++) {
         var o_filas = document.createElement('tr');
         var nombre = document.createElement('td');
         nombre.style.width = "30px";
         nombre.style.height = "30px";
         nombre.style.backgroundColor = "#CDA434";
         nombre.style.borderColor = "#1F1F1F";
         nombre.style.textAlign = "center";
         nombre.textContent = vertices[k];
         o_filas.appendChild(nombre);

         for (let j = 0; j < matriz.length; j++) {
             var datos = document.createElement('td');
             datos.style.width = "30px";
             datos.style.height = "30px";
             datos.style.textAlign = "center";
             datos.style.borderColor = "#1F1F1F";
             datos.textContent = matriz[k][j];
             o_filas.appendChild(datos);
         }
         tablaS.appendChild(o_filas);
     }
     return tablaS;
 }

// aca se imprime directamente la matriz adyacencia, donde se llama las funciones anteriores con el query y el appenchild
 function imprimirAD() {
     const matrizAdy = document.querySelector("#matrizAdy");
     var matriz = MatrizAdyacencia();
     matrizAdy.appendChild(drawMatriz(matriz));

 }
//  no es contar vertice es contar nodo xd
 function contarNodo(mAdyacencia) {  
    return vertices.length;
 }
// no es contar vertice es contar nodo xd
 function imprimircontarNodo() { 
    var mAdyacencia = MatrizAdyacencia(); //
    const contNodo = document.querySelector("#cvertice"); // se cambia #cvertice, contNodo
    var mcontar= contarNodo(mAdyacencia); // mcontar se cambiar= funcion ciclo(madyacencia)
    //contvertice.appendChild(drawMatriz(mcontar));
    contNodo.textContent = (`la cantidad de nodos es:   [${mcontar}]`); // aqui la variable que esta arriba de esta
    contNodo.className = "alert alert-warning text-center mt-3 mx-3"; // la variable que cambiaste de contNodo
 }


 function imprimirCamino() {
     var mAdyacencia = MatrizAdyacencia();
     const matrizCamino = document.querySelector("#matrizCam");
     var matriz_c = MatrizCaminos(mAdyacencia);
     matrizCamino.appendChild(drawMatriz(matriz_c));
 }

 function imprimirConexo() {
     var mAdyacencia = MatrizAdyacencia();
     const matrizCamino = document.querySelector("#matrizCam");
     var matriz_c = MatrizCaminos(mAdyacencia);
     const saberCon = document.querySelector("#saberConexo");
     var conexo = matrizConexa(matriz_c);
     if (conexo) {
         saberCon.textContent = "La matriz ingresada es Conexa :D !";
         saberCon.className = "alert alert-warning text-center";
     } else {
         saberCon.textContent = "Su matriz no es Conexa :V";
         saberCon.className = "alert alert-warning text-center";
     }
 }
// funcion para obtener peso con vis
 function ObtenerPeso(columnas, filas) {
     for (let i = 0; i < aristas_origen.length; i++) {
         if (columnas === aristas_origen[i] && filas === aristas_llegada[i]) {
             return peso[i];
         }
     }
 }

 function Matriz_Pesos() {
     var Matriz_de_Peso = [];
     var Matriz_aux = [];
     for (let i = 0; i < vertices.length; i++) {
         for (let j = 0; j < vertices.length; j++) {
             if (buscar(vertices[i], vertices[j]) == 1) {
                 Matriz_aux.push(ObtenerPeso(vertices[i], vertices[j]));

             } else {
                 Matriz_aux.push(0);
             }
         }
         Matriz_de_Peso[i] = Matriz_aux;
         Matriz_aux = [];
     }
     return Matriz_de_Peso;
 }
 
function contarVertice(mAdyacencia) {
    var Matriz_aux = [];
    let contador=0;
    for (let i= 0; i < mAdyacencia.length ; i++) {
        for (let j = 0; j < mAdyacencia.length; j++) {
            //if (buscar(mAdyacencia[i],mAdyacencia[j]) == 1) { // no estoy seguro si va
                if (mAdyacencia[i][j] != 0) {
                    contador++;
                }
            //}
        }
    }
    return contador;
 }
 // esto salio mal
 /*function contarVertice(mAdyacencia) {
    var multiplicada = [],
        mCaminos = [],
        aux = [],
        sumada = [] = mAdyacencia,
        aux = mAdyacencia;
    for (let i = 0; i < ((vertices.length) - 1); i++) {
        Multiplicacion_de_Matriz(mAdyacencia, aux, multiplicada);
    }
    Suma_De_Matrices(multiplicada, sumada, mCaminos);
    aux = multiplicada;

    return aux.length;
}
 */

function region(mAdyacencia,mAdyacencia){
    var mAdyacencia = MatrizAdyacencia();
    let n = contarNodo(mAdyacencia);
    let e = contarVertice(mAdyacencia);
    let contador = 2 - n + e;
    return contador;
}
function imprimirregion(){
    var mAdyacencia = MatrizAdyacencia();
    const contNodo = document.querySelector("#cvertice");
    const contV = document.querySelector("#cverticeee");
    var mcontarNodo= contarNodo(mAdyacencia);
    var mcontarVertice= contarVertice(mAdyacencia);
    const contregion = document.querySelector("#cregion");
    //const contnodo = document.querySelector("#cregion");
    //const contvertice = document.querySelector("#cregion");
    var mregion= region(mcontarNodo,mcontarVertice);
    //contvertice.appendChild(drawMatriz(mcontar));
    contregion.textContent = (`la cantidad de nodos es:   [${mregion}]`);
    contregion.className = "alert alert-warning text-center mt-3 mx-3";
 }  


function imprimircontarVertice(){
    var tipo_grafo = document.querySelector("#tipoGrafo").value;
    var mAdyacencia = MatrizAdyacencia();
    const contV = document.querySelector("#cverticeee");
    var mcontarV= contarVertice(mAdyacencia);
    //contvertice.appendChild(drawMatriz(mcontar));
    if (tipo_grafo == "Dirigido"){
        contV.textContent = (`la cantidad de vertices es:   [${mcontarV}]`);
        contV.className = "alert alert-warning text-center mt-3 mx-3";
    }
    else{
        mcontarV= mcontarV/2
        contV.textContent = (`la cantidad de vertices es:   [${mcontarV}]`);
        contV.className = "alert alert-warning text-center mt-3 mx-3";
    }
}

// se llama a la matriz peso, a la mcamino y a los valores colocados por el usuario en grafos.html
 function caminoMasCorto(Matriz_Peso, mCaminos, ValorA, ValorB) {
     let recorrido = Infinity;
     let Valor1 = ValorA;
     let Valor2 = ValorB;
     console.log("a:", ValorA);
     console.log("b:", ValorB);
     console.log("a:", Valor1);
     console.log("b:", Valor2);
     for (let i = 0; i < vertices.length; i++) {
         console.log("i:", recorrido);
         for (let j = 0; j < vertices.length; j++) {
             if (Matriz_Peso[i][j] != 0) {
                 console.log("i-j:", Matriz_Peso[i][j]);
                 if (i === Valor1) {
                     if (j === Valor2) {
                         if (mCaminos[i][j] != 0) {
                             if (parseInt(Matriz_Peso[i][j]) < recorrido) {
                                 recorrido = parseInt(Matriz_Peso[i][j]);
                             } else {
                                 if (mCaminos[j][i] != 0) {
                                     if (parseInt(Matriz_Peso[j][i]) < recorrido) {
                                         recorrido = parseInt(Matriz_Peso[j][i]);
                                     }
                                 }
                             }
                         }
                     } else {
                         for (let k = 0; k < vertices.length; k++) {
                             if (k === Valor2) {
                                 if (mCaminos[i][j] != 0) {
                                     if (mCaminos[j][k] != 0) {
                                         if ((parseInt(Matriz_Peso[i][j]) + parseInt(Matriz_Peso[j][k])) < recorrido) {
                                             recorrido = (parseInt(Matriz_Peso[i][j]) + parseInt(Matriz_Peso[j][k]));
                                         } else {
                                             if (mCaminos[k][j] != 0) {
                                                 if (mCaminos[j][i] != 0) {
                                                     if ((parseInt(Matriz_Peso[k][j]) + parseInt(Matriz_Peso[j][i])) < recorrido) {
                                                         recorrido = (parseInt(Matriz_Peso[k][j]) + parseInt(Matriz_Peso[j][i]));
                                                     }
                                                 }
                                             }
                                         }
                                     }
                                 }
                             } else {
                                 for (let m = 0; m < vertices.length; m++) {
                                     if (m === Valor2) {
                                         if (mCaminos[i][j] != 0) {
                                             if (mCaminos[j][k] != 0) {
                                                 if (mCaminos[k][m] != 0) {
                                                     if ((parseInt(Matriz_Peso[i][j]) + parseInt(Matriz_Peso[j][k]) + parseInt(Matriz_Peso[k][m])) < recorrido) {
                                                         recorrido = (parseInt(Matriz_Peso[i][j]) + parseInt(Matriz_Peso[j][k]) + parseInt(Matriz_Peso[k][m]));
                                                     } else {
                                                         if (mCaminos[m][k] != 0) {
                                                             if (mCaminos[k][j] != 0) {
                                                                 if (mCaminos[j][i] != 0) {
                                                                     if ((parseInt(Matriz_Peso[m][k]) + parseInt(Matriz_Peso[k][j]) + parseInt(Matriz_Peso[j][i])) < recorrido) {
                                                                         recorrido = (parseInt(Matriz_Peso[m][k]) + parseInt(Matriz_Peso[k][j]) + parseInt(Matriz_Peso[j][i]));
                                                                     }
                                                                 }
                                                             }
                                                         }

                                                     }
                                                 }
                                             }
                                         }
                                     }
                                 }
                             }
                         }
                     }
                 }
             }
         }
     }
     return recorrido;
 }

 function Corto() {
     var matrizPeso, mCaminos, mAdya, en, sa;
     var caminoCorto;
     const entrada = document.querySelector("#entrada_camino").value;
     const salida = document.querySelector("#salida_camino").value;
     mAdya = MatrizAdyacencia();
     matrizPeso = Matriz_Pesos();
     mCaminos = MatrizCaminos(mAdya)
     en = vertices.indexOf(entrada);
     sa = vertices.indexOf(salida);


     if (en == -1 || sa == -1) {
         alert("Error \n Ingrese un valor valido en el vertice ingresado");
     } else {
         caminoCorto = caminoMasCorto(matrizPeso, mCaminos, en, sa);
         const output = document.querySelector("#caminoCorto");
         output.textContent = (`La suma de los pesos del camino más corto es de:  [${caminoCorto}]`);
         output.className = "alert alert-warning text-center mt-3 mx-3";
     }


 }


 function gradoPar(matrizA) {
     var aux = 0;
     for (let i = 0; i < matrizA.length; i++) {
         if ((matrizA[i] % 2) === 0)
             aux++;
     }
     if (aux === matrizA.length) {
         return true;
     } else {
         return false;
     }
 }

 function grado(matrizA) {
     var gradoVertice = [],
         grado = 0;
     for (let i = 0; i < matrizA.length; i++) {
         for (let j = 0; j < matrizA.length; j++) {
             grado += matrizA[i][j];
         }
         gradoVertice.push(grado);
         grado = 0;
     }
     if (gradoPar(gradoVertice) === true) {
         const output = document.querySelector("#esEuleriano");
         output.textContent = (`Además es Euleriano debido a que pasa por el camino:  [${aristas_llegada}]`);
         output.className = ("alert alert-warning text-center mx-3");
         return true;
     } else {
         return false;
     }
 }

 function esEuleriano() {
     const matrizCamino = document.querySelector("#matrizCam");
     var mAdyacencia = MatrizAdyacencia();
     var matrizCam = MatrizCaminos(mAdyacencia);
     if (grado(matrizCam) === true && matrizConexa(mAdyacencia) === false) {
         return true;
     } else {
         return false;
     }
 }

 function imprimirEuleriano() {   //aquiiiii para el corte de rrrrrrrrr
     var mAdyacencia = MatrizAdyacencia();
     const matrizCamino = document.querySelector("#matrizCam");
     var matriz_c = MatrizCaminos(mAdyacencia);
     const esEule = document.querySelector("#esEule");
     var eule = esEuleriano();
     if (eule) {
         esEule.textContent = "Su grafo es Euleriano!";
         esEule.className = "alert alert-warning text-center";
     } else {
         esEule.textContent = "Su grafo no es Euleriano :v !";
         esEule.className = "alert alert-warning text-center";
     }
 }

 function gradoHamil(mAdyacencia) {
     var gradoVertice = [],
         grado = 0;
     for (let i = 0; i < mAdyacencia.length; i++) {
         for (let j = 0; j < mAdyacencia.length; j++) {
             grado += mAdyacencia[i][j];
         }
         gradoVertice.push(grado);
         grado = 0;
     }
     return gradoVertice;
 }

 function esHamil(mAdyacencia) {
     var aux = gradoHamil(mAdyacencia);
     for (let i = 0; i < aux.length; i++) {
         if (aux[i] > 2) {
             return false;
         }
     }
     return true;
 }

 function esHamiltoniano() {
     var mAdyacencia = MatrizAdyacencia();
     if (esHamil(mAdyacencia) === true) {
         const output = document.querySelector("#esHamilton");
         output.textContent = (`Además es hamiltoniano debido a que pasa por el camino:  [${aristas_llegada}]`);
         output.className = ("alert alert-warning text-center mx-3");
         return true;
     } else {
         return false;
     }
 }

 function imprimirHamil() {
     var mAdyacencia = MatrizAdyacencia();
     const matrizCamino = document.querySelector("#matrizCam");
     var matriz_c = MatrizCaminos(mAdyacencia);
     const esHamilto = document.querySelector("#esHamilto");
     var hamil = esHamiltoniano();
     if (hamil) {
         esHamilto.textContent = "El grafo es Hamiltoniano :D";
         esHamilto.className = "alert alert-warning text-center";
     } else {
         esHamilto.textContent = "El grafo no es Hamiltoniano :V";
         esHamilto.className = "alert alert-warning text-center";
     }
 }




 function imprimirMasCorto1() {
     var en;
     const entrada = document.querySelector("#entradacamino").value;
     en = vertices.indexOf(entrada);
     if (en == -1) {
         alert("Error de ingreso! \n Ingresa un valor valido en el vertice ingresado");
     } else {
         var matrizPeso = Matriz_Pesos();
         var caminoMasCorto1 = CaminoMasCorto(matrizPeso, en);
         const output = document.querySelector("#caminoCorto");
     }
 }


 function recorrerVertices(matrizA, en, sa, raiz) {
     var ver_visitado = [],
         col = [];
         
     for (let i = 0; i < vertices.length; i++) {
         ver_visitado[i] = false;
        
     }
     col.push(en);
     ver_visitado[en] = true;
     raiz[en] = -1;
     while (col.length != 0) {
         var aux = col.shift();
         for (let i = 0; i < vertices.length; i++) {
             if (ver_visitado[i] == false && matrizA[aux][i] > 0) {
                 col.push(i);
                 raiz[i] = aux;
                 ver_visitado[i] = true;
             }
         }
     }
     return (ver_visitado[sa] == true);
 }

 /*function ContarV(matrizA, en, sa, raiz) {
    var ver_visitado = [],
    col = [];
    cont=0;
    for (let i = 0; i < vertices.length; i++) {
        ver_visitado[i] = false;
        cont++;
    }
    col.push(en);
    ver_visitado[en] = true;
    raiz[en] = -1;
    while (col.length != 0) {
        var aux = col.shift();
        for (let i = 0; i < vertices.length; i++) {
            if (ver_visitado[i] == false && matrizA[aux][i] > 0) {
                col.push(i);
                raiz[i] = aux;
                ver_visitado[i] = true;
                cont++;
            }
        }
    }
    return (cont);
}
*/
/*function imprimircontarv(){
    var en, sa;
    const entrada = document.querySelector("#entrada_flujo").value;
    const salida = document.querySelector("#salida_flujo").value;
    var tipo_grafo = document.querySelector("#tipoGrafo").value;
    if (tipo_grafo === "Dirigido") {
        en = vertices.indexOf(entrada);
        sa = vertices.indexOf(salida);
        if (en == -1 || sa == -1) {
            alert("Error \n Ingrese un valor valido en el vertice ingresado");
        } 
        else {
            var matrizPeso = Matriz_Pesos();
            var mcontarv = ContarV(matrizPeso, en, sa);
            const output = document.querySelector("#flujovertice");
            output.textContent = (`la cantidad de vertices es :  [${mcontarv}]`);
            output.className = "alert alert-warning text-center";
        }
    }
} 
*/



 function calcularFlujo(matrizA, en, sa) {
     var matriz_aux = matrizA;
     var raiz = new Array(vertices.length);
     var flujoC = 0;
     var aux;

     while (recorrerVertices(matriz_aux, en, sa, raiz)) {
         var flujoMaximo = Number.MAX_VALUE;
         for (let i = sa; i != en; i = raiz[i]) {
             aux = raiz[i];
             flujoMaximo = Math.min(flujoMaximo, matriz_aux[aux][i]);
         }
         for (let i = sa; i != en; i = raiz[i]) {
             aux = raiz[i];
             matriz_aux[aux][i] -= flujoMaximo;
             matriz_aux[i][aux] += flujoMaximo;
         }
         flujoC += flujoMaximo;
     }
     return flujoC;
 }
 

 function ImprimirFlujoMaximo() {
     var en, sa;
     const entrada = document.querySelector("#entrada_flujo").value;
     const salida = document.querySelector("#salida_flujo").value;
     var tipo_grafo = document.querySelector("#tipoGrafo").value;
     if (tipo_grafo === "Dirigido") {
         en = vertices.indexOf(entrada);
         sa = vertices.indexOf(salida);
         if (en == -1 || sa == -1) {
             alert("Error \n Ingrese un valor valido en el vertice ingresado");
         } else {
             var matrizPeso = Matriz_Pesos();
             var flujoMaximo = calcularFlujo(matrizPeso, en, sa);
             const output = document.querySelector("#flujoMax");
             output.textContent = (`El flujo máximo de la ruta de vertices es de:  [${flujoMaximo}]`);
             output.className = "alert alert-warning text-center";
         }
     } else {
         const popAlert = document.querySelector("#popAlert");
         popAlert.textContent = "El flujo máximo es solo para grafos dirigidos :v !";
         popAlert.className = "alert alert-danger text-center";

     }
 }


 function Prim(Matriz_Peso) {
     var vertice1;
     var vertice2;
     var aux = [];
     var aux1 = [];
     var aux2;
     var aux3 = [];
     var aux4;
     var aux5;
     var col = [];
     for (let z = 0; z < vertices.length; z++) {
         aux.push(vertices[z]);
     }
     let k = 0;
     let p = 0;
     let aux_mayor = Infinity;
     for (let i = 0; i < vertices.length; i++) {
         if (aux3[i] != 0) {
             for (let j = 0; j < vertices.length; j++) {
                 if (k != 0) {
                     if (parseInt(Matriz_Peso[k][j]) != 0) {
                         if (parseInt(Matriz_Peso[k][j]) < aux_mayor) {
                             aux_mayor = parseInt(Matriz_Peso[k][j]);
                             vertice1 = aux[k];
                             vertice2 = aux[j];
                             k = j;
                             p = k;
                             if (j === (vertices.length - 1)) {
                                 aux_mayor = Infinity;
                                 aux2 = aux[k];
                                 for (let o = 0; o < vertices.length; o++) {
                                     if (aux[o] === aux2) {
                                         aux3.push(0);
                                     } else {
                                         aux3.push(aux[o]);
                                     }
                                 }
                             }
                         } else {
                             if (j === (vertices.length - 1)) {
                                 aux_mayor = Infinity;
                                 aux2 = aux[k];
                                 for (let o = 0; o < vertices.length; o++) {
                                     if (aux[o] === aux2) {
                                         aux3.push(0);
                                     } else {
                                         aux3.push(aux[o]);
                                     }
                                 }
                             }
                         }

                     } else {
                         if (j === (vertices.length - 1)) {
                             aux_mayor = Infinity;
                             aux2 = aux[k];
                             for (let o = 0; o < vertices.length; o++) {
                                 if (aux[o] === aux2) {
                                     aux3.push(0);
                                 } else {
                                     aux3.push(aux[o]);
                                 }
                             }
                         }
                     }

                 } else {
                     for (let l = 0; l < vertices.length; l++) {
                         if (parseInt(Matriz_Peso[i][l]) != 0) {

                             if (parseInt(Matriz_Peso[i][l]) < aux_mayor) {
                                 aux_mayor = parseInt(Matriz_Peso[i][l]);
                                 vertice1 = aux[i];
                                 vertice2 = aux[l];
                                 console.log("el numero que tomo", Matriz_Peso[i][l]);
                                 console.log(vertice1, "----->", vertice2);
                                 aux4 = vertice1;
                                 col.push(aux4);
                                 aux5 = vertice2;
                                 col.push("--->");
                                 col.push(aux5);
                                 col.push("--->");
                                 k = l;
                                 p = i;
                                 if (l === (vertices.length - 1)) {
                                     aux_mayor = Infinity;
                                     aux2 = aux[k];
                                     for (let o = 0; o < vertices.length; o++) {
                                         if (aux[o] === aux2) {
                                             aux3.push(0);
                                         } else {
                                             aux3.push(aux[o]);
                                         }
                                     }
                                 }
                             } else {
                                 if (l === (vertices.length - 1)) {
                                     aux_mayor = Infinity;
                                     aux2 = aux[k];
                                     for (let o = 0; o < vertices.length; o++) {
                                         if (aux[o] === aux2) {
                                             aux3.push(0);
                                         } else {
                                             aux3.push(aux[o]);
                                         }
                                     }
                                 }
                             }
                         } else {
                             if (l === (vertices.length - 1)) {
                                 aux_mayor = Infinity;
                                 aux2 = aux[k];
                                 for (let o = 0; o < vertices.length; o++) {
                                     if (aux[o] === aux2) {
                                         aux3.push(0);
                                     } else {
                                         aux3.push(aux[o]);
                                     }
                                 }
                             }
                         }
                     }
                 }
             }
             console.log(vertice1, "----->", vertice2);
             aux4 = vertice1;
             col.push(aux4);
             aux5 = vertice2;
             col.push("--->");
             col.push(aux5);
             col.push("--->");
         }
     }
     return col;
 }

 function imprimirPrim() {
     var tipo_grafo = document.querySelector("#tipoGrafo").value;
     const matrizAdy = document.querySelector("#matrizAdy");
     var mAdyacencia = MatrizAdyacencia();
     const matrizCamino = document.querySelector("#matrizCam");
     var matriz_c = MatrizCaminos(mAdyacencia);
     const saberCon = document.querySelector("#saberConexo");
     const output = document.querySelector("#algoritmoPrim");
     var conexo = matrizConexa(matriz_c);
     //if (tipo_grafo !== "Dirigido" && conexo == true) {
         console.log("ENTRO AL IFFFF");
         var matrizPeso = Matriz_Pesos();
         var esPrim = Prim(matrizPeso);
         console.log("eso mismo");
         output.textContent = (`El arbol generado es : [${esPrim}]`);
         output.className = "alert alert-warning text-center mt-2";
     //}else {
      //   console.log("ESTE GRAFO NO ES CONEXO");
       //  const popAlert = document.querySelector("#popAlertprim");
       //  popAlert.textContent = "El arbol generador  es exclusivo para grafos no dirigidos y además conexos!";
        // popAlert.className = "alert alert-danger text-center";
     }

 }