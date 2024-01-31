import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SellService } from '../services/sell.service';
import { Location } from '@angular/common';
import { CustomerService } from '../services/customer.service';
import { SettingService } from '../services/setting.service';
import { SellItem } from '@app/models/sell.model';

@Component({
  selector: 'app-view-sell',
  templateUrl: './view-sell.component.html',
  styleUrls: ['./view-sell.component.scss'],
})
export class ViewSellComponent {
  sellId: any;
  sell: any;
  customer: any;
  setting: any;
  imageToShow: any;
  upiId: any;
  sellItes: any;
  sellItems: SellItem[];

  constructor(
    private route: ActivatedRoute,
    private sellService: SellService,
    private location: Location,
    private customerService: CustomerService,
    private router: Router,
    private settingService: SettingService,
  ) {}

  ngOnInit(): void {
    this.settingService.getSellPrintSetting().subscribe((x) => {
      this.setting = { ...x };
      this.upiId = `upi://pay?pa=${x.upiId}`;
      this.createImageFromBlob(this.setting.logoUrl);

    });
    this.route.params.subscribe((x: any) => {
      if (x) {
        // this.isEdit = true;
        this.sellService.get(x.sellId).subscribe((y: any) => {
          this.sell = y;
          this.sellService.getAllSellItem().subscribe((sellItem) => {
            this.sellItems = sellItem.filter(
              (sellItem) => sellItem.sellId === x.sellId
              );
          })
          this.customerService.get(this.sell.customerId)?.subscribe((c: any) =>{
            this.customer = c;
          })
          this.route.queryParamMap.subscribe((z) => {
            if (z.has('print')) {
              if (z.get('print') === 'true') {
                if (this.isMobile()) {
                  setTimeout(() => this.printInvoice(), 1000);
                } else {
                  setTimeout(() => this.printPage(), 1000);
                }
              }
            }
          });
        });
      }
    });

  }

  createImageFromBlob(image:Blob){
    let reader = new FileReader();
    reader.addEventListener("load", () => {
       this.imageToShow = reader.result;
    }, false);

    if (image) {
       reader.readAsDataURL(image);
    }
  }


  settings() {
    this.router.navigate(['/setting'], {
      fragment: 'SellPrintSetting',
    });
  }

  isMobile(): boolean {
    return window.innerWidth <= 768;
  }

  navigateBack() {
    this.location.back();
  }

  printPage(): void {
    const printContents = document.querySelector('.sell-details')?.innerHTML;

    if (printContents) {
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      document.body.appendChild(iframe);

      const iframeDocument =
        iframe.contentDocument || iframe.contentWindow?.document;
      iframeDocument!.open();
      iframeDocument!.write(`
          <!DOCTYPE html>
            <html>
            <head>
                <title>Invoice Generated</title>
                <style>
                /* FOR DISABLING THE PRINT FOOTER */
                @page {
                  size: auto;
                  margin: 0;
                }

                @page :footer {
                  display: none;
                }

                @page :header {
                  display: none;
                }

                .sell-details {
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  padding: 20px;
                  background-color: var(--primary);
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }

                .sell-header {
                  width: 100%;
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                }

                .businessSetion {
                  gap : 20px;
                }

                img {
                 margin-top: 10px;
                }

                .sell-id {
                  font-size: 16px;
                  color: #666;
                }

                .sell-summary {
                  width: 100%;
                  display: flex;
                  justify-content: space-between;
                  margin-top: 20px;
                  padding: 0 20px;
                  box-sizing: border-box;
                }

                .customer-info {
                  flex: 2;
                }

                .status {
                  flex: 1;
                  text-align: right;
                }

                .product-list {
                  width: 100%;
                  margin-top: 30px;
                }

                .product-table {
                  width: 100%;
                  border-collapse: collapse;
                  margin-top: 10px;
                }

                .product-table th,
                .product-table td {
                  padding: 10px;
                  text-align: left;
                  border-bottom: 1px solid #616161;
                }

                .total {
                  width: 100%;
                  margin-top: 20px;
                  text-align: right;
                  font-size: 18px;
                  font-weight: bold;
                  color: var(--grey-50);
                  padding: 0 20px;
                  box-sizing: border-box;
                }
              </style>

            </head>
            <body>${printContents}</body>
            </html>
        `);
      iframeDocument!.close();

      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();

      // Clean up
      document.body.removeChild(iframe);
    }
  }

  printInvoice(): void {
    const printContent = document.querySelector('.sell-details');

    if (printContent) {
      const printWindow = window.open('', '_blank');

      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
            <style>
            /* FOR DISABLING THE PRINT FOOTER */
            @page {
              size: auto;
              margin: 0;
            }

            @page :footer {
              display: none;
            }

            @page :header {
              display: none;
            }

            .sell-details {
              display: flex;
              flex-direction: column;
              align-items: center;
              padding: 20px;
              background-color: var(--primary);
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }

            .sell-header {
              width: 100%;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }

            .businessSetion {
              gap : 20px;
            }

            img {
             margin-top: 10px;
            }

            .sell-id {
              font-size: 16px;
              color: #666;
            }

            .sell-summary {
              width: 100%;
              display: flex;
              justify-content: space-between;
              margin-top: 20px;
              padding: 0 20px;
              box-sizing: border-box;
            }

            .customer-info {
              flex: 2;
            }

            .status {
              flex: 1;
              text-align: right;
            }

            .product-list {
              width: 100%;
              margin-top: 30px;
            }

            .product-table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 10px;
            }

            .product-table th,
            .product-table td {
              padding: 10px;
              text-align: left;
              border-bottom: 1px solid #616161;
            }

            .total {
              width: 100%;
              margin-top: 20px;
              text-align: right;
              font-size: 18px;
              font-weight: bold;
              color: var(--grey-50);
              padding: 0 20px;
              box-sizing: border-box;
            }
          </style>
            </head>
            <body>
              ${printContent.innerHTML}
            </body>
          </html>
        `);

        // Close the document writing
        printWindow.document.close();

        // Print the content
        printWindow.print();
      }
    }
  }
}
