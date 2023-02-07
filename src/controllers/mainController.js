const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	index: (req, res) => {
		const inSale = products.filter(product => product.category === "in-sale");
		const visited = products.filter(product => product.category === "visited");
		return res.render('index',{
			inSale,
			visited,
			toThousand
		})
	},
	search: (req, res) => {
		const {keywords} = req.query;
		const productsFiltered = products.filter(product => product.name.tolowerCase().includes(keywords.tolowerCase()) || product.description.tolowerCase().includes(keywords.tolowerCase()));
		return res.render('results',{
			productsFiltered,
			toThousand,
			keywords
				
		})
	},
}; 

module.exports = controller;
