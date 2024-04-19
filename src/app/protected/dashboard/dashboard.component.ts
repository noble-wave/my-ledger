import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { SellService } from '../services/sell.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '@app/shared/controls/template/dialog/dialog.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  dataPresent: boolean = false;

  constructor(
    private location: Location,
    private sellService: SellService,
    public dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.sellService.isDataPresent().subscribe((dataPresent) => {
      this.dataPresent = dataPresent;
      const isFirstVisit = localStorage.getItem('isFirstVisitProductList');
      if (!isFirstVisit || !dataPresent) {
        localStorage.setItem('isFirstVisitProductList', 'true');
        this.demoData('enterAnimationDuration', 'exitAnimationDuration');
      }
    });
  }

  navigateBack() {
    this.location.back();
  }

  async demoData(
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ) {
    const dialogConfig = {
      width: '600px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        dialogTitle: 'Welcome to Ledger App',
        dialogContent: `
      This application simplifies invoice generation, enables insightful sales analysis,
      and facilitates efficient product and customer management.<br><br>
      Would you like to explore the app with pre-populated data for a comprehensive understanding, or start with a clean slate?
    `,
        cancelButtonText: 'Start Fresh',
        confirmButtonText: 'Explore with Sample Data',
        color: 'primary',
        headButton: true,
        headButtonContent: 'User Guide',
      },
    };

    const dialogRef = this.dialog.open(DialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === 'true') {
        this.router.navigate(['/dummy-data-loader']);
      }
    });
  }
}
