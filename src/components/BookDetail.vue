<template>

  <div>
    <div class="wrap-book-detail">
      <div class="wrap-detail">
        <div class="row">
          <label for="inputPrice" class="mt-2">價格</label>
          <button class="btn"><i class="bi bi-dash-square" @click="minusPrice"></i></button>
          <input id="inputPrice"
            :class="['needs-validation', {'is-invalid':validation[0]}, 'form-control']" 
            v-model="detail.price"
          >
          <button class="btn"><i class="bi bi-plus-square" @click="addPrice"></i></button>
          <div class="invalid-feedback">Please enter positive number.</div>
        </div>

        <div class="row mt-3">
          <label for="inputCount" class="mt-2">數量</label>
          <button class="btn"><i class="bi bi-dash-square" @click="minusCount"></i></button>
          <input id="inputCount" 
            :class="['needs-validation', {'is-invalid':validation[1]}, 'form-control']" 
            v-model="detail.count"
          >
          <button class="btn"><i class="bi bi-plus-square" @click="addCount"></i></button>
          <div class="invalid-feedback">Please enter positive number.</div> 
        </div>
      
        <button id="btn" class="btn btn-primary mt-3" @click="submit">
          確認修改
          <i class="bi bi-pencil-square"></i>
        </button>
      </div>
    </div>

    <div v-if="modal" class="open-modal">
      <div class="modal-dialog slide-dialog">
        <i class="bi bi-check-circle"></i>
        Successfully updated!
      </div>
    </div>
  </div>

</template>


<script>

const bookDetailAPI = 'https://fe-interview-api.unnotech.com/profile/';

export default {
  data() {
    return {
      detail: '',
      validation: [false, false],
      modal: '',
    }
  },
  mounted() {
    this.getDetail();
  },
  watch: {
    $route() {
      this.getDetail();
    }
  },
  methods: {
    getDetail() {   
      const btn = document.querySelector('#btn');
      const count = document.querySelector('#count');
      const price = document.querySelector('#price');

      this.axios.get(`${bookDetailAPI}${this.$route.params.id}`).then(response => {
        this.detail = {
          price: parseInt(response.data.price, 10),
          count: parseInt(response.data.count, 10)
        }
      }).then(() => {
        price.classList.add('fade-in');
        count.classList.add('fade-in');
        btn.classList.add('fade-in');
        count.style.animationDelay = '.2s';
        btn.style.animationDelay = '.4s';

        btn.addEventListener('animationend', () => {
          price.classList.remove('fade-in');
          count.classList.remove('fade-in');
          btn.classList.remove('fade-in');
        });
      })
    },
    addPrice() {
      this.detail.price ++;
    },
    minusPrice() {
      if (this.detail.price > 0) this.detail.price --;
    },
    addCount() {
      this.detail.count ++;
    },
    minusCount() {
      if (this.detail.count > 0) this.detail.count --;
    },
    submit() {
      const vm = this;
      const forms = document.querySelectorAll('.needs-validation');

      Array.prototype.slice.call(forms).forEach(function (form, index) {
        if (isNaN(form.value) || form.value == '' || form.value <  0) {
          vm.validation.splice(index, 1, true);
          
        } else {
          vm.validation.splice(index, 1, false);
        }
      })
      if (this.validation.every(e => e == false)) this.updateDetail();
    },
    updateDetail() {
      const vm = this;
      const top = document.documentElement.scrollTop;

      this.axios.patch(`${bookDetailAPI}${this.$route.params.id}`, this.detail).then(response => {
        if (response.status == 200) {
          this.modal = true;

          setTimeout(() => {
            vm.modal = false;
            document.body.style.overflow = "auto"; 
          }, 1000); 

          document.querySelector('body').style.setProperty('--top', top + 'px');
          document.body.style.overflow = "hidden"; 
        }
      })
    },
  }
}
</script>

<style>

  body {
    --top: 0;
  }

  .wrap-book-detail {
    width: 30%;
    margin: 0 auto;
    padding: 3vh 1vh 2vh 1vh;
    background: linear-gradient(to right, #4BC0C8, #C779D0, #FEAC5E);
  }

  .wrap-detail {
    margin: 0 auto;
    max-width: 80%;
    text-align: center;
  }

  input {
    max-width: 60%; 
    text-align: center;
  }

  .fade-in { 
    animation: fade-in .2s;
  }

  .modal-dialog{
    background: white;
    display: inline-block;
    padding: 15px;
    border-radius: 5px;
    animation: slide-dialog .5s;
  }

  .open-modal {
    width: 100%;
    height: 100%;
    background: rgb(0, 0, 0, .4);
    position: absolute;
    top: var(--top);
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: pop-modal .5s;
  }

  @media (max-width: 546px) {
    .wrap-book-detail {
      width: 100%;
      margin: 0 auto;
      padding: 3vh 1vh 2vh 1vh;
      background: linear-gradient(to right, #4BC0C8, #C779D0, #FEAC5E);
    }
  }

  @keyframes pop-modal {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @keyframes slide-dialog {
    0% {
      transform: translate(0, 10vh)
    }
    100% {
      transform: translate(0, 0);
    }
  }

  @keyframes fade-in {
    0% {
      opacity: 0;
      transform: translate(-100px, 0);
    }
    100% {
      opacity: 1;
      transform: translate(0, 0);
    }
  }

</style>
