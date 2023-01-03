require('dotenv').config();
const { leerInput, inquirerMenu, pausa, listarLugares } = require("./helpers/inquirer");
const Busquedas = require("./models/busqueda");

const main = async () => {
  const busquedas = new Busquedas();
  let opt;

  do {

    opt = await inquirerMenu();

    switch (opt) {
      case 1:
        //Mostrar mensajes
        const lugar = await leerInput('Ciudad: ');
        
        // Buscar los lugares
        const lugares = await busquedas.ciudad(lugar);
        
        // Seleccionar el lugar
        const id = await listarLugares(lugares);
        if (id === '0') continue;
        const lugarSelected = lugares.find( l => l.id === id );
        // Guardar en db
        busquedas.agregarHistorial(lugarSelected.nombre);
        // console.log(lugarSelected)

        // Datos del clima
        const clima = await busquedas.climaLugar(lugarSelected.lat, lugarSelected.lng);
        // console.log(clima)

        // Mostrar resultados

        console.log('\nInformacion de la ciudad\n'.blue);
        console.log('Ciudad: ', lugarSelected.nombre);
        console.log('Lat: ', lugarSelected.lat);
        console.log('Lng: ', lugarSelected.lng);
        console.log('Temperatura: ', clima.temp)
        console.log('Mínima: ', clima.min);
        console.log('Máxima: ', clima.max);
        console.log('Cómo está el clima?: ', clima.desc)

        break;

        case 2:
          busquedas.historialCapitalizado.forEach((lugar, i) => {
            const idx = `${i + 1}.`.green
            console.log(`${idx} ${lugar}`)
          })
        break;
    }


    if (opt !== 0) await pausa();

  } while (opt !== 0)
}

main();