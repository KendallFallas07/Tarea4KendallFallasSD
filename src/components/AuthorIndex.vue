<template>

    <div>

        <h2>Author List</h2>

        <div class="actions">

            <router-link
                class="button button-primary"
                to="/author/create"
            >
                New Author
            </router-link>

            <button
                class="button"
                @click="allAuthors"
            >
                Refresh
            </button>

            <button
                class="button button-primary"
                :disabled="syncing"
                @click="syncAuthors"
            >
                Sincronizar cambios
            </button>

        </div>


        <table>

            <thead>

                <tr>
                    <th>ID</th>
                    <th>Author</th>
                    <th>Nationality</th>
                    <th>Birth Year</th>
                    <th>Fields</th>
                    <th>Actions</th>
                </tr>

            </thead>


            <tbody>

                <tr
                    v-for="author in authors"
                    :key="author.id"
                >

                    <td>{{ author.id }}</td>

                    <td>{{ author.author }}</td>

                    <td>{{ author.nationality }}</td>

                    <td>{{ author.birth_year }}</td>

                    <td>{{ author.fields }}</td>


                    <td>

                        <div class="actions">

                            <router-link
                                class="button"
                                :to="'/author/show/' + author.id"
                            >
                                Show
                            </router-link>

                            <router-link
                                class="button"
                                :to="'/author/edit/' + author.id"
                            >
                                Edit
                            </router-link>

                            <button
                                class="button"
                                @click="deleteAuthor(author.id)"
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

    name: "AuthorIndex",

    data() {

        return {
            authors: [],
            message:
                sessionStorage.getItem(
                    "authorSyncStatus"
                ) || "No hay cambios pendientes.",
            syncing: false
        };

    },

    mounted() {

        this.allAuthors();

    },

    methods: {

        async allAuthors() {

            try {

                const response = await fetch(
                    this.$url +
                    '/authorFindAll'
                );

                if (!response.ok) {
                    throw new Error(
                        await response.text()
                    );
                }

                this.authors =
                    await response.json();

            } catch (error) {

                console.error(error);

                this.message =
                    "Error loading authors.";
            }
        },


        async deleteAuthor(id) {

            if (!confirm(
                "Queue deletion of this author?"
            )) {
                return;
            }

            try {

                const response = await fetch(
                    this.$url +
                    '/authorDelete/' +
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
                    "authorSyncStatus",
                    this.message
                );

            } catch (error) {

                console.error(error);

                this.message =
                    "Error queuing delete.";
            }
        },

        async syncAuthors() {

            try {

                this.syncing = true;

                const response = await fetch(
                    this.$url + '/authorTasks'
                );

                if (!response.ok) {
                    throw new Error(
                        await response.text()
                    );
                }

                await this.allAuthors();

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
