const state = {
	items: [],
}

// getters
const getters = {
	/**
	 * Формирует данные для отображения продуктов в корзине
	 *
	 * @param state
	 * @param getters
	 * @param rootState
	 * @returns {*}
	 */
	cartProducts: (state, getters, rootState) => {
		return state.items.map((item) => {
			let product = rootState.products.all[item.group_id].products[item.product_id];
			return {
				product_id: product.product_id,
				group_id: product.group_id,
				product_name: product.product_name,
				price: product.price,
				price_total: product.price * item.quantity,
				quantity: item.quantity,
				in_stock: product.in_stock,
				current_in_stock: product.current_in_stock,
			}
		})
	},

	/**
	 * Считает общую цену продуктов
	 *
	 * @param state
	 * @param getters
	 * @returns {*}
	 */
	cartTotalPrice: (state, getters) => {
		return getters.cartProducts.reduce((total, product) => {
			return total + product.price * product.quantity
		}, 0)
	}
}

// actions
const actions = {

	/**
	 * Изменяет количество продуктов
	 *
	 * @param commit
	 * @param cart_product
	 */
	changeQuantity({commit}, cart_product) {

		if (cart_product.quantity > cart_product.in_stock) {
			cart_product.quantity = cart_product.in_stock;
		}

		commit('setQuantity', cart_product);
		commit('products/refreshProductStock', {
			group_id: cart_product.group_id,
			product_id: cart_product.product_id,
			count: cart_product.quantity,
		}, {root: true});

	},

	/**
	 * Удаляет продукт из корзины
	 *
	 * @param state
	 * @param commit
	 * @param product
	 */
	removeItem({state, commit}, product) {
		const cartItems = state.items.filter(item => {
			if ((item.group_id === product.group_id && item.product_id === product.product_id)) {
				//Возвращаем продукты на склад
				commit('products/refreshProductStock', {
					group_id: product.group_id,
					product_id: product.product_id,
					count: 0,
				}, {root: true});
				return false;
			}
			return true;
		});
		commit('setCartItems', cartItems)
	},

	/**
	 * Добавляет продукт в корзину, если продукт уже был в корзине, добавляем к существующему
	 *
	 * @param state
	 * @param commit
	 * @param product
	 */
	addProductToCart({state, commit}, product) {
		if (product.in_stock > 0) {
			let cartItem = methods.findItem(state, product.product_id);
			!cartItem ? commit('pushProductToCart', product) : commit('incrementItemQuantity', cartItem);
			commit('products/refreshProductStock', {
				...product, ...{
					count: cartItem ? cartItem.quantity : 1,
				}
			}, {root: true})
		}
	}

}

const methods = {
	/**
	 * Поиск продукта в корзине
	 *
	 * @param state
	 * @param product_id
	 * @returns {*}
	 * @private
	 */
	findItem(state, product_id) {
		return state.items.find(item => item.product_id === product_id);
	},
};

// mutations
const mutations = {

	/**
	 * Управляет количеством продукта в корзине
	 *
	 * @param state
	 * @param product_id
	 * @param quantity
	 */
	setQuantity(state, {product_id, quantity}) {
		let cartItem = methods.findItem(state, product_id);
		if (cartItem) {
			cartItem.quantity = quantity;
		}
	},

	/**
	 * Добавляет продукт в корзину
	 *
	 * @param state
	 * @param group_id
	 * @param product_id
	 */
	pushProductToCart(state, {group_id, product_id}) {
		state.items.push({
			group_id: group_id,
			product_id: product_id,
			quantity: 1
		})
	},

	/**
	 * Прибавляет к существующему продукту 1 позицию
	 *
	 * @param state
	 * @param product_id
	 * @param group_id
	 */
	incrementItemQuantity(state, {product_id}) {
		const cartItem = methods.findItem(state, product_id);
		if (cartItem) {
			cartItem.quantity++;
		}
	},

	setCartItems(state, items) {
		state.items = items
	},
}

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations,
	methods,
}
