class Location {
  constructor({ id, city, province, country, postalCode }) {
    this.id = id;
    this.city = city;
    this.province = province;
    this.country = country;
    this.postalCode = postalCode;
  }
}

module.exports = Location;
