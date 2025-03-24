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
    fetch("Parque Estadual Fonte Grande.geojson")
      .then((response) => response.json())
      .then((data) => {
        console.log("GeoJSON loaded successfully");
        
        // If you need to adjust coordinates due to vertical displacement
        // This is a simple vertical adjustment - modify the offset as needed
        const verticalOffset = -0.0025; // Approximately 300m at this latitude
        
        // Create a deep copy of the data to avoid modifying the original
        const adjustedData = JSON.parse(JSON.stringify(data));
        
        // Apply the correction to each coordinate
        if (adjustedData.geometry && adjustedData.geometry.coordinates) {
          // For single geometry objects
          adjustCoordinates(adjustedData.geometry.coordinates, verticalOffset);
        } else if (adjustedData.features) {
          // For feature collections
          adjustedData.features.forEach(feature => {
            if (feature.geometry && feature.geometry.coordinates) {
              adjustCoordinates(feature.geometry.coordinates, verticalOffset);
            }
          });
        }
        
        // Create and add the GeoJSON layer to the map
        const geojsonLayer = L.geoJSON(adjustedData, {
          style: style
        }).addTo(map);
        
        // Fit the map to the bounds of the GeoJSON feature
        map.fitBounds(geojsonLayer.getBounds());
      })
      .catch((error) => console.error("Error loading GeoJSON:", error));
      
    // Helper function to adjust coordinates recursively
    function adjustCoordinates(coords, offset) {
      if (Array.isArray(coords[0]) && typeof coords[0][0] === 'number') {
        // We have a simple coordinate pair array
        for (let i = 0; i < coords.length; i++) {
          coords[i][1] += offset; // Adjust latitude (vertical position)
        }
      } else if (Array.isArray(coords[0])) {
        // We have a nested array structure
        for (let i = 0; i < coords.length; i++) {
          adjustCoordinates(coords[i], offset);
        }
      }
    }
  });
  