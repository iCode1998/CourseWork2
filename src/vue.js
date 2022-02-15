var vueApp = new Vue({
    el: '#app',
    data: {
        sitename: 'Lessons.com',
        lessons: null,
        cart: [],
        searchBar: "",
        sort: {
            attributes: "price",
            option: "acending",
        },
        showProduct: true,
        name: "",
        phone: "",

    },
    created: () => {
        fetch("https://md1373.herokuapp.com/collection/Lessons")
          .then((response) => {
            return response.json();
          })
          .then((_lessons) => {
            vueApp.lessons = _lessons;
            console.log(vueApp.lessons.length);
          });
      },


    methods: {
        // checks if decending or acending option picked 
        // "this.sort.attributes" is the option user wants to sort by. eg price, location,spaces, title
        norml(n) {
            if (n == "decending") {
                this.sortLow(this.sort.attributes)
            }
            else if (n == "acending") {
                this.sortHigh(this.sort.attributes)
            }
        },

        // sort from low to high
        sortHigh(n) {

            // comparing the price of each object within the array 
            // "a" and "b" represents the 2 object you r comparing
            if (n == "price") {
                function compare(a, b) {
                    if (a.price > b.price)
                        return -1;
                    if (a.price < b.price)
                        return 1;
                    return 0;
                }
            }

            else if (n == "locations") {
                function compare(a, b) {
                    if (a.locations > b.locations)
                        return -1;
                    if (a.locations < b.locations)
                        return 1;
                    return 0;
                }
            }
            else if (n == "spaces") {
                function compare(a, b) {
                    if (a.spaces > b.spaces)
                        return -1;
                    if (a.spaces < b.spaces)
                        return 1;
                    return 0;
                }
            }
            else if (n == "title") {
                function compare(a, b) {
                    if (a.title > b.title)
                        return -1;
                    if (a.title < b.title)
                        return 1;
                    return 0;
                }
            }
            // sorts the whole array
            return this.lessons.sort(compare);

        },

        // opposite from sorthigh() function
        sortLow(n) {
            if (n == "price") {
                function compare(a, b) {
                    if (a.price > b.price)
                        return 1;
                    if (a.price < b.price)
                        return -1;
                    return 0;
                }
            }
            else if (n == "locations") {
                function compare(a, b) {
                    if (a.locations > b.locations)
                        return 1;
                    if (a.locations < b.locations)
                        return -1;
                    return 0;
                }
            }
            else if (n == "spaces") {
                function compare(a, b) {
                    if (a.spaces > b.spaces)
                        return 1;
                    if (a.spaces < b.spaces)
                        return -1;
                    return 0;
                }
            }
            else if (n == "title") {
                function compare(a, b) {
                    if (a.title > b.title)
                        return 1;
                    if (a.title < b.title)
                        return -1;
                    return 0;
                }
            }
            return this.lessons.sort(compare);

        },

        // when checkout button pressed it show a message
        // submitForm() { alert('order submitted!') },
        submitForm() {
            
            for (var i = 0; i < this.cart.length; ++i){

                const orderNew = {                  
                    name: this.name,
                    phone: this.phone,
                    lesson_id: this.cart[i]._id,
                    topic: this.cart[i].topic,
                    space: this.cart[i].space,
                }

            fetch("https://md1373.herokuapp.com/collection/Orders", {
                method: "POST",
                body: JSON.stringify(orderNew),
                headers: {
                  "Content-Type": "application/json",
                },
              }).then((response) => response.json())
            //   .then((res) => {
                this.updateLessonSpaces();
            //   });
               
            }
            
            alert('order submitted!') 
        },
        updateLessonSpaces: function () {
            for (var i = 0; i < this.cart.length; ++i){
                console.log(this.cart[i]._id)
            fetch("https://md1373.herokuapp.com/collection/Lessons/" + this.cart[i]._id, {
                method: "PUT",
                body: JSON.stringify({
                    space: this.cart[i].space,
                    // topic: this.cart[i].topic
                }),
                headers: {
                  "Content-Type": "application/json",
                },
              })
                .then((response) => response.json())
                // .then((res) => {

                  location.reload();
                // });
                } 
                
          },

        // determains whether you r on the basket page or main page
        // showProduct is true when u r on the main page and false when u r on basket page
        showCheckout() {
            this.showProduct = this.showProduct ? false : true;
        },

        filterLesson(){
            if(this.searchBar == "" || this.searchBar == " "){
                fetch("https://md1373.herokuapp.com/collection/Lessons")
                .then((response) => {
                  return response.json();
                })
                .then((_lessons) => {
                  vueApp.lessons = _lessons;
                  console.log(vueApp.lessons.length);
                });
            }else{
            fetch("https://md1373.herokuapp.com/collection/Lessons/search/" + this.searchBar)
            .then((response) => {
              return response.json();
            })
            .then((_lessons) => {
                vueApp.lessons = _lessons;
              console.log(vueApp.lessons.length);
            });
        }
        },

        // reduces number of spaces in lesson and adds it to the cart array
        addToCart: function (lesson) {
            lesson.space--;
            this.cart.push(lesson)

        },

        // Disallows to add any more items if the remaining spaces are 0
        canAddToCart: function (lesson) {
            return !lesson.spaces == 0;
        },

        // filters product by search 
        // n is the products u want to filter in this case its all the subjects
        // filteredProducts: function (n) {
        //     return n.filter((lessons) => {
        //         return lessons.title.toLowerCase().match(this.searchBar.toLowerCase());
        //     });
        // },

        removeCart: function () {
            for (let j = 0; j < this.cart.length; j++) {
            
            for (let i = 0; i < this.lessons.length; i++) {

                if (this.cart[j].id === this.lessons[i].id) {
                    this.cart.splice(this.cart[j], 1);
                    console.log("remove")
                    this.lessons[i].spaces++;
                    return;

                }
                
            };
        }
    }

    },

    computed: {

        // Returns amount of items in cart
        cartItemCount: function () {
            return this.cart.length || '';
        },
        // filteredProductss: function () {
        //     return this.lessons.filter((lessons) => {
        //         return lessons.title.toLowerCase().match(this.searchBar.toLowerCase());
        //     });
        // },
        // Disallows to add any more items if the remaining spaces are 0

    }
});