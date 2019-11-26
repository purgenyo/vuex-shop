<template>
    <v-container>
        <v-card
                dark
        >
            <v-card-title>Корзина</v-card-title>
            <v-container
                    v-for="product in products"
                    :key="product.id"
            >
                <CartProduct :product_item="product"/>
            </v-container>
        </v-card>
        <v-card
                class="small-margin-top"
                dark
        >
            <v-card-text>
                <p>Сумма: {{ total | currency }}</p>
            </v-card-text>
        </v-card>
    </v-container>
</template>


<script>
	import CartProduct from './CartProduct'
	import {mapGetters} from 'vuex'
	import filters from '../mixins/filters'

	export default {
		computed: {
			...mapGetters('cart', {
				products: 'cartProducts',
				total: 'cartTotalPrice'
			}),
		},
		components: {
			CartProduct
		},
		mixins: [
			filters,
		]
	}
</script>
<style>
    .small-margin-top {
        margin-top: 12px;
        overflow-y: auto;
    }
</style>
