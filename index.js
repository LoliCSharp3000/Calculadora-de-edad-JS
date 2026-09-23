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
const main = async () =>{
    const year = Number(await preguntar("Ingrese el año de nacimiento: "));
    const month = Number(await preguntar("Ingrese el mes de nacimiento: "));
    const day = Number(await preguntar("Ingrese el dia de nacimiento: "));

    try {
        const client = new Date(year, month - 1, day);
        if(client.getFullYear() !== year || 
        client.getMonth() !== month - 1 || 
        client.getDate() !== day){
            throw new Error("la fecha ingresada no es valida");
        }
        if(client > today){
            throw new Error("la fecha no puede ser futura");
        }
        const edad = calcularEdad(client, today);
        console.log(`Tienes ${edad} años`);
    } catch (error) {
        console.log("Error: " + error.message);
    }
    rl.close();
}
main();