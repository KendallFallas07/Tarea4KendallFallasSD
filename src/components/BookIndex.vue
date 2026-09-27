<template>

    <div>

        <h2>Book List</h2>


        <div class="actions">

            <router-link
                class="button button-primary"
                to="/book/create"
            >
                New Book
            </router-link>


            <button
                class="button"
                @click="allBooks"
            >
                Refresh
            </button>
            <button
                class="button button-primary"
                :disabled="syncing"
                @click="syncBooks"
            >
                Sincronizar cambios
            </button>

        </div>


        <table>

            <thead>

                <tr>

                    <th>ID</th>

                    <th>Title</th>

                    <th>Author</th>

                    <th>Publisher</th>

                    <th>Edition</th>

                    <th>Actions</th>

                </tr>

            </thead>


            <tbody>

                <tr
                    v-for="book in books"
                    :key="book.id"
                >

                    <td>
                        {{ book.id }}
                    </td>

                    <td>
                        {{ book.title }}
                    </td>

                    <td>
                        {{ book.author }}
                    </td>

                    <td>
                        {{ book.publisher }}
                    </td>

                    <td>
                        {{ book.edition }}
                    </td>


                    <td>

                        <div class="actions">

                            <router-link
                                class="button"
                                :to="'/book/show/' + book.id"
                            >
                                Show
                            </router-link>


                            <router-link
                                class="button"
                                :to="'/book/edit/' + book.id"
                            >
                                Edit
                            </router-link>


                            <button
                                class="button"
                                @click="deleteBook(book.id)"
                            >
                                Erase
                            </button>

                        </div>

                    </td>

                </tr>

            </tbody>

        </table>


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

    name: "BookIndex",


    data() {

        return {

            books: [],

            message:
                sessionStorage.getItem(
                    "bookSyncStatus"
                ) || "No hay cambios pendientes.",

            syncing: false

        };

    },


    mounted() {

        this.allBooks();

    },


    methods: {


        async allBooks() {

            try {

                const response =
                    await fetch(
                        this.$url +
                        '/bookFindAll'
                    );

                if (!response.ok) {
                    throw new Error(
                        await response.text()
                    );
                }


                this.books =
                    await response.json();

            }

            catch (error) {

                console.error(error);

                this.message =
                    "Error loading books.";

            }

        },


        async deleteBook(id) {

            const confirmed =
                confirm(
                    "Queue deletion of this book?"
                );


            if (!confirmed) {

                return;

            }


            try {

                const response =
                    await fetch(

                        this.$url +
                        '/bookDelete/' +
                        id,

                        {
                            method:
                                'DELETE'
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
                    "bookSyncStatus",
                    this.message
                );

            }

            catch (error) {

                console.error(error);

                this.message =
                    "Error queuing delete.";

            }

        },

        async syncBooks() {

            try {

                this.syncing = true;

                const response = await fetch(
                    this.$url + '/bookTasks'
                );

                if (!response.ok) {
                    throw new Error(
                        await response.text()
                    );
                }

                await this.allBooks();

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
