const fs = require('fs').promises;

class ProductsManager {
  #products;
  idAuto = 0;

  constructor() {
    this.#products = [];
    this.fileName = './products.json';
  }

 // Este método carga los datos de productos del archivo JSON products.json.
  async loadData() {
    try {
      const products = await this.getProducts();
      this.#products = products;
      this.idAuto = products.length;
    } catch (error) {
      console.log(`The file ${this.fileName} does not exist, creating...`);
      await fs.writeFile(this.fileName, '[]');
    }
  }

  // Este método agrega un nuevo producto al archivo JSON products.json. Si el producto se agrega con éxito, devuelve el mensaje "Product created successfully".
  async addProduct(product) {
    try {
      if (!product.title || !product.price || !product.description || !product.thumbnail || !product.code || !product.stock) {
        throw new Error('Incomplete product information');
      }

      this.idAuto = this.idAuto + 1;
      const newProduct = { ...product, id: this.idAuto };
      this.#products.push(newProduct);

      await fs.writeFile(this.fileName, JSON.stringify(this.#products));
      return 'Product created successfully';
    } catch (error) {
      console.log(error);
      throw new Error('Error creating product');
    }
  }

  // Este método devuelve una lista de todos los productos almacenados en el archivo JSON products.json.
  async getProducts() {
    try {
      const products = await fs.readFile(this.fileName, { encoding: 'utf-8' });
      return JSON.parse(products);
    } catch (error) {
      console.log(`The file ${this.fileName} does not exist, creating...`);
      await fs.writeFile(this.fileName, '[]');
      return [];
    }
  }

  // Este método devuelve un solo producto que coincide con el ID proporcionado. Si el producto no existe, se lanzará un error y se capturará en el bloque catch.
  async getProductById(productId) {
    try {
      const product = this.#products.find((product) => productId === product.id);
      if (!product) {
        throw new Error(`The product with id ${productId} does not exist`);
      }
      return product;
    } catch (error) {
      console.log(error);
      throw new Error('Error fetching product');
    }
  }


  // Este método actualiza un producto existente en el archivo JSON products.json. Si el producto se actualiza con éxito, devuelve el mensaje "Producto actualizado con éxito".
  async updateProduct(productId, updatedProduct) {
    try {
      const productIndex = this.#products.findIndex((product) => product.id === productId);
      if (productIndex === -1) {
        return "Producto no encontrado";
      }

      const updatedProductWithId = {
        ...updatedProduct,
        id: productId
      };

      this.#products[productIndex] = updatedProductWithId;

      await fs.writeFile(this.fileName, JSON.stringify(this.#products));

      return "Producto actualizado con éxito";
    } catch (error) {
      console.log(error);
    }
  }

  // Este método elimina un producto existente del archivo JSON products.json. Si el producto se elimina con éxito, devuelve el mensaje "Producto eliminado con éxito".
  async deleteProduct(productId) {
    try {
      const productIndex = this.#products.findIndex((product) => product.id === productId);
      if (productIndex === -1) {
        return "Producto no encontrado";
      }

      this.#products.splice(productIndex, 1);

      await fs.writeFile(this.fileName, JSON.stringify(this.#products));

      return "Producto eliminado con éxito";
    } catch (error) {
      console.log(error);
    }
  }
}

const main1 = async () => {
  try {
    const productsManager = new ProductsManager();
    await productsManager.loadData();

    const res = await productsManager.addProduct({
      title: 'Nike Magista 11',
      price: 7000,
      description: 'Championes de Futbol Nike',
      thumbnail: 'No image yet',
      code: 'ADP98562',
      stock: 40,
    });

  console.log(res);  
 const productosSS = await productsManager.getProducts()
 console.log(productosSS);

  }catch{

  }
}

main1();
