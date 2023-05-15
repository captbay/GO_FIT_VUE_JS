<template>
    <v-snackbar :color="snackbar.color" timeout="5000" v-model="snackbar.show" bottom right>
        <v-icon left>{{ snackbar.icon }}</v-icon>{{ snackbar.message }}
    </v-snackbar>
</template>
  
<script>
export default {
    name: "vtoast",
    // props: {
    //     message: String,
    //     color: String,
    //     icon: String,
    //     showSnackbar: Boolean
    // },
    data() {
        return {
            snackbar: {
                show: false,
                message: '',
                color: '',
                icon: ''
            }
        }
    },
    methods: {
        show(message, color, icon) {
            this.snackbar.show = true;
            this.snackbar.message = message;
            this.snackbar.color = color;
            this.snackbar.icon = icon;
        }
    }
}
</script>