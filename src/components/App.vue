<template>
    <v-container
            class="fill-height"
            fluid
    >
        <v-row>
            <v-col :cols="8">
                <ProductList/>
            </v-col>
            <v-col :cols="4">
                <Cart/>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
	import ProductList from '@/components/ProductList'
	import Cart from '@/components/Cart'

	export default {
		name: 'App',
		components: {
			ProductList,
			Cart,
		},
		methods: {},
		created() {
			let delay = 15 * 1000;
			let store = this.$store;
			this.$store.dispatch('products/getProductsData');
			setTimeout(function request() {
				store.dispatch('products/getProductsData');
				setTimeout(request, delay);
			}, delay);
		}
	}
</script>
<style>
    body {
        background-color: #352b30;
    }
</style>
