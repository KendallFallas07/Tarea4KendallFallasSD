<template>

    <div>

        <h2>Publisher List</h2>

        <div class="actions">

            <router-link
                class="button button-primary"
                to="/publisher/create"
            >
                New Publisher
            </router-link>

            <button
                class="button"
                @click="allPublishers"
            >
                Refresh
            </button>
            <button
                class="button button-primary"
                :disabled="syncing"
                @click="syncPublishers"
            >
                Sincronizar cambios
            </button>

        </div>


        <table>

            <thead>

                <tr>
                    <th>ID</th>
                    <th>Publisher</th>
                    <th>Country</th>
                    <th>Founded</th>
                    <th>Genre</th>
                    <th>Actions</th>
                </tr>

            </thead>


            <tbody>

                <tr
                    v-for="publisher in publishers"
                    :key="publisher.id"
                >

                    <td>{{ publisher.id }}</td>

                    <td>{{ publisher.publisher }}</td>

                    <td>{{ publisher.country }}</td>

                    <td>{{ publisher.founded }}</td>

                    <td>{{ publisher.genre }}</td>


                    <td>

                        <div class="actions">

                            <router-link
                                class="button"
                                :to="'/publisher/show/' + publisher.id"
                            >
                                Show
                            </router-link>

                            <router-link
                                class="button"
                                :to="'/publisher/edit/' + publisher.id"
                            >
                                Edit
                            </router-link>

                            <button
                                class="button"
                                @click="deletePublisher(publisher.id)"
                            >
                                Erase
                            </button>

                        </div>

                    </td>

                </tr>

            </tbody>

        </table>


        <p v-if="message">
            {{ message }}
        </p>

    </div>

</template>


<script>

export default {

    name: "PublisherIndex",

    data() {

        return {
            publishers: [],
            message:
                sessionStorage.getItem(
                    "publisherSyncStatus"
                ) || "No hay cambios pendientes.",
            syncing: false
        };

    },

    mounted() {

        this.allPublishers();

    },

    methods: {

        async allPublishers() {

            try {

                const response = await fetch(
                    this.$url +
                    '/publisherFindAll'
                );

                if (!response.ok) {
                    throw new Error(
                        await response.text()
                    );
                }

                this.publishers =
                    await response.json();

            } catch (error) {

                console.error(error);

                this.message =
                    "Error loading publishers.";
            }
        },


        async deletePublisher(id) {

            if (!confirm(
                "Queue deletion of this publisher?"
            )) {
                return;
            }

            try {

                const response = await fetch(
                    this.$url +
                    '/publisherDelete/' +
                    id,
                    {
                        method: 'DELETE'
                    }
                );

                if (!response.ok) {

                    throw new Error(
                        await response.text()
                    );
                }

                this.message =
                    "⏳ Cambio enviado a RabbitMQ. " +
                    "Pendiente de sincronización.";

                sessionStorage.setItem(
                    "publisherSyncStatus",
                    this.message
                );

            } catch (error) {

                console.error(error);

                this.message =
                    "Error queuing delete.";
            }
        },

        async syncPublishers() {

            try {

                this.syncing = true;

                const response = await fetch(
                    this.$url + '/publisherTasks'
                );

                if (!response.ok) {
                    throw new Error(
                        await response.text()
                    );
                }

                await this.allPublishers();

                this.message =
                    "✅ Cambios sincronizados con SQL.";

                this.clearPendingStatuses();

            } catch (error) {

                console.error(error);

                this.message =
                    "❌ Error al sincronizar cambios.";

            } finally {

                this.syncing = false;
            }
        },

        clearPendingStatuses() {

            ["book", "author", "publisher"]
                .forEach((entity) => {
                    sessionStorage.removeItem(
                        `${entity}SyncStatus`
                    );
                });
        }
    }
};

</script>
