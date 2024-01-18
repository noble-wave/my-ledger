import { Component, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SellService } from '@app/protected/services/sell.service';
import { ModelMeta } from '@app/shared-services';
import { Observable, Subject, forkJoin, map, takeUntil } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { getSellPaymentMeta } from '@app/models/sell.model';
import { AppService } from '@app/services/app.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '@app/shared/controls/template/dialog/dialog.component';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  customerId: any;
  customerSells: any[];
  selectedDueAmount: number = 0;
  paymentForm: FormGroup;
  paymentMeta: ModelMeta[];
  selectedSells: string[] = [];

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private sellService: SellService,
    private app: AppService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((x: any) => {
      this.customerId = x.custId;
      console.log(this.customerId);
    });

    this.getCustomerPaymentData();

    this.paymentMeta = getSellPaymentMeta();
    this.paymentForm = this.app.meta.toFormGroup(
      { paymentDate: new Date(), customerId: this.customerId },
      this.paymentMeta
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next(undefined);
    this.destroy$.complete();
  }

  getCustomerPaymentData() {
    this.route.queryParams.subscribe((params: any) => {
      this.customerId = params.custId;
    });

    forkJoin([this.sellService.getAll()])
      .pipe(
        map((res: any[]) => {
          let sells: any[] = res[0];

          let customerSells = sells.filter(
            (sell) => sell.customerId === this.customerId
          );

          customerSells.forEach((sell) => {
            sell['sellDisplayDate'] = new Date(sell.sellDate)
              ?.toISOString()
              .split('T')[0];
          });

          customerSells.sort(
            (a, b) =>
              new Date(a.sellDate).getTime() - new Date(b.sellDate).getTime()
          );

          return customerSells.filter((x) => x.dueAmount > 0);
        })
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((x) => {
        this.customerSells = x;
      });
  }

  onNgModelChange($event) {
    // console.log($event);
    this.selectedSells = $event;

    let selectedSells = this.customerSells.filter(
      (x) => this.selectedSells.indexOf(x.sellId) > -1
    );

    this.selectedDueAmount = selectedSells.reduce(
      (a, b) => Number(a + b.dueAmount) || 0,
      0
    );
  }

  navigateBack() {
    this.location.back();
  }

  upDatePayment() {
    let payment = this.paymentForm.value;
    if (payment.amountPaid <= this.selectedDueAmount) {
      let amountPaid = payment.amountPaid;
     
      let selectedSellLists = this.customerSells.filter(
        (x) => this.selectedSells.indexOf(x.sellId) > -1
      );
      let sells = JSON.parse(JSON.stringify(selectedSellLists));
      sells.sort(
        (a, b) =>
          new Date(a.sellDate).getTime() - new Date(b.sellDate).getTime()
      );
      sells.forEach((sell) => {
        if (sell.dueAmount < amountPaid) {
          let leftAmount = amountPaid - sell.dueAmount;
          amountPaid = leftAmount;
          sell.dueAmount = 0;
        } else if (sell.dueAmount == amountPaid) {
          sell.dueAmount = 0;
        } else if (sell.dueAmount > amountPaid) {
          let newDueAmount = sell.dueAmount - amountPaid;
          sell.dueAmount = newDueAmount;
          amountPaid = 0;
        }
       
        this.sellService.updateSell(sell).subscribe(() => {
          console.log(`Sell DueAmount updated`);
        });
      });

      let newlist = sells.filter((x, i) => {
        let osell = selectedSellLists[i];
        return osell.dueAmount != x.dueAmount;
      });

      let a = newlist.map((x) => x.sellId).join(',');
      console.log(a);
      payment.sellId = a;

      this.sellService.addSellPayment1(payment)?.subscribe((y) => {
        console.log('Payment Saved', y);
        this.app.noty.notifyUpdated('Payment');
        // window.location.reload();
        this.getCustomerPaymentData();
        this.paymentForm.reset({
          paymentDate: new Date()
        });
      });

      // this.sellService.updateSell(newlist).subscribe(() => {
      //     console.log(`Sell DueAmount updated`);
      //   });
    } else {
      this.app.noty.notifyError('Due amount should be greather or qual to paid amount');
      // window.alert('Due amount should be greather or qual to paid amount');
    }
  }

   async addPayment(
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ) {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '400px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        dialogTitle: 'Update Payment',
        dialogContent:
          'Are you sure you want to update the payment?<br> <br>Please verify again.',
        cancelButtonText: 'No',
        confirmButtonText: 'Yes',
        color: 'warn',
      },
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === 'true') {
        await this.upDatePayment();
      }
    });
  }
}
