<template>
    <v-main class="body">
        <v-container fill-height fluid>
            <v-row align="center" justify="center">
                <v-col cols="12" sm="12" md="5" lg="4" align="center">
                    <v-card elevation="3" class="mx-auto" rounded align-center justify-center :loading="loading"
                        :disabled="loading">

                        <v-form @submit.prevent="Login()">
                            <v-card-title class="text-h6 text-center d-block pb-8 pt-8">
                                <v-img :src="require('@/assets/Logo.png')" contain max-height="100"
                                    style="-webkit-filter: drop-shadow( 2px 2px 2px #FFF);"></v-img>
                                Gofit
                            </v-card-title>


                            <v-divider></v-divider>
                            <v-card-text class="text-center pb-0">
                                <!-- <v-form> -->
                                <v-text-field v-model="user.username" label="Username" type="text"
                                    prepend-inner-icon="mdi-account" color="blue" outlined
                                    :error-messages="validation.username" :loading="loading"
                                    :disabled="loading"></v-text-field>
                                <v-text-field v-model="user.password" label="Password" prepend-inner-icon="mdi-lock"
                                    color="blue" outlined :error-messages="validation.password"
                                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                                    :type="showPassword ? 'text' : 'password'" @click:append="showPassword = !showPassword"
                                    :loading="loading" :disabled="loading"></v-text-field>
                                <!-- </v-form> -->
                            </v-card-text>
                            <v-card-actions>
                                <!-- <v-row align="center" justify="end"> -->
                                <!-- <v-spacer></v-spacer> -->
                                <v-btn width="100%" color="orange" class="d-block" type="submit">Login</v-btn>
                                <!-- <v-spacer></v-spacer> -->
                                <!-- </v-row> -->
                            </v-card-actions>
                        </v-form>
                    </v-card>
                </v-col>
            </v-row>

        </v-container>

        <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="2000" center bottom>
            <v-icon left>{{ snackbar.icon }}</v-icon>
            {{ snackbar.message }}
            <template v-slot:action="{ attrs }">
                <v-btn icon v-bind="attrs" @click="(snackbar.show = false)">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </template>
        </v-snackbar>
    </v-main>
</template>
<script>
import { reactive, ref } from "vue";
// import { useRouter } from "vue-router";
import * as Api from "./ApiHelper";
import axios from "axios";
export default {
    setup() {
        const slides = [
            'https://neilpatel.com/wp-content/uploads/2014/06/social-media-sites-blog.jpg',
            'https://www.ebu.ch/files/live/sites/ebu/files/Events/Media/Digital%20Media%20Days%202020/Digital%20Media%20Days%202020%20-%20Online%20edition/social-media_resize_md.jpg',
            'https://images.indianexpress.com/2022/05/social-media-crop.jpg',
            'https://phlearn.com/wp-content/uploads/2019/02/social-media-planning-header.jpg?fit=1600%2C1104&quality=99&strip=all',
            'https://www.managementsite.nl/resized/2011/03/Social-media.jpg_2000x2000_nocrop.webp',
        ]

        const user = reactive({
            username: "",
            password: "",
        });

        const snackbar = reactive({
            show: false,
            message: "",
            color: "",
            icon: "",
        });

        const loading = ref(false);

        const showPassword = ref(false);
        //state validation
        const validation = ref([]);

        function Login() {
            loading.value = true;
            axios.post(Api.BASE_URL + "/login", {
                username: user.username,
                password: user.password
            })
                .then((response) => {
                    let session_token = response.data.access_token;
                    let role = response.data.role
                    $cookies.set("SESSION", session_token);
                    $cookies.set("ROLE", role);
                    this.$router.push({
                        name: 'Home',
                    })
                }).catch((error) => {
                    validation.value.username = error.response.data.user;
                    validation.value.password = error.response.data.user;
                    snackbar.show = true;
                    snackbar.icon = "mdi-alert";
                    snackbar.message = error.response.data.message;
                    snackbar.color = "red";
                }).finally(() => {
                    loading.value = false;
                });
        }


        return {
            showPassword,
            slides,
            user,
            validation,
            Login,
            snackbar,
            loading
        }

    }
}

</script>
<style scoped>
.body {
    background-color: #FF9045;
    /* For browsers that do not support gradients */
    background-image: linear-gradient(100deg, #FF9045 1%, #23252E 99%);
    /* background-image: linear-gradient( 135deg, #d7dde8 10%, #9cb4da 100%); */
    /* background-image: linear-gradient(to bottom right, rgb(20, 75, 30) 50%, rgb(97, 62, 6)); */
}
</style>