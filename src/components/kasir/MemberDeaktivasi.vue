<template>
    <v-main class="list">
        <link href="https://cdn.jsdelivr.net/npm/@mdi/font@5.x/css/materialdesignicons.min.css" rel="stylesheet" />
        <v-card>
            <v-list-item style="padding: 16px;">
                <v-list-item-content>
                    <v-list-item-title class="headline">Deaktivasi Member </v-list-item-title>
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
            <v-card-title>Member expired per hari ini</v-card-title>
            <v-data-table :headers="headers" :items="member" :search="search">
                <template v-slot:[`item.status_membership`]="{ item }">
                    <v-chip v-if="item.status_membership == 0" text-color="white" color="red">
                        Not Active
                    </v-chip>
                    <v-chip v-if="item.status_membership == 1" text-color="white" color="green">
                        Active
                    </v-chip>
                </template>
                <template v-slot:[`item.jumlah_deposit_reguler`]="{ item }">
                    <v-card-text>Rp. {{ formatPrice(item.jumlah_deposit_reguler) }}</v-card-text>
                </template>
                <template v-slot:[`item.actions`]="{ item }">
                    <v-btn small class="mr-2 red lighten-3" @click="deleteItem(item.id)">Deaktivasi</v-btn>
                </template>
            </v-data-table>
        </v-card>

        <v-card>
            <v-card-title>Member tidak aktif</v-card-title>
            <v-data-table :headers="headers" :items="memberNotActive" :search="search">
                <template v-slot:[`item.status_membership`]="{ item }">
                    <v-chip v-if="item.status_membership == 0" text-color="white" color="red">
                        Not Active
                    </v-chip>
                    <v-chip v-if="item.status_membership == 1" text-color="white" color="green">
                        Active
                    </v-chip>
                </template>
                <template v-slot:[`item.jumlah_deposit_reguler`]="{ item }">
                    <v-card-text>Rp. {{ formatPrice(item.jumlah_deposit_reguler) }}</v-card-text>
                </template>
                <template v-slot:[`item.actions`]="{ item }">
                    <v-btn :disabled=true small class="mr-2 red lighten-3" @click="deleteItem(item.id)">Deaktivasi</v-btn>
                </template>
            </v-data-table>
        </v-card>

        <!-- deaktivasi -->
        <v-dialog transition="dialog-top-transition" v-model="dialogDelete" max-width="500px">
            <v-card>
                <v-card-title class="text-h5 justify-center">Are you sure you want to deactive this member?</v-card-title>
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
            member: [],
            memberNotActive: [],
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

        formatPrice(value) {
            let val = (value / 1).toFixed(2).replace('.', ',')
            return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        },

        getMember() {
            axios.get(Api.BASE_URL + "/showMemberExpired", {
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

        getMemberNotActive() {
            axios.get(Api.BASE_URL + "/showMemberNotActive", {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + $cookies.get("SESSION")
                }
            }).then((response) => {
                this.memberNotActive = response.data.data;
                console.log(this.memberNotActive)
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
            axios.post(Api.BASE_URL + `/deaktivasiMember/${id}`, {}, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + $cookies.get("SESSION")
                }
            }).then((response) => {
                console.log(response)
                this.snackbar.show = true;
                this.snackbar.color = 'success';
                this.snackbar.icon = 'mdi-check';
                this.snackbar.message = 'Berhasil deaktivasi';
                //
                this.dialogDelete = false
                //reload
                this.getMember();
                this.getMemberNotActive();
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
        this.getMemberNotActive();
    }
};
</script>

  