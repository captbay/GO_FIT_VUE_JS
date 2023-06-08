<template>
    <v-main class="list">
        <link href="https://cdn.jsdelivr.net/npm/@mdi/font@5.x/css/materialdesignicons.min.css" rel="stylesheet" />
        <v-card>
            <v-list-item style="padding: 16px;">
                <v-list-item-content>
                    <v-list-item-title class="headline">Instruktur </v-list-item-title>
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
            <v-data-table :headers="headers" :items="instruktur" :search="search">
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
                <v-form @submit.prevent="dialogAreUSureAdd = true">
                    <v-card-title>
                        <span class="headine"> Form Instruktur</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container>
                            <v-text-field v-model="instrukturTemp.name" label="Nama" clearable
                                :error-messages="validation.name"></v-text-field>
                            <v-text-field v-model="instrukturTemp.address" label="Alamat" clearable
                                :error-messages="validation.address"></v-text-field>
                            <v-text-field v-model="instrukturTemp.number_phone" label="Nomor Telepon" clearable
                                :error-messages="validation.number_phone"></v-text-field>
                            <v-menu v-model="fromDateMenu" :close-on-content-click="false" nudge-bottom="64"
                                transition="scale-transition" max-width="290px" min-width="290px">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field label="Tanggal Lahir" readonly v-model="instrukturTemp.born_date"
                                        v-on="on" v-bind="attrs" clearable
                                        :error-messages="validation.born_date"></v-text-field>
                                </template>
                                <v-date-picker v-model="instrukturTemp.born_date" show-adjacent-months locale="en-in"
                                    @input="fromDateMenu = false"></v-date-picker>
                            </v-menu>
                            <v-select v-model="instrukturTemp.gender" :items="gender" label="Gender" name="gender" clearable
                                :error-messages="validation.gender">
                            </v-select>
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
                <v-form @submit.prevent="dialogAreUSureEdit = true">
                    <v-card-title>
                        <span class="headine"> Form Instruktur</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container>
                            <v-text-field v-model="editedItem.name" label="Nama" clearable
                                :error-messages="validation.name"></v-text-field>
                            <v-text-field v-model="editedItem.address" label="Alamat" clearable
                                :error-messages="validation.address"></v-text-field>
                            <v-text-field v-model="editedItem.number_phone" label="Nomor Telepon" clearable
                                :error-messages="validation.number_phone"></v-text-field>
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
            instruktur: [],
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
            instrukturTemp: [],
            title: "",
            headers: [
                {
                    text: "Nomor Instruktur",
                    sortable: true,
                    value: "no_instruktur",
                },
                { text: "Nama", value: "name" },
                { text: "Alamat", value: "address" },
                { text: "Nomor Telepon", value: "number_phone" },
                { text: "Tanggal Lahir", value: "born_date" },
                { text: "Gender", value: "gender" },
                { text: "Total Late", value: "total_late" },
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

            //date
            fromDateMenu: false,

            //validation
            validation: [],
        };
    },
    methods: {

        getInstruktur() {
            axios.get(Api.BASE_URL + "/instruktur", {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + $cookies.get("SESSION")
                }
            }).then((response) => {
                this.instruktur = response.data.data;
                console.log(this.instruktur)
            }).catch((error) => {
                console.log(error)
            });
        },

        //belum selesai
        editItem(id, item) {
            this.editedIndex = id
            this.indexArray = this.instruktur.indexOf(item)
            this.editedItem.name = this.instruktur[this.indexArray].name
            this.editedItem.address = this.instruktur[this.indexArray].address
            this.editedItem.number_phone = this.instruktur[this.indexArray].number_phone
            this.editedItem.born_date = this.instruktur[this.indexArray].born_date
            this.editedItem.gender = this.instruktur[this.indexArray].gender
            console.log(this.editedItem)
            console.log(this.editedIndex)
            this.dialogEdit = true
        },

        saveEdit() {
            let id = this.editedIndex;
            let name = this.editedItem.name;
            let address = this.editedItem.address;
            let number_phone = this.editedItem.number_phone;
            // let born_date = this.editedItem.born_date;
            // let gender = this.editedItem.gender;
            axios.put(Api.BASE_URL + `/instruktur/${id}`, {
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
                //
                this.dialogEdit = false;
                this.dialogAreUSureEdit = false
                //reload
                this.getInstruktur();
                this.validation = [];
            }).catch((error) => {
                console.log(error)
                this.dialogAreUSureEdit = false

                this.validation.name = error.response.data.name
                this.validation.address = error.response.data.address
                this.validation.number_phone = error.response.data.number_phone

                if (error.response.data.message != null) {
                    this.snackbar.show = true;
                    this.snackbar.color = 'error';
                    this.snackbar.icon = 'mdi-close';
                    this.snackbar.message = error.response.data.message;
                }
            });
        },

        deleteItem(item) {
            this.editedIndex = item
            this.dialogDelete = true
        },

        deleteItemConfirm() {
            let id = this.editedIndex;
            axios.delete(Api.BASE_URL + `/instruktur/${id}`, {
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
                this.getInstruktur();
                this.validation = [];
            }).catch((error) => {
                console.log(error)
                if (error.response.data.message != null) {
                    this.snackbar.show = true;
                    this.snackbar.color = 'error';
                    this.snackbar.icon = 'mdi-close';
                    this.snackbar.message = error.response.data.message;
                }
            });

        },

        saveTambah() {
            let name = this.instrukturTemp.name;
            let address = this.instrukturTemp.address;
            let number_phone = this.instrukturTemp.number_phone;
            let born_date = this.instrukturTemp.born_date;
            let gender = this.instrukturTemp.gender;
            axios.post(Api.BASE_URL + "/instruktur", {
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
                console.log(response)
                //reset
                this.instrukturTemp = [];

                this.snackbar.show = true;
                this.snackbar.color = 'success';
                this.snackbar.icon = 'mdi-check';
                this.snackbar.message = 'Berhasil tambah';
                ///
                this.dialogTambah = false;
                this.dialogAreUSureAdd = false
                //reload
                this.getInstruktur();
                this.validation = [];
            }).catch((error) => {
                console.log(error)
                this.dialogAreUSureAdd = false

                this.validation.name = error.response.data.name
                this.validation.address = error.response.data.address
                this.validation.number_phone = error.response.data.number_phone
                this.validation.born_date = error.response.data.born_date
                this.validation.gender = error.response.data.gender

                if (error.response.data.message != null) {
                    this.snackbar.show = true;
                    this.snackbar.color = 'error';
                    this.snackbar.icon = 'mdi-close';
                    this.snackbar.message = error.response.data.message;
                }
            });
        }

    },
    mounted() {
        this.getInstruktur();
    }
};
</script>

  