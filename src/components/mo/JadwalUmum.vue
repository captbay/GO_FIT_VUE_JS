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
                <template v-slot:[`item.actions`]="{ item }">
                    <v-btn small class="mr-2 blue lighten-3" @click="editItem(item.id, item)">
                        edit
                    </v-btn>
                    <v-btn small class="mr-2 red lighten-3" @click="deleteItem(item.id)">delete</v-btn>
                </template>
            </v-data-table>
        </v-card>

        <v-card>
            <div style="padding: 16px 16px 0px 16px;">
                <v-list-item style="padding: 16px;">
                    <v-list-item-content>
                        <v-list-item-title class="headline">Morning Classes</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <table style="width:100%" class="table">
                    <template v-for="day in days">
                        <tr :key="day.name">
                            <template v-if="getFilteredJadwalMorning(day.filter).length != 0">
                                <th class="border">{{ day.name }}</th>
                                <template v-for="item in getFilteredJadwalMorning(day.filter)">
                                    <td class="borderData" :key="item.id">
                                        {{ convertTimeFormat(item.start_class) }} <br />
                                        <template
                                            v-if="item.class_detail.name === 'Bungee' || item.class_detail.name === 'Trampoline Workout'">
                                            {{ item.class_detail.name }} <span style="color: red;">*</span><br />
                                        </template>
                                        <template v-else>
                                            {{ item.class_detail.name }}<br />
                                        </template>
                                        {{ item.instruktur.name }}
                                    </td>
                                </template>
                            </template>
                        </tr>
                    </template>
                </table>
            </div>

            <div style="padding: 16px;">
                <v-list-item style="padding: 16px;">
                    <v-list-item-content>
                        <v-list-item-title class="headline">Evening Classes</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <table style="width:100%" class="table">
                    <template v-for="day in days">
                        <tr :key="day.name">
                            <template v-if="getFilteredJadwalEvening(day.filter).length != 0">
                                <th class="border">{{ day.name }}</th>
                                <template v-for="item in getFilteredJadwalEvening(day.filter)">
                                    <td class="borderData" :key="item.id">
                                        {{ convertTimeFormat(item.start_class) }} <br />
                                        <template
                                            v-if="item.class_detail.name === 'Bungee' || item.class_detail.name === 'Trampoline Workout'">
                                            {{ item.class_detail.name }} <span style="color: red;">*</span><br />
                                        </template>
                                        <template v-else>
                                            {{ item.class_detail.name }}<br />
                                        </template>
                                        {{ item.instruktur.name }}
                                    </td>
                                </template>
                            </template>
                        </tr>
                    </template>
                </table>
                <v-list-item style="padding: 16px;">
                    <v-list-item-content>
                        <v-list-item-title>All classes limited to 10 members</v-list-item-title>
                        <v-list-item-title>Price: IDR 150K</v-list-item-title>
                        <v-list-item-title>(<span style="color: red;">*</span>) : IDR
                            200K</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </div>
        </v-card>
        <!-- tambah  -->
        <v-dialog transition="dialog-top-transition" v-model="dialogTambah" persistent max-width="600px">
            <v-card>
                <v-form @submit.prevent="dialogAreUSureAdd = true">
                    <v-card-title>
                        <span class="headine"> Form Jadwal Umum</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container>
                            <v-select v-model="jadwalTemp.id_instruktur" :items="instruktur" label="Instruktur Mengajar"
                                name="instruktur" item-value="id" item-text="name" clearable
                                :error-messages="validation.id_instruktur">
                            </v-select>
                            <v-select v-model="jadwalTemp.id_class_detail" :items="classDetail" label="Class yang Jadwal"
                                name="classDetail" item-value="id" item-text="name" clearable
                                :error-messages="validation.id_class_detail">
                            </v-select>
                            <v-menu v-model="fromTimeMenu" :close-on-content-click="false" nudge-bottom="64"
                                transition="scale-transition" max-width="290px" min-width="290px">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field label="Mulai Kelas" readonly v-model="jadwalTemp.start_class" v-on="on"
                                        v-bind="attrs" clearable :error-messages="validation.start_class"></v-text-field>
                                </template>
                                <v-time-picker v-model="jadwalTemp.start_class" format="24hr"
                                    @input="fromTimeMenu = false"></v-time-picker>
                            </v-menu>
                            <v-select v-model="jadwalTemp.day_name" :items="day_name" label="Nama Hari" name="day_name"
                                item-value="name" item-text="name" clearable :error-messages="validation.day_name">
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
                        <span class="headine"> Form Edit Jadwal Umum</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container>
                            <v-select v-model="editedItem.id_instruktur" :items="instruktur" label="Instruktur Mengajar"
                                name="instruktur" item-value="id" item-text="name" clearable
                                :error-messages="validation.id_instruktur">
                            </v-select>
                            <v-select v-model="editedItem.id_class_detail" :items="classDetail" label="Class yang Jadwal"
                                name="classDetail" item-value="id" item-text="name" clearable
                                :error-messages="validation.id_class_detail">
                            </v-select>
                            <v-menu v-model="fromTimeMenuEdit" :close-on-content-click="false" nudge-bottom="64"
                                transition="scale-transition" max-width="290px" min-width="290px">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field label="Mulai Kelas" readonly v-model="editedItem.start_class" v-on="on"
                                        v-bind="attrs" clearable :error-messages="validation.start_class"></v-text-field>
                                </template>
                                <v-time-picker v-model="editedItem.start_class" format="24hr"
                                    @input="fromTimeMenuEdit = false"></v-time-picker>
                            </v-menu>
                            <v-text-field v-model="editedItem.capacity" label="Capasitas Kelas" clearable
                                :error-messages="validation.capacity"></v-text-field>
                            <v-select v-model="editedItem.day_name" :items="day_name" label="Nama Hari" name="day_name"
                                item-value="name" item-text="name" clearable :error-messages="validation.day_name">
                            </v-select>
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

<style>
.table {
    table-layout: fixed;
    border: 1px solid black;
    width: 100%;
    border-collapse: collapse;
}

.border {
    width: 100px;
    border: 1px solid black;
    padding: 5px;
    text-align: center;
    color: white;
    background-color: black;
}

.borderData {
    border: 1px solid black;
    text-align: center;
    color: black;
    background-color: white;
    padding: 8px;
}
</style>

<script>
import { reactive } from "vue";
import * as Api from "../ApiHelper";
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
                capacity: 0,
                day_name: '',
            },
            jadwalTemp: [],
            title: "",
            headers: [
                {
                    text: "Nama Instruktur",
                    sortable: true,
                    value: "instruktur.name",
                },
                { text: "Nama Kelas", value: "class_detail.name" },
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
            dialogAreUSureAdd: false,
            dialogAreUSureEdit: false,

            //day name
            day_name: [
                { name: 'Sunday' },
                { name: 'Monday' },
                { name: 'Tuesday' },
                { name: 'Wednesday' },
                { name: 'Thursday' },
                { name: 'Friday' },
                { name: 'Saturday' },
            ],

            days: [
                { name: 'Mon', filter: 'Monday' },
                { name: 'Tue', filter: 'Tuesday' },
                { name: 'Wed', filter: 'Wednesday' },
                { name: 'Thu', filter: 'Thursday' },
                { name: 'Fri', filter: 'Friday' },
                { name: 'Sat', filter: 'Saturday' },
                { name: 'Sun', filter: 'Sunday' }
            ],

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
            fromTimeMenu: false,
            fromTimeMenuEdit: false,

            //validation
            validation: [],
        };
    },
    methods: {

        getFilteredJadwalMorning(day) {
            return this.jadwal.filter(item => {
                return item.day_name === day && item.start_class < '17:00:00';
            });
        },

        getFilteredJadwalEvening(day) {
            return this.jadwal.filter(item => {
                return item.day_name === day && item.start_class >= '17:00:00';
            });
        },

        convertTimeFormat(time) {
            const [hours, minutes] = time.split(':');
            let convertedHours = parseInt(hours);
            let meridiem = 'AM';

            if (convertedHours === 0) {
                convertedHours = 12;
            } else if (convertedHours >= 12) {
                meridiem = 'PM';
                if (convertedHours > 12) {
                    convertedHours -= 12;
                }
            }

            return `${convertedHours}:${minutes} ${meridiem}`;
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
            this.editedItem.capacity = this.jadwal[this.indexArray].capacity
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
            let capacity = this.editedItem.capacity;
            let day_name = this.editedItem.day_name;
            axios.put(Api.BASE_URL + `/jadwal_umum/${id}`, {
                id_instruktur: id_instruktur,
                id_class_detail: id_class_detail,
                start_class: start_class,
                capacity: capacity,
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
                //
                this.dialogEdit = false;
                this.dialogAreUSureEdit = false
                //reload
                this.getJadwal();
                this.validation = [];
            }).catch((error) => {
                console.log(error)
                this.dialogAreUSureEdit = false

                this.validation.id_instruktur = error.response.data.id_instruktur
                this.validation.id_class_detail = error.response.data.id_class_detail
                this.validation.start_class = error.response.data.start_class
                this.validation.capacity = error.response.data.capacity
                this.validation.day_name = error.response.data.day_name

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
                //
                this.dialogDelete = false
                //reload
                this.getJadwal();
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
                ///
                this.dialogTambah = false;
                this.dialogAreUSureAdd = false
                //reload
                this.getJadwal();
                this.validation = [];
            }).catch((error) => {
                console.log(error)
                this.dialogAreUSureAdd = false

                this.validation.id_instruktur = error.response.data.id_instruktur
                this.validation.id_class_detail = error.response.data.id_class_detail
                this.validation.start_class = error.response.data.start_class
                this.validation.day_name = error.response.data.day_name

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
        this.getJadwal();
        this.getClassDetail();
        this.getInstruktur();
    }
};
</script>

  