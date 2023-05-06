<template>
    <v-main class="list">
        <link href="https://cdn.jsdelivr.net/npm/@mdi/font@5.x/css/materialdesignicons.min.css" rel="stylesheet" />
        <v-card>
            <v-list-item style="padding: 16px;">
                <v-list-item-content>
                    <v-list-item-title class="headline">Kelas</v-list-item-title>
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
            <v-data-table :headers="headers" :items="kelas" :search="search">
                <template v-slot:[`item.price`]="{ item }">
                    <v-card-text>Rp. {{ formatPrice(item.price) }}</v-card-text>
                </template>
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
                <v-form v-model="form" @submit.prevent="dialogAreUSureAdd = true">
                    <v-card-title>
                        <span class="headine"> Form Kelas</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container>
                            <v-text-field v-model="kelasTemp.name" label="nama kelas" clearable :rules="[required]"
                                :error-messages="validation.name"></v-text-field>
                            <v-text-field v-model="kelasTemp.price" label="harga kelas" clearable :rules="[required]"
                                :error-messages="validation.price"></v-text-field>
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

        <!-- edit  -->
        <v-dialog transition="dialog-top-transition" v-model="dialogEdit" persistent max-width="600px">
            <v-card>
                <v-form v-model="form" @submit.prevent="dialogAreUSureEdit = true">
                    <v-card-title>
                        <span class="headine"> Form Kelas</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container>
                            <v-text-field v-model="editedItem.name" label="nama kelas" clearable :rules="[required]"
                                :error-messages="validation.name"></v-text-field>
                            <v-text-field v-model="editedItem.price" label="harga kelas" clearable :rules="[required]"
                                :error-messages="validation.price"></v-text-field>
                        </v-container>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="red lighten-3" text @click="dialogEdit = false"> CANCEL</v-btn>
                        <v-btn color="blue darken-1" text type="submit"> SAVE</v-btn>
                    </v-card-actions>
                </v-form>
            </v-card>
        </v-dialog>

        <!-- hapus -->
        <v-dialog transition="dialog-top-transition" v-model="dialogDelete" max-width="500px">
            <v-card>
                <v-card-title class="text-h5 justify-center">Are you sure you want to delete this item?</v-card-title>
                <v-card-actions class="mt-4">
                    <v-spacer></v-spacer>
                    <v-btn color="blue-darken-1" variant="text" @click="dialogDelete = false">CANCEL</v-btn>
                    <v-btn color="mr-2 red lighten-3" variant="text" @click="deleteItemConfirm">YES</v-btn>
                    <v-spacer></v-spacer>
                </v-card-actions>
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

        <!-- are you sure edit -->
        <v-dialog transition="dialog-top-transition" v-model="dialogAreUSureEdit" max-width="500px">
            <v-card>
                <v-card-title class="text-h5 justify-center">Are you sure you want to edit?</v-card-title>
                <v-card-actions class="mt-4">
                    <v-spacer></v-spacer>
                    <v-btn color="blue-darken-1" variant="text" @click="dialogAreUSureEdit = false">CANCEL</v-btn>
                    <v-btn color="mr-2 red lighten-3" variant="text" @click="saveEdit()">YES</v-btn>
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
import { reactive } from "vue";
import * as Api from "../ApiHelper";
import axios from "axios";

export default {
    data() {
        return {
            search: null,
            kelas: [],
            editedItem: {
                name: '',
                price: '',
            },
            kelasTemp: [],
            title: "",
            headers: [
                {
                    text: "Nama Kelas",
                    sortable: true,
                    value: "name",
                },
                { text: "Harga Kelas", value: "price" },
                { text: "Actions", value: "actions", sortable: false },
            ],
            //pop up
            dialogTambah: false,
            dialogEdit: false,
            dialogDelete: false,
            dialogAreUSureAdd: false,
            dialogAreUSureEdit: false,

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
        //tambahin ini disetiap input biar dicek
        // clearable :rules="[required]"
        required(v) {
            return !!v || 'Field is required'
        },

        formatPrice(value) {
            let val = (value / 1).toFixed(2).replace('.', ',')
            return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        },

        getKelas() {
            axios.get(Api.BASE_URL + "/class_detail", {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + $cookies.get("SESSION")
                }
            }).then((response) => {
                this.kelas = response.data.data;
                console.log(this.kelas)
            }).catch((error) => {
                console.log(error)
            });
        },

        //belum selesai
        editItem(id, item) {
            this.editedIndex = id
            this.indexArray = this.kelas.indexOf(item)
            this.editedItem.name = this.kelas[this.indexArray].name
            this.editedItem.price = this.kelas[this.indexArray].price
            console.log(this.editedItem)
            console.log(this.editedIndex)
            this.dialogEdit = true
        },

        saveEdit() {
            let id = this.editedIndex;
            let name = this.editedItem.name;
            let price = this.editedItem.price;
            axios.put(Api.BASE_URL + `/class_detail/${id}`, {
                name: name,
                price: price,
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
                //
                this.dialogEdit = false;
                this.dialogAreUSureEdit = false
                //reload
                this.getKelas();
                this.validation = [];
            }).catch((error) => {
                console.log(error)
                this.dialogAreUSureEdit = false

                this.validation.name = error.response.data.name;
                this.validation.price = error.response.data.price;

                // this.snackbar.show = true;
                // this.snackbar.color = 'error';
                // this.snackbar.icon = 'mdi-close';
                // this.snackbar.message = error.response.data.message;
            });
        },

        deleteItem(item) {
            this.editedIndex = item
            this.dialogDelete = true
        },

        deleteItemConfirm() {
            let id = this.editedIndex;
            axios.delete(Api.BASE_URL + `/class_detail/${id}`, {
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
                //
                this.dialogDelete = false
                //reload
                this.getKelas();
                this.validation = [];
            }).catch((error) => {
                console.log(error)
                this.snackbar.show = true;
                this.snackbar.color = 'error';
                this.snackbar.icon = 'mdi-close';
                this.snackbar.message = error.response.data.message;
            });

        },

        saveTambah() {
            let name = this.kelasTemp.name;
            let price = this.kelasTemp.price;
            axios.post(Api.BASE_URL + "/class_detail", {
                name: name,
                price: price,
            }, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + $cookies.get("SESSION")
                }
            }).then((response) => {
                console.log(response)
                //reset
                this.kelasTemp = [];

                this.snackbar.show = true;
                this.snackbar.color = 'success';
                this.snackbar.icon = 'mdi-check';
                this.snackbar.message = 'Berhasil tambah';
                ///
                this.dialogTambah = false;
                this.dialogAreUSureAdd = false
                //reload
                this.getKelas();
                this.validation = [];
            }).catch((error) => {
                console.log(error)
                this.dialogAreUSureAdd = false

                this.validation.name = error.response.data.name;
                this.validation.price = error.response.data.price;
                // this.snackbar.show = true;
                // this.snackbar.color = 'error';
                // this.snackbar.icon = 'mdi-close';
                // this.snackbar.message = error.response.data.message;
            });
        }

    },
    mounted() {
        this.getKelas();
    }
};
</script>

  