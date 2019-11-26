/**
 * Mocking client-server processing
 */

import data from './dataset/data.json'
import names from './dataset/names.json'

export default {

	/**
	 * Информацию о курсе валюты
	 *
	 * @returns {Promise<unknown>}
	 */
	getCurrency() {
		return new Promise((resolve) => {
			resolve({
				name: 'RUB',
				amount: 32.02 - Math.random(0.5, 2)
			});
		})
			.catch(e => {
				throw new Error(e)
			});
	},

	/**
	 * Информация о цене, количестве
	 *
	 * @returns {Promise<unknown>}
	 */
	getData() {
		return new Promise((resolve) => {
			resolve(data);
		})
			.catch(e => {
				throw new Error(e)
			});
	},

	/**
	 * Информация о именах и группах
	 *
	 * @returns {Promise<unknown>}
	 */
	getNames() {
		return new Promise((resolve) => {
			resolve(names);
		})
			.catch(e => {
				throw new Error(e)
			});
	}

}
