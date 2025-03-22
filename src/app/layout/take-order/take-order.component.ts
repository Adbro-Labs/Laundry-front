import { DatePipe } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { debounceTime } from "rxjs/operators";
import { AuthService } from "src/app/shared/services/auth.service";
import { CustomerService } from "src/app/shared/services/customer.service";
import { BranchService } from "src/app/shared/services/measure.service";
import { OrderService } from "src/app/shared/services/order.service";
import { OrderapiService } from "src/app/shared/services/orderapi.service";
import { AddCustomerComponent } from "../add-customer/add-customer.component";
import { BillViewComponent } from "../bill-view/bill-view.component";
import { ItemDetailsComponent } from "../item-details/item-details.component";
import { SettlementComponent } from "../settlement/settlement.component";
import { paymentMethod } from "src/app/shared/enums";
import { ConfirmOrderCancelComponent } from "../confirm-order-cancel/confirm-order-cancel.component";

@Component({
    selector: "app-take-order",
    templateUrl: "./take-order.component.html",
    styleUrls: ["./take-order.component.scss"],
})
export class TakeOrderComponent implements OnInit {
    orderNumber;
    customerDetails;
    showNoCustomer;
    orderDate = new Date();
    orderTime;
    disableUpdate = false;
    orderMaster;
    showCancelOrder = false;
    branchDetails;
    orderStatus = "PENDING";
    enablePrint = false;
    disableNumberChange = false;
    orderStatusList = ["PENDING", "PAID", "CANCELLED", "DELIVERED"];
    statusCode = 0;
    userRole = this.auth.getUserRole();
    customerList = [];
    tempCustomerList = [];
    disableSave = false;
    payment = paymentMethod;
    @ViewChild(ItemDetailsComponent) items: ItemDetailsComponent;
    mobileNumber = new FormControl(
        { value: "", disabled: this.disableNumberChange },
        [
            Validators.required,
            Validators.minLength(10),
            Validators.maxLength(10),
        ]
    );
    constructor(
        private route: ActivatedRoute,
        private customer: CustomerService,
        private auth: AuthService,
        private router: Router,
        private branch: BranchService,
        private dialog: MatDialog,
        private order: OrderService,
        private orderApi: OrderapiService,
        private snack: MatSnackBar,
        private datePipe: DatePipe
    ) {}

    ngOnInit(): void {
        this.route.params.subscribe((data) => {
            this.orderNumber = data.id;
            if (this.orderNumber) {
                this.getOrderDetailsByOrderNumber(this.orderNumber);
            }
        });
        this.getAllCustomers("");
        this.mobileNumber.valueChanges
            .pipe(debounceTime(500))
            .subscribe((data) => {
                this.getAllCustomers(data);
            });
        this.order.hideSidebars();
    }

    filterCustomers(query) {
        if (typeof query == "string") {
            this.showNoCustomer = false;
            this.tempCustomerList = this.customerList
                .filter(
                    (x) =>
                        x?.customerName
                            ?.toLowerCase()
                            ?.includes(query?.toLowerCase()) ||
                        x?.mobile?.toString()?.includes(query)
                )
                ?.slice(0, 3);
            if (
                (!this.tempCustomerList || this.tempCustomerList.length < 1) &&
                query &&
                query.length >= 10
            ) {
                this.customerDetails = null;
                this.showNoCustomer = true;
            }
        }
    }

    getAllCustomers(query) {
        if (typeof query == "string") {
            this.showNoCustomer = false;
            this.customer.getAllCustomers(0, query).subscribe((data) => {
                this.customerList = data as any;
                this.tempCustomerList = data as any;
                if (
                    (!this.tempCustomerList ||
                        this.tempCustomerList.length < 1) &&
                    query &&
                    query.length >= 10
                ) {
                    this.customerDetails = null;
                    this.showNoCustomer = true;
                }
            });
        }
    }
    displayFn(user): string {
        const cusomerMobile = user && user.mobile ? user.mobile : "";
        return cusomerMobile;
    }
    setCustomerDetails() {
        const user = this.mobileNumber.value;
        if (user) {
            this.customerDetails = user;
            this.order.setCustomerId((user as any)._id);
            this.items.customerId = (user as any)._id;
            this.items.getItems();
            this.getBranchDetails();
        }
    }

    updateNumberChange(value) {
        this.disableNumberChange = value;
        if (value) {
            this.mobileNumber.disable();
        } else {
            this.mobileNumber.enable();
        }
    }

    searchCustomer(query) {
        this.customer.searchCustomerByMobile(query).subscribe(
            (data) => {
                this.showNoCustomer = false;
                this.customerDetails = data;
                this.order.setCustomerId((data as any)._id);
                this.items.customerId = (data as any)._id;
                this.items.getItems();
                this.getBranchDetails();
            },
            (error) => {
                this.showNoCustomer = true;
                if (error.status == 404) {
                    this.customerDetails = null;
                }
            }
        );
    }
    showCustomerForm() {
        let formData;
        if (isNaN(this.mobileNumber.value)) {
            const valueType = typeof this.mobileNumber.value;
            if (valueType == "string") {
                formData = { customerName: this.mobileNumber.value };
            }
        } else {
            formData = { mobile: this.mobileNumber.value };
        }
        this.dialog
            .open(AddCustomerComponent, {
                disableClose: true,
                width: "400px",
                data: formData,
            })
            .afterClosed()
            .subscribe((data) => {
                if (data) {
                    this.showNoCustomer = false;
                    this.customerList.push(data);
                    this.tempCustomerList = [data];
                    this.mobileNumber.setValue(data);
                    this.setCustomerDetails();
                }
            });
    }
    getOrderDetailsByOrderNumber(orderNumber) {
        this.orderApi
            .getOrderDetailsByNumber(
                orderNumber,
                this.auth.decodeJwt()?.branchCode
            )
            .subscribe((data) => {
                this.disableUpdate = true;
                const orderMaster = (data as any).orderMaster;
                this.branchDetails = (data as any).branchDetails;
                this.orderMaster = orderMaster;
                if (orderMaster) {
                    this.orderDate = new Date(orderMaster.orderDate);
                }
                this.orderNumber = orderMaster?.orderNumber;
                this.customerDetails = orderMaster?.customer;
                this.items.discount = orderMaster?.discount;
                this.items.additionalInstructions =
                    orderMaster?.additionalInstructions;
                this.items.deliveryType = orderMaster?.deliveryType;
                this.items.deliveryTime = orderMaster?.deliveryTime;
                this.items.netTotal = orderMaster?.netTotal;
                this.items.disableUpdate = true;
                this.items.isVatEnabled = orderMaster.vatEnabled;
                this.mobileNumber.setValue(this.customerDetails.mobile);
                this.items.setItemDetail((data as any).orderDetails);
                this.enablePrint = true;
                this.orderStatus = this.orderMaster.status;
                this.mobileNumber.disable();
                this.statusCode = this.orderStatusList.findIndex(
                    (x) => x == this.orderMaster.status
                );
            });
    }
    saveOrder(paymentMethod) {
        this.disableSave = true;
        if (paymentMethod != this.payment.PAY_LATER && this.orderStatus != "DELIVERED") {
            this.orderStatus = "PAID";
        }
        if (this.items.orderDetails.valid) {
            const items = this.items.orderDetails.value;
            let total = 0;
            let netTotal = 0;
            if (items) {
                items.forEach((element) => {
                    total = total + Number(element.total);
                });
                netTotal = total;
                const discount = Number(this.items.discount);
                if (discount) {
                    netTotal = total - discount;
                }
            }
            const orderDetails = {
                orderMaster: {
                    orderNumber: this.orderNumber,
                    customer: this.customerDetails,
                    customerId: this.customerDetails?._id,
                    total: total,
                    discount: Number(this.items.discount),
                    netTotal: this.items.netTotal,
                    additionalInstructions: this.items.additionalInstructions,
                    deliveryType: this.items.deliveryType,
                    deliveryTime: this.items.deliveryTime,
                    branchCode: this.auth.decodeJwt()?.branchCode,
                    status: this.orderStatus,
                    paymentMethod,
                    vatAmount: this.items.vatAmount,
                    subTotal: this.items.subTotal,
                    roundoffAmount: this.items.roundoffAmount,
                    vatEnabled: this.items.isVatEnabled
                },
                orderDetails: this.items.orderDetails.value,
            };
            this.orderApi.saveOrdere(orderDetails).subscribe((data) => {
              this.processSaveOrder(data);
            });
        } else {
            this.snack.open("complete the item details", "Ok", {
                duration: 1500,
            });
            this.disableSave = false;
        }
    }
  printReciept() {
    const elementIdsToHide = [];

    if (this.items.isVatEnabled) {
        this.orderApi.getInvoiceTemplate().subscribe((htmlString) => {
            // Process template replacements (same as before)
            htmlString = htmlString.replace("[ORDER_NO]", this.orderNumber);
            htmlString = htmlString.replace("[CUSTOMER_NAME]", this.customerDetails?.customerName);
            htmlString = htmlString.replace("[CUSTOMER_MOBILE]", this.customerDetails?.mobile);
            htmlString = htmlString.replace("[DATE]", this.datePipe.transform(this.orderDate, "dd-MM-yyyy", "+0400"));
            htmlString = htmlString.replace("[SHOPNAME]", this.branchDetails?.title);
            htmlString = htmlString.replace("[TITLE]", this.branchDetails?.title);
            htmlString = htmlString.replace("[SUBTITLE1]", this.branchDetails?.subtitle1);
            htmlString = htmlString.replace("[SUBTITLE2]", this.branchDetails?.subtitle2);
            
        
    
            if (this.branchDetails?.imageUrl) {
                htmlString = htmlString.replace("[IMAGE_URL]", this.branchDetails?.imageUrl);
            } else {
                elementIdsToHide.push("shoplogo");
            }
    
            const itemDetails = this.items.orderDetails.value;
            let itemsString = '';
            let subTotal = 0;
    
            let totalQty = 0;
            itemDetails.forEach((el) => {
                const item = `<tr>
                    <td style="text-align: left;">${el.itemName}</td>
                    <td>${el.quantity}</td>
                    <td>${el.rate}</td>
                    <td>${el.vat}</td>
                    <td>${el.total}</td>
                </tr>`;
                itemsString += item;
                subTotal += Number(el.rate);
                if (Number(el.quantity)) {
                    totalQty += Number(el.quantity);
                }
            });
            htmlString = htmlString.replace("[TOTAL_ITEMS]", totalQty.toString());
            htmlString = htmlString.replace("[PAYMENT_TYPE]", this.orderMaster.paymentMethod);
            htmlString = htmlString.replace("[itemDetails]", itemsString);
    
    
            if (this.orderMaster?.discount) {
                htmlString = htmlString.replace("[DISCOUNT]", Number(this.orderMaster?.discount).toFixed(2));
            } else {
                elementIdsToHide.push("discountLabel");
            }
    
            if (this.orderMaster?.subTotal) {
                htmlString = htmlString.replace("[SUBTOTAL]", Number(this.orderMaster?.subTotal).toFixed(2));
            } 
            else {
                elementIdsToHide.push("subTotalLabel");
            }
    
            if (this.orderMaster?.vatAmount) {
                htmlString = htmlString.replace("[VATAMOUNT]", Number(this.orderMaster?.vatAmount).toFixed(2));
            } else {
                elementIdsToHide.push("vatAmountLabel");
            }
    
            if (this.orderMaster?.vatEnabled && this.branchDetails?.taxNumber) {
                htmlString = htmlString.replace("[TRN]", this.branchDetails?.taxNumber);
            } else {
                elementIdsToHide.push("taxDetails");
            }
    
            if (this.orderMaster?.roundoffAmount) {
                htmlString = htmlString.replace("[ROUNDOFF]", Number(this.orderMaster?.roundoffAmount).toFixed(2));
            } else {
                elementIdsToHide.push("roundoffLabel");
            }
    
            htmlString = htmlString.replace("[NETTOTAL]", Number(this.orderMaster?.netTotal).toFixed(2));
    
            if (this.orderMaster?.additionalInstructions) {
                htmlString = htmlString.replace("[NOTES]", this.orderMaster?.additionalInstructions);
            } else {
                elementIdsToHide.push("notelabel");
            }
    
            htmlString = htmlString.replace("[DELIVREY_TYPE]", this.orderMaster?.deliveryType);
    
            if (this.orderMaster?.deliveryTime) {
                htmlString = htmlString.replace("[DELIVREY_TIME]", this.orderMaster?.deliveryTime);
            } else {
                elementIdsToHide.push("deliveryTimeLabel");
            }
    
            htmlString = htmlString.replace("undefined", "");
    
            // Create a new print window
            const printWindow = window.open("", "", "height=600,width=900");
            
            // Add content with a function that returns a Promise
            const setupPrintWindow = () => {
                return new Promise<void>((resolve) => {
                    printWindow.document.write(`<html><head><title>${this.branchDetails?.title}</title>`);
                    printWindow.document.write('<style>@media print { @page { size: 80mm auto; margin: 0; }}</style>');
                    printWindow.document.write("</head><body>");
                    printWindow.document.write(htmlString);
                    printWindow.document.write("</body></html>");
                    printWindow.document.close();
                    
                    // Wait for window to load before resolving
                    if (printWindow.document.readyState === 'complete') {
                        resolve();
                    } else {
                        // printWindow.onload = resolve;
                        printWindow.onload = (event) => resolve();
                    }
                });
            };
            
            // Manipulate DOM elements
            const manipulateDom = () => {
                return new Promise((resolve) => {
                    // Hide elements
                    for (let item of elementIdsToHide) {
                        let element = printWindow.document.getElementById(item);
                        if (element) {
                            element.style.setProperty("display", "none", "important");
                        }
                    }
                    
                    // Add status watermark if needed
                    if (this.orderMaster.status) {
                        const div = printWindow.document.createElement("h4");
                        const node = printWindow.document.createElement("h4");
                        const text = printWindow.document.createTextNode(this.orderMaster.status);
                        node.style.position = "absolute";
                        node.style.top = "240px";
                        node.style.zIndex = "-1";
                        node.style.transform = "rotate(320deg)";
                        node.style.color = "#c6afaf";
                        node.style.fontSize = "25px";
                        div.style.display = "flex";
                        div.style.justifyContent = "center";
                        node.appendChild(text);
                        div.appendChild(node);
                        const printDoc = printWindow.document.getElementById("invoice-box");
                        if (printDoc) {
                            printDoc.appendChild(div);
                        }
                    }
                    
                    // Use a short delay to ensure styles are applied
                    setTimeout(resolve, 100);
                });
            };
            
            // Execute the printing process as a chain of promises
            setupPrintWindow()
                .then(manipulateDom)
                .then(() => {
                    return new Promise<void>((resolve) => {
                        // Force a repaint before printing
                        requestAnimationFrame(() => {
                            requestAnimationFrame(() => {
                                printWindow.print();
                                setTimeout(() => {
                                    printWindow.close();
                                    resolve();
                                }, 100);
                            });
                        });
                    });
                })
                .catch((error) => {
                    console.error("Print error:", error);
                    printWindow.close();
                });
        });
    }
 else{

    this.orderApi.getInvoiceTemplateWithoutVat().subscribe((htmlString) => {
        // Process template replacements (same as before)
        htmlString = htmlString.replace("[ORDER_NO]", this.orderNumber);
        htmlString = htmlString.replace("[CUSTOMER_NAME]", this.customerDetails?.customerName);
        htmlString = htmlString.replace("[CUSTOMER_MOBILE]", this.customerDetails?.mobile);
        htmlString = htmlString.replace("[DATE]", this.datePipe.transform(this.orderDate, "dd-MM-yyyy", "+0400"));
        htmlString = htmlString.replace("[SHOPNAME]", this.branchDetails?.title);
        htmlString = htmlString.replace("[TITLE]", this.branchDetails?.title);
        htmlString = htmlString.replace("[SUBTITLE1]", this.branchDetails?.subtitle1);
        htmlString = htmlString.replace("[SUBTITLE2]", this.branchDetails?.subtitle2);
        
    

        if (this.branchDetails?.imageUrl) {
            htmlString = htmlString.replace("[IMAGE_URL]", this.branchDetails?.imageUrl);
        } else {
            elementIdsToHide.push("shoplogo");
        }

        const itemDetails = this.items.orderDetails.value;
        let itemsString = '';
        let subTotal = 0;

        let totalQty = 0;
        itemDetails.forEach((el) => {
            const item = `<tr>
                <td style="text-align: left;">${el.itemName}</td>
                <td>${el.quantity}</td>
                <td colspan="2">${el.rate}</td>
                <td>${el.total}</td>
            </tr>`;
            itemsString += item;
            subTotal += Number(el.rate);
            if (Number(el.quantity)) {
                totalQty += Number(el.quantity);
            }
        });
        htmlString = htmlString.replace("[TOTAL_ITEMS]", totalQty.toString());
        htmlString = htmlString.replace("[PAYMENT_TYPE]", this.orderMaster.paymentMethod);
        htmlString = htmlString.replace("[itemDetails]", itemsString);


        if (this.orderMaster?.discount) {
            htmlString = htmlString.replace("[DISCOUNT]", Number(this.orderMaster?.discount).toFixed(2));
        } else {
            elementIdsToHide.push("discountLabel");
        }

        if (this.orderMaster?.subTotal) {
            htmlString = htmlString.replace("[SUBTOTAL]", Number(this.orderMaster?.subTotal).toFixed(2));
        } 
        else {
            elementIdsToHide.push("subTotalLabel");
        }

   

        if (this.orderMaster?.vatEnabled && this.branchDetails?.taxNumber) {
            htmlString = htmlString.replace("[TRN]", this.branchDetails?.taxNumber);
        } else {
            elementIdsToHide.push("taxDetails");
        }

        if (this.orderMaster?.roundoffAmount) {
            htmlString = htmlString.replace("[ROUNDOFF]", Number(this.orderMaster?.roundoffAmount).toFixed(2));
        } else {
            elementIdsToHide.push("roundoffLabel");
        }

        htmlString = htmlString.replace("[NETTOTAL]", Number(this.orderMaster?.netTotal).toFixed(2));

        if (this.orderMaster?.additionalInstructions) {
            htmlString = htmlString.replace("[NOTES]", this.orderMaster?.additionalInstructions);
        } else {
            elementIdsToHide.push("notelabel");
        }

        htmlString = htmlString.replace("[DELIVREY_TYPE]", this.orderMaster?.deliveryType);

        if (this.orderMaster?.deliveryTime) {
            htmlString = htmlString.replace("[DELIVREY_TIME]", this.orderMaster?.deliveryTime);
        } else {
            elementIdsToHide.push("deliveryTimeLabel");
        }

        htmlString = htmlString.replace("undefined", "");

        // Create a new print window
        const printWindow = window.open("", "", "height=600,width=900");
        
        // Add content with a function that returns a Promise
        const setupPrintWindow = () => {
            return new Promise<void>((resolve) => {
                printWindow.document.write(`<html><head><title>${this.branchDetails?.title}</title>`);
                printWindow.document.write('<style>@media print { @page { size: 80mm auto; margin: 0; }}</style>');
                printWindow.document.write("</head><body>");
                printWindow.document.write(htmlString);
                printWindow.document.write("</body></html>");
                printWindow.document.close();
                
                // Wait for window to load before resolving
                if (printWindow.document.readyState === 'complete') {
                    resolve();
                } else {
                    // printWindow.onload = resolve;
                    printWindow.onload = (event) => resolve();
                }
            });
        };
        
        // Manipulate DOM elements
        const manipulateDom = () => {
            return new Promise((resolve) => {
                // Hide elements
                for (let item of elementIdsToHide) {
                    let element = printWindow.document.getElementById(item);
                    if (element) {
                        element.style.setProperty("display", "none", "important");
                    }
                }
                
                // Add status watermark if needed
                if (this.orderMaster.status) {
                    const div = printWindow.document.createElement("h4");
                    const node = printWindow.document.createElement("h4");
                    const text = printWindow.document.createTextNode(this.orderMaster.status);
                    node.style.position = "absolute";
                    node.style.top = "240px";
                    node.style.zIndex = "-1";
                    node.style.transform = "rotate(320deg)";
                    node.style.color = "#c6afaf";
                    node.style.fontSize = "25px";
                    div.style.display = "flex";
                    div.style.justifyContent = "center";
                    node.appendChild(text);
                    div.appendChild(node);
                    const printDoc = printWindow.document.getElementById("invoice-box");
                    if (printDoc) {
                        printDoc.appendChild(div);
                    }
                }
                
                // Use a short delay to ensure styles are applied
                setTimeout(resolve, 100);
            });
        };
        
        // Execute the printing process as a chain of promises
        setupPrintWindow()
            .then(manipulateDom)
            .then(() => {
                return new Promise<void>((resolve) => {
                    // Force a repaint before printing
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            printWindow.print();
                            setTimeout(() => {
                                printWindow.close();
                                resolve();
                            }, 100);
                        });
                    });
                });
            })
            .catch((error) => {
                console.error("Print error:", error);
                printWindow.close();
            });
    });
 }

    
}
    showCancelOrderDialog() {
        this.dialog.open(ConfirmOrderCancelComponent, {
            width: '350px'
        }).afterClosed().subscribe(response => {
            if (response) {
                this.cancelOrder(response);
            }
        });
    }

    cancelOrder(cancellationReason) {
        const orderId = this.orderMaster._id;
        if (orderId) {
            const orderDetails = {
                orderId,
                cancellationReason
            };
            this.orderApi.cancelOrder(orderDetails).subscribe(
                (data) => {
                    this.snack.open("Order cancelled successfuly", "Ok", {
                        duration: 1500,
                    });
                    this.router.navigate(["/orders"]);
                },
                (error) => {
                    this.snack.open("Something went wrong", "Ok", {
                        duration: 1500,
                    });
                }
            );
        }
    }
    getBranchDetails() {
        this.customer
            .getBranchByCode(this.auth.decodeJwt()?.branchCode)
            .subscribe((data) => {
                this.branchDetails = data as any;
            });
    }
    guestLogin() {
        const guestLogin = this.customerList.find(
            (x) => x.mobile == "9988776655"
        );
        if (guestLogin) {
            this.mobileNumber.setValue(guestLogin);
            this.setCustomerDetails();
        }
    }
    showPreviousBill() {
        const branchCode = this.auth.decodeJwt()?.branchCode;
        if (branchCode) {
            this.orderApi
                .getOrderDetailsByCustomer(this.customerDetails._id)
                .subscribe(
                    (data) => {
                        this.dialog.open(BillViewComponent, {
                            width: "400px",
                            data,
                            disableClose: true
                        });
                    },
                    (error) => {
                        this.snack.open("Couldn't find Previous Bill", "", {
                            duration: 1500,
                        });
                    }
                );
        }
    }

    initiateOrderStatusUpdate() {
        if (this.orderStatus == this.orderMaster?.status) {
            return;
        }
        if (this.orderMaster?.status == "PAID" && this.orderStatus == "DELIVERED") {
            this.updateOrderStatus(this.orderMaster?.paymentMethod);
        } else {
            this.dialog.open(SettlementComponent, {
                width: '500px',
                data: {
                    orderNumber: this.orderNumber,
                    disablePayLater: true
                },
                position: {
                    top: "150px"
                }
            }).afterClosed().subscribe(paymentMethod => {
                this.updateOrderStatus(paymentMethod);
            });
        }
    }

    updateOrderStatus(paymentMethod) {
        if (paymentMethod) {
            this.orderApi
        .updateOrderStatus(this.orderMaster?._id, this.orderStatus, paymentMethod)
        .subscribe(
            (data) => {
              this.getOrderDetailsByOrderNumber(this.orderNumber);
              this.snack.open("Order updated successfuly", "Ok", {
                duration: 1500,
            });
            },
            (error) => {
                console.error(error);
            }
        );
        }
    }

    processSaveOrder(data) {
        const OrderMaster = (data as any)?.masterResponse;
        if (OrderMaster) {
            this.orderMaster = OrderMaster;
        }
        this.enablePrint = true;
        this.disableUpdate = true;
        this.disableSave = false;
        this.printReciept();
        this.snack.open("Order placed successfully", "Ok", { duration: 1500 });
        this.router.navigate(["/orders"]);
    }

    initiateSettlement() {
        if (this.items.orderDetails.valid) {
            this.dialog.open(SettlementComponent, {
                width: '500px',
                data: this.orderNumber,
                position: {
                    top: "150px"
                }
            }).afterClosed().subscribe(data => {
                if (data) {
                    this.saveOrder(data);
                }
            });
        } else {
            this.snack.open("complete the item details", "Ok", {
                duration: 1500,
            });
            this.disableSave = false;
        }        
    }
}
