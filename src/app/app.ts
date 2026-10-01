import { Component } from "@angular/core";
import { SignupComponent } from "./signup/signup";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [SignupComponent],
  templateUrl: "./app.html",
  styleUrl: "./app.scss",
})
export class App {
  title = "roulot_lilia";
}
