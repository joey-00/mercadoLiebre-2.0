const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	// Root - Show all products
	index: (req, res) => {
		return res.render('products',{
			products,
			toThousand
		})
	},

	// Detail - Detail from one product
	detail: (req, res) => {

		const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
		const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
		
		const {id} = req.params;
		const product = products.find(product => product.id === +id);
		return res.render('detail',{
			...product,
			toThousand
		})
	},

	// Create - Form to create
	create: (req, res) => {
		return res.render('product-create-form')
	},
	
	// Create -  Method to store
	store: (req, res) => {
		const {name, discount, price, description, category} =req.body
		const newProduct ={
			id : products[products.length - 1].id + 1,
			name : name.trim(),
			description : description.trim(),
			price : +price,
			discount : +discount,
			image: req.file ? req.file.filename : 'default-image.png',
			category
		}
		
		products.push(newProduct),
		fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 3),'utf-8');

		return res.redirect('/products')
	},

	// Update - Form to edit
	edit: (req, res) => {
		const {id} = req.params;

		const edit = products.find(product => product.id === +id)
		return res.render('product-edit-form',{
			toEdit : edit
			/* ...product */
		})
	},
	// Update - Method to update
	update: (req, res) => {
		/* return res.send(
			req.body
		) */
		const {id} = req.params;

		const product = products.find(product => product.id === +id);
		const {name, discount, price, description, category} = req.body;

		const productModified = {
			id : +id,
			name : name.trim(),
			description : description.trim(),
			price : +price,
			discount : +discount,
			image : req.file ? req.file.originalname : product.image,
			category
		}

		const productsModified = products.map(product => {
			if(product.id === +id){
				return productModified
			}

			return product
		})
		fs.writeFileSync(productsFilePath, JSON.stringify(productsModified, null, 3),'utf-8');

		return res.redirect('/products/detail/' + id)
	},

	// Delete - Delete one product from DB
	destroy : (req, res) => {
		/* return res.send(
			req.params) */
		const {id} = req.params;
		const productsModified = products.filter(product =>{
			return product.id !== +id})
		fs.writeFileSync(productsFilePath, JSON.stringify(productsModified, null, 3),'utf-8');

		return res.redirect('/')
	}
};

module.exports = controller;