<template>
    <v-main>
        <v-container>
            <v-card class="mx-auto" max-width="auto" :loading="loadingProfile" :disabled="loadingProfile">
                <v-card-text>
                    <v-list-item class="d-flex flex-column mb-6 bg-surface-variant">
                        <v-list-item-avatar class="mt-1" size="240">
                            <v-img :src="'https://cdn.vuetifyjs.com/images/john.jpg'" alt="Foto profil">
                            </v-img>
                        </v-list-item-avatar>
                        <v-list-item-content style="padding:16px">
                            <v-list-item-title class="format">No Pegawai: {{ User.no_pegawai }}</v-list-item-title>
                            <v-list-item-title class="format">Nama: {{ User.name }}</v-list-item-title>
                            <v-list-item-title class="format">Alamat: {{ User.address }}</v-list-item-title>
                            <v-list-item-title class="format">Telepon: {{ User.number_phone }}</v-list-item-title>
                            <v-list-item-title class="format">Gender: {{ User.gender }}</v-list-item-title>
                            <v-list-item-title class="format">Role: {{ User.role }}</v-list-item-title>
                            <v-list-item-title class="format">Tanggal Lahir: {{ User.born_date ?
                                Api.getDateTimeID(User.born_date, 'fulldate') :
                                '-'
                            }}</v-list-item-title>
                            <v-list-item-title class="format">Akun Dibuat: {{ Api.getDateTimeID(User.created_at, 'month')
                            }}</v-list-item-title>
                        </v-list-item-content>
                        <v-btn color="success" class="editUser" depressed @click="UpdateUser" style="margin: 16px;">
                            Edit Profil <v-icon right> mdi-account-edit</v-icon>
                        </v-btn>
                        <v-btn color="success" class="editUserPass" depressed @click="UpdateUserPass" style="margin: 16px;">
                            Edit Password <v-icon right> mdi-account-edit</v-icon>
                        </v-btn>
                    </v-list-item>
                </v-card-text>
            </v-card>
        </v-container>

        <v-dialog transition="dialog-top-transition" v-model="dialogUpdate" persistent max-width="600px">
            <v-card :loading="loading2" :disabled="loading2">
                <v-toolbar color="blue darken-1" dark class="headline">Update User</v-toolbar>
                <!--  -->
                <!-- <v-list-item-subtitle class="name">@{{ User.name }}</v-list-item-subtitle>
                <v-list-item-subtitle class="address">@{{ User.address }}</v-list-item-subtitle>
                <v-list-item-subtitle class="number_phone">@{{ User.number_phone }}</v-list-item-subtitle>
                -->
                <!--  -->
                <v-form @submit.prevent="save(tempUser.id)">
                    <v-container>
                        <v-text-field v-model="tempUser.name" label="Name" outlined></v-text-field>

                        <v-text-field v-model="tempUser.address" label="Address" outlined></v-text-field>

                        <v-text-field v-model="tempUser.number_phone" label="number_phone" outlined></v-text-field>

                        <!-- <v-menu v-model="fromDateMenu" :close-on-content-click="false" nudge-bottom="64"
                            transition="scale-transition" max-width="290px" min-width="290px">
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field outlined label="Tanggal Lahir" readonly v-model="tempUser.tanggal_lahir"
                                    v-on="on" v-bind="attrs"></v-text-field>
                            </template>
                            <v-date-picker v-model="tempUser.tanggal_lahir" show-adjacent-months locale="en-in"
                                @input="fromDateMenu = false"></v-date-picker>
                        </v-menu> -->
                    </v-container>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" text @click="dialogUpdate = false">Cancel</v-btn>
                        <v-btn color="orange" type="submit">Save</v-btn>
                    </v-card-actions>
                </v-form>
            </v-card>
        </v-dialog>

        <v-dialog transition="dialog-top-transition" v-model="dialogUpdatePass" persistent max-width="600px">
            <v-card :loading="loading2" :disabled="loading2">
                <v-toolbar color="blue darken-1" dark class="headline">Update User</v-toolbar>
                <!--  -->
                <!-- <v-list-item-subtitle class="name">@{{ User.name }}</v-list-item-subtitle>
                <v-list-item-subtitle class="address">@{{ User.address }}</v-list-item-subtitle>
                <v-list-item-subtitle class="number_phone">@{{ User.number_phone }}</v-list-item-subtitle>
                -->
                <!--  -->
                <v-card-text>
                    <v-container>
                        <v-text-field v-model="tempUserPass.passwordOld" label="Password Lama" prepend-inner-icon="mdi-lock"
                            color="blue" outlined :append-icon="showPasswordLama ? 'mdi-eye' : 'mdi-eye-off'"
                            :type="showPasswordLama ? 'text' : 'password'"
                            @click:append="showPasswordLama = !showPasswordLama"></v-text-field>

                        <v-text-field v-model="tempUserPass.passwordNew" label="Password Baru" prepend-inner-icon="mdi-lock"
                            color="blue" outlined :append-icon="showPasswordBaru ? 'mdi-eye' : 'mdi-eye-off'"
                            :type="showPasswordBaru ? 'text' : 'password'"
                            @click:append="showPasswordBaru = !showPasswordBaru"></v-text-field>

                        <!-- <v-menu v-model="fromDateMenu" :close-on-content-click="false" nudge-bottom="64"
                            transition="scale-transition" max-width="290px" min-width="290px">
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field outlined label="Tanggal Lahir" readonly v-model="tempUser.tanggal_lahir"
                                    v-on="on" v-bind="attrs"></v-text-field>
                            </template>
                            <v-date-picker v-model="tempUser.tanggal_lahir" show-adjacent-months locale="en-in"
                                @input="fromDateMenu = false"></v-date-picker>
                        </v-menu> -->
                    </v-container>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="dialogUpdatePass = false">Cancel</v-btn>
                    <v-btn color="blue darken-1" text @click="savePass">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- snacbkar -->
        <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="5000" center bottom>
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
import * as Api from "./ApiHelper";
import { onMounted } from "vue";
import axios from "axios";

export default {
    setup() {
        // get id from route
        // const route = useRoute();
        // const id = ref(route.params.id);
        let dialogUpdate = ref(false);
        let dialogUpdatePass = ref(false);

        // let dialogPreview = ref(false);
        // let editPostDialog = ref(false);
        // let commentDialog = ref(fa  lse);

        const showPasswordLama = ref(false);
        const showPasswordBaru = ref(false);

        const User = ref({});
        const UserLog = ref({});
        const tempUser = ref({
        });
        const tempUserPass = ref({});
        // const showPassword = ref(false);
        const loadingProfile = ref(true);
        const loading2 = ref(false);

        //state validation
        const validation = ref([]);

        const snackbar = reactive({
            show: false,
            color: '',
            icon: '',
            message: ''
        })

        function getUserLog() {
            axios.get(Api.BASE_URL + "/users", {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + $cookies.get("SESSION")
                }
            }).then((response) => {
                if (response.data.superrole == 'superadmin') {
                    User.value = response.data.dataDiri;
                    tempUserPass.value.username = response.data.dataDiri.username;
                    loadingProfile.value = false;
                    console.log(User)
                    console.log(tempUserPass)
                } else {
                    User.value = response.data.dataDiri;
                    tempUserPass.value.username = response.data.dataUser.username;
                    let tgl = new Date(User.value.born_date);
                    tgl.setHours(tgl.getHours() + 7);
                    if (User.value.born_date !== null) {
                        User.value.born_date = tgl.toISOString().substr(0, 10);
                    }
                    loadingProfile.value = false;
                    console.log(User)
                    console.log(tempUserPass)
                }
            }).catch((error) => {
                console.log(error)
            });
        }

        // function get Posts
        function UpdateUser() {
            dialogUpdate.value = true;
            tempUser.value = JSON.parse(JSON.stringify(User.value));
        }

        function UpdateUserPass() {
            dialogUpdatePass.value = true;
            // tempUser.value = JSON.parse(JSON.stringify(User.value));
        }

        // Save User
        function save(id) {
            loading2.value = true;
            let name = tempUser.value.name;
            let address = tempUser.value.address;
            let number_phone = tempUser.value.number_phone;
            axios.put(Api.BASE_URL + `/pegawai/${id}`, {
                name: name,
                address: address,
                number_phone: number_phone,
            }, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + $cookies.get("SESSION")
                }
            }).then((response) => {
                console.log(response)
                snackbar.show = true;
                snackbar.color = 'success';
                snackbar.icon = 'mdi-check';
                snackbar.message = 'Berhasil Update User';
                User.value = JSON.parse(JSON.stringify(tempUser.value));
                dialogUpdate.value = false;
                getUserLog();

                this.$forceUpdate();
            }).catch((error) => {
                console.log(error)
                snackbar.show = true;
                snackbar.color = 'error';
                snackbar.icon = 'mdi-close';
                snackbar.message = error.response.data;
            }).finally(() => {
                loading2.value = false;
            });
        }

        // Save UserPass
        function savePass() {
            loading2.value = true;
            let tempUserPassusername = tempUserPass.value.username;
            let passwordOld = tempUserPass.value.passwordOld;
            let passwordNew = tempUserPass.value.passwordNew;
            axios.post(Api.BASE_URL + "/users/updatePassword", {
                username: tempUserPassusername,
                passwordOld: passwordOld,
                passwordNew: passwordNew,
            }, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + $cookies.get("SESSION")
                }
            }).then((response) => {
                console.log(response)
                snackbar.show = true;
                snackbar.color = 'success';
                snackbar.icon = 'mdi-check';
                snackbar.message = 'Berhasil Update Password User';
                tempUserPass.value.passwordOld = '';
                tempUserPass.value.passwordNew = '';
                dialogUpdatePass.value = false;
            }).catch((error) => {
                console.log(error)
                snackbar.show = true;
                snackbar.color = 'error';
                snackbar.icon = 'mdi-close';
                snackbar.message = 'Gagal Update Password User, Password Lama Salah';
            }).finally(() => {
                loading2.value = false;
            });
        }

        function cancel() {
            dialogUpdate.value = false;
        }



        // getUser();
        getUserLog();

        // Return
        return {
            Api,
            User,
            // getUser,
            dialogUpdate,
            dialogUpdatePass,
            // dialogPreview,
            UpdateUser,
            UpdateUserPass,
            validation,
            show: false,
            snackbar,
            save,
            savePass,
            cancel,
            tempUser,
            tempUserPass,
            fromDateMenu: false,
            // onImageClicked,
            // uploadAvatar,
            // posts,
            // editPostDialog,
            // editPostContent,
            // onimageSelected,
            // dialogUpdate,
            // editPost,
            // updatePost,
            // deletePost,
            // showPassword,
            // copyLink,
            // commentDialog,
            UserLog,
            loadingProfile,
            loading2,
            showPasswordLama,
            showPasswordBaru,
        };
    },
    watch: {
        '$route'(to, from) {
            if (to != from)
                this.$router.go();
        },
    }
}
</script>
<style>
.v-file-input {
    margin-left: 8px;
}

.format {
    margin-left: 30px;
    padding: 4px;
    font-size: 18px;
    font-weight: bold;
}

.nama {
    font-size: 48px;
    font-weight: bold;
}


.bio {
    margin-top: 10px;
    padding-left: 10px;
}

.editUser {
    float: right;
}

.overlay-change-pp {
    opacity: 0;
    cursor: pointer;
}

.overlay-change-pp:hover {
    opacity: 1;
}

.img-area {
    width: 100%;
    aspect-ratio: 16 / 9;
    position: relative;
    overflow: hidden;
}

.img-area .img-area-main {
    position: absolute;
    top: 0;
}
</style>