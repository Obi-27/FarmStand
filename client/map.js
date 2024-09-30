const access_token = 'pk.eyJ1IjoiemFjaG03MTE1IiwiYSI6ImNsaDlmYTd6cTA2dDIzdG9pNDJrNGxldmEifQ.Dd04Jw0u9SktyqkJj0YM4g';
mapboxgl.accessToken = access_token;
import * as crud from './crud.js';

let frontendAddress = '127.0.0.1:5500'
//Create the map
let map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-74.5, 40], // Starting position [lng, lat]
    zoom: 4.8 // Starting zoom
});

// Add navigation control
map.addControl(new mapboxgl.NavigationControl());

//Fetch all farms from the server
let farms = await crud.getAllStands(); // load in all stands

//Create address objects from the farm objects
let addresses = farms.map(async f => {
    try {
      let response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(f.address)}.json?access_token=${access_token}`);
      let data = await response.json();

      //If the address is not valid, send farm to longitude latitude (0, 0)
      let coords = [0, 0];
      if (data.features.length > 0) {
        coords = data.features[0].center;
      }
      
      //Link to farm stand page
      let link = "/farmPage.html?id="+f.farmId;
      return {name: f.name, address: f.address, coordinates: coords, link: link};
    } catch (error) {
      console.error(error);
    }
});

let resolvedAddresses = await Promise.all(addresses);

// Create a new instance of Supercluster
//Supercluster groups nearby listings together
const supercluster = new Supercluster({
  radius: 50,
  maxZoom: 16,
});

// Add your resolved addresses to the Supercluster instance
supercluster.load(resolvedAddresses.map(address => ({
  type: 'Feature',
  geometry: {
    type: 'Point',
    coordinates: address.coordinates,
  },
  properties: {
    name: address.name,
    address: address.address,
    link: address.link,
  },
})));

//Update the map every time the page is zoomed in our out
map.on("zoomend", drawMap);

//Initial draw
drawMap();

function drawMap() {
  let zoom = map.getZoom();
  let clusters = supercluster.getClusters([-180, -90, 180, 90], zoom);

  // Remove existing markers from the map
  document.querySelectorAll(".marker").forEach(function(marker) {
    marker.remove();
  });
  document.querySelectorAll(".cluster-marker").forEach(function(marker) {
    marker.remove();
  });

  // Add new markers to the map
  clusters.forEach(function(cluster) {
    if (cluster.properties.cluster) {
      // Create a DOM element for the cluster marker
      let el = document.createElement("div");
      el.className = "cluster-marker";
      el.style.width = el.style.height = `${40 + (cluster.properties.point_count / resolvedAddresses.length) * 20}px`;

      // Create a span for the text and add it to the parent div
      let span = document.createElement("span");
      span.innerText = cluster.properties.point_count;
      el.appendChild(span);

      // Add styles for the circle
      el.style.borderRadius = "50%";
      el.style.color = "white";
      el.style.backgroundColor = "green";
      el.style.display = "flex";
      el.style.justifyContent = "center";
      el.style.alignItems = "center";

      // Add the cluster marker to the map
      new mapboxgl.Marker(el)
        .setLngLat(cluster.geometry.coordinates)
        .addTo(map);
    } else {
      // Create a DOM element for the marker
      let el = document.createElement("div");
      el.className = "marker";

      //Create pin on the map with image
      let icon = document.createElement("img");
      icon.src = "https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png";
      icon.style.width = "20px";
      icon.style.height = "24px";
      icon.style.marginBottom = "0px";

      // Create a link with the address name and link
      let link = document.createElement("a");
      link.href = cluster.properties.link;
      link.innerText = cluster.properties.name;

      // Add the icon and link to the marker element
      el.appendChild(icon);
      el.appendChild(link);

      // Use flexbox layout to center the image and text vertically
      el.style.display = "flex";
      el.style.flexDirection = "column";
      el.style.alignItems = "center";

      // Add the marker to the map
      new mapboxgl.Marker(el)
        .setLngLat(cluster.geometry.coordinates)
        .addTo(map);
    }
  });
}