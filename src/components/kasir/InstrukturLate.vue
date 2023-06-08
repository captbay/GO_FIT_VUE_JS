<template>
    <v-main class="list">
        <link href="https://cdn.jsdelivr.net/npm/@mdi/font@5.x/css/materialdesignicons.min.css" rel="stylesheet" />
        <v-card>
            <v-list-item style="padding: 16px;">
                <v-list-item-content>
                    <v-list-item-title class="headline">Data Total Terlambat Instruktur</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-card-title>
                <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" outlined hide
                    details></v-text-field>
                <v-spacer></v-spacer>
                <v-btn color="success" dark @click="dialogAreUSureAdd = true"> Reset Jumlah Terlambat </v-btn>
            </v-card-title>
        </v-card>
        <v-card>
            <v-data-table :headers="headers" :items="instruktur" :search="search">
            </v-data-table>
        </v-card>

        <!-- are you sure add -->
        <v-dialog transition="dialog-top-transition" v-model="dialogAreUSureAdd" max-width="500px">
            <v-card>
                <v-card-title class="text-h5 justify-center">Are you sure you want to reset ALL?</v-card-title>
                <v-card-actions class="mt-4">
                    <v-spacer></v-spacer>
                    <v-btn color="blue-darken-1" variant="text" @click="dialogAreUSureAdd = false">CANCEL</v-btn>
                    <v-btn color="mr-2 red lighten-3" variant="text" @click="saveReset()">YES</v-btn>
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
            instruktur: [],
            title: "",
            headers: [
                {
                    text: "Nomor Instruktur",
                    sortable: true,
                    value: "no_instruktur",
                },
                { text: "Nama", value: "name" },
                { text: "Alamat", value: "address" },
                { text: "Nomor Telepon", value: "number_phone" },
                { text: "Tanggal Lahir", value: "born_date" },
                { text: "Gender", value: "gender" },
                { text: "Total Late(sec)", value: "total_late" },
            ],
            //pop up
            dialogAreUSureAdd: false,

            //index
            editedIndex: null,
            indexArray: null,
            snackbar: reactive({
                show: false,
                color: '',
                icon: '',
                message: ''
            }),
        };
    },
    methods: {

        getInstruktur() {
            axios.get(Api.BASE_URL + "/instruktur", {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + $cookies.get("SESSION")
                }
            }).then((response) => {
                this.instruktur = response.data.data;
                console.log(this.instruktur)
            }).catch((error) => {
                console.log(error)
            });
        },

        saveReset() {
            axios.post(Api.BASE_URL + "/resetTotalLate", {}, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + $cookies.get("SESSION")
                }
            }).then((response) => {
                console.log(response)

                this.snackbar.show = true;
                this.snackbar.color = 'success';
                this.snackbar.icon = 'mdi-check';
                this.snackbar.message = 'Berhasil Reset Jumlah Terlambat Semua instruktur';
                ///
                this.dialogAreUSureAdd = false
                //reload
                this.getInstruktur();
            }).catch((error) => {
                console.log(error)
                this.dialogAreUSureAdd = false

                if (error.response.data.message != null) {
                    this.snackbar.show = true;
                    this.snackbar.color = 'error';
                    this.snackbar.icon = 'mdi-close';
                    this.snackbar.message = error.response.data.message;
                }
            });
        }

    },
    mounted() {
        this.getInstruktur();
    }
};
</script>

  