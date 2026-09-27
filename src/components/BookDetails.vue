<template>

    <div>

        <h2>
            {{ title }}
        </h2>


        <div class="form-group">

            <label>
                ID
            </label>

            <input
                type="number"
                v-model.number="book.id"
                readonly
            >

        </div>


        <div class="form-group">

            <label>
                Title
            </label>

            <input
                type="text"
                v-model="book.title"
                :readonly="show"
            >

        </div>


        <div class="form-group">

            <label>
                Edition
            </label>

            <input
                type="text"
                v-model="book.edition"
                :readonly="show"
            >

        </div>


        <div class="form-group">

            <label>
                Copyright
            </label>

            <input
                type="number"
                v-model.number="book.copyright"
                :readonly="show"
            >

        </div>


        <div class="form-group">

            <label>
                Language
            </label>

            <input
                type="text"
                v-model="book.language"
                :readonly="show"
            >

        </div>


        <div class="form-group">

            <label>
                Pages
            </label>

            <input
                type="number"
                v-model.number="book.pages"
                :readonly="show"
            >

        </div>


        <div class="form-group">

            <label>
                Author ID
            </label>

            <input
                type="number"
                v-model.number="book.author_id"
                :readonly="show"
            >

        </div>


        <div class="form-group">

            <label>
                Publisher ID
            </label>

            <input
                type="number"
                v-model.number="book.publisher_id"
                :readonly="show"
            >

        </div>


        <div class="actions">

            <router-link
                class="button"
                to="/book"
            >
                Back
            </router-link>


            <button
                v-if="edit"
                class="button button-primary"
                @click="updateBook"
            >
                Update
            </button>


            <button
                v-if="create"
                class="button button-primary"
                @click="createBook"
            >
                Create
            </button>

        </div>


        <p
            v-if="message"
            style="margin-top:20px"
        >

            {{ message }}

        </p>

    </div>

</template>


<script>

export default {

    name: "BookDetails",


    props: [

        'show',

        'edit',

        'create'

    ],


    data() {

        return {

            title: "Book Data",


            message: "",


            book: {

                id: null,

                title: "",

                edition: "",

                copyright: 0,

                language: "",

                pages: 0,

                author_id: 1,

                publisher_id: 1

            }

        };

    },


    mounted() {

        if (this.create) {

            /*
             * Igual que en el ejemplo del profesor,
             * generamos el ID en el frontend.
             */

            this.book.id =
                Math.floor(
                    Math.random() *
                    100000000
                );

        }

        else {

            this.findBook(
                this.$route.params.id
            );

        }

    },


    methods: {


        async findBook(id) {

            try {

                const response =
                    await fetch(

                        this.$url +
                        '/bookFind/' +
                        id

                    );


                if (!response.ok) {

                    throw new Error(
                        await response.text()
                    );

                }


                this.book =
                    await response.json();

            }

            catch (error) {

                console.error(error);

                this.message =
                    "Error loading book.";

            }

        },


        async updateBook() {

            try {

                const response =
                    await fetch(

                        this.$url +
                        '/bookUpdate/' +
                        this.book.id,

                        {

                            method: 'PUT',

                            headers: {

                                'Content-Type':
                                    'application/json'

                            },

                            body:
                                JSON.stringify(
                                    this.book
                                )

                        }

                    );


                if (!response.ok) {

                    throw new Error(
                        await response.text()
                    );

                }


                const pendingMessage =
                    "⏳ Cambio enviado a RabbitMQ. " +
                    "Pendiente de sincronización.";

                sessionStorage.setItem(
                    "bookSyncStatus",
                    pendingMessage
                );


                this.$router.push(
                    '/book'
                );

            }

            catch (error) {

                console.error(error);

                this.message =
                    "Error queuing update.";

            }

        },


        async createBook() {

            try {

                const response =
                    await fetch(

                        this.$url +
                        '/bookInsert',

                        {

                            method: 'POST',

                            headers: {

                                'Content-Type':
                                    'application/json'

                            },

                            body:
                                JSON.stringify(
                                    this.book
                                )

                        }

                    );


                if (!response.ok) {

                    throw new Error(
                        await response.text()
                    );

                }


                const pendingMessage =
                    "⏳ Cambio enviado a RabbitMQ. " +
                    "Pendiente de sincronización.";

                sessionStorage.setItem(
                    "bookSyncStatus",
                    pendingMessage
                );


                this.$router.push(
                    '/book'
                );

            }

            catch (error) {

                console.error(error);

                this.message =
                    "Error queuing insert.";

            }

        }

    }

};

</script>
