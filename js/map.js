document.addEventListener("DOMContentLoaded", function () {
    // Create map with a view centered on the approximate area
    const map = L.map("map").setView([-20.304598, -40.339163], 12);
  
    // Add OpenStreetMap tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors - " + new Date().getFullYear(),
      maxZoom: 19,
    }).addTo(map);
  
    // Define style for the GeoJSON feature
    function style() {
      return {
        fillColor: "green",
        weight: 2,
        opacity: 1,
        color: "red",
        fillOpacity: 0.3,
      };
    }
  
    // Fetch and process the GeoJSON data
    fetch("parque.geojson")
      .then((response) => response.json())
      .then((data) => {
        console.log("GeoJSON loaded successfully");
        
        // Create and add the GeoJSON layer to the map
        const geojsonLayer = L.geoJSON(data, {
          style: style
        }).addTo(map);
        
        // Fit the map to the bounds of the GeoJSON feature
        map.fitBounds(geojsonLayer.getBounds());
      })
      .catch((error) => console.error("Error loading GeoJSON:", error));
  });
  