<template>
  <div>
    <!--头部替换为NavHeader.vue-->
    <nav-header></nav-header>
    <!--面包屑插件替换为NavBread 并用slot="bread"控制-->
    <nav-bread>
      <span>Goods</span>
    </nav-bread>
    <div class="accessory-result-page accessory-page">
      <div class="container">
        <div class="filter-nav">
          <span class="sortby">Sort by:</span>
          <a href="javascript:void(0)" class="default cur">Default</a>
          <a href="javascript:void(0)" class="price" @click="sortGoods">Price
            <svg class="icon icon-arrow-short" v-bind:class="{'sort-up':!sortFlag}">
              <use xlink:href="#icon-arrow-short"></use>
            </svg>
          </a>
          <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop">Filter by</a>
        </div>
        <div class="accessory-result">
          <!-- filter -->
          <div class="filter stopPop" id="filter" v-bind:class="{'filterby-show':filterBy}">
            <dl class="filter-price">
              <dt>Price:</dt>
              <dd><a href="javascript:void(0)" v-bind:class="{'cur':priceChecked=='all'}" @click="priceChecked='all'">All</a>
              </dd>
              <dd v-for="(price,index) in priceFilter" @click="setPriceFilter(index)">
                <a href="javascript:void(0)" v-bind:class="{cur:priceChecked==index}"> {{price.startPrice}} -
                  {{price.endPrice}} </a>
              </dd>

              <!--    <dd>
                    <a href="javascript:void(0)">100 - 500</a>
                  </dd>
                  <dd>
                    <a href="javascript:void(0)">500 - 1000</a>
                  </dd>
                  <dd>
                    <a href="javascript:void(0)">1000 - 2000</a>
                  </dd>-->
            </dl>
          </div>

          <!-- search result accessories list -->
          <div class="accessory-list-wrap">
            <div class="accessory-list col-4">
              <ul>
                <li v-for="(item,index) in goodsList">
                  <div class="pic">
                    <a href="javascript:;"><img v-bind:src="'/static/'+item.productImage" alt=""></a>
                  </div>
                  <div class="main">
                    <div class="name">{{item.productName}}</div>
                    <div class="price">{{item.salePrice}}</div>
                    <div class="btn-area">
                      <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                    </div>
                  </div>
                </li>
                <!--          <li>
                            <div class="pic">
                              <a href="#"><img src="static/2.jpg" alt=""></a>
                            </div>
                            <div class="main">
                              <div class="name">XX</div>
                              <div class="price">1000</div>
                              <div class="btn-area">
                                <a href="javascript:;" class="btn btn&#45;&#45;m">加入购物车</a>
                              </div>
                            </div>
                          </li>
                          <li>
                            <div class="pic">
                              <a href="#"><img src="static/3.jpg" alt=""></a>
                            </div>
                            <div class="main">
                              <div class="name">XX</div>
                              <div class="price">500</div>
                              <div class="btn-area">
                                <a href="javascript:;" class="btn btn&#45;&#45;m">加入购物车</a>
                              </div>
                            </div>
                          </li>
                          <li>
                            <div class="pic">
                              <a href="#"><img src="static/4.jpg" alt=""></a>
                            </div>
                            <div class="main">
                              <div class="name">XX</div>
                              <div class="price">2499</div>
                              <div class="btn-area">
                                <a href="javascript:;" class="btn btn&#45;&#45;m">加入购物车</a>
                              </div>
                            </div>
                          </li>-->
              </ul>

              <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="30">
                <img src="./../assets/loading-spinning-bubbles.svg" v-show="loading" alt="">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="md-overlay" v-show="overLayFlag" @click="closePop"></div>
    <Modal v-bind:mdShow="mdShow" v-on:close="closeModal">
        <p slot="message">
          请先登陆,否则无法加入购物车
        </p>
        <div slot="btnGroup">
            <a class="btn btn--m" href="javascript:;" @click="mdShow = false">关闭</a>
        </div>
    </Modal>
    <Modal v-bind:mdShow="mdShowCart" v-on:close="closeModal">
        <p slot="message">
          <svg class="icon-status-ok">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-status-ok"></use>
          </svg>
          <span>加入购物车成功！</span>
        </p>
        <div slot="btnGroup">
          <a class="btn btn--m" href="javascript:;" @click="mdShowCart = false">继续购物</a>
          <router-link class="btn btn--m btn--red" href="javascript:;" to="/cart">查看购物车</router-link>
        </div>
    </Modal>
    <!--底部替换为NavFooter.vue-->
    <nav-footer></nav-footer>
  </div>
</template>

<script>
  import './../assets/css/base.css'
  import './../assets/css/product.css'
  import './../assets/css/login.css'
  import './../assets/css/checkout.css'
  import NavHeader from '../components/NavHeader.vue'
  import NavFooter from '../components/NavFooter.vue'
  import NavBread from '../components/NavBread.vue'
  import Modal from '../components/Modal.vue'
  import axios from 'axios'
  export default {
    name: "GoodsList",
    data() {
      return {
        goodsList: [],
        priceFilter: [
          {
            startPrice: '0.00',
            endPrice: '500.00'
          },
          {
            startPrice: '500.00',
            endPrice: '1000.00'
          },
          {
            startPrice: '1000.00',
            endPrice: '2000.00'
          },
        ],
        sortFlag: true,
        page: 1,
        pageSize: 8,
        priceChecked: 'all',
        filterBy: false,
        overLayFlag: false,
        busy: true,
        count:0,
        loading:false,
        data:[],
        mdShow:false,
        mdShowCart:false
      }
    },
    components: {
      NavHeader: NavHeader,
      NavFooter: NavFooter,
      NavBread: NavBread,
      Modal:Modal,
    },
    mounted() {
      this.getGoodsList();
    },
    methods: {
      showFilterPop() {
        this.filterBy = true;
        this.overLayFlag = true;
      },
      closePop() {
        this.filterBy = false;
        this.overLayFlag = false;
      },
      setPriceFilter(index) {
        this.priceChecked = index;
        this.closePop();
        this.page = 1;
        this.getGoodsList();

      },
      getGoodsList(flag) {
        var param = {
          "page": this.page,
          "pageSize": this.pageSize,
          "sort": this.sortFlag ? 1 : -1,
          "priceChecked":this.priceChecked,
        }
        this.loading= true
        axios.get("/goods/list", {params: param}).then((res) => {

          res = res.data;
          if (res.status == "0") {
            this.loading= false
            if (flag) {
              this.goodsList = this.goodsList.concat(res.result.list);
              if(res.result.count == 0) {
                this.busy = true
              }else {
                this.busy = false
              }
            } else {
              this.goodsList = res.result.list;
              this.busy = false
            }

          } else {
            this.goodsList = [];
          }

        })
      },
      sortGoods() {
        this.sortFlag = !this.sortFlag;
        this.page = 1;
        this.getGoodsList();
      },
      loadMore() {
        this.busy = true;
        setTimeout(() => {
          this.page++;
          this.getGoodsList(true);
          for (var i = 0, j = 10; i < j; i++) {
            this.data.push({ name: this.count++ });
          }
          this.busy = false;
        }, 1000);
      },
      addCart(productId){
        axios.post("/goods/addCart",{
          productId:productId
        }).then((res)=>{
          var res = res.data
          if(res.status == '0'){
            this.mdShowCart = true
            this.$store.commit("updateCartCount",1)
          }else{
            this.mdShow = true
          }
        })
      },
      closeModal(){
        this.mdShow = false
      }
    }
  }
</script>

<style scoped>

</style>
