import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements AfterViewInit {
  locatedNumber: number | null = null;
  seconds: number = 0;
  _timerSubscription: Subscription | undefined;

  constructor(private location: Location) { }

  ngOnInit(): void {
  //   setTimeout(() => {
  //     const state: any = this.location.getState();
  //     console.log(state?.navigationId)
  //     if (state) {
  //       this.locatedNumber = state.navigationId;
  //     }
  //     if (this.locatedNumber) {
  //       this.location.historyGo(-this.locatedNumber)
  //     }
  //   }, 10000);
  //   this.startTimer();
  // }

  // startTimer(): void {
  //   setInterval(() => {
  //     this.seconds++;
  //   }, 1000);
  // }
  }
  ngAfterViewInit(): void {}

  onClick(): void {
    const state: any = this.location.getState();
    if (state && 'navigationId' in state) {
      this.locatedNumber = state.navigationId;
    }

    if (this.locatedNumber) {
      this.location.historyGo(-this.locatedNumber)
    }
  }
}

