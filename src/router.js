import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

function importView(path) {
  return () => import(`./components/${path}.vue`);
}

function importViewAdmin(path) {
  return () => import(`./components/admin/${path}.vue`);
}

function importViewKasir(path) {
  return () => import(`./components/kasir/${path}.vue`);
}

const router = new VueRouter({
  mode: "history",
  routes: [
    {
      path: "/",
      meta: { title: "Gofit" },
      component: importView("LayoutTemplate"),
      children: [
        {
          path: "/",
          name: "Home",
          meta: { title: "Home" },
          component: importView("Home"),
        },
        // admin
        {
          path: "/promocash",
          name: "PromoCash",
          meta: { title: "PromoCash" },
          component: importViewAdmin("PromoCash"),
        },
        {
          path: "/promoclass",
          name: "PromoClass",
          meta: { title: "PromoClass" },
          component: importViewAdmin("PromoClass"),
        },
        {
          path: "/pegawai",
          name: "Pegawai",
          meta: { title: "Pegawai" },
          component: importViewAdmin("Pegawai"),
        },
        {
          path: "/instruktur",
          name: "Instruktur",
          meta: { title: "Instruktur" },
          component: importViewAdmin("Instruktur"),
        },
        //kasir
        {
          path: "/member",
          name: "Member",
          meta: { title: "Member" },
          component: importViewKasir("Member"),
        },
        {
          path: "/resetPass",
          name: "ResetPass",
          meta: { title: "ResetPass" },
          component: importViewKasir("ResetPass"),
        },
        // semua role bisa akses
        {
          path: "/profil",
          name: "Profil",
          meta: { title: "Profil" },
          component: importView("Profil"),
        },
        {
          path: "/profil/:id",
          name: "OtherProfil",
          meta: { title: "Profil" },
          component: importView("Profil"),
        },
      ],
    },
    {
      path: "/Login",
      name: "Login",
      meta: { title: "Login" },
      component: importView("Login"),
    },
  ],
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title;
  next();
});

export default router;
