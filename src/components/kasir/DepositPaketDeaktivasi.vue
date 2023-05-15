<template>
    <v-main class="list">
        <link href="https://cdn.jsdelivr.net/npm/@mdi/font@5.x/css/materialdesignicons.min.css" rel="stylesheet" />
        <v-card>
            <v-list-item style="padding: 16px;">
                <v-list-item-content>
                    <v-list-item-title class="headline">Reset Jumlah Deposit Paket</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-card-title>
                <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" outlined hide
                    details></v-text-field>
                <v-spacer></v-spacer>
                <v-btn class="mr-2 blue lighten-3">Tanggal Hari ini: {{ new Date().toISOString().substr(0, 10)
                }}</v-btn>
            </v-card-title>
        </v-card>
        <v-card>
            <v-card-title>Deposit paket expired per hari ini</v-card-title>
            <v-data-table :headers="headers" :items="deposit_package" :search="search">
                <template v-slot:[`item.actions`]="{ item }">
                    <v-btn small class="mr-2 red lighten-3" @click="deleteItem(item.id)">Reset</v-btn>
                </template>
            </v-data-table>
        </v-card>

        <!-- deaktivasi -->
        <v-dialog transition="dialog-top-transition" v-model="dialogDelete" max-width="500px">
            <v-card>
                <v-card-title class="text-h5 justify-center">Are you sure you want to reset this
                    deposit package?</v-card-title>
                <v-card-actions class="mt-4">
                    <v-spacer></v-spacer>
                    <v-btn color="blue-darken-1" variant="text" @click="dialogDelete = false">CANCEL</v-btn>
                    <v-btn color="mr-2 red lighten-3" variant="text" @click="deleteItemConfirm">YES</v-btn>
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
            //
            search: null,
            deposit_package: [],
            title: "",
            headers: [
                {
                    text: "Nama Kelas",
                    sortable: true,
                    value: "class_detail.name",
                },
                { text: "No Member", value: "member.no_member" },
                { text: "Nama Member", value: "member.name" },
                { text: "Jumlah Deposit Paket", value: "package_amount" },
                { text: "Expired Date Paket", value: "expired_date" },
                { text: "Actions", value: "actions", sortable: false },
            ],
            //pop up
            dialogDelete: false,

            //index
            editedIndex: null,
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
        getMember() {
            axios.get(Api.BASE_URL + "/showDepositPackageExpired", {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + $cookies.get("SESSION")
                }
            }).then((response) => {
                this.deposit_package = response.data.data;
                console.log(this.deposit_package)
            }).catch((error) => {
                console.log(error)
            });
        },

        deleteItem(item) {
            this.editedIndex = item
            this.dialogDelete = true
        },

        deleteItemConfirm() {
            let id = this.editedIndex;
            axios.delete(Api.BASE_URL + `/deposit_package/${id}`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + $cookies.get("SESSION")
                }
            }).then((response) => {
                console.log(response)
                this.snackbar.show = true;
                this.snackbar.color = 'success';
                this.snackbar.icon = 'mdi-check';
                this.snackbar.message = 'Berhasil Reset';
                //
                this.dialogDelete = false
                //reload
                this.getMember();
                this.validation = [];
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
        this.getMember();
    }
};
</script>

  