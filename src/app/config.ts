import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})

export class Config {
  readonly navTree = {
    "analytics":
    {
      name: "My Analytics",
      route: "analytics",
      icon: 'trending_up',
      features: {
        home: {icon : "home", name: "Home", route: "home"},
        dashboards: { name: "Dashboards", route: "dashboards" },
        benchmarks: { name: "Benchmarks", route: "benchmarks" },
        reports: { name: "Reports", route: "reports" },
        // nat_benchmarks: {name:"National Benchmarks", route:"reports"}, 
      }
    },

    "postplan":
    {
      name: "Post Plan",
      route: "postplan",
      icon: 'share',
      features: {
        calendars: { name: "My Calendars", route: "calendars" },
        inspire: { name: "Get Inspired", route: "inspire" },
        plan: { name: "Plan a post", route: "plan-post" },
        optimize: { name: "Optimize", route: "optimize" },
      }
    },


    "moderation":
    {
      name: "Moderation",
      route: "moderation",
      icon: 'import_contacts',
      features: {
        moderate: { name: "Moderate", route: "moderate" },
        productivity: { name: "Productivity", route: "productivity" },
      }
    },


    "adsmanager":
    {
      name: "Ads Manager",
      route: "adsmanager",
      icon: 'assignment',
      features: {
        dashboards: { name: "Default Dashboards", route: "dashboards" },
        customdashboards: { name: "Custom Dashboards", route: "custom-dashboards" },
      }
    },
  }
}