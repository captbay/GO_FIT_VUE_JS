<template>
    <v-main class="list">
        <link href="https://cdn.jsdelivr.net/npm/@mdi/font@5.x/css/materialdesignicons.min.css" rel="stylesheet" />
        <v-card>
            <v-list-item style="padding: 16px;">
                <v-list-item-content>
                    <v-list-item-title class="headline"> Deposit Kelas </v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-card-title>
                <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" outlined hide
                    details></v-text-field>
                <v-spacer></v-spacer>
                <v-btn color="success" dark @click="dialogTambah = true"> Tambah </v-btn>
            </v-card-title>
        </v-card>
        <v-card>
            <v-data-table :headers="headers" :items="deposit_package_history" :search="search">
                <template v-slot:[`item.topup_amount`]="{ item }">
                    <v-card-text>Rp. {{ formatPrice(item.topup_amount) }}</v-card-text>
                </template>
                <template v-slot:[`item.bonus`]="{ item }">
                    <v-card-text>Rp. {{ formatPrice(item.bonus) }}</v-card-text>
                </template>
                <template v-slot:[`item.sisa`]="{ item }">
                    <v-card-text>Rp. {{ formatPrice(item.sisa) }}</v-card-text>
                </template>
                <template v-slot:[`item.total`]="{ item }">
                    <v-card-text>Rp. {{ formatPrice(item.total) }}</v-card-text>
                </template>
                <template v-slot:[`item.cetak`]="{ item }">
                    <v-btn small class="mr-2 yellow lighten-3" @click="cetakPdf(item.id, item)">cetak</v-btn>
                </template>
            </v-data-table>
        </v-card>

        <!-- tambah  -->
        <v-dialog transition="dialog-top-transition" v-model="dialogTambah" persistent max-width="600px">
            <v-card>
                <v-form @submit.prevent="dialogAreUSureAdd = true">
                    <v-card-title>
                        <span class="headine"> Form Deposit Kelas</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container>
                            <v-select v-model="deposit_package_historyTemp.id_class_detail" :items="classDetail"
                                label="Class yang dipilih" name="class_detail" item-value="id" item-text="name" clearable
                                :error-messages="validation.id_class_detail">
                            </v-select>
                            <v-select v-model="deposit_package_historyTemp.id_member" :items="member"
                                label="Member yang mau deposit" name="member" item-value="id" item-text="name" clearable
                                :error-messages="validation.id_member">
                            </v-select>
                            <v-select v-model="deposit_package_historyTemp.id_pegawai" :items="pegawaiKasir"
                                label="Kasir yang membuat transaksi" name="pegawaiKasir" item-value="id" item-text="name"
                                clearable :error-messages="validation.id_pegawai">
                            </v-select>
                            <v-select v-model="deposit_package_historyTemp.package_amount" :items="promoClass"
                                label="Pilih Paket yang diinginkan" name="package_amount" item-value="jumlah_sesi"
                                :item-text="item => `Beli ${item.jumlah_sesi} - Bonus ${item.bonus_sesi} - Durasi ${item.durasi_aktif} bulan`"
                                clearable :error-messages="validation.package_amount">
                            </v-select>
                            <!-- <v-text-field v-model="deposit_package_historyTemp.package_amount" label="jumlah topup paket"
                                clearable :error-messages="validation.package_amount"></v-text-field> -->
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
            deposit_package_history: [],
            member: [],
            pegawaiKasir: [],
            classDetail: [],
            promoClass: [],
            deposit_package_historyTemp: [],
            title: "",
            headers: [
                {
                    text: "Nomor Deposit Kelas",
                    sortable: true,
                    value: "no_deposit_package_history",
                },
                { text: "DateTime", value: "date_time" },
                { text: "No Member", value: "member.no_member" },
                { text: "Nama Member", value: "member.name" },
                { text: "Deposit", value: "total_price" },
                { text: "Jenis Kelas", value: "class_detail.name" },
                { text: "Total Deposit", value: "package_amount" },
                { text: "Berlaku sampai dengan (jika promo)", value: "expired_date" },
                { text: "Nama Kasir", value: "pegawai.name" },
                { text: "Cetak", value: "cetak", sortable: false },
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
        formatPrice(value) {
            let val = (value / 1).toFixed(2).replace('.', ',')
            return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        },

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

        getPegawaiKasir() {
            axios.get(Api.BASE_URL + "/getPegawaiKasir", {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + $cookies.get("SESSION")
                }
            }).then((response) => {
                this.pegawaiKasir = response.data.data;
                console.log(this.pegawaiKasir)
            }).catch((error) => {
                console.log(error)
            });
        },

        getClassDetail() {
            axios.get(Api.BASE_URL + "/class_detail", {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + $cookies.get("SESSION")
                }
            }).then((response) => {
                this.classDetail = response.data.data;
                console.log(this.classDetail)
            }).catch((error) => {
                console.log(error)
            });
        },


        getPromoClass() {
            axios.get(Api.BASE_URL + "/promo_class", {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + $cookies.get("SESSION")
                }
            }).then((response) => {
                this.promoClass = response.data.data;
                console.log(this.promoClass)
            }).catch((error) => {
                console.log(error)
            });
        },

        getData() {
            axios.get(Api.BASE_URL + "/deposit_package_history", {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + $cookies.get("SESSION")
                }
            }).then((response) => {
                this.deposit_package_history = response.data.data;
                console.log(this.deposit_package_history)
            }).catch((error) => {
                console.log(error)
            });
        },

        saveTambah() {
            let id_class_detail = this.deposit_package_historyTemp.id_class_detail;
            let id_member = this.deposit_package_historyTemp.id_member;
            let id_pegawai = this.deposit_package_historyTemp.id_pegawai;
            let package_amount = this.deposit_package_historyTemp.package_amount;
            axios.post(Api.BASE_URL + "/deposit_package_history", {
                id_class_detail: id_class_detail,
                id_member: id_member,
                id_pegawai: id_pegawai,
                package_amount: package_amount
            }, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + $cookies.get("SESSION")
                }
            }).then((response) => {
                console.log(response)
                //reset
                this.deposit_package_historyTemp = [];

                this.snackbar.show = true;
                this.snackbar.color = 'success';
                this.snackbar.icon = 'mdi-check';
                this.snackbar.message = 'Berhasil tambah aktivasi';
                ///
                this.dialogTambah = false;
                this.dialogAreUSureAdd = false
                //reload
                this.getData();
                this.validation = [];
            }).catch((error) => {
                console.log(error)
                this.dialogAreUSureAdd = false

                this.validation.id_class_detail = error.response.data.id_class_detail
                this.validation.id_member = error.response.data.id_member
                this.validation.id_pegawai = error.response.data.id_pegawai
                this.validation.package_amount = error.response.data.package_amount

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
            this.indexArray = this.deposit_package_history.indexOf(item);
            this.namePDF = this.deposit_package_history[this.indexArray].no_deposit_package_history;

            this.snackbar.show = true;
            this.snackbar.color = 'warning';
            this.snackbar.icon = 'mdi-check';
            this.snackbar.message = 'Mohon Menunggu Sedang Mencetak :)';
            this.dialogTambah = false;

            axios.get(Api.BASE_URL + `/deposit_package_history/generatePdf/${id}`, {
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
                fileLink.setAttribute('download', `deposit_package_history ${this.namePDF}.pdf`);
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
        this.getPegawaiKasir();
        this.getClassDetail();
        this.getPromoClass();
    }
};
</script>

  