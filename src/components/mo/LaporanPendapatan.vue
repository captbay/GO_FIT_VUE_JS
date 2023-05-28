<template>
    <v-main class="list">
        <link href="https://cdn.jsdelivr.net/npm/@mdi/font@5.x/css/materialdesignicons.min.css" rel="stylesheet" />
        <v-card>
            <v-list-item style="padding: 16px;">
                <v-list-item-content>
                    <v-list-item-title class="headline"> Laporan Pendapatan </v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-card-title>
                <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" outlined hide
                    details></v-text-field>
                <v-spacer></v-spacer>
                <v-select v-model="tahunDipilih" :items="tahunDB" label="Pilih Tahun" name="tahun" item-value="tahun"
                    item-text="tahun" style="max-width: 100px;" @change="fetchDataByYear">
                </v-select>
                <!-- <v-btn color="success" dark @click="cetakPDF(tahun)"> Cetak PDF </v-btn> -->
                <v-spacer></v-spacer>
                <v-btn color="success" dark @click="dialogCetak = true"> Cetak PDF </v-btn>
            </v-card-title>
        </v-card>
        <v-card>
            <v-data-table :headers="headers" :items="pendapatanPerTahun" :search="search">
                <template v-slot:[`item.aktivasi`]="{ item }">
                    <v-card-text>Rp. {{ formatPrice(item.aktivasi) }}</v-card-text>
                </template>
                <template v-slot:[`item.deposit`]="{ item }">
                    <v-card-text>Rp. {{ formatPrice(item.deposit) }}</v-card-text>
                </template>
                <template v-slot:[`item.total`]="{ item }">
                    <v-card-text>Rp. {{ formatPrice(item.total) }}</v-card-text>
                </template>
            </v-data-table>
        </v-card>
        <v-card style=" margin: 16px;" v-if="tahunDipilih != null">
            <v-card-title>
                <span class="headline"> Total Pendapatan</span>
            </v-card-title>
            <v-card-text>
                <span class="headline"> Rp. {{ formatPrice(totalPendapatan) }} </span>
            </v-card-text>
        </v-card>
        <v-card style="padding: 32px;" v-if="tahunDipilih != null">
            <h1 class="headline">Grafik Pendapatan</h1>
            <div style="margin: 32px;">
                <canvas ref="chartCanvas"></canvas>
            </div>
        </v-card>


        <!-- cetak  -->
        <v-dialog transition="dialog-top-transition" v-model="dialogCetak" persistent max-width="600px">
            <v-card>
                <v-form @submit.prevent="cetakPDF(tahunDipilih)">
                    <v-card-title>
                        <span class="headine"> Pilih Tahun</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container>
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
import { Chart, registerables } from 'chart.js';

export default {
    data() {
        return {
            search: null,
            pendapatanPerTahun: [],
            editedIndex: null,
            headers: [
                {
                    text: "Bulan",
                    sortable: true,
                    value: "bulan",
                },
                { text: "Aktivasi", value: "aktivasi" },
                { text: "Deposit", value: "deposit" },
                { text: "Total", value: "total" },
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
            tahunDipilih: new Date().getFullYear(),

            //total pendapatan per tahun
            totalPendapatan: null,
        };
    },
    methods: {
        formatPrice(value) {
            let val = (value / 1).toFixed(2).replace('.', ',')
            return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        },

        fetchDataByYear() {
            this.getPendapatanPerTahun(this.tahunDipilih);
            this.fetchChartData(this.tahunDipilih);
        },

        getPendapatanPerTahun(tahun) {
            axios.get(Api.BASE_URL + `/pendapatanPerTahun/${tahun}`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + $cookies.get("SESSION")
                }
            }).then((response) => {
                this.pendapatanPerTahun = response.data.data;
                this.totalPendapatan = response.data.total;
                console.log(this.pendapatanPerTahun)
            }).catch((error) => {
                console.log(error)
            });
        },

        getYear() {
            axios.get(Api.BASE_URL + "/howManyYearInDB", {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + $cookies.get("SESSION")
                }
            }).then((response) => {
                this.tahunDB = response.data.data;
                console.log(this.tahunDB)
            }).catch((error) => {
                console.log(error)
            });
        },


        //cetak pdf cash
        cetakPDF(tahun) {
            if (tahun == null) {
                this.snackbar.show = true;
                this.snackbar.color = 'error';
                this.snackbar.icon = 'mdi-close';
                this.snackbar.message = "tahun cetak null atau tidak dipilih";
            } else {

                this.snackbar.show = true;
                this.snackbar.color = 'warning';
                this.snackbar.icon = 'mdi-check';
                this.snackbar.message = 'Mohon Menunggu Sedang Mencetak :)';
                this.dialogCetak = false;

                axios.get(Api.BASE_URL + `/pendapatanPerTahunPDF/${tahun}`, {
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
                    fileLink.setAttribute('download', `pendapatanPerTahun ${tahun}.pdf`);
                    document.body.appendChild(fileLink);
                    fileLink.click();

                    this.snackbar.show = true;
                    this.snackbar.color = 'success';
                    this.snackbar.icon = 'mdi-check';
                    this.snackbar.message = 'Berhasil Cetak';
                    this.dialogCetak = false;
                }).catch((error) => {
                    this.snackbar.show = true;
                    this.snackbar.color = 'error';
                    this.snackbar.icon = 'mdi-close';
                    this.snackbar.message = error.response.data.message;
                });
            }
        },

        fetchChartData(tahun) {
            // Fetch data from API
            axios
                .get(Api.BASE_URL + `/chartDataPendapatanBulanan/${tahun}`, {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + $cookies.get("SESSION")
                    }
                })
                .then((response) => {
                    const labels = response.data.label; // Use the label array as it is
                    const data = response.data.value; // Use the value array as it is

                    // Create the chart
                    if (labels.length > 0 && data.length > 0) {
                        this.createChart(labels, data);
                    } else {
                        // this.createChart(['Tidak Ada Data'], [0]);
                        console.log("tidak ada tahun yang dipilih");
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        },

        createChart(labels, data) {
            const ctx = this.$refs.chartCanvas.getContext("2d");

            // Register the necessary chart components
            Chart.register(...registerables);

            // Destroy the previous chart instance, if it exists
            if (this.chartInstance) {
                this.chartInstance.destroy();
            }

            // Create the chart instance
            this.chartInstance = new Chart(ctx, {
                type: "bar",
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: "Total Pendapatan",
                            data: data,
                            backgroundColor: "rgba(75, 192, 192, 0.2)",
                            borderColor: "rgba(75, 192, 192, 1)",
                            borderWidth: 1,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                },
            });
        },
    },
    mounted() {
        this.getYear();
        this.fetchDataByYear();
    },
};
</script>

  