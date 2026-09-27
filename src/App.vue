<template>

    <div class="container">

        <div class="menu">

            <router-link
                class="button"
                to="/"
            >
                Home
            </router-link>

            <router-link
                class="button"
                to="/book"
            >
                Books
            </router-link>
            <router-link
                class="button"
                to="/author"
            >
                Authors
            </router-link>
            <router-link
                class="button"
                to="/publisher"
            >
                Publishers
            </router-link>

        </div>


        <router-view />


        <hr>

        <footer>
            Tarea 4 - Sistemas Distribuidos
        </footer>

    </div>

</template>


<script>

export default {

    name: "App"

};

</script>


<style>

body {

    font-family:
        Arial,
        Helvetica,
        sans-serif;

    margin: 0;

    background: #f5f5f5;

}


.container {

    max-width: 1100px;

    margin: auto;

    padding: 25px;

    background: white;

    min-height: 100vh;

}


.menu {

    display: flex;

    gap: 10px;

    margin-bottom: 30px;

}


.button {

    display: inline-block;

    padding: 10px 16px;

    text-decoration: none;

    border: 1px solid #999;

    border-radius: 5px;

    background: #eee;

    color: #222;

    cursor: pointer;

}


.button:hover {

    background: #ddd;

}


.button-primary {

    background: #1976d2;

    color: white;

}


table {

    width: 100%;

    border-collapse: collapse;

    margin-top: 20px;

}


th,
td {

    padding: 10px;

    border-bottom: 1px solid #ddd;

    text-align: left;

}


input {

    padding: 8px;

    width: 100%;

    box-sizing: border-box;

}


.form-group {

    margin-bottom: 15px;

}


.actions {

    display: flex;

    gap: 8px;

}

</style>