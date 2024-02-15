<template>
  <div class="container">
    <div class="text-end mt-4">
      <button class="btn btn-primary" @click="openProductModal('new')">建立新的產品</button>
    </div>
    <ProductBackstageTable
      :products="products"
      :open-product-modal="openProductModal"
    ></ProductBackstageTable>
    <ProductBackstagePagination
      :pages="pages"
      :get-products="getProducts"
    ></ProductBackstagePagination>
  </div>
  <!-- Modal -->
  <ProductBackstageModal
    :state="state"
    :temp-product="tempProduct"
    :no-confirm-product="noConfirmProduct"
    :confirm-product="confirmProduct"
  ></ProductBackstageModal>
  <ProductBackstageModalDel :confirm-productDel="confirmProductDel"></ProductBackstageModalDel>
  <!-- Modal -->
</template>

<script>
import * as bootstrap from 'bootstrap'
const { VITE_API, VITE_PATH } = import.meta.env
let productModalUse = null
let delProductModalUse = null

import ProductBackstageTable from '../components/ProductBackstageTable.vue'
import ProductBackstagePagination from '../components/ProductBackstagePagination.vue'
import ProductBackstageModal from '../components/ProductBackstageModal.vue'
import ProductBackstageModalDel from '../components/ProductBackstageModalDel.vue'

export default {
  data() {
    return {
      state: '新增',
      tempProduct: {
        imagesUrl: []
      },
      products: [],
      pages: {}
    }
  },
  methods: {
    checkAdmin() {
      this.axios
        .post(`${VITE_API}/api/user/check`)
        .then((res) => {
          this.getProducts()
        })
        .catch((err) => {
          alert(err.response.data.message)
          this.$router.push('/')
        })
    },
    getProducts(page = 1) {
      this.axios
        .get(`${VITE_API}/api/${VITE_PATH}/admin/products?page=${page}`)
        .then((res) => {
          this.products = res.data.products
          this.pages = res.data.pagination
        })
        .catch((err) => {
          alert(err.response.data.message)
        })
    },
    openProductModal(state, product) {
      if (state === 'new') {
        this.state = '新增'
        this.tempProduct = {
          imagesUrl: []
        }
        productModalUse.show()
      } else if (state === 'edit') {
        this.state = '編輯'
        this.tempProduct = { ...product }
        productModalUse.show()
      } else if (state === 'del') {
        this.tempProduct = product
        delProductModalUse.show()
      }
    },
    confirmProduct(state) {
      if (state === '新增') {
        this.axios
          .post(`${VITE_API}/api/${VITE_PATH}/admin/product`, { data: this.tempProduct })
          .then((res) => {
            productModalUse.hide()
            this.getProducts()
          })
          .catch((err) => {
            alert(err.response.data.message)
          })
      } else if (state === '編輯') {
        this.axios
          .put(`${VITE_API}/api/${VITE_PATH}/admin/product/${this.tempProduct.id}`, {
            data: this.tempProduct
          })
          .then((res) => {
            productModalUse.hide()
            this.getProducts()
          })
          .catch((err) => {
            alert(err.response.data.message)
          })
      }
    },
    confirmProductDel() {
      this.axios
        .delete(`${VITE_API}/api/${VITE_PATH}/admin/product/${this.tempProduct.id}`)
        .then((res) => {
          delProductModalUse.hide()
          this.getProducts()
        })
        .catch((err) => {
          alert(err.response.data.message)
        })
    },
    noConfirmProduct() {
      this.getProducts()
      productModalUse.hide()
    }
  },
  mounted() {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexschool\s*=\s*([^;]*).*$)|^.*$/, '$1')
    this.axios.defaults.headers.common['Authorization'] = token

    productModalUse = new bootstrap.Modal(document.querySelector('#productModal'), {
      keyboard: false,
      backdrop: 'static'
    })
    delProductModalUse = new bootstrap.Modal(document.querySelector('#delProductModal'), {
      keyboard: false,
      backdrop: 'static'
    })

    this.checkAdmin()
  },
  components: {
    ProductBackstageTable,
    ProductBackstagePagination,
    ProductBackstageModal,
    ProductBackstageModalDel
  }
}
</script>
