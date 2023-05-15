<template>
    <v-main class="list">
        <link href="https://cdn.jsdelivr.net/npm/@mdi/font@5.x/css/materialdesignicons.min.css" rel="stylesheet" />
        <v-card>
            <v-list-item style="padding: 16px;">
                <v-list-item-content>
                    <v-list-item-title class="headline"> Izin Instruktur </v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-card-title>
                <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" outlined hide
                    details></v-text-field>
                <v-spacer></v-spacer>
            </v-card-title>
        </v-card>
        <v-card>
            <v-card-title>Belum Dikonfirmasi</v-card-title>
            <v-data-table :headers="headers" :items="instruktur_izinNotConfrim" :search="search">
                <template v-slot:[`item.is_confirm`]="{ item }">
                    <v-chip v-if="item.is_confirm == 0" text-color="white" color="red">
                        Not Confirm
                    </v-chip>
                    <v-chip v-if="item.is_confirm == 1" text-color="white" color="green">
                        Confirm
                    </v-chip>
                </template>
                <template v-slot:[`item.action`]="{ item }">
                    <v-btn small class="mr-2 yellow lighten-3" @click="confirmIzin(item.id)">Konfirmasi</v-btn>
                </template>
            </v-data-table>
        </v-card>
        <v-card>
            <v-card-title>Sudah Dikonfirmasi</v-card-title>
            <v-data-table :headers="headers" :items="instruktur_izinAlreadyConfrim" :search="search">
                <template v-slot:[`item.is_confirm`]="{ item }">
                    <v-chip v-if="item.is_confirm == 0" text-color="white" color="red">
                        Not Confirm
                    </v-chip>
                    <v-chip v-if="item.is_confirm == 1" text-color="white" color="green">
                        Confirm
                    </v-chip>
                </template>
                <template v-slot:[`item.action`]>
                    <v-btn :disabled=true small class="mr-2 yellow lighten-3">Sudah Dikonfirmasi</v-btn>
                </template>
            </v-data-table>
        </v-card>

        <!-- are you sure add -->
        <v-dialog transition="dialog-top-transition" v-model="dialogAreUSureAdd" max-width="500px">
            <v-card>
                <v-card-title class="text-h5 justify-center">Are you sure you want to confirm?</v-card-title>
                <v-card-actions class="mt-4">
                    <v-spacer></v-spacer>
                    <v-btn color="blue-darken-1" variant="text" @click="dialogAreUSureAdd = false">CANCEL</v-btn>
                    <v-btn color="mr-2 red lighten-3" variant="text" @click="updateIzin()">YES</v-btn>
                    <v-spacer></v-spacer>
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
import { reactive } from "vue";
import * as Api from "../ApiHelper";
import axios from "axios";

export default {
    data() {
        return {
            search: null,
            instruktur_izinNotConfrim: [],
            instruktur_izinAlreadyConfrim: [],
            title: "",
            headers: [
                { text: "Nama Instruktur", sortable: true, value: "instruktur.name" },
                { text: "Nama Instruktur Pengganti", value: "instruktur_pengganti.name" },
                { text: "Nama Kelas Yang Diizin", value: "class_running.jadwal_umum.class_detail.name" },
                { text: "Alasan", value: "alasan" },
                { text: "Konfirmasi", value: "is_confirm" },
                { text: "Action", value: "action", sortable: false },
            ],
            //pop up
            dialogAreUSureAdd: false,

            //index
            indexArray: null,
            snackbar: reactive({
                show: false,
                color: '',
                icon: '',
                message: ''
            }),

            //validation
            validation: [],
        };
    },
    methods: {

        getIzinNotConfirm() {
            axios.get(Api.BASE_URL + "/instrukturIzin/notConfirm", {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + $cookies.get("SESSION")
                }
            }).then((response) => {
                this.instruktur_izinNotConfrim = response.data.data;
                console.log(this.instruktur_izinNotConfrim)
            }).catch((error) => {
                console.log(error)
            });
        },

        getIzinAlreadyConfirm() {
            axios.get(Api.BASE_URL + "/instrukturIzin/alreadyConfirm", {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + $cookies.get("SESSION")
                }
            }).then((response) => {
                this.instruktur_izinAlreadyConfrim = response.data.data;
                console.log(this.instruktur_izinAlreadyConfrim)
            }).catch((error) => {
                console.log(error)
            });
        },

        confirmIzin(id) {
            this.editedIndex = id;
            this.dialogAreUSureAdd = true;
        },

        updateIzin() {
            let id = this.editedIndex
            axios.post(Api.BASE_URL + `/instruktur_izin/confirmIzin/${id}`, {}, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + $cookies.get("SESSION")
                }
            }).then((response) => {
                console.log(response)

                this.snackbar.show = true;
                this.snackbar.color = 'success';
                this.snackbar.icon = 'mdi-check';
                this.snackbar.message = 'Berhasil konfirmasi izin';
                ///
                this.dialogAreUSureAdd = false
                //reload
                this.getIzinNotConfirm();
                this.getIzinAlreadyConfirm();
                this.validation = [];
            }).catch((error) => {
                console.log(error)
                this.dialogAreUSureAdd = false

                this.snackbar.show = true;
                this.snackbar.color = 'error';
                this.snackbar.icon = 'mdi-close';
                this.snackbar.message = error.response.data;
            });
        },

    },
    mounted() {
        this.getIzinNotConfirm();
        this.getIzinAlreadyConfirm();
    }
};
</script>

  