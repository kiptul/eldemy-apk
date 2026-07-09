import { Routes } from "@angular/router";

export const routes: Routes = [
  { path: "", redirectTo: "splash", pathMatch: "full" },
  { path: "splash", loadComponent: () => import("./splash/splash.page").then((m) => m.SplashPage) },
  { path: "welcome", loadComponent: () => import("./welcome/welcome.page").then((m) => m.WelcomePage) },
  { path: "login", loadComponent: () => import("./login-umum/login-umum.page").then((m) => m.LoginUmumPage) },
  { path: "login-siswa", loadComponent: () => import("./login/login.page").then((m) => m.LoginPage) },
  { path: "register", loadComponent: () => import("./register/register.page").then((m) => m.RegisterPage) },  { path: "privacy-policy", loadComponent: () => import("./privacy-policy/privacy-policy.page").then((m) => m.PrivacyPolicyPage) },
  {
    path: "tabs",
    loadComponent: () => import("./tabs/tabs.page").then((m) => m.TabsPage),
    children: [
      { path: "home", loadComponent: () => import("./home/home.page").then((m) => m.HomePage) },
      { path: "courses", loadComponent: () => import("./courses/courses.page").then((m) => m.CoursesPage) },
      { path: "history", loadComponent: () => import("./history/history.page").then((m) => m.HistoryPage) },
      { path: "profile", loadComponent: () => import("./profile/profile.page").then((m) => m.ProfilePage) },
      { path: "profile/notifications", loadComponent: () => import("./profile/notifications.page").then((m) => m.NotificationsPage) },
      { path: "profile/help", loadComponent: () => import("./profile/help.page").then((m) => m.HelpPage) },
      { path: "course-detail/:id", loadComponent: () => import("./course-detail/course-detail.page").then((m) => m.CourseDetailPage) },
      { path: "course-detail/:courseId/material/:materialId", loadComponent: () => import("./material-detail/material-detail.page").then((m) => m.MaterialDetailPage) },
      { path: "tugas-detail/:id", loadComponent: () => import("./tugas-detail/tugas-detail.page").then((m) => m.TugasDetailPage) },
      { path: "kuis/:id", loadComponent: () => import("./kuis/kuis.page").then((m) => m.KuisPage) },
      { path: "", redirectTo: "home", pathMatch: "full" },
    ],
  },
];