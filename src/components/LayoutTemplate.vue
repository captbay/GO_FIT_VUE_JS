<template>
    <v-container fluid class="body">
        <!-- side bar Kiri -->
        <v-navigation-drawer app v-model="drawer" width="300px" min-width="200px" color="#23252E" class="sideNav"
            hide-overlay>
            <v-list-item>
                <v-list-item-content>
                    <v-img :src="require('@/assets/Logo.png')" contain max-height="160"></v-img>
                </v-list-item-content>
            </v-list-item>


            <v-list nav>
                <v-divider color="#FF9045"></v-divider>
                <v-container v-if="admin">
                    <v-list-item class="my-5 sidebar-menu-item" v-for="menu in menus" :key="menu.title" link
                        tag="router-link" :to="menu.to">
                        <v-list-item-icon>
                            <v-icon>{{ menu.icon }}</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title class="text">{{ menu.title }}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-container>
                <v-container v-if="kasir">
                    <v-list-item class="my-5 sidebar-menu-item" v-for="kasir in kasirs" :key="kasir.title" link
                        tag="router-link" :to="kasir.to">
                        <v-list-item-icon>
                            <v-icon>{{ kasir.icon }}</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title class="text">{{ kasir.title }}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-container>
                <v-container v-if="mo">
                    <v-list-item class="my-5 sidebar-menu-item" v-for="manager in managers" :key="manager.title" link
                        tag="router-link" :to="manager.to">
                        <v-list-item-icon>
                            <v-icon>{{ manager.icon }}</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title class="text">{{ manager.title }}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-container>
                <v-divider color="#FF9045"></v-divider>
                <v-container>
                    <v-list-item @click="dialogAreUSureLogout = true" class="my-5 sidebar-menu-item">
                        <v-list-item-icon>
                            <v-icon>mdi-logout</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title class="text">Logout</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-container>

            </v-list>
        </v-navigation-drawer>

        <v-app-bar app fixed height="64%" color="#FF9045">
            <v-app-bar-nav-icon @click.stop="drawer = !drawer" color="#FFFFFF"></v-app-bar-nav-icon>
            <v-spacer></v-spacer>

        </v-app-bar>


        <div style="min-height: 100vh !important;">
            <router-view></router-view>
        </div>

        <!-- Side bar Kanan -->
        <!-- <v-navigation-drawer app v-model="drawer"  absolute right width="16%" color="#93A9D1" hide-overlay>
            <template v-slot:prepend>
                <v-list-item two-line>
                    <v-list-item-avatar>
                        <img src="https://randomuser.me/api/portraits/women/81.jpg">
                    </v-list-item-avatar>

                    <v-list-item-content>
                        <v-list-item-title>Jane Smith</v-list-item-title>
                        <v-list-item-subtitle>Logged In</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
            </template>
            <v-divider></v-divider>
        </v-navigation-drawer> -->

        <!-- are you sure logout -->
        <v-dialog transition="dialog-top-transition" v-model="dialogAreUSureLogout" max-width="500px">
            <v-card>
                <v-card-title class="text-h5 justify-center">Are you sure you want to Logout?</v-card-title>
                <v-card-actions class="mt-4">
                    <v-spacer></v-spacer>
                    <v-btn color="blue-darken-1" variant="text" @click="dialogAreUSureLogout = false">CANCEL</v-btn>
                    <v-btn color="mr-2 red lighten-3" variant="text" @click="Logout()">YES</v-btn>
                    <v-spacer></v-spacer>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <!-- toast -->
        <!-- <vtoast ref="vtoast" /> -->
        <!-- Snackbar -->
        <v-snackbar v-model="sb.show" :color="sb.color" timeout="5000" center bottom>
            <v-icon left>{{ sb.icon }}</v-icon>
            {{ sb.message }}
            <template v-slot:action="{ attrs }">
                <v-btn icon v-bind="attrs" @click="(sb.show = false)">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </template>
        </v-snackbar>
    </v-container>
</template>

<script>
import axios from "axios";
import * as Api from "./ApiHelper";
export default {


    name: 'LayoutTemplate',
    data() {
        return {
            drawer: false,
            dialogAreUSureLogout: false,

            menus: [
                { title: 'Home', icon: 'mdi-home', to: '/' }, ///
                { title: 'Promo Cash', icon: ' mdi-sale', to: '/promocash' }, //
                { title: 'Promo Class', icon: ' mdi-percent-circle', to: '/promoclass' },//
                { title: 'Pegawai', icon: ' mdi-account-multiple-plus', to: '/pegawai' },///
                { title: 'Instruktur', icon: ' mdi-account-tie-hat', to: '/instruktur' },//
                { title: 'Profil', icon: ' mdi-account', to: '/profil' }, //
            ],
            kasirs: [
                { title: 'Home', icon: 'mdi-home', to: '/' },
                { title: 'Member', icon: 'mdi-account-multiple-plus', to: '/member' }, //isi reset pass member
                { title: 'Reset Pass Member', icon: 'mdi-eye', to: '/resetPass' }, //isi reset pass member
                { title: 'Deaktivasi Member', icon: 'mdi-account-arrow-down', to: '/memberDeaktivasi' }, //isi reset pass member
                { title: 'Reset Deposit Paket', icon: 'mdi-magnify-minus', to: '/depositPaketDeaktivasi' }, //isi reset pass member
                { title: 'Reset Telat Instruktur', icon: ' mdi-account-tie-hat', to: '/instrukturLate' },//
                { title: 'Aktivasi Member', icon: ' mdi-head-plus', to: '/aktivasiMember' },
                { title: 'Deposit Uang', icon: ' mdi-cash', to: '/depositUang' },
                { title: 'Deposit Kelas', icon: ' mdi-google-classroom', to: '/depositKelas' },
                { title: 'Presensi GYM', icon: ' mdi-trophy-variant', to: '/presensiGym' },
                { title: 'Presensi Kelas', icon: ' mdi-google-classroom', to: '/presensiKelasRegulerAndPaket' },
                // { title: 'Presensi Kelas Paket', icon: ' mdi-google-classroom', to: '/presensiKelasPaket' },
                { title: 'Profil', icon: ' mdi-account', to: '/profil' }, //
            ],
            managers: [
                { title: 'Home', icon: 'mdi-home', to: '/' }, //
                { title: 'Class', icon: 'mdi-google-classroom', to: '/class' }, //
                { title: 'Jadwal Umum', icon: 'mdi-calendar', to: '/jadwalUmum' }, //
                { title: 'Jadwal Harian', icon: 'mdi-calendar-alert', to: '/jadwalHarian' },
                { title: 'Ijin Instruktur', icon: ' mdi-account-tie-voice', to: '/instrukturIzin' },
                { title: 'Laporan Pendapatan', icon: ' mdi-cash', to: '/laporanPendapatan' },
                { title: 'Laporan Kelas', icon: ' mdi-book-variant', to: '/laporanKelas' },
                { title: 'Laporan Gym', icon: ' mdi-weight-kilogram', to: '/laporanGym' },
                { title: 'Laporan Instruktur', icon: ' mdi-account-alert-outline', to: '/laporanInstruktur' },
                { title: 'Profil', icon: ' mdi-account', to: '/profil' }, //
            ],
            sb: {
                show: false,
                message: '',
                color: '',
                icon: ''
            },
            admin: $cookies.get("ROLE") == 'admin',
            kasir: $cookies.get("ROLE") == 'kasir',
            mo: $cookies.get("ROLE") == 'mo',
        }
    },
    methods: {
        snackbar: function ({ message, color, icon }) {
            this.sb.show = true
            this.sb.message = message
            this.sb.color = color
            this.sb.icon = icon
        }
    },
    setup() {
        function Logout() {
            axios.post(Api.BASE_URL + "/logout", {
                // body: tidak ada
            }, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + $cookies.get("SESSION")
                }
            })
                .then((response) => {
                    $cookies.remove("SESSION");
                    $cookies.remove("ROLE");
                    this.$router.push('/login');
                }).catch((error) => {
                    this.sb.icon = "mdi-alert";
                    this.sb.message = error.response.data;
                    this.sb.color = "red";
                    this.sb.show = true;
                });
        }
        return {
            Logout,
        }
    },
    mounted() {
        if ($cookies.get("SESSION") == null) {
            this.$router.push('/login')
        }
        this.$root.$on('snackbar', this.snackbar)
    },
}
</script>

<style>
.nl2br {
    white-space: pre-wrap;
}

.post-content {
    line-height: 1.5;
    font-size: 1rem;
    opacity: 1;
}

.post-content-large {
    font-size: 1.5rem;
}

.sideNav {
    background-image: #FF9045
}

.body {
    background-image: #FF9045
        /* overlay background */
}

.sidebar-menu-item {
    font-weight: bold;
    color: #FFFFFF;
}

.sidebar-menu-item .v-icon {
    color: #FFFFFF;
}

.sidebar-menu-item .text {
    color: #FFFFFF;
}

.sidebar-menu-item.text--active {
    color: #FF9045;
}

.sidebar-menu-item.v-list-item--active {
    color: #FF9045;
}

.sidebar-menu-item.v-list-item--active .v-icon {
    color: #FF9045;
}
</style>
