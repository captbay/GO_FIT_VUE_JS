<template>
    <v-main class="list">
        <link href="https://cdn.jsdelivr.net/npm/@mdi/font@5.x/css/materialdesignicons.min.css" rel="stylesheet" />
        <v-card>
            <v-list-item style="padding: 16px;">
                <v-list-item-content>
                    <v-list-item-title class="headline">Promo Cash</v-list-item-title>
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
            <v-data-table :headers="headers" :items="promo" :search="search">
                <template v-slot:[`item.actions`]="{ item }">
                    <v-btn small class="mr-2 blue lighten-3" @click="editItem(item.id, item)">
                        edit
                    </v-btn>
                    <v-btn small class="mr-2 red lighten-3" @click="deleteItem(item.id)">delete</v-btn>
                </template>
            </v-data-table>
        </v-card>

        <!-- tambah  -->
        <v-dialog transition="dialog-top-transition" v-model="dialogTambah" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headine"> Form Promo Cash</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-text-field v-model="promoTemp.min_deposit_cash" label="deposit" required></v-text-field>
                        <v-text-field v-model="promoTemp.min_topup_cash" label="topup" required></v-text-field>
                        <v-text-field v-model="promoTemp.bonus_cash" label="bonus" required></v-text-field>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="dialogTambah = false"> Cancel</v-btn>
                    <v-btn color="blue darken-1" text @click="saveTambah()"> Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- edit  -->
        <v-dialog transition="dialog-top-transition" v-model="dialogEdit" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headine"> Form Promo Cash</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-text-field v-model="editedItem.min_deposit_cash" label="deposit" required></v-text-field>
                        <v-text-field v-model="editedItem.min_topup_cash" label="topup" required></v-text-field>
                        <v-text-field v-model="editedItem.bonus_cash" label="bonus" required></v-text-field>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="dialogEdit = false"> Cancel</v-btn>
                    <v-btn color="blue darken-1" text @click="saveEdit()"> Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- hapus -->
        <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
                <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue-darken-1" variant="text" @click="dialogDelete = false">Cancel</v-btn>
                    <v-btn color="mr-2 red lighten-3" variant="text" @click="deleteItemConfirm">OK</v-btn>
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
import { reactive, ref } from "vue";
import * as Api from "../ApiHelper";
import { onMounted } from "vue";
import axios from "axios";

export default {
    data() {
        return {
            search: null,
            promo: [],
            editedItem: {
                min_deposit_cash: 0,
                min_topup_cash: 0,
                bonus_cash: 0,
            },
            promoTemp: [],
            title: "",
            headers: [
                {
                    text: "Minimal Deposit",
                    sortable: true,
                    value: "min_deposit_cash",
                },
                { text: "Minimal Topup", value: "min_topup_cash" },
                { text: "Bonus", value: "bonus_cash" },
                { text: "Actions", value: "actions", sortable: false },
            ],
            //pop up
            dialogTambah: false,
            dialogEdit: false,
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
        };
    },
    methods: {
        getPromo() {
            axios.get(Api.BASE_URL + "/promo_cash", {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + $cookies.get("SESSION")
                }
            }).then((response) => {
                this.promo = response.data.data;
                console.log(this.promo)
            }).catch((error) => {
                console.log(error)
            });
        },

        //belum selesai
        editItem(id, item) {
            this.editedIndex = id
            this.indexArray = this.promo.indexOf(item)
            this.editedItem.min_deposit_cash = this.promo[this.indexArray].min_deposit_cash
            this.editedItem.min_topup_cash = this.promo[this.indexArray].min_topup_cash
            this.editedItem.bonus_cash = this.promo[this.indexArray].bonus_cash
            console.log(this.editedItem)
            console.log(this.editedIndex)
            this.dialogEdit = true
        },

        saveEdit() {
            let id = this.editedIndex;
            let min_deposit_cash = this.editedItem.min_deposit_cash;
            let min_topup_cash = this.editedItem.min_topup_cash;
            let bonus_cash = this.editedItem.bonus_cash;
            axios.put(Api.BASE_URL + `/promo_cash/${id}`, {
                min_deposit_cash: min_deposit_cash,
                min_topup_cash: min_topup_cash,
                bonus_cash: bonus_cash,
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
                this.snackbar.message = 'Berhasil Edit';
                this.dialogEdit = false;
                //reload
                this.getPromo();
            }).catch((error) => {
                console.log(error)
                this.snackbar.show = true;
                this.snackbar.color = 'error';
                this.snackbar.icon = 'mdi-close';
                this.snackbar.message = error.response.data.message;
            });
        },

        deleteItem(item) {
            this.editedIndex = item
            this.dialogDelete = true
        },

        deleteItemConfirm() {
            let id = this.editedIndex;
            axios.delete(Api.BASE_URL + `/promo_cash/${id}`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + $cookies.get("SESSION")
                }
            }).then((response) => {
                console.log(response)
                this.snackbar.show = true;
                this.snackbar.color = 'success';
                this.snackbar.icon = 'mdi-check';
                this.snackbar.message = 'Berhasil hapus';
                this.dialogDelete = false
                //reload
                this.getPromo();
            }).catch((error) => {
                console.log(error)
                this.snackbar.show = true;
                this.snackbar.color = 'error';
                this.snackbar.icon = 'mdi-close';
                this.snackbar.message = error.response.data.message;
            });

        },

        saveTambah() {
            let min_deposit_cash = this.promoTemp.min_deposit_cash;
            let min_topup_cash = this.promoTemp.min_topup_cash;
            let bonus_cash = this.promoTemp.bonus_cash;
            axios.post(Api.BASE_URL + "/promo_cash", {
                min_deposit_cash: min_deposit_cash,
                min_topup_cash: min_topup_cash,
                bonus_cash: bonus_cash,
            }, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + $cookies.get("SESSION")
                }
            }).then((response) => {
                console.log(response)
                //reset
                this.promoTemp = [];

                this.snackbar.show = true;
                this.snackbar.color = 'success';
                this.snackbar.icon = 'mdi-check';
                this.snackbar.message = 'Berhasil tambah';
                this.dialogTambah = false;
                //reload
                this.getPromo();
            }).catch((error) => {
                console.log(error)
                this.snackbar.show = true;
                this.snackbar.color = 'error';
                this.snackbar.icon = 'mdi-close';
                this.snackbar.message = error.response.data.message;
            });
        }

    },
    mounted() {
        this.getPromo();
    }
};
</script>

  