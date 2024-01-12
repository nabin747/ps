<template>
  <div id="mapContainer" class="overflow-hidden z-0"></div>
</template>

<script>
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-search/dist/leaflet-search.min.css";
import "leaflet-search";

export default {
  name: "LeafletMap",
  data() {
    return {
      map: null,
      latitude: null,
      longitude: null,
      parkingDetails: null,
    };
  },
  created() {
    const success = (position) => {
      this.latitude = "27.67154318133275";
      this.longitude = "85.33878121896521";

      // Initialize Leaflet map
      this.map = L.map("mapContainer").setView([this.latitude, this.longitude], 15);

      // Add OpenStreetMap tile layer
      L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(this.map);

      // Mock parking details for initial marker
      this.parkingDetails = {
        parkingName: "NCIT Parking Lot",
        capacity: {
          car: 30,
          bike: 152,
        },
        availableSpots: {
          car: 20,
          bike: 70,
        },
        pricePerHour: `Rs. 0 (Free Parking)`,
      };

      // Add initial marker
      const initialMarker = L.marker([this.latitude, this.longitude], { draggable: true }).addTo(this.map);
      initialMarker.bindPopup(this.generatePopupContent(this.parkingDetails));

      // Add two more markers with sample data
      const marker2 = L.marker([27.672179842487765, 85.33588443613635], { draggable: true }).addTo(this.map);
      const marker3 = L.marker([27.669597006784084, 85.33476142952517], { draggable: true }).addTo(this.map);

      // Set popup content for each additional marker
      marker2.bindPopup(this.generatePopupContent(this.mockApiData()));
      marker3.bindPopup(this.generatePopupContent(this.mockApiData1()));

      // Listen for dragend event on the initial marker
      initialMarker.on("dragend", async (event) => {
        const newLatLng = event.target.getLatLng();
        this.latitude = newLatLng.lat;
        this.longitude = newLatLng.lng;

        // Mock API call for parking details
        this.parkingDetails = await this.mockApiData();

        // Update initial marker popup content
        initialMarker.setPopupContent(this.generatePopupContent(this.parkingDetails));

        // Log or use the updated coordinates as needed
        console.log("New Marker Location:", this.latitude, this.longitude);
      });

      // Add search control
      const searchControl = new L.Control.Search({
        position: "topright",
        layer: L.layerGroup().addTo(this.map),
      });
      this.map.addControl(searchControl);
    };

    const error = (err) => {
      console.error(err);
    };

    // This will open the permission popup
    navigator.geolocation.getCurrentPosition(success, error);
  },
  methods: {
    // Mock API data for parking details
    mockApiData() {
      return {
        parkingName: "BalKumari Parking",
        capacity: {
          car: 10,
          bike: 120,
        },
        availableSpots: {
          car: 3,
          bike: 50,
        },
        pricePerHour: `Rs. 20`,
      };
    },
    mockApiData1() {
      return {
        parkingName: "EPS Parking",
        capacity: {
          car: 20,
          bike: 250,
        },
        availableSpots: {
          car: 5,
          bike: 105,
        },
        pricePerHour: `Rs. 20`,
      };
    },
    // Generate popup content for parking details
    generatePopupContent(details) {
      return `
        <div>
          <strong>${details.parkingName}</strong><br>
          <em>Capacity:</em> <br>
          &nbsp; &nbsp; Car: ${details.capacity.car}<br>
          &nbsp; &nbsp;  Bike: ${details.capacity.bike}<br>
          <em>Available Spots: </em><br>
          &nbsp; &nbsp; Car: ${details.availableSpots.car}<br>
          &nbsp; &nbsp;  Bike: ${details.availableSpots.bike}<br>
          Price Per Hour: ${details.pricePerHour}
        </div>
      `;
    },
  },
  onBeforeUnmount() {
    if (this.map) {
      this.map.remove();
    }
  },
};
</script>
