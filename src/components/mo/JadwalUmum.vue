<template>
    <v-main class="list">
        <link href="https://cdn.jsdelivr.net/npm/@mdi/font@5.x/css/materialdesignicons.min.css" rel="stylesheet" />
        <v-card>
            <v-list-item style="padding: 16px;">
                <v-list-item-content>
                    <v-list-item-title class="headline">Jadwal Umum</v-list-item-title>
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
            <v-data-table :headers="headers" :items="jadwal" :search="search">
                <!-- <template v-slot:[`item.id_instruktur`]="{ item }">
                    <v-card-text>{{ item.instruktur.name }}</v-card-text>
                </template> -->
                <!-- <template v-slot:[`item.id_class_detail`]="{ item }">
                    <v-card-text>{{ classDetail[item.id_class_detail] }}</v-card-text>
                </template> -->
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
                    <span class="headine"> Form Jadwal Umum</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-select v-model="jadwalTemp.id_instruktur" :items="instruktur" label="Instruktur Mengajar"
                            name="instruktur" item-value="id" item-text="name" required>
                        </v-select>
                        <v-select v-model="jadwalTemp.id_class_detail" :items="classDetail" label="Class yang Jadwal"
                            name="classDetail" item-value="id" item-text="name" required>
                        </v-select>
                        <!-- <v-text-field v-model="jadwalTemp.id_instruktur" label="id instruktur" required></v-text-field> -->
                        <!-- <v-text-field v-model="jadwalTemp.id_class_detail" label="id class detail" required></v-text-field> -->
                        <v-text-field v-model="jadwalTemp.start_class" label="mulai kelas" required></v-text-field>
                        <v-text-field v-model="jadwalTemp.day_name" label="nama hari" required></v-text-field>
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
                    <span class="headine"> Form Jadwal Umum</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-select v-model="editedItem.id_instruktur" :items="instruktur" label="Instruktur Mengajar"
                            name="instruktur" item-value="id" item-text="name" required>
                        </v-select>
                        <v-select v-model="editedItem.id_class_detail" :items="classDetail" label="Class yang Jadwal"
                            name="classDetail" item-value="id" item-text="name" required>
                        </v-select>
                        <!-- <v-text-field v-model="editedItem.id_instruktur" label="id instruktur" required></v-text-field> -->
                        <!-- <v-text-field v-model="editedItem.id_class_detail" label="id class detail" required></v-text-field> -->
                        <v-text-field v-model="editedItem.start_class" label="mulai kelas" required></v-text-field>
                        <v-text-field v-model="editedItem.day_name" label="nama hari" required></v-text-field>
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
            jadwal: [],
            classDetail: [],
            instruktur: [],
            editedItem: {
                id_instruktur: 0,
                id_class_detail: 0,
                start_class: '',
                day_name: '',
            },
            jadwalTemp: [],
            title: "",
            headers: [
                {
                    text: "Id Instruktur",
                    sortable: true,
                    value: "id_instruktur",
                },
                { text: "Id Kelas", value: "id_class_detail" },
                { text: "Mulai Kelas", value: "start_class" },
                { text: "Selesai Kelas", value: "end_class" },
                { text: "Kapasitas Kelas", value: "capacity" },
                { text: "Hari Kelas", value: "day_name" },
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

        getJadwal() {
            axios.get(Api.BASE_URL + "/jadwal_umum", {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + $cookies.get("SESSION")
                }
            }).then((response) => {
                this.jadwal = response.data.data;
                console.log(this.jadwal)
            }).catch((error) => {
                console.log(error)
            });
        },

        //belum selesai
        editItem(id, item) {
            this.editedIndex = id
            this.indexArray = this.jadwal.indexOf(item)
            this.editedItem.id_instruktur = this.jadwal[this.indexArray].id_instruktur
            this.editedItem.id_class_detail = this.jadwal[this.indexArray].id_class_detail
            this.editedItem.start_class = this.jadwal[this.indexArray].start_class
            this.editedItem.day_name = this.jadwal[this.indexArray].day_name
            console.log(this.editedItem)
            console.log(this.editedIndex)
            this.dialogEdit = true
        },

        saveEdit() {
            let id = this.editedIndex;
            let id_instruktur = this.editedItem.id_instruktur;
            let id_class_detail = this.editedItem.id_class_detail;
            let start_class = this.editedItem.start_class;
            let day_name = this.editedItem.day_name;
            axios.put(Api.BASE_URL + `/jadwal_umum/${id}`, {
                id_instruktur: id_instruktur,
                id_class_detail: id_class_detail,
                start_class: start_class,
                day_name: day_name,
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
                this.getJadwal();
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
            axios.delete(Api.BASE_URL + `/jadwal_umum/${id}`, {
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
                this.getJadwal();
            }).catch((error) => {
                console.log(error)
                this.snackbar.show = true;
                this.snackbar.color = 'error';
                this.snackbar.icon = 'mdi-close';
                this.snackbar.message = error.response.data.message;
            });

        },

        saveTambah() {
            let id_instruktur = this.jadwalTemp.id_instruktur;
            let id_class_detail = this.jadwalTemp.id_class_detail;
            let start_class = this.jadwalTemp.start_class;
            let day_name = this.jadwalTemp.day_name;
            axios.post(Api.BASE_URL + "/jadwal_umum", {
                id_instruktur: id_instruktur,
                id_class_detail: id_class_detail,
                start_class: start_class,
                day_name: day_name,
            }, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + $cookies.get("SESSION")
                }
            }).then((response) => {
                console.log(response)
                //reset
                this.jadwalTemp = [];

                this.snackbar.show = true;
                this.snackbar.color = 'success';
                this.snackbar.icon = 'mdi-check';
                this.snackbar.message = 'Berhasil tambah';
                this.dialogTambah = false;
                //reload
                this.getJadwal();
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
        this.getJadwal();
        this.getClassDetail();
        this.getInstruktur();
    }
};
</script>

  