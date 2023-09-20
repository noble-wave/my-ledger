import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-view-order',
  templateUrl: './view-order.component.html',
  styleUrls: ['./view-order.component.scss'],
})
export class ViewOrderComponent {
  orderId: any;
  order: any;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((x: any) => {
      if (x) {
        // this.isEdit = true;
        this.orderService.get(x.orderId).subscribe((y: any) => {
          this.order = y;
          this.route.queryParamMap.subscribe((z) => {
            if (z.has('print')) {
              if (z.get('print') === 'true') {
                setTimeout(() => this.printPage(), 1000);
              }
            }
          });
        });
      }
    });
  }

  printPage(): void {
    const printContents = document.querySelector('.order-details')?.innerHTML;

    if (printContents) {
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      document.body.appendChild(iframe);

      const iframeDocument =
        iframe.contentDocument || iframe.contentWindow?.document;
      iframeDocument!.open();
      iframeDocument!.write(`
            <html>
            <head>
                <title>Invoice Generated</title>
                <style>
                // FOR DESABLE THE PRINT FOOTER

                @page {
                    size: auto;
                    margin: 0;
                  }
                @print {
                  @page :footer {
                      display: none;
                  }
                
                @page :header {
                      display: none;
                  }
                }

                .order-details {
                  display: flex;
                  flex-direction: column;
                  align-items: center;  
                  padding: 20px;
                  background-color: var(--primary);
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                
                .order-header {
                  width: 100%;
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                }
                
                .order-id {
                  font-size: 16px;
                  color: #666;
                }
                
                .order-summary {
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
                
                .product-table th, .product-table td {
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

  printPages(): void {
    const printContents = document.querySelector('.order-details')?.innerHTML;

    if (printContents) {
      const printWindow = window.open('', '_blank');

      if (printWindow) {
        printWindow.document.open();
        printWindow.document.write(`
          <html>
            <head>
              <title>Invoice Generated</title>
              <style>
                /* Your CSS styles here */
                @media print {
                  /* Additional styles for printing */
                  @page {
                    size: auto;
                    margin: 0;
                  }
                
                  body::before {
                    content: "";
                    display: block;
                    height: 20px; /* Adjust the height as needed */
                  }
                
                  body::after {
                    content: "";
                    display: block;
                    height: 20px; /* Adjust the height as needed */
                    page-break-after: always;
                  }
                  .order-details {
                    display: flex;
                    flex-direction: column;
                    align-items: center;  
                    padding: 20px;
                    background-color: var(--primary);
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                  }
                  
                  .order-header {
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                  }
                  
                  .order-id {
                    font-size: 16px;
                    color: #666;
                  }
                  
                  .order-summary {
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
                  
                  .product-table th, .product-table td {
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
                }
              </style>
            </head>
            <body>${printContents}</body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
        printWindow.onafterprint = () => {
          printWindow.close();
        };
      } else {
        // Handle the case where the popup window couldn't be opened
        console.error(
          'Unable to open print window. Please check your popup blocker settings.'
        );
      }
    }
  }
}
