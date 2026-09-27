<template>

    <div>

        <h2>Publisher Data</h2>


        <div class="form-group">

            <label>ID</label>

            <input
                type="number"
                v-model.number="publisher.id"
                readonly
            >

        </div>


        <div class="form-group">

            <label>Publisher</label>

            <input
                type="text"
                v-model="publisher.publisher"
                :readonly="show"
            >

        </div>


        <div class="form-group">

            <label>Country</label>

            <input
                type="text"
                v-model="publisher.country"
                :readonly="show"
            >

        </div>


        <div class="form-group">

            <label>Founded</label>

            <input
                type="number"
                v-model.number="publisher.founded"
                :readonly="show"
            >

        </div>


        <div class="form-group">

            <label>Genre</label>

            <input
                type="text"
                v-model="publisher.genre"
                :readonly="show"
            >

        </div>


        <div class="actions">

            <router-link
                class="button"
                to="/publisher"
            >
                Back
            </router-link>


            <button
                v-if="edit"
                class="button button-primary"
                @click="updatePublisher"
            >
                Update
            </button>


            <button
                v-if="create"
                class="button button-primary"
                @click="createPublisher"
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

    name: "PublisherDetails",

    props: [
        'show',
        'edit',
        'create'
    ],

    data() {

        return {

            message: "",

            publisher: {
                id: null,
                publisher: "",
                country: "",
                founded: 0,
                genre: ""
            }

        };

    },

    mounted() {

        if (this.create) {

            this.publisher.id =
                Math.floor(
                    Math.random() *
                    100000000
                );

        } else {

            this.findPublisher(
                this.$route.params.id
            );

        }

    },

    methods: {

        async findPublisher(id) {

            const response = await fetch(
                this.$url +
                '/publisherFind/' +
                id
            );

            if (!response.ok) {
                this.message =
                    "Error loading publisher.";
                return;
            }

            this.publisher =
                await response.json();
        },


        async updatePublisher() {

            const response = await fetch(

                this.$url +
                '/publisherUpdate/' +
                this.publisher.id,

                {
                    method: 'PUT',

                    headers: {
                        'Content-Type':
                            'application/json'
                    },

                    body:
                        JSON.stringify(
                            this.publisher
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
                "publisherSyncStatus",
                pendingMessage
            );

            this.$router.push(
                '/publisher'
            );
        },


        async createPublisher() {

            const response = await fetch(

                this.$url +
                '/publisherInsert',

                {
                    method: 'POST',

                    headers: {
                        'Content-Type':
                            'application/json'
                    },

                    body:
                        JSON.stringify(
                            this.publisher
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
                "publisherSyncStatus",
                pendingMessage
            );

            this.$router.push(
                '/publisher'
            );
        }
    }
};

</script>
