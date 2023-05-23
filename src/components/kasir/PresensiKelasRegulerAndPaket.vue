<template>
    <v-main class="list">
        <link href="https://cdn.jsdelivr.net/npm/@mdi/font@5.x/css/materialdesignicons.min.css" rel="stylesheet" />
        <v-card>
            <v-list-item style="padding: 16px;">
                <v-list-item-content>
                    <v-list-item-title class="headline"> Presensi Kelas dan Paket </v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-card-title>
                <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" outlined hide
                    details></v-text-field>
                <v-spacer></v-spacer>
            </v-card-title>
        </v-card>
        <v-card style="margin-top: 16px;">
            <v-list-item style="padding: 16px;">
                <v-list-item-content>
                    <v-list-item-title class="headline"> Presensi Kelas</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-data-table :headers="headers" :items="class_history" :search="search">
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
                <template v-slot:[`item.cetak`]="{ item }">
                    <v-btn small class="mr-2 yellow lighten-3" @click="cetakPdfCash(item.id, item)">cetak</v-btn>
                </template>
            </v-data-table>
        </v-card>
        <v-card style="margin-top: 16px;">
            <v-list-item style="padding: 16px;">
                <v-list-item-content>
                    <v-list-item-title class="headline"> Presensi Kelas Paket</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-data-table :headers="headerPackages" :items="class_package_history" :search="search">
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
                <template v-slot:[`item.cetak`]="{ item }">
                    <v-btn small class="mr-2 yellow lighten-3" @click="cetakPdfPackage(item.id, item)">cetak</v-btn>
                </template>
            </v-data-table>
        </v-card>


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
            class_history: [],
            class_package_history: [],
            editedIndex: null,
            title: "",
            headers: [
                {
                    text: "Nomor Booking",
                    sortable: true,
                    value: "no_class_history",
                },
                { text: "DateTime Presensi", value: "date_time" },
                { text: "No Member", value: "class_booking.member.no_member" },
                { text: "Nama Member", value: "class_booking.member.name" },
                { text: "Tanggal Kelas", value: "class_booking.class_running.date" },
                { text: "Sisa Deposit", value: "sisa_deposit" },
                { text: "Status Presensi", value: "status" },
                { text: "Cetak", value: "cetak", sortable: false },
            ],
            headerPackages: [
                {
                    text: "Nomor Booking",
                    sortable: true,
                    value: "no_class_package_history",
                },
                { text: "DateTime Presensi", value: "date_time" },
                { text: "No Member", value: "class_booking.member.no_member" },
                { text: "Nama Member", value: "class_booking.member.name" },
                { text: "Tanggal Kelas", value: "class_booking.class_running.date" },
                { text: "Sisa Deposit Kelas", value: "sisa_deposit_kelas" },
                { text: "Exp Date Paket", value: "expired_date" },
                { text: "Status Presensi", value: "status" },
                { text: "Cetak", value: "cetak", sortable: false },
            ],

            //index
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

        getClassHistory() {
            axios.get(Api.BASE_URL + "/class_history", {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + $cookies.get("SESSION")
                }
            }).then((response) => {
                this.class_history = response.data.data;
                console.log(this.class_history)
            }).catch((error) => {
                console.log(error)
            });
        },


        getClassPackageHistory() {
            axios.get(Api.BASE_URL + "/class_package_history", {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + $cookies.get("SESSION")
                }
            }).then((response) => {
                this.class_package_history = response.data.data;
                console.log(this.class_package_history)
            }).catch((error) => {
                console.log(error)
            });
        },


        //cetak pdf cash
        cetakPdfCash(id, item) {
            this.indexArray = this.class_history.indexOf(item);
            this.namePDF = this.class_history[this.indexArray].no_class_history;

            this.snackbar.show = true;
            this.snackbar.color = 'warning';
            this.snackbar.icon = 'mdi-check';
            this.snackbar.message = 'Mohon Menunggu Sedang Mencetak :)';
            this.dialogTambah = false;

            axios.get(Api.BASE_URL + `/class_history/generatePdf/${id}`, {
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
                fileLink.setAttribute('download', `class_history ${this.namePDF}.pdf`);
                document.body.appendChild(fileLink);
                fileLink.click();

                this.snackbar.show = true;
                this.snackbar.color = 'success';
                this.snackbar.icon = 'mdi-check';
                this.snackbar.message = 'Berhasil Cetak';
                this.dialogTambah = false;
            }).catch((error) => {
                this.snackbar.show = true;
                this.snackbar.color = 'error';
                this.snackbar.icon = 'mdi-close';
                this.snackbar.message = error.response.data.message;
            });
        },

        cetakPdfPackage(id, item) {
            this.indexArray = this.class_package_history.indexOf(item);
            this.namePDF = this.class_package_history[this.indexArray].no_class_package_history;

            this.snackbar.show = true;
            this.snackbar.color = 'warning';
            this.snackbar.icon = 'mdi-check';
            this.snackbar.message = 'Mohon Menunggu Sedang Mencetak :)';
            this.dialogTambah = false;

            axios.get(Api.BASE_URL + `/class_package_history/generatePdf/${id}`, {
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
                fileLink.setAttribute('download', `class_package_history ${this.namePDF}.pdf`);
                document.body.appendChild(fileLink);
                fileLink.click();

                this.snackbar.show = true;
                this.snackbar.color = 'success';
                this.snackbar.icon = 'mdi-check';
                this.snackbar.message = 'Berhasil Cetak';
                this.dialogTambah = false;
            }).catch((error) => {
                this.snackbar.show = true;
                this.snackbar.color = 'error';
                this.snackbar.icon = 'mdi-close';
                this.snackbar.message = error.response.data.message;
            });
        },

    },
    mounted() {
        this.getClassHistory();
        this.getClassPackageHistory();
    }
};
</script>

  