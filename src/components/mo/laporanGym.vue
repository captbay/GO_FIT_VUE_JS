<template>
    <v-main class="list">
        <link href="https://cdn.jsdelivr.net/npm/@mdi/font@5.x/css/materialdesignicons.min.css" rel="stylesheet" />
        <v-card>
            <v-list-item style="padding: 16px;">
                <v-list-item-content>
                    <v-list-item-title class="headline"> Laporan Aktivitas GYM </v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-card-title>
                <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" outlined hide
                    details></v-text-field>
                <v-spacer></v-spacer>
                <v-select v-model="bulanDipilih" :items="bulanDB" label="Pilih Bulan" name="bulan" item-value="value"
                    item-text="text" style="max-width: 100px;" @change="fetchDataByMonthYear">
                </v-select>
                <v-spacer></v-spacer>
                <v-select v-model="tahunDipilih" :items="tahunDB" label="Pilih Tahun" name="tahun" item-value="tahun"
                    item-text="tahun" style="max-width: 100px;" @change="fetchDataByMonthYear">
                </v-select>
                <v-spacer></v-spacer>
                <v-btn color="success" dark @click="dialogCetak = true"> Cetak PDF </v-btn>
            </v-card-title>
        </v-card>
        <v-card>
            <v-data-table :headers="headers" :items="aktivitasGYM" :search="search">
            </v-data-table>
        </v-card>
        <v-card style=" margin: 16px;" v-if="tahunDipilih != null && bulanDipilih != null">
            <v-card-title>
                <span class="headline"> Total Member Hadir</span>
            </v-card-title>
            <v-card-text>
                <span class="headline"> {{ totalMember }} </span>
            </v-card-text>
        </v-card>


        <!-- cetak  -->
        <v-dialog transition="dialog-top-transition" v-model="dialogCetak" persistent max-width="600px">
            <v-card>
                <v-form @submit.prevent="cetakPDF(bulanDipilih, tahunDipilih)">
                    <v-card-title>
                        <span class="headine"> Pilih Tahun</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container>
                            <v-select v-model="bulanDipilih" :items="bulanDB" label="Pilih Bulan" selected name="bulan"
                                item-value="value" item-text="text">
                            </v-select>
                            <v-select v-model="tahunDipilih" :items="tahunDB" label="Pilih Tahun" selected name="tahun"
                                item-value="tahun" item-text="tahun">
                            </v-select>
                        </v-container>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="red lighten-3" text @click="dialogCetak = false"> CANCEL</v-btn>
                        <v-btn color="blue darken-1" text type="submit"> SAVE</v-btn>
                    </v-card-actions>
                </v-form>
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
            aktivitasGYM: [],
            editedIndex: null,
            headers: [
                {
                    text: "Tanggal",
                    sortable: true,
                    value: "tanggal",
                },
                { text: "Jumlah Member", value: "jumlah_member" },
            ],

            //index
            indexArray: null,
            snackbar: reactive({
                show: false,
                color: '',
                icon: '',
                message: ''
            }),

            dialogCetak: false,

            //format tahun now
            tahunDB: [],
            bulanDB: [],
            tahunDipilih: new Date().getFullYear().toString(),
            bulanDipilih: (new Date().getMonth() + 1).toString(),

            //total pendapatan per tahun
            totalMember: null,
        };
    },
    methods: {

        fetchDataByMonthYear() {
            this.getData(this.bulanDipilih, this.tahunDipilih);
        },

        getData(bulan, tahun) {
            axios.get(Api.BASE_URL + `/aktivitasGymPerTahun/${bulan}/${tahun}`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + $cookies.get("SESSION")
                }
            }).then((response) => {
                this.aktivitasGYM = response.data.data;
                this.totalMember = response.data.total;
            }).catch((error) => {
                console.log(error)
            });
        },

        getBulanTahun() {
            axios.get(Api.BASE_URL + "/howManyMonthYearInGym", {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + $cookies.get("SESSION")
                }
            }).then((response) => {
                this.tahunDB = response.data.tahun;
                this.bulanDB = response.data.bulan;
                console.log(this.tahunDB)
            }).catch((error) => {
                console.log(error)
            });
        },


        //cetak pdf cash
        cetakPDF(bulan, tahun) {
            if (tahun == null || bulan == null) {
                this.snackbar.show = true;
                this.snackbar.color = 'error';
                this.snackbar.icon = 'mdi-close';
                this.snackbar.message = "bulan / tahun cetak null atau tidak dipilih";
            } else {

                this.snackbar.show = true;
                this.snackbar.color = 'warning';
                this.snackbar.icon = 'mdi-check';
                this.snackbar.message = 'Mohon Menunggu Sedang Mencetak :)';
                this.dialogCetak = false;

                axios.get(Api.BASE_URL + `/aktivitasGymPerTahunPDF/${bulan}/${tahun}`, {
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
                    fileLink.setAttribute('download', `aktivitasGYM Bulan ${bulan} - ${tahun}.pdf`);
                    document.body.appendChild(fileLink);
                    fileLink.click();

                    this.snackbar.show = true;
                    this.snackbar.color = 'success';
                    this.snackbar.icon = 'mdi-check';
                    this.snackbar.message = 'Berhasil Cetak';
                    this.dialogCetak = false;
                }).catch((error) => {
                    if (error.response.data.message != null) {
                        this.snackbar.show = true;
                        this.snackbar.color = 'error';
                        this.snackbar.icon = 'mdi-close';
                        this.snackbar.message = error.response.data.message;
                    }
                });
            }
        },
    },
    mounted() {
        this.getBulanTahun();
        this.fetchDataByMonthYear();
    },
};
</script>

  