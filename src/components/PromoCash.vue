<template>
    <v-main class="list">
        <link href="https://cdn.jsdelivr.net/npm/@mdi/font@5.x/css/materialdesignicons.min.css" rel="stylesheet" />
        <v-card>
            <v-list-item>
                <v-list-item-avatar color="grey"></v-list-item-avatar>
                <v-list-item-content>
                    <v-list-item-title class="headline">To Do List</v-list-item-title>
                    <v-list-item-subtitle>by 200710994</v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
            <v-card-title>
                <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" outlined hide details
                    style="margin-top: 30px"></v-text-field>
                <v-spacer></v-spacer>
                <v-btn color="success" dark @click="dialog = true"> Tambah </v-btn>
            </v-card-title>
        </v-card>
        <v-card>
            <v-data-table :headers="headers" :items="todos" :search="search">
                <template v-slot:[`item.actions`]="{ item }">
                    <v-btn small class="mr-2 blue-grey lighten-3" @click="editItem(item)">
                        edit
                    </v-btn>
                    <v-btn small class="mr-2 blue-grey lighten-3" @click="deleteItem(item)">delete</v-btn>
                </template>
            </v-data-table>
        </v-card>
        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headine"> Form Todo List</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-text-field v-model="formTodo.task" label="Task" required></v-text-field>
                        <v-select v-model="formTodo.priority" :items="[`Penting`, `Biasa`, `Tidak Penting`]"
                            label="Priority" required></v-select>

                        <v-textarea v-model="formTodo.note" label="Note" required></v-textarea>
                        <v-select v-model="formTodo.status" :items="[`Selesai`, `Belum Selesai`]" label="Status"
                            required></v-select>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="cancel"> Cancel</v-btn>
                    <v-btn color="blue darken-1" text @click="save"> Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-main>
</template>
<script>
export default {
    name: "ListItem",
    data() {
        return {
            search: null,
            dialog: false,
            headers: [
                {
                    text: "Task",
                    align: "start",
                    sortable: true,
                    value: "task",
                },
                { text: "Priority", value: "priority" },
                { text: "Note", value: "note" },
                { text: "Status", value: "status" },
                { text: "Actions", value: "actions" },
            ],
            todos: [
                {
                    task: "Coding",
                    priority: "Penting",
                    note: "Code for your life",
                    status: "Belum Selesai",
                },
                {
                    task: "Cooking",
                    priority: "Biasa",
                    note: "Indomie saat begadang ngerjain coding terbaek",
                    status: "Selesai",
                },
                {
                    task: "Gaming",
                    priority: "Tidak Penting",
                    note: "Wasting time",
                    status: "Belum Selesai",
                },
            ],
            formTodo: {
                task: null,
                priority: null,
                note: null,
                status: null,
            },
        };
    },
    methods: {
        save() {
            this.todos.push(this.formTodo);
            this.resetForm();
            this.dialog = false;
        },
        editItem() {
            //
        },
        cancel() {
            this.resetForm();
            this.dialog = false;
        },
        deleteItem() {
            //
        },
        resetForm() {
            this.formTodo = {
                task: null,
                priority: null,
                note: null,
                status: null,
            };
        },
    },
};
</script>

  