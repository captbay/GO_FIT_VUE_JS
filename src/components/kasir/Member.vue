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
                    <v-btn small class="mr-2 blue lighten-3" @click="editItem(item.id, item)">
                        edit
                    </v-btn>
                    <v-btn small class="mr-2 red lighten-3" @click="deleteItem(item.id)">delete</v-btn>
                </template>
                <template v-slot:[`item.cetak`]="{ item }">
                    <v-btn small class="mr-2 yellow lighten-3" @click="cetakPdf(item.id, item)">cetak</v-btn>
                </template>
            </v-data-table>
        </v-card>

        <!-- tambah  -->
        <v-dialog transition="dialog-top-transition" v-model="dialogTambah" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headine"> Form Member</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-text-field v-model="memberTemp.name" label="Nama" required></v-text-field>
                        <v-text-field v-model="memberTemp.address" label="Alamat" required></v-text-field>
                        <v-text-field v-model="memberTemp.number_phone" label="Nomor Telepon" required></v-text-field>
                        <v-menu v-model="fromDateMenu" :close-on-content-click="false" nudge-bottom="64"
                            transition="scale-transition" max-width="290px" min-width="290px">
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field label="Tanggal Lahir" readonly v-model="memberTemp.born_date" v-on="on"
                                    v-bind="attrs"></v-text-field>
                            </template>
                            <v-date-picker v-model="memberTemp.born_date" show-adjacent-months locale="en-in"
                                @input="fromDateMenu = false"></v-date-picker>
                        </v-menu>
                        <v-select v-model="memberTemp.gender" :items="gender" label="Gender" name="gender" required>
                        </v-select>
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
                    <span class="headine"> Form Member</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-text-field v-model="editedItem.name" label="Nama" required></v-text-field>
                        <v-text-field v-model="editedItem.address" label="Alamat" required></v-text-field>
                        <v-text-field v-model="editedItem.number_phone" label="Nomor Telepon" required></v-text-field>
                        <!-- <v-menu v-model="fromDateMenu" :close-on-content-click="false" nudge-bottom="64"
                            transition="scale-transition" max-width="290px" min-width="290px">
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field label="Tanggal Lahir" readonly v-model="editedItem.born_date" v-on="on"
                                    v-bind="attrs"></v-text-field>
                            </template>
                            <v-date-picker v-model="editedItem.born_date" show-adjacent-months locale="en-in"
                                @input="fromDateMenu = false"></v-date-picker>
                        </v-menu>
                        <v-select v-model="editedItem.gender" :items="gender" label="Gender" name="gender" required>
                        </v-select> -->
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
            namePDF: '',
            search: null,
            member: [],
            editedItem: {
                name: '',
                address: '',
                number_phone: '',
                born_date: '',
                gender: '',
            },
            //gender
            gender: [
                "pria",
                "wanita",
            ],
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

            //date
            fromDateMenu: false,
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
        editItem(id, item) {
            this.editedIndex = id;
            this.indexArray = this.member.indexOf(item);
            this.editedItem.name = this.member[this.indexArray].name;
            this.editedItem.address = this.member[this.indexArray].address;
            this.editedItem.number_phone = this.member[this.indexArray].number_phone;
            this.editedItem.born_date = this.member[this.indexArray].born_date;
            this.editedItem.gender = this.member[this.indexArray].gender;
            console.log(this.editedItem);
            console.log(this.editedIndex);
            this.dialogEdit = true;
        },

        saveEdit() {
            let id = this.editedIndex;
            let name = this.editedItem.name;
            let address = this.editedItem.address;
            let number_phone = this.editedItem.number_phone;
            // let born_date = this.editedItem.born_date;
            // let gender = this.editedItem.gender;
            axios.put(Api.BASE_URL + `/member/${id}`, {
                name: name,
                address: address,
                number_phone: number_phone,
                // born_date: born_date,
                // gender: gender,
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
                this.getPegawai();
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
            axios.delete(Api.BASE_URL + `/member/${id}`, {
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
                this.getPegawai();
            }).catch((error) => {
                console.log(error)
                this.snackbar.show = true;
                this.snackbar.color = 'error';
                this.snackbar.icon = 'mdi-close';
                this.snackbar.message = error.response.data.message;
            });

        },

        saveTambah() {
            let name = this.memberTemp.name;
            let address = this.memberTemp.address;
            let number_phone = this.memberTemp.number_phone;
            let born_date = this.memberTemp.born_date;
            let gender = this.memberTemp.gender;
            axios.post(Api.BASE_URL + "/member", {
                name: name,
                address: address,
                number_phone: number_phone,
                born_date: born_date,
                gender: gender,
            }, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + $cookies.get("SESSION")
                }
            }).then((response) => {
                console.log(this.response)
                //reset
                this.memberTemp = [];

                this.snackbar.show = true;
                this.snackbar.color = 'success';
                this.snackbar.icon = 'mdi-check';
                this.snackbar.message = 'Berhasil tambah';
                this.dialogTambah = false;
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

        //cetak pdf
        cetakPdf(id, item) {
            this.indexArray = this.member.indexOf(item);
            this.namePDF = this.member[this.indexArray].name
            axios.get(Api.BASE_URL + `/member/generatePdf/${id}`, {
                responseType: 'blob',
            }).then((response) => {
                console.log(response.data)
                var fileURL = window.URL.createObjectURL(new Blob([response.data]));
                var fileLink = document.createElement('a');
                fileLink.href = fileURL;
                fileLink.setAttribute('download', `member ${this.namePDF}.pdf`);
                document.body.appendChild(fileLink);
                fileLink.click();

                this.snackbar.show = true;
                this.snackbar.color = 'success';
                this.snackbar.icon = 'mdi-check';
                this.snackbar.message = 'Berhasil Cetak';
                this.dialogTambah = false;
            }).catch((error) => {
                // console.log(error.response.data.message)
            });
        },

    },
    mounted() {
        this.getPegawai();
    }
};
</script>

  