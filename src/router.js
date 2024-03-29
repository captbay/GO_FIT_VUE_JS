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

function importViewMo(path) {
  return () => import(`./components/mo/${path}.vue`);
}

const router = new VueRouter({
  mode: "history",
  routes: [
    {
      path: "/",
      meta: { title: "Gofit" },
      component: importView("LayoutTemplate"),
      children: [
        // semua role bisa akses

        {
          path: "/",
          name: "Home",
          meta: { title: "Home" },
          component: importView("Home"),
        },
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

        // admin
        {
          path: "/promocash",
          name: "PromoCash",
          meta: {
            title: "PromoCash",
            authRequired: "admin",
          },
          component: importViewAdmin("PromoCash"),
        },
        {
          path: "/promoclass",
          name: "PromoClass",
          meta: {
            title: "PromoClass",
            authRequired: "admin",
          },
          component: importViewAdmin("PromoClass"),
        },
        {
          path: "/pegawai",
          name: "Pegawai",
          meta: {
            title: "Pegawai",
            authRequired: "admin",
          },
          component: importViewAdmin("Pegawai"),
        },
        {
          path: "/instruktur",
          name: "Instruktur",
          meta: {
            title: "Instruktur",
            authRequired: "admin",
          },
          component: importViewAdmin("Instruktur"),
        },
        //kasir
        {
          path: "/member",
          name: "Member",
          meta: {
            title: "Member",
            authRequired: "kasir",
          },
          component: importViewKasir("Member"),
        },
        {
          path: "/memberDeaktivasi",
          name: "MemberDeaktivasi",
          meta: {
            title: "MemberDeaktivasi",
            authRequired: "kasir",
          },
          component: importViewKasir("MemberDeaktivasi"),
        },
        {
          path: "/resetPass",
          name: "ResetPass",
          meta: {
            title: "ResetPass",
            authRequired: "kasir",
          },
          component: importViewKasir("ResetPass"),
        },
        {
          path: "/instrukturLate",
          name: "InstrukturLate",
          meta: {
            title: "InstrukturLate",
            authRequired: "kasir",
          },
          component: importViewKasir("InstrukturLate"),
        },
        {
          path: "/aktivasiMember",
          name: "AktivasiMember",
          meta: {
            title: "AktivasiMember",
            authRequired: "kasir",
          },
          component: importViewKasir("AktivasiMember"),
        },
        {
          path: "/depositUang",
          name: "DepositUang",
          meta: {
            title: "DepositUang",
            authRequired: "kasir",
          },
          component: importViewKasir("DepositUang"),
        },
        {
          path: "/depositKelas",
          name: "DepositKelas",
          meta: {
            title: "DepositKelas",
            authRequired: "kasir",
          },
          component: importViewKasir("DepositKelas"),
        },
        {
          path: "/depositPaketDeaktivasi",
          name: "DepositPaketDeaktivasi",
          meta: {
            title: "DepositPaketDeaktivasi",
            authRequired: "kasir",
          },
          component: importViewKasir("DepositPaketDeaktivasi"),
        },
        {
          path: "/presensiGym",
          name: "PresensiGym",
          meta: {
            title: "PresensiGym",
            authRequired: "kasir",
          },
          component: importViewKasir("PresensiGym"),
        },
        {
          path: "/presensiKelasRegulerAndPaket",
          name: "PresensiKelasRegulerAndPaket",
          meta: {
            title: "PresensiKelasRegulerAndPaket",
            authRequired: "kasir",
          },
          component: importViewKasir("PresensiKelasRegulerAndPaket"),
        },
        //mo
        {
          path: "/class",
          name: "Class",
          meta: {
            title: "Class",
            authRequired: "mo",
          },
          component: importViewMo("Class"),
        },
        {
          path: "/jadwalUmum",
          name: "JadwalUmum",
          meta: {
            title: "JadwalUmum",
            authRequired: "mo",
          },
          component: importViewMo("JadwalUmum"),
        },
        {
          path: "/jadwalHarian",
          name: "JadwalHarian",
          meta: {
            title: "JadwalHarian",
            authRequired: "mo",
          },
          component: importViewMo("JadwalHarian"),
        },
        {
          path: "/instrukturIzin",
          name: "InstrukturIzin",
          meta: {
            title: "InstrukturIzin",
            authRequired: "mo",
          },
          component: importViewMo("InstrukturIzin"),
        },
        {
          path: "/laporanPendapatan",
          name: "LaporanPendapatan",
          meta: {
            title: "LaporanPendapatan",
            authRequired: "mo",
          },
          component: importViewMo("LaporanPendapatan"),
        },
        {
          path: "/laporanKelas",
          name: "laporanKelas",
          meta: {
            title: "laporanKelas",
            authRequired: "mo",
          },
          component: importViewMo("laporanKelas"),
        },
        {
          path: "/laporanGym",
          name: "laporanGym",
          meta: {
            title: "laporanGym",
            authRequired: "mo",
          },
          component: importViewMo("laporanGym"),
        },
        {
          path: "/laporanInstruktur",
          name: "laporanInstruktur",
          meta: {
            title: "laporanInstruktur",
            authRequired: "mo",
          },
          component: importViewMo("laporanInstruktur"),
        },
      ],
    },
    {
      path: "/Login",
      name: "Login",
      meta: { title: "Login" },
      component: importView("Login"),
    },
    {
      path: "/Unauthorized",
      name: "Unauthorized",
      meta: { title: "Unauthorized" },
      component: importView("Unauthorized"),
    },
  ],
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title;
  //check page is protected or not
  console.log("to.meta.authRequired", to.meta.authRequired);
  if (to.meta.authRequired === "admin") {
    //access check
    if (
      //if user is admin or super admin
      $cookies.get("ROLE") == "admin"
    ) {
      return next();
    } else {
      router.push({
        name: "Unauthorized",
      });
    }
  } else if (to.meta.authRequired === "kasir") {
    //access check
    if (
      //if user is kasir
      $cookies.get("ROLE") == "kasir"
    ) {
      return next();
    } else {
      router.push({
        name: "Unauthorized",
      });
    }
  } else if (to.meta.authRequired === "mo") {
    //access check
    if (
      //if user is kasir
      $cookies.get("ROLE") == "mo"
    ) {
      return next();
    } else {
      router.push({
        name: "Unauthorized",
      });
    }
  } else {
    return next();
  }
});

export default router;
