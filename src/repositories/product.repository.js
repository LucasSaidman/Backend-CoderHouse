const ProductModel = require("../models/products.model.js");


class ProductRepository {
    async agregarProducto({ title, description, price, img, code, stock, category, thumbnails, owner }) {
        try {
            if (!title || !description || !price || !code || !stock || !category) {
                console.log("Todos los campos son obligatorios");
                return;
            }

            const existeProducto = await ProductModel.findOne({ code: code });

            if (existeProducto) {
                throw new Error(EErrors.PRODUCTO_EXISTE);
            }

            const newProduct = new ProductModel({
                title,
                description,
                price,
                img,
                code,
                stock,
                category,
                status: true,
                thumbnails: thumbnails || [],
                owner
            });

            await newProduct.save();

            return newProduct;

        } catch (error) {
            //throw new Error(EErrors.ERROR_GENERAL);
            console.log("fallooo", error);
        }
    }

    async obtenerProductos({limit = 100, page = 1, sort, query} = {}) {
        try {
            const skip = (page - 1) * limit;

            let queryOptions = {};

            if (query) {
                queryOptions = { category: query };
            }

            const sortOptions = {};
            if (sort) {
                if (sort === 'asc' || sort === 'desc') {
                    sortOptions.price = sort === 'asc' ? 1 : -1;
                }
            }

            const productos = await ProductModel
                .find(queryOptions)
                .sort(sortOptions)
                .skip(skip)
                .limit(limit);

            const totalProducts = await ProductModel.countDocuments(queryOptions);
            
            const totalPages = Math.ceil(totalProducts / limit);
            
            const hasPrevPage = page > 1;
            const hasNextPage = page < totalPages;
            

            return {
                docs: productos,
                totalPages,
                prevPage: hasPrevPage ? page - 1 : null,
                nextPage: hasNextPage ? page + 1 : null,
                page,
                hasPrevPage,
                hasNextPage,
                prevLink: hasPrevPage ? `/api/products?limit=${limit}&page=${page - 1}&sort=${sort}&query=${query}` : null,
                nextLink: hasNextPage ? `/api/products?limit=${limit}&page=${page + 1}&sort=${sort}&query=${query}` : null,
            };
        } catch (error) {
            //throw new Error(EErrors.ERROR_GENERAL);
            console.log("fallooo 1", error);
        }
    }

    async obtenerProductoPorId(id) {
        try {
            const products = await ProductModel.findById(id);

            if (!products) {
                //throw new Error(EErrors.PRODUCTO_NO_ENCONTRADO);
                console.log("fallooo 2");
            }

            console.log("Producto encontrado!!");
            return products;
        } catch (error) {
            //throw new Error(EErrors.ERROR_GENERAL);
            console.log("fallooo 3", error);
        }
    }

    async actualizarProducto(id, productoActualizado) {
        try {
            const actualizado = await ProductModel.findByIdAndUpdate(id, productoActualizado);
            if (!actualizado) {
                //throw new Error(EErrors.PRODUCTO_NO_ENCONTRADO);
                //return null;
                console.log("fallooo 4");
            }

            console.log("Producto actualizado con exito");
            return actualizado;
        } catch (error) {
            //throw new Error(EErrors.ERROR_GENERAL);
            console.log("fallooo 5", error);
        }
    }

    async eliminarProducto(id) {
        try {
            const deleteado = await ProductModel.findByIdAndDelete(id);

            if (!deleteado) {
                //throw new Error(EErrors.PRODUCTO_NO_ENCONTRADO);
                //return null;
                console.log("fallooo 6");
            }

            console.log("Producto eliminado correctamente!");
            return deleteado;
        } catch (error) {
            //throw new Error(EErrors.ERROR_GENERAL);
            console.log("fallooo 7", error);
        }
    }
}

module.exports = ProductRepository;