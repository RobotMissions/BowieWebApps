/*
Robot Missions Field Test Data Map
----------------------------------

Display Bowie's sensor data onto a MapboxGL map
Based on this meteorite example:
https://mappa.js.org/docs/animated-meteorite-landings.html
Uses p5.js and mappa.js

----------------------------------
Project started April 2018
Revisiting now December 2019
by Erin RobotGrrl for Robot Missions
*/

// API Key for MapboxGL. Get one here:
// https://www.mapbox.com/studio/account/tokens/
let key;


// Options for map
const options = { 
  lat: 34.142172,
  lng: -118.149646,
  //lat: 45.3948631,
  //lng: -75.7611084,
  zoom: 17,
  //style: 'mapbox://styles/robotmissions/cjs6q3gdh04yb1ft8avzbb5zz', // too light
  //style: 'mapbox://styles/mapbox/traffic-night-v2', // dark
  style: 'mapbox://styles/mapbox/satellite-v9', // real, nice
  pitch: 50,
};


// Create an instance of Mapboxgl
let mappa;
let myMap;

let canvas;
let meteorites;

var current_time = 0;
var point_interval = 1;
var last_point = 0;
var point_index = 0;
var completed_points = false;

var min_temp = -1;
var max_temp = -1;
var temperature_range = -1;
var num_intervals = 3;
var temperature_interval = -1;

function preload() {
  // Load the data
  meteorites = loadTable('data/hackaday_environmental_log.csv', 'csv', 'header');
  //meteorites = loadTable('data/og_season_finale_environmental_log.csv', 'csv', 'header');
  key = loadStrings('mapboxkey.txt');
  console.log(key);
  mappa = new Mappa('MapboxGL', key);
}


function setup() {
  canvas = createCanvas(800, 700);//.parent('canvasContainer');

  // Calculate the intervals
  for (let i = 0; i < meteorites.getRowCount(); i += 1) {
    let temperature = meteorites.getString(i, 'Temperature');
    temperature = float(temperature);
    if(i == 0) {
      min_temp = temperature;
      max_temp = temperature;
    }
    if(temperature < min_temp) min_temp = temperature;
    if(temperature > max_temp) max_temp = temperature;
  }

  temperature_range = max_temp-min_temp;
  temperature_interval = temperature_range/num_intervals;

  console.log("temperature_range = " + temperature_range + " max = " + max_temp + " min = " + min_temp + " temperature_interval = " + temperature_interval);

  let a = ( float(min_temp) + (0*temperature_interval) );
  let b = ( float(min_temp) + (1*temperature_interval) );
  let c = ( float(min_temp) + (2*temperature_interval) );

  console.log('A = ' + a );
  console.log('B = ' + b );
  console.log('C = ' + c );

  // Create a tile map and overlay the canvas on top.
  myMap = mappa.tileMap(options);
  myMap.overlay(canvas);

  // Only redraw the meteorites when the map change and not every frame.
  //myMap.onChange(drawMeteorites);

}

function draw() {

  current_time = millis();

  if(current_time-last_point > point_interval && completed_points == false) {
    const latitude = Number(meteorites.getString(point_index, 'GPS Latitude'));
    const longitude = Number(meteorites.getString(point_index, 'GPS Longitude'));
    const pos = myMap.latLngToPixel(latitude, longitude);
    
    let temperature = meteorites.getString(point_index, 'Temperature');
    
    stroke(255, 40);

    //console.log(temperature);

    

    if(float(temperature) >= min_temp + (2*temperature_interval) ) {//} && temperature < min_temp + (1*temperature_interval)) {
      //console.log('A');
      fill(50, 255, 50, 10);
    } else if(float(temperature) >= min_temp + (1*temperature_interval) ) {//} && temperature < min_temp + (2*temperature_interval)) {
      //console.log('B');
      fill(200, 200, 10, 10);
    } else if(float(temperature) >= min_temp + (0*temperature_interval) ) {//} && temperature < min_temp + (3*temperature_interval)) {
      //console.log('C');
      fill(255, 50, 50, 10);
    }
    
    ellipse(pos.x, pos.y, 20, 20);

    point_index++;
    last_point = current_time;

    if(point_index >= meteorites.getRowCount()) completed_points = true;
  }

}

function drawMeteorites() {
  
  console.log("Redrawing...");

  // Clear the canvas
  clear();

  for (let i = 0; i < meteorites.getRowCount(); i += 1) {
    // Get the lat/lng of each meteorite
    const latitude = Number(meteorites.getString(i, 'GPS Latitude'));
    const longitude = Number(meteorites.getString(i, 'GPS Longitude'));

    //console.log("Lat: " + latitude);
    //console.log("Lon: " + longitude);

    // Transform lat/lng to pixel position
    const pos = myMap.latLngToPixel(latitude, longitude);
    // Get the size of the meteorite and map it. 60000000 is the mass of the largest
    // meteorite (https://en.wikipedia.org/wiki/Hoba_meteorite)
    let size = meteorites.getString(i, 'Temperature');
    size = map(size, 558, 60000000, 1, 25) + myMap.zoom();
    
    fill(109, 255, 0, 10);
    stroke(100);
    ellipse(pos.x, pos.y, size, size);
  }

  console.log("Done");
}



