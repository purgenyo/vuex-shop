<template>
    <div>
        <v-container
                v-for="group in products"
                :key="group.group_id"
        >
            <v-card
                    dark
            >
                <v-card-title>{{ group.group_name }}</v-card-title>

                <v-container
                        v-for="product in group.products"
                        :key="product.product_id"
                >
                    <v-card>
                        <v-card-text>
                            <div>{{ product.product_name }}</div>
                            <p class="display-1 text--primary">
                                {{ product.price | currency }} Руб.
                            </p>
                            <div class="text--primary">
                                На складе: {{product.current_in_stock}}
                            </div>
                        </v-card-text>
                        <v-card-actions>
                            <v-btn
                                    :disabled="!product.current_in_stock"
                                    @click="addProductToCart(product)"
                            >
                                Купить
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-container>
            </v-card>
        </v-container>
    </div>
</template>

<script>
	import {mapState, mapActions} from 'vuex'
	import filters from '../mixins/filters'

	export default {
		computed: mapState({
			products: state => state.products.all
		}),
		methods: mapActions('cart', [
			'addProductToCart'
		]),
		mixins: [
			filters,
		],
	}
</script>

