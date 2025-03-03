import {
  i19addToFavorites,
  i19buy,
  i19connectionErrorProductMsg,
  i19outOfStock,
  i19unavailable
} from '@ecomplus/i18n'

import {
  i18n,
  name as getName,
  inStock as checkInStock,
  onPromotion as checkOnPromotion,
  price as getPrice,
  variationsGrids as getVariationsGrids
} from '@ecomplus/utils'

import Vue from 'vue'
import { store } from '@ecomplus/client'
import ecomCart from '@ecomplus/shopping-cart'
import ALink from '@ecomplus/storefront-components/src/ALink.vue'
import APicture from '@ecomplus/storefront-components/src/APicture.vue'
import APrices from '@ecomplus/storefront-components/src/APrices.vue'
import ecomPassport from '@ecomplus/passport-client'
import { toggleFavorite, checkFavorite } from '@ecomplus/storefront-components/src/js/helpers/favorite-products'

const getExternalHtml = (varName, product) => {
  if (typeof window === 'object') {
    varName = `productCard${varName}Html`
    const html = typeof window[varName] === 'function'
      ? window[varName](product)
      : window[varName]
    if (typeof html === 'string') {
      return html
    }
  }
  return undefined
}

export default {
  name: 'ProductCard',

  components: {
    ALink,
    APicture,
    APrices
  },

  props: {
    product: Object,
    productId: String,
    isSmall: Boolean,
    headingTag: {
      type: String,
      default: 'h3'
    },
    buyText: String,
    transitionClass: {
      type: String,
      default: 'animated fadeIn'
    },
    canAddToCart: {
      type: Boolean,
      default: true
    },
    ecomPassport: {
      type: Object,
      default () {
        return ecomPassport
      }
    },
    accountUrl: {
      type: String,
      default: '/app/#/account/'
    },
    isLoaded: Boolean,
    installmentsOption: Object,
    discountOption: Object
  },

  data () {
    return {
      body: {},
      isLoading: false,
      isWaitingBuy: false,
      isHovered: false,
      isFavorite: false,
      error: ''
    }
  },

  computed: {
    i19addToFavorites: () => i18n(i19addToFavorites),
    i19outOfStock: () => i18n(i19outOfStock),
    i19unavailable: () => i18n(i19unavailable),
    i19uponRequest: () => 'Sob consulta',

    isWithoutPrice () {
      return !getPrice(this.body)
    },

    ratingHtml () {
      return getExternalHtml('Rating', this.body)
    },

    buyHtml () {
      return getExternalHtml('Buy', this.body)
    },

    footerHtml () {
      return getExternalHtml('Footer', this.body)
    },

    name () {
      return getName(this.body)
    },

    strBuy () {
      return this.buyText ||
        (typeof window === 'object' && window.productCardBuyText) ||
        i18n(i19buy)
    },

    isInStock () {
      return checkInStock(this.body)
    },

    isActive () {
      return this.body.available && this.body.visible && this.isInStock
    },

    isLogged () {
      return ecomPassport.checkAuthorization()
    },

    discount () {
      const { body } = this
      return checkOnPromotion(body)
        ? Math.round(((body.base_price - getPrice(body)) * 100) / body.base_price)
        : 0
    }
  },

  methods: {
    setBody (data) {
      this.body = Object.assign({}, data)
      delete this.body.body_html
      delete this.body.body_text
      delete this.body.inventory_records
      delete this.body.price_change_records
      this.isFavorite = checkFavorite(this.body._id, this.ecomPassport)
      this.body.variationsGrids = getVariationsGrids(this.body, {}, true)
    },
    getItemHex(color) {
      let colorTitle = color.toLowerCase().trim();
      const colorList = {
        "vermelho": "#FF0000",
        "azul": "#0000FF",
        "verde": "#008000",
        "amarelo": "#FFFF00",
        "preto": "#000000",
        "branco": "#FFFFFF",
        "roxo": "#800080",
        "laranja": "#FFA500",
        "rosa": "#FFC0CB",
        "marrom": "#8B4513",
        "cinza": "#808080",
        "turquesa": "#40E0D0",
        "violeta": "#EE82EE",
        "indigo": "#4B0082",
        "dourado": "#FFD700",
        "prata": "#C0C0C0",
        "cobre": "#B87333",
        "lavanda": "#E6E6FA",
        "carmesim": "#DC143C",
        "coral": "#FF7F50",
        "cromado": "#E5E4E2",
        "esmeralda": "#50C878",
        "ciano": "#00FFFF",
        "magenta": "#FF00FF",
        "bordo": "#800000",
        "oliva": "#808000",
        "verde oliva": "#6B8E23",
        "azul celeste": "#87CEEB",
        "azul marinho": "#000080",
        "azul petroleo": "#008080",
        "azul real": "#4169E1",
        "azul cobalto": "#0047AB",
        "azul turquesa": "#30D5C8",
        "azul ardosia": "#6A5ACD",
        "amarelo ouro": "#FFD700",
        "amarelo canario": "#FFEF00",
        "amarelo mostarda": "#FFDB58",
        "chocolate": "#D2691E",
        "sepia": "#704214",
        "salmao": "#FA8072",
        "bege": "#F5F5DC",
        "pessego": "#FFDAB9",
        "terracota": "#E2725B",
        "ferrugem": "#B7410E",
        "ameixa": "#DDA0DD",
        "lilas": "#C8A2C8",
        "fucsia": "#FF00FF",
        "malva": "#E0B0FF",
        "pistache": "#93C572",
        "limao": "#CCFF00",
        "esmeralda claro": "#A7F432",
        "cinza claro": "#D3D3D3",
        "cinza escuro": "#A9A9A9",
        "carvao": "#36454F",
        "grafite": "#2F4F4F",
        "gelo": "#F8F8FF",
        "marfim": "#FFFFF0",
        "branco fume": "#F5F5F5",
        "hortela": "#3EB489",
        "abobora": "#FF7518",
        "cereja": "#DE3163",
        "rubi": "#E0115F",
        "bronze": "#CD7F32",
        "ambar": "#FFBF00",
        "perolado": "#EAE0C8",
        "safira": "#0F52BA",
        "jade": "#00A86B",
        "cinza azulado": "#5F9EA0",
        "cinza esverdeado": "#8F9779",
        "carvao vegetal": "#36454F",
        "antique" : "#8a6455"
      };
    
      return colorList[colorTitle] || null; // Retorna a cor ou null caso não exista
    },
    
    fetchItem () {
      if (this.productId) {
        this.isLoading = true
        store({ url: `/products/${this.productId}.json` })
          .then(({ data }) => {
            this.$emit('update:product', data)
            this.setBody(data)
            this.$emit('update:is-loaded', true)
          })
          .catch(err => {
            console.error(err)
            if (!this.body.name || !this.body.slug || !this.body.pictures) {
              this.error = i18n(i19connectionErrorProductMsg)
            }
          })
          .finally(() => {
            this.isLoading = false
          })
      }
    },

    toggleFavorite () {
      if (this.isLogged) {
        this.isFavorite = toggleFavorite(this.body._id, this.ecomPassport)
      }
    },

    buy () {
      const product = this.body
      this.$emit('buy', { product })
      if (this.canAddToCart) {
        this.isWaitingBuy = true
        store({ url: `/products/${product._id}.json` })
          .then(({ data }) => {
            const selectFields = ['variations', 'customizations', 'kit_composition']
            for (let i = 0; i < selectFields.length; i++) {
              const selectOptions = data[selectFields[i]]
              if (selectOptions && selectOptions.length) {
                return import('@ecomplus/storefront-components/src/ProductQuickview.vue')
                  .then(quickview => {
                    new Vue({
                      render: h => h(quickview.default, {
                        props: {
                          product: data
                        }
                      })
                    }).$mount(this.$refs.quickview)
                  })
              }
            }
            const { quantity, price } = data
            ecomCart.addProduct({ ...product, quantity, price })
          })
          .catch(err => {
            console.error(err)
            window.location = `/${product.slug}`
          })
          .finally(() => {
            this.isWaitingBuy = false
          })
      }
    }
  },

  created () {
    if (this.product) {
      this.setBody(this.product)
      if (this.product.available === undefined) {
        this.body.available = true
      }
      if (this.product.visible === undefined) {
        this.body.visible = true
      }
    }
    if (!this.isLoaded) {
      this.fetchItem()
    }
  }
}