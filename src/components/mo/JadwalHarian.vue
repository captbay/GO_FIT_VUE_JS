<template>
    <v-main class="list">
        <link href="https://cdn.jsdelivr.net/npm/@mdi/font@5.x/css/materialdesignicons.min.css" rel="stylesheet" />
        <v-card>
            <v-list-item style="padding: 16px;">
                <v-list-item-content>
                    <v-list-item-title class="headline">Jadwal Harian</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-card-title>
                <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" outlined hide
                    details></v-text-field>
                <v-spacer></v-spacer>
                <v-btn color="success" dark @click="dialogAreUSureAdd = true"> Generate dari Jadwal Umum </v-btn>
            </v-card-title>
        </v-card>
        <v-card>
            <v-data-table :headers="headers" :items="jadwal" :search="search">
                <template v-slot:[`item.actions`]="{ item }">
                    <v-btn small class="mr-2 blue lighten-3" @click="editItem(item.id, item)">
                        Edit Status
                    </v-btn>
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
                                <th class="border">{{ day.name }}
                                    <br />
                                    <span style="font-weight: normal;">
                                        {{ formatDate(getFilteredJadwalMorning(day.filter)[0].date) }}
                                    </span>
                                </th>
                                <template v-for="item in getFilteredJadwalMorning(day.filter)">
                                    <td class="borderData" :key="item.id">
                                        {{ convertTimeFormat(item.start_class) }} <br />
                                        <template
                                            v-if="item.jadwal_umum.class_detail.name === 'Bungee' || item.jadwal_umum.class_detail.name === 'Trampoline Workout'">
                                            {{ item.jadwal_umum.class_detail.name }} <span
                                                style="color: red;">*</span><br />
                                        </template>
                                        <template v-else>
                                            {{ item.jadwal_umum.class_detail.name }}<br />
                                        </template>
                                        {{ item.instruktur.name }}
                                        <template v-if="item.status != ''">
                                            <br /><span style="color: red;">( {{ item.status }} )</span><br />
                                        </template>
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
                                <th class="border">{{ day.name }}
                                    <br />
                                    <span style="font-weight: normal;">
                                        {{ formatDate(getFilteredJadwalEvening(day.filter)[0].date) }}
                                    </span>
                                </th>
                                <template v-for="item in getFilteredJadwalEvening(day.filter)">
                                    <td class="borderData" :key="item.id">
                                        {{ convertTimeFormat(item.start_class) }} <br />
                                        <template
                                            v-if="item.jadwal_umum.class_detail.name === 'Bungee' || item.jadwal_umum.class_detail.name === 'Trampoline Workout'">
                                            {{ item.jadwal_umum.class_detail.name }} <span
                                                style="color: red;">*</span><br />
                                        </template>
                                        <template v-else>
                                            {{ item.jadwal_umum.class_detail.name }}<br />
                                        </template>
                                        {{ item.instruktur.name }}
                                        <template v-if="item.status != ''">
                                            <br /><span style="color: red;">( {{ item.status }} )</span><br />
                                        </template>
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

        <!-- edit  -->
        <v-dialog transition="dialog-top-transition" v-model="dialogEdit" persistent max-width="600px">
            <v-card>
                <v-form @submit.prevent="dialogAreUSureEdit = true">
                    <v-card-title>
                        <span class="headine"> Form Status Jadwal Harian</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container>
                            <v-select v-model="editedItem.status" :items="status" label="status" name="status" clearable
                                :error-messages="validation.status">
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

        <!-- are you sure add -->
        <v-dialog transition="dialog-top-transition" v-model="dialogAreUSureAdd" max-width="500px">
            <v-card>
                <v-card-title class="text-h5 justify-center">Are you sure you want to generate jadwal harian?</v-card-title>
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
            status: [
                "libur",
                "instruktur terlambat",
            ],
            editedItem: {
                status: "",
            },
            jadwalTemp: [],
            title: "",
            headers: [
                {
                    text: "Hari",
                    sortable: true,
                    value: "day_name",
                },
                { text: "Tanggal", value: "date" },
                { text: "Mulai Kelas", value: "start_class" },
                { text: "Selesai Kelas", value: "end_class" },
                { text: "Nama Kelas", value: "jadwal_umum.class_detail.name" },
                { text: "Nama Instruktur", value: "instruktur.name" },
                { text: "Status Kelas Jika tidak ada", value: "status" },
                { text: "Actions", value: "actions", sortable: false },
            ],
            //pop up
            dialogEdit: false,
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

            days: [
                { name: 'Mon', filter: 'Monday' },
                { name: 'Tue', filter: 'Tuesday' },
                { name: 'Wed', filter: 'Wednesday' },
                { name: 'Thu', filter: 'Thursday' },
                { name: 'Fri', filter: 'Friday' },
                { name: 'Sat', filter: 'Saturday' },
                { name: 'Sun', filter: 'Sunday' }
            ],
        };
    },
    methods: {

        formatDate(dateString) {
            const options = { month: 'long', day: 'numeric' };
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', options);
        },

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

        getJadwal() {
            axios.get(Api.BASE_URL + "/class_running", {
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
            this.editedItem.status = this.jadwal[this.indexArray].status
            console.log(this.editedItem)
            console.log(this.editedIndex)
            this.dialogEdit = true
        },

        saveEdit() {
            let id = this.editedIndex;
            let status = this.editedItem.status;
            axios.post(Api.BASE_URL + `/class_running/statusUpdate/${id}`, {
                status: status,
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

                this.validation.status = error.response.data.status
                if (error.response.data.message != null) {
                    this.snackbar.show = true;
                    this.snackbar.color = 'error';
                    this.snackbar.icon = 'mdi-close';
                    this.snackbar.message = error.response.data.message;
                }
            });
        },


        saveTambah() {
            axios.post(Api.BASE_URL + "/class_running/generate", {
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
                this.snackbar.message = response.data.message;
                ///
                this.dialogAreUSureAdd = false
                //reload
                this.getJadwal();
                this.validation = [];
            }).catch((error) => {
                console.log(error)
                this.dialogAreUSureAdd = false

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
    }
};
</script>

  