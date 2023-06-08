<template>
    <v-main class="list">
        <link href="https://cdn.jsdelivr.net/npm/@mdi/font@5.x/css/materialdesignicons.min.css" rel="stylesheet" />
        <v-card>
            <v-list-item style="padding: 16px;">
                <v-list-item-content>
                    <v-list-item-title class="headline"> Presensi GYM </v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-card-title>
                <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" outlined hide
                    details></v-text-field>
                <v-spacer></v-spacer>
                <v-btn color="success" dark @click="dialogTambah = true"> Tambah Presensi & Bookingan </v-btn>
            </v-card-title>
        </v-card>
        <v-card>
            <v-data-table :headers="headers" :items="gym_history" :search="search">
                <template v-slot:[`item.status`]="{ item }">
                    <v-chip v-if="item.status == 0" text-color="white" color="red">
                        Tidak Hadir
                    </v-chip>
                    <v-chip v-if="item.status == 1" text-color="white" color="green">
                        Hadir
                    </v-chip>
                    <v-chip v-if="item.status == null" text-color="black" color="yellow">
                        Belum Dipresensi
                    </v-chip>
                </template>
                <template v-slot:[`item.presensi`]="{ item }">
                    <v-btn small class="mr-2 green lighten-3" @click="editPresensi(item.id)">presensi</v-btn>
                    <!-- <v-btn v-if="item.status != null" small class="mr-2 green lighten-3" :disabled=true>presensi</v-btn> -->
                </template>
                <template v-slot:[`item.cetak`]="{ item }">
                    <v-btn v-if="item.status != null && item.status == 1" small class="mr-2 yellow lighten-3"
                        @click="cetakPdf(item.id, item)">cetak</v-btn>
                    <v-btn v-if="item.status == null || item.status == 0" small class="mr-2 yellow lighten-3"
                        @click="cetakPdf(item.id, item)" :disabled=true>cetak</v-btn>
                </template>
            </v-data-table>
        </v-card>

        <!-- tambah  -->
        <v-dialog transition="dialog-top-transition" v-model="dialogTambah" persistent max-width="600px">
            <v-card>
                <v-form @submit.prevent="dialogAreUSureAdd = true">
                    <v-card-title>
                        <span class="headine"> Form GYM</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container>
                            <v-select v-model="gym_historyTemp.id_gym" :items="Gym" label="Gym yang dipilih" name="gym"
                                item-value="id" :item-text="item => `${item.start_gym} - ${item.end_gym}`" clearable
                                :error-messages="validation.id_gym">
                            </v-select>
                            <v-select v-model="gym_historyTemp.id_member" :items="member" label="Member yang GYM"
                                name="member" item-value="id" item-text="name" clearable
                                :error-messages="validation.id_member">
                            </v-select>
                            <v-menu v-model="fromDateMenu" :close-on-content-click="false" nudge-bottom="64"
                                transition="scale-transition" max-width="290px" min-width="290px">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field label="Tanggal Booking GYM" readonly
                                        v-model="gym_historyTemp.date_booking" v-on="on" v-bind="attrs" clearable
                                        :error-messages="validation.date_booking"></v-text-field>
                                </template>
                                <v-date-picker v-model="gym_historyTemp.date_booking" show-adjacent-months locale="en-in"
                                    @input="fromDateMenu = false"></v-date-picker>
                            </v-menu>
                        </v-container>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="red lighten-3" text @click="dialogTambah = false"> CANCEL</v-btn>
                        <v-btn color="blue darken-1" text type="submit"> SAVE</v-btn>
                    </v-card-actions>
                </v-form>
            </v-card>
        </v-dialog>

        <!-- are you sure add -->
        <v-dialog transition="dialog-top-transition" v-model="dialogAreUSureAdd" max-width="500px">
            <v-card>
                <v-card-title class="text-h5 justify-center">Are you sure you want to add?</v-card-title>
                <v-card-actions class="mt-4">
                    <v-spacer></v-spacer>
                    <v-btn color="blue-darken-1" variant="text" @click="dialogAreUSureAdd = false">CANCEL</v-btn>
                    <v-btn color="mr-2 red lighten-3" variant="text" @click="saveTambah()">YES</v-btn>
                    <v-spacer></v-spacer>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- presensi hadir atau tidak hadir  -->
        <v-dialog transition="dialog-top-transition" v-model="dialogPresensi" persistent max-width="600px">
            <v-card>
                <v-form @submit.prevent="dialogAreUSureEdit = true">
                    <v-card-title>
                        <span class="headine"> Form Presensi</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container>
                            <v-select v-model="gym_historyTemp.status" :items="statusPilihan" label="Pilih Status Kehadiran"
                                name="status" item-value="id" item-text="name" clearable
                                :error-messages="validation.status">
                            </v-select>
                        </v-container>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="red lighten-3" text @click="dialogPresensi = false"> CANCEL</v-btn>
                        <v-btn color="blue darken-1" text type="submit"> SAVE</v-btn>
                    </v-card-actions>
                </v-form>
            </v-card>
        </v-dialog>


        <!-- are you sure presensi -->
        <v-dialog transition="dialog-top-transition" v-model="dialogAreUSureEdit" max-width="500px">
            <v-card>
                <v-card-title class="text-h5 justify-center">Are you sure you want to presensi?</v-card-title>
                <v-card-actions class="mt-4">
                    <v-spacer></v-spacer>
                    <v-btn color="blue-darken-1" variant="text" @click="dialogAreUSureEdit = false">CANCEL</v-btn>
                    <v-btn color="mr-2 red lighten-3" variant="text" @click="presensiAktivitas()">YES</v-btn>
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
            //cetak pdf
            namePDF: '',
            //
            search: null,
            gym_history: [],

            member: [],
            Gym: [],
            promoClass: [],

            gym_historyTemp: [],
            editedIndex: null,
            title: "",
            headers: [
                {
                    text: "Nomor Presensi GYM",
                    sortable: true,
                    value: "no_gym_history",
                },
                { text: "No Member", value: "gym_booking.member.no_member" },
                { text: "Nama Member", value: "gym_booking.member.name" },
                { text: "Tanggal GYM", value: "gym_booking.date_booking" },
                { text: "Start GYM", value: "gym_booking.gym.start_gym" },
                { text: "End GYM", value: "gym_booking.gym.end_gym" },
                { text: "Status Presensi", value: "status" },
                { text: "Presensi", value: "presensi", sortable: false },
                { text: "Cetak", value: "cetak", sortable: false },
            ],
            //pop up
            dialogTambah: false,
            dialogPresensi: false,
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

            statusPilihan: [
                { id: 1, name: "Hadir" },
                { id: 0, name: "Tidak Hadir" },
            ],
        };
    },
    methods: {

        getMember() {
            axios.get(Api.BASE_URL + "/member", {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + $cookies.get("SESSION")
                }
            }).then((response) => {
                this.member = response.data.data;
                console.log(this.member)
            }).catch((error) => {
                console.log(error)
            });
        },
        getGym() {
            axios.get(Api.BASE_URL + "/gym", {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + $cookies.get("SESSION")
                }
            }).then((response) => {
                this.Gym = response.data.data;
                console.log(this.Gym)
            }).catch((error) => {
                console.log(error)
            });
        },

        getData() {
            axios.get(Api.BASE_URL + "/gym_history", {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + $cookies.get("SESSION")
                }
            }).then((response) => {
                this.gym_history = response.data.data;
                console.log(this.gym_history)
            }).catch((error) => {
                console.log(error)
            });
        },

        saveTambah() {
            let id_gym = this.gym_historyTemp.id_gym;
            let id_member = this.gym_historyTemp.id_member;
            let date_booking = this.gym_historyTemp.date_booking;
            axios.post(Api.BASE_URL + "/gym_history", {
                id_gym: id_gym,
                id_member: id_member,
                date_booking: date_booking,
            }, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + $cookies.get("SESSION")
                }
            }).then((response) => {
                console.log(response)
                //reset
                this.gym_historyTemp = [];

                this.snackbar.show = true;
                this.snackbar.color = 'success';
                this.snackbar.icon = 'mdi-check';
                this.snackbar.message = 'Berhasil tambah Presensi dan Booking';
                ///
                this.dialogTambah = false;
                this.dialogAreUSureAdd = false
                //reload
                this.getData();
                this.validation = [];
            }).catch((error) => {
                console.log(error)
                this.dialogAreUSureAdd = false

                this.validation.id_gym = error.response.data.id_gym
                this.validation.id_member = error.response.data.id_member
                this.validation.date_booking = error.response.data.date_booking

                if (error.response.data.message != null) {
                    this.snackbar.show = true;
                    this.snackbar.color = 'error';
                    this.snackbar.icon = 'mdi-close';
                    this.snackbar.message = error.response.data.message;
                }
            });
        },


        editPresensi(id) {
            this.editedIndex = id;
            this.dialogPresensi = true;
        },

        presensiAktivitas() {
            let id = this.editedIndex;
            let status = this.gym_historyTemp.status;
            axios.post(Api.BASE_URL + `/gym_history/updateStatus/${id}`, {
                status: status,
            }, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + $cookies.get("SESSION")
                }
            }).then((response) => {
                console.log(response)
                //reset
                this.gym_historyTemp = [];

                this.snackbar.show = true;
                this.snackbar.color = 'success';
                this.snackbar.icon = 'mdi-check';
                this.snackbar.message = 'Berhasil Presensi';
                ///
                this.dialogPresensi = false;
                this.dialogAreUSureEdit = false
                //reload
                this.getData();
                this.validation = [];
            }).catch((error) => {
                console.log(error)
                this.dialogAreUSureEdit = false

                this.validation.status = error.response.data.status

                if (error.response.data.message != null) {
                    this.snackbar.show = true;
                    this.snackbar.color = 'error';
                    this.snackbar.icon = 'mdi-close';
                    this.snackbar.message = error.response.data.message;
                }
            });
        },

        //cetak pdf
        cetakPdf(id, item) {
            this.indexArray = this.gym_history.indexOf(item);
            this.namePDF = this.gym_history[this.indexArray].no_gym_history;

            this.snackbar.show = true;
            this.snackbar.color = 'warning';
            this.snackbar.icon = 'mdi-check';
            this.snackbar.message = 'Mohon Menunggu Sedang Mencetak :)';
            this.dialogTambah = false;

            axios.get(Api.BASE_URL + `/gym_history/generatePdf/${id}`, {
                responseType: 'blob',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + $cookies.get("SESSION")
                }
            }).then((response) => {
                console.log(response.data)
                var fileURL = window.URL.createObjectURL(new Blob([response.data]));
                var fileLink = document.createElement('a');
                fileLink.href = fileURL;
                fileLink.setAttribute('download', `gym_history ${this.namePDF}.pdf`);
                document.body.appendChild(fileLink);
                fileLink.click();

                this.snackbar.show = true;
                this.snackbar.color = 'success';
                this.snackbar.icon = 'mdi-check';
                this.snackbar.message = 'Berhasil Cetak';
                this.dialogTambah = false;
            }).catch((error) => {
                if (error.response.data.message != null) {
                    this.snackbar.show = true;
                    this.snackbar.color = 'error';
                    this.snackbar.icon = 'mdi-close';
                    this.snackbar.message = error.response.data.message;
                }
            });
        },

    },
    mounted() {
        this.getData();
        this.getMember();
        // this.getPegawaiKasir();
        this.getGym();
        // this.getPromoClass();
    }
};
</script>

  