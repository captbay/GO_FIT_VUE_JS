<template>
    <v-main class="list">
        <link href="https://cdn.jsdelivr.net/npm/@mdi/font@5.x/css/materialdesignicons.min.css" rel="stylesheet" />
        <v-card>
            <v-list-item style="padding: 16px;">
                <v-list-item-content>
                    <v-list-item-title class="headline">Member </v-list-item-title>
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
            <v-data-table :headers="headers" :items="member" :search="search">
                <template v-slot:[`item.actions`]="{ item }">
                    <v-btn small class="mr-2 blue lighten-3" @click="editItem(item)">
                        Reset Password
                    </v-btn>
                </template>
            </v-data-table>
        </v-card>

        <!-- edit  -->
        <v-dialog transition="dialog-top-transition" v-model="dialogEdit" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headine"> Form Reset Password Member</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-text-field v-model="memberTemp.passwordNew" label="password" required></v-text-field>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="dialogEdit = false"> Cancel</v-btn>
                    <v-btn color="blue darken-1" text @click="saveEdit()"> Save</v-btn>
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
import { reactive, ref } from "vue";
import * as Api from "../ApiHelper";
import { onMounted } from "vue";
import axios from "axios";

export default {
    data() {
        return {
            search: null,
            member: [],
            editedItem: {
                no_member: '',
            },
            memberTemp: [],
            title: "",
            headers: [
                {
                    text: "Nomor Member",
                    sortable: true,
                    value: "no_member",
                },
                { text: "Nama", value: "name" },
                { text: "Alamat", value: "address" },
                { text: "Nomor Telepon", value: "number_phone" },
                { text: "Tanggal Lahir", value: "born_date" },
                { text: "Gender", value: "gender" },
                { text: "Deposit Uang", value: "jumlah_deposit_reguler" },
                { text: "Exp Membership", value: "expired_date_membership" },
                { text: "Status Membership", value: "status_membership" },
                { text: "Actions", value: "actions", sortable: false },
                { text: "Cetak Kartu", value: "cetak", sortable: false },
            ],
            //pop up
            dialogTambah: false,
            dialogEdit: false,

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

        getPegawai() {
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

        //belum selesai
        editItem(item) {
            this.indexArray = this.member.indexOf(item);
            this.editedItem.no_member = this.member[this.indexArray].no_member;
            this.dialogEdit = true;
        },

        saveEdit() {
            let no_member = this.editedItem.no_member;
            let passwordNew = this.memberTemp.passwordNew;
            // let born_date = this.editedItem.born_date;
            // let gender = this.editedItem.gender;
            axios.post(Api.BASE_URL + `/users/resetPassword`, {
                username: no_member,
                passwordNew: passwordNew,
            }, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + $cookies.get("SESSION")
                }
            }).then((response) => {
                console.log(response)
                this.snackbar.show = true;
                this.snackbar.color = 'success';
                this.snackbar.icon = 'mdi-check';
                this.snackbar.message = 'Berhasil ubah password';
                this.dialogEdit = false;
                //reload
                this.getPegawai();
            }).catch((error) => {
                console.log(error)
                this.snackbar.show = true;
                this.snackbar.color = 'error';
                this.snackbar.icon = 'mdi-close';
                this.snackbar.message = error.response.data.message;
            });
        },

    },
    mounted() {
        this.getPegawai();
    }
};
</script>

  