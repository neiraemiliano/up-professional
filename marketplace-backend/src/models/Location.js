class Location {
  constructor({ id, professionalId, city, latitude, longitude }) {
    this.id = id;
    this.professionalId = professionalId;
    this.city = city;
    this.latitude = latitude;
    this.longitude = longitude;
  }
}

module.exports = Location;
