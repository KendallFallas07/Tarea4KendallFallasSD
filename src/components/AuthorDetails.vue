<template>

    <div>

        <h2>Author Data</h2>


        <div class="form-group">

            <label>ID</label>

            <input
                type="number"
                v-model.number="author.id"
                readonly
            >

        </div>


        <div class="form-group">

            <label>Author</label>

            <input
                type="text"
                v-model="author.author"
                :readonly="show"
            >

        </div>


        <div class="form-group">

            <label>Nationality</label>

            <input
                type="text"
                v-model="author.nationality"
                :readonly="show"
            >

        </div>


        <div class="form-group">

            <label>Birth Year</label>

            <input
                type="number"
                v-model.number="author.birth_year"
                :readonly="show"
            >

        </div>


        <div class="form-group">

            <label>Fields</label>

            <input
                type="text"
                v-model="author.fields"
                :readonly="show"
            >

        </div>


        <div class="actions">

            <router-link
                class="button"
                to="/author"
            >
                Back
            </router-link>


            <button
                v-if="edit"
                class="button button-primary"
                @click="updateAuthor"
            >
                Update
            </button>


            <button
                v-if="create"
                class="button button-primary"
                @click="createAuthor"
            >
                Create
            </button>

        </div>

        <p v-if="message">
            {{ message }}
        </p>

    </div>

</template>


<script>

export default {

    name: "AuthorDetails",

    props: [
        'show',
        'edit',
        'create'
    ],

    data() {

        return {

            message: "",

            author: {
                id: null,
                author: "",
                nationality: "",
                birth_year: 0,
                fields: ""
            }

        };

    },

    mounted() {

        if (this.create) {

            this.author.id =
                Math.floor(
                    Math.random() *
                    100000000
                );

        } else {

            this.findAuthor(
                this.$route.params.id
            );

        }

    },

    methods: {

        async findAuthor(id) {

            const response = await fetch(
                this.$url +
                '/authorFind/' +
                id
            );

            if (!response.ok) {
                this.message =
                    "Error loading author.";
                return;
            }

            this.author =
                await response.json();
        },


        async updateAuthor() {

            const response = await fetch(

                this.$url +
                '/authorUpdate/' +
                this.author.id,

                {
                    method: 'PUT',

                    headers: {
                        'Content-Type':
                            'application/json'
                    },

                    body:
                        JSON.stringify(
                            this.author
                        )
                }
            );

            if (!response.ok) {
                this.message =
                    "Error queuing update.";
                return;
            }

            const pendingMessage =
                "⏳ Cambio enviado a RabbitMQ. " +
                "Pendiente de sincronización.";

            sessionStorage.setItem(
                "authorSyncStatus",
                pendingMessage
            );

            this.$router.push(
                '/author'
            );
        },


        async createAuthor() {

            const response = await fetch(

                this.$url +
                '/authorInsert',

                {
                    method: 'POST',

                    headers: {
                        'Content-Type':
                            'application/json'
                    },

                    body:
                        JSON.stringify(
                            this.author
                        )
                }
            );

            if (!response.ok) {
                this.message =
                    "Error queuing insert.";
                return;
            }

            const pendingMessage =
                "⏳ Cambio enviado a RabbitMQ. " +
                "Pendiente de sincronización.";

            sessionStorage.setItem(
                "authorSyncStatus",
                pendingMessage
            );

            this.$router.push(
                '/author'
            );
        }
    }
};

</script>
