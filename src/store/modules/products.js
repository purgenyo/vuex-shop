import shop from '../../api/shop'
import cart from "./cart";
// initial state
const state = {
	all: []
}

// getters
const getters = {}

// actions
const actions = {

	/**
	 * Формируем список продуктов,
	 * вычисляет цену с учетом курса,
	 * Вычисляет доступное количество и записывает состояние
	 *
	 * @param commit
	 */
	getProductsData({commit}) {
		let data = shop.getData();
		let names = shop.getNames();
		let currency = shop.getCurrency();
		Promise.all([data, names, currency])
			.then(shop_data => {
				if (shop_data[0].hasOwnProperty('Success') && shop_data[0].Success === true) {
					let data = mergeData(shop_data[0].Value.Goods, shop_data[1]);
					data = calculateCurrency(data, shop_data[2].amount);
					data = calculateInStock(data);
					commit('setProducts', data)
				}
			});
	},
}

/**
 * Формирует цену с учетом курса валюты
 *
 * @param data
 * @param currency_amount
 * @returns {*}
 */
const calculateCurrency = (data, currency_amount) => {
	for (let i in data) {
		Object.keys(data[i].products).map(function(index) {
			let product = data[i].products[index];
			product.price = product.usd_price * currency_amount;
		});
	}
	return data;
};

/**
 * Вычисляет доступные (с учетом корзины) на текущий момент продукты
 *
 * @param data
 * @returns {*}
 */
const calculateInStock = (data) => {
	for (let i in data) {
		Object.keys(data[i].products).map(function(index) {
			let product = data[i].products[index];
			//Добавлен ли текущий продукт в корзину
			let item = cart.methods.findItem(cart.state, product.product_id);
			if (item) {
				product.current_in_stock = calculateInStockCount(product, item.quantity);
			}
		});
	}
	return data;
}

/**
 *
 * @param product
 * @param count
 * @returns {number}
 */
const calculateInStockCount = (product, count) => {
	let current_in_stock = product.in_stock - count;
	if (current_in_stock < 0) {
		current_in_stock = 0;
	}
	return current_in_stock;
}

/**
 * Соеденяет данные о продуктах с их именами
 *
 * @param data
 * @param products
 */
const mergeData = (data, products) => {

	let result = {};
	/* Получаем имя группы и продукта */
	let getProductInfo = (group_id, product_id) => {
		let group, product = null;
		let isExist = (group = products[group_id]) !== undefined
			&& group.B !== undefined
			&& (product = group.B[product_id]) !== undefined;
		if (!isExist) {
			return null;
		}
		return {
			'group_name': group.G,
			'product_name': product.N,
		}
	};

	// Обрабатываем данные о продукте
	for (let i in data) {

		let product = null;
		let item = data[i];

		if (!(product = getProductInfo(item.G, item.T))) {
			continue;
		}

		// Если ещё не было информации о группе товаров, заполняем
		if (result[item.G] === undefined) {
			result[item.G] = {
				group_id: item.G,
				group_name: product.group_name,
				products: {},
			};
		}

		//Заполняем список товаров по их группе
		result[item.G].products[item.T] = {
			group_id: item.G,
			product_id: item.T,
			product_name: product.product_name,
			usd_price: item.C,
			in_stock: item.P,
			current_in_stock: item.P,
		}

	}

	return result;
};


const mutations = {
	/**
	 * @param state
	 * @param products
	 */
	setProducts(state, products) {
		state.all = products;
	},
	/**
	 * Обновляет состояние остатков
	 *
	 * @param state
	 * @param group_id
	 * @param product_id
	 * @param count
	 */
	refreshProductStock(state, {group_id, product_id, count}) {
		const product = state.all[group_id].products[product_id];
		product.current_in_stock = calculateInStockCount(product, count);
	},
}

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations
}
