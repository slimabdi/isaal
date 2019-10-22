import { Injectable } from "@angular/core";
import {
  Breakpoints,
  BreakpointState,
  BreakpointObserver
} from "@angular/cdk/layout";

@Injectable({
  providedIn: "root"
})
export class DataService {
  //#region variables
  lineChartType: string[] = ["line", "bar", "bar", "bar", "bar"];
  lastestDate: string;
  beforeLastestDate: string;
  //#endregion

  constructor(private breakpointObserver: BreakpointObserver) {
    let d = new Date();
    let day = d.getDate() < 10 ? "0" + (d.getDate() - 1) : d.getDate() - 1;

    this.lastestDate = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + day;
    this.beforeLastestDate =
      d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + day;
  }

  // **************** Fans Progression ***********************
  getFansProgression(res) {}
}
