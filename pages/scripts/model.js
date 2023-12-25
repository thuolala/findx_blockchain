class NSX {
    constructor(id, name, address, phone, email) {
      this.id = id;
      this.name = name;
      this.address = address;
      this.phone = phone;
      this.email = email;
    }
}

class NCC {
    constructor(id, name, address, phone, email) {
      this.id = id;
      this.name = name;
      this.address = address;
      this.phone = phone;
      this.email = email;
    }
}

class Account {
    constructor(email, password) {
      this.email = email;
      this.password = password;
    }
}

class Category {
    constructor(id, name) {
      this.id = id;
      this.name = name;
    }
}

class Product {
    constructor(id, category_id, name) {
      this.id = id;
      this.category_id = category_id;
      this.name = name;
    }
}

const model = {
    NSX,
    NCC,
    Category,
    Product,
};

module.exports = model;


