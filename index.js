const readLine = require("readline");
const today = new Date();
const rl = readLine.createInterface({
    input: process.stdin,
    output: process.stdout
});
const calcularEdad = (fechaNacimiento, fechaHoy) => {
    let edad = fechaHoy.getFullYear() - fechaNacimiento.getFullYear();
    if(fechaHoy.getMonth() < fechaNacimiento.getMonth() || 
       (fechaHoy.getMonth() === fechaNacimiento.getMonth() && 
        fechaHoy.getDate() < fechaNacimiento.getDate())){
        edad--;
    }
    return edad;
};
const preguntar = (texto) =>{
    return new Promise(resolve => {
        rl.question(texto, respuesta =>{
            resolve(respuesta);
        })
    })
};
const pedirFecha = async () =>{
    const year = Number(await preguntar("Ingrese el año de nacimiento: "));
    const month = Number(await preguntar("Ingrese el mes de nacimiento: "));
    const day = Number(await preguntar("Ingrese el dia de nacimiento: "));
    if(isNaN(year) || isNaN(month) || isNaN(day)){
        throw new Error("la fecha ingresada no es valida");
    }
    const client = new Date(year, month - 1, day);
    if(client.getFullYear() !== year || 
    client.getMonth() !== month - 1 || 
    client.getDate() !== day){
        throw new Error("la fecha ingresada no es valida");
    }
    if(client > today){
        throw new Error("la fecha no puede ser futura");
    }
    return client;
}
const main = async () =>{
    let fun = false;
    let personas = [];
    while(!fun){
        try{
            console.log("1. Calcular edad\n2. Guardar persona\n3. Ver personas\n4. Buscar persona\n5. Estadísticas\n6. Salir");
            const opcion = await preguntar("Ingrese una opción: ");
            switch(opcion){
                case "1":
                    const client = await pedirFecha(); 
                    const edad = calcularEdad(client, today);
                    console.log(`La edad es: ${edad} años`);
                break;
                case "2":
                    let persona = {
                        nombre: await preguntar("Ingrese el nombre de la persona: "),
                        fechaNacimiento: await pedirFecha()
                    };
                    personas.push(persona);
                break;
                case "3":
                    if(personas.length === 0){
                        console.log("No hay personas guardadas.");
                    }else{
                        console.log("Personas guardadas:");
                        personas.forEach(persona => {
                            console.log(`Nombre: ${persona.nombre}, Fecha de nacimiento: ${persona.fechaNacimiento.toLocaleDateString()}`);
                        })
                    }
                break;
                case "4":
                    const nombreBuscar = await preguntar("Ingrese el nombre de la persona a buscar: ");
                    const personaEncontrada = personas.find(persona => persona.nombre.toLowerCase() === nombreBuscar.toLowerCase());
                    if(personaEncontrada){
                        console.log(`Nombre: ${personaEncontrada.nombre}, Fecha de nacimiento: ${personaEncontrada.fechaNacimiento.toLocaleDateString()}`);
                    }else{
                        console.log("Persona no encontrada.");
                    }
                break;
                case "5":
                    if(personas.length === 0){
                        console.log("No hay personas guardadas para calcular estadísticas.");
                    }else{
                        console.log("===== ESTADÍSTICAS =====\n");
                        console.log(`Personas registradas: ${personas.length}`);
                        const edades = personas.map(persona =>{
                            return calcularEdad(persona.fechaNacimiento, today);
                        });
                        const suma = edades.reduce((total, edad) => {
                            return total + edad;
                        }, 0);
                        const media = suma / edades.length;
                        console.log(`Edad media: ${media.toFixed(2)} años`);
                        let menor;
                        let mayor;
                        for(let i = 0; i < personas.length; i++){
                            if(i === 0){
                                menor = personas[i];
                                mayor = personas[i];
                            }else{
                                if(calcularEdad(personas[i].fechaNacimiento, today) <
                                calcularEdad(menor.fechaNacimiento, today)){
                                    menor = personas[i];
                                }
                                if(calcularEdad(personas[i].fechaNacimiento, today) >
                                calcularEdad(mayor.fechaNacimiento, today)){
                                    mayor = personas[i];
                                }
                            }
                        }
                        console.log(`Persona más joven: ${menor.nombre}, edad: ${calcularEdad(menor.fechaNacimiento, today)} años`);
                        console.log(`Persona más vieja: ${mayor.nombre}, edad: ${calcularEdad(mayor.fechaNacimiento, today)} años`);
                        const mayores = personas.filter(persona => calcularEdad(persona.fechaNacimiento, today) >= 18);
                        const menores = personas.filter(persona => calcularEdad(persona.fechaNacimiento, today) < 18);
                        console.log(`Cantidad de personas mayores de edad: ${mayores.length}`);
                        console.log(`Cantidad de personas menores de edad: ${menores.length}`);
                    }
                break;
                case "6":
                    console.log("Saliendo del programa...");
                    fun = true;
                break;
                default:
                    console.log("Opción no válida. Por favor, ingrese una opción del 1 al 6.");
                break;
            } 
        }catch(error){
            console.log("Error: " + error.message);
        }
    }
    rl.close();
}
main();