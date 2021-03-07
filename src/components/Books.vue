<template>
  <div>
    <div id="pc">
      <div class="wrap">
        <i :class="['bi', 'navigation', {'bi-arrow-left-circle':!mouseLeft}, {'bi-arrow-left-circle-fill':mouseLeft}]"
          @mouseover="mouseLeft=true"
          @mouseleave="mouseLeft=false"
          @click="left"
        >
        </i>
        <div class="slider-show" @click.once="swipe">
          <div class="book-list">
            <div v-for="(item, index) in books" :key="index" class="wrap-slide">
              <div class="card shadow card-book fade-in-card"
                @click="bookDetail(item.id, $event)"
              >
                <picture>
                  <source class="card-img-top" type="image/webp" :srcset="item.image" alt="Book's image">
                  <img class="card-img-top" :src="item.image" alt="Book's image">
                </picture>
                <div class="card-body">
                  <div class="card-text">
                    {{ item.name }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <i :class="['bi', 'navigation', {'bi-arrow-right-circle':!mouseRight}, {'bi-arrow-right-circle-fill':mouseRight}]"
          @mouseover="mouseRight=true"
          @mouseleave="mouseRight=false"
          @click="right"
        >
        </i>
      </div>
      <router-link name="book-detail" to="/books/:id" />
      <router-view />
    </div>
    
    <div id="mobile">
      <div>
          <div class="book-list-m">
            <div v-for="(item, index) in books" :key="index" :id="index" class="wrap-slide-m">
              <div class="card shadow card-book fade-in-card"
                @click="bookDetail(item.id, $event, index)"
              >
                <picture>
                  <source class="card-img-top" type="image/webp" :srcset="item.image" alt="Book's image">
                  <img class="card-img-top" :src="item.image" alt="Book's image">
                </picture>
                <div class="card-body">
                  <div class="card-text">
                    {{ item.name }}
                  </div>
                </div>
              </div>

              <div style="margin-top:3vh">
                <router-link name="book-detail" :to="{path:'/books/' + item.id}" />
                <router-view :id="['view' + index]" v-if="index == selectedId" />
              </div>
            </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script>

const bookListAPI = 'https://fe-interview-api.unnotech.com/books';

export default {
  data() {
    return {
      books: [],
      mouseLeft: '',
      mouseRight: '',
      selectedId: ''
    }
  },
  mounted() {
    this.axios.get(bookListAPI).then(response => {
      this.books = response.data;
    })
      .then(() => {
        const cards = document.querySelectorAll('.fade-in-card');

        Array.prototype.slice.call(cards).forEach((card, index) => {
          let duration = .3 * (index + 1);
          card.style.animationDuration = `${duration}s`;
          card.addEventListener('animationend', () => {
            card.classList.remove('fade-in-card');
          });
        })
      })
  },
  methods: {
    bookDetail(itemId, event, index) {
      const current = event.currentTarget;
      const selected = document.querySelectorAll('.selected-card');

      this.selectedId = index;
      Array.prototype.slice.call(selected).forEach(card => {
        card.classList.remove('selected-card');
      })

      current.classList.add('flip-card', 'selected-card');

      current.addEventListener('animationend', () => {
        current.classList.remove('flip-card');
      });
      this.$router.push(`/books/${itemId}`);
      
    },
    left() {
      const bookList = document.querySelector('.book-list');
      let deg = document.querySelector('body').style.getPropertyValue('--deg');

      if (deg == '' || deg == '0%') {
        deg = 0;
      } else {
        deg.replace('/%/', '');
        deg = parseInt(deg, 10) + 32;
      }
      bookList.classList.add('slide-move');
      document.querySelector('body').style.setProperty('--deg', deg + '%');
    },
    right() {
      const bookList = document.querySelector('.book-list');
      let deg = document.querySelector('body').style.getPropertyValue('--deg');

      if (deg == '' || deg == '0%') {
        deg = -32;
      } else if (deg == '-96%') {
        deg = -96;
      } else {
        deg.replace('/%/', '');
        deg = parseInt(deg, 10) - 32;
      }

      bookList.classList.add('slide-move');
      document.querySelector('body').style.setProperty('--deg', deg + '%');

      this.test = true;
    },
    swipe() {
      let start = '';
      let drag = false;
      const e = document.querySelector('.slider-show');

      e.addEventListener("mousedown", e => {
        drag = false;
        start = e.clientX;
      }, false);
      e.addEventListener("mousemove", () => {drag = true}, false);
      e.addEventListener("mouseup", e => {
        if (drag == true && e.clientX < start) {
          this.right();
        } else if (drag == true && e.clientX >= start) {
          this.left();
        }
      }, false);
    }
  }
}
</script>

<style>

  body {
    --deg: 0;
  }

  .wrap {
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 85%;
    margin: 0 auto;
  }

  .navigation {
    font-size: 80px;
    display: flex;
    align-items: center;
  }

  .slider-show {
    width: 84%;
    overflow: hidden;
    cursor: grab;
    pointer-events: stroke;
  }

  .book-list {
    margin: 0 auto;
    display: grid;
    grid-auto-flow: column;
  }

  .wrap-slide {
    padding-left: 5vw;
    margin: 5vh 0 5vh 0;
  }

  .slide-move {
    transform: translate(var(--deg), 0);
    transition: 1s;
  }

  .card-book {
    width: 250px;
    margin: 0 auto;
  }

  .card-book img {
    height: 35vh;
  }

  .card-book:hover {
    transform: scale(1.1);
  }

  .selected-card {
    border: 5px #007bff solid !important;
    border-radius: 5px !important;
  }

  .flip-card {
    animation: flip-card 1s !important;
  }

  .fade-in-card { 
    animation: fade-in-card;
  }

  .book-list-m {
    display: flex;
    align-items: center;
    flex-direction: column;
    margin-top: 5vh;
  }

  .wrap-slide-m {
    margin-top: 5vh;
    width: 90%;
  }

  #mobile {
    display: none;
  }

  #pc {
    display: inline-block;
    width: 100%;
  }

  @media (max-width: 546px) {
    #mobile {
      display: inline-block;
      width: 100%;
    }
    #pc {
      display: none;
    }
  }

  @keyframes flip-card {
    0%, 100%{
      transform: rotateY(0deg) scale(1);
    }
    50% {
      transform: rotateY(180deg) scale(1.2);
    }
  }

  @keyframes fade-in-card {
    0% {
      transform: translate(-100px, -100px);
    }
    100% {
      transform: translate(0, 0);
    }
  }

</style>
