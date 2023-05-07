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
            <v-data-table :headers="headers" :items="instruktur_izin" :search="search">
                <template v-slot:[`item.action`]="{ item }">
                    <v-btn small class="mr-2 yellow lighten-3" @click="confirmIzin(item.id, item)">Konfirmasi</v-btn>
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
                    <v-btn color="mr-2 red lighten-3" variant="text" @click="saveTambah()">YES</v-btn>
                    <v-spacer></v-spacer>
                </v-card-actions>
            </v-card>
        </v-dialog>


        <!-- snacbkar -->
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
import { reactive } from "vue";
import * as Api from "../ApiHelper";
import axios from "axios";

export default {
    data() {
        return {
            search: null,
            instruktur_izin: [],
            member: [],
            pegawaiKasir: [],
            instruktur_izinTemp: [],
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
            dialogTambah: false,
            dialogEdit: false,
            dialogDelete: false,
            dialogAreUSureAdd: false,
            dialogAreUSureEdit: false,

            //index
            indexArray: null,
            snackbar: reactive({
                show: false,
                color: '',
                icon: '',
                message: ''
            }),

            //date
            fromDateMenu: false,

            //validation
            validation: [],
        };
    },
    methods: {

        getIzin() {
            axios.get(Api.BASE_URL + "/instruktur_izin", {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + $cookies.get("SESSION")
                }
            }).then((response) => {
                this.instruktur_izin = response.data.data;
                console.log(this.instruktur_izin)
            }).catch((error) => {
                console.log(error)
            });
        },

        confirmIzin(id, item) {
            this.editedIndex = item
            this.dialogAreUSureAdd = true
        },

        saveTambah() {
            let id_member = this.instruktur_izinTemp.id_member;
            let id_pegawai = this.instruktur_izinTemp.id_pegawai;
            axios.post(Api.BASE_URL + "/instruktur_izin", {
                id_member: id_member,
                id_pegawai: id_pegawai,
            }, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + $cookies.get("SESSION")
                }
            }).then((response) => {
                console.log(response)
                //reset
                this.instruktur_izinTemp = [];

                this.snackbar.show = true;
                this.snackbar.color = 'success';
                this.snackbar.icon = 'mdi-check';
                this.snackbar.message = 'Berhasil tambah aktivasi';
                ///
                this.dialogTambah = false;
                this.dialogAreUSureAdd = false
                //reload
                this.getIzin();
                this.validation = [];
            }).catch((error) => {
                console.log(error)
                this.dialogAreUSureAdd = false

                this.validation.id_member = error.response.data.id_member
                this.validation.id_pegawai = error.response.data.id_pegawai

                // this.snackbar.show = true;
                // this.snackbar.color = 'error';
                // this.snackbar.icon = 'mdi-close';
                // this.snackbar.message = error.response.data.message;
            });
        },

    },
    mounted() {
        this.getIzin();
    }
};
</script>

  