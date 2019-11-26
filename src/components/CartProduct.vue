<template>
    <v-card>
        <v-card-text>
            <div>{{ product.product_name }}</div>
            <p class="display-1 text--primary">
                {{ product.price | currency }} x {{ product_quantity }} = {{ product.price_total | currency }} Руб.
            </p>
            <div class="text--primary">
                На складе: {{product.current_in_stock}}
            </div>
        </v-card-text>
        <v-card-actions>
            <v-text-field
                    v-model="product_quantity"
            >
            </v-text-field>
            <v-btn
                    @click="removeItem(product)"
            >
                Удалить
            </v-btn>
        </v-card-actions>
    </v-card>

</template>

<script>
	import {mapActions} from 'vuex'
	import filters from '../mixins/filters'

	export default {
		props: ['product_item'],
		computed: {
			product: {
				get() {
					return this.product_item
				}
			},
			product_quantity: {
				set(quantity) {
					if (isNaN(quantity) || !quantity) {
						quantity = 1;
					}
					if (quantity === this.product_item.quantity) {
						return false;
					}
					quantity = parseInt(quantity);
					let product = {...this.product_item, 'quantity': quantity};
					this.$store.dispatch('cart/changeQuantity', product);
				},
				get() {
					return this.product_item.quantity;
				}
			},
		},
		methods: mapActions('cart', [
			'removeItem',
			'changeQuantity',
		]),
		mixins: [
			filters,
		],
	}
</script>
<style>
    .custom-input {
        border: 1px solid #6a6a6a;
        padding: 7px;
        margin: 3px;
        border-radius: 2px;
    }
</style>
