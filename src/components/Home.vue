<template>
    <v-main>
        <v-container>
            <v-row>
                <v-col>
                    <v-card>
                        <v-card-title v-if="admin">
                            <h1>Home Admin</h1>
                        </v-card-title>
                        <v-card-title v-if="kasir">
                            <h1>Home Kasir</h1>
                        </v-card-title>
                        <v-card-title v-if="mo">
                            <h1>Home Manager Operasional</h1>
                        </v-card-title>
                        <v-card-text>
                            <p>Ini adalah halaman home</p>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </v-main>
</template>
<script>

export default {
    data() {
        return {
            admin: $cookies.get("ROLE") == 'admin',
            kasir: $cookies.get("ROLE") == 'kasir',
            mo: $cookies.get("ROLE") == 'mo',
        }
    },
};
</script>

  