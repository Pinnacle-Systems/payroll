import { configureStore } from "@reduxjs/toolkit";
import { openTabs } from "./features";
import {
  countryMasterApi, pageMasterApi, stateMasterApi,
  cityMasterApi, departmentMasterApi, employeeCategoryMasterApi,
  finYearMasterApi, rolesMasterApi, employeeMasterApi, userMasterApi,
  branchMasterApi, companyMasterApi, pageGroupMasterApi, productBrandMasterApi, productCategoryMasterApi, productMasterApi, partyMasterApi, partyCategoryMasterApi, purchaseBillApi, styleSheetApi, stockApi, salesBillApi, purchaseReturnApi, salesReturnApi, uomMasterApi,
  productSubCategoryMasterApi,
  quotesApi,
  leadFormApi,
  projectApi,
  invoiceApi,
  OrderImportApi,
  GaugeApi,
  PaytermMasterApi,
  TaxTermMasterApi,
  TaxTemplateApi,
  TermsAndConditionsMasterApi,
  CurrencyMasterApi,
  machineMasterApi,
  sampleEntryApi,
  designationMasterApi,

} from "./services"
import projectPaymentFormApi from "./services/ProjectPaymentService";
import {
  AccessoryGroupMasterApi, AccessoryItemMasterApi, AccessoryMasterApi, ClassMasterApi,
  CuttingOrderApi, OrderApi, PoApi, SampleApi, StyleTypeMasterApi, DiaApi, GsmApi, LoopLengthApi, DesignApi,
  YarnBlendMasterApi, YarnTypeMasterApi,
  YarnMasterApi,
  LocationMasterApi,
  DirectInwardOrReturnApi, DirectCancelOrReturnApi,
  PurchaseCancelApi, CuttingDeliveryApi, LossReasonApi,
  ProcessDeliveryApi,
  ProcessMasterApi,
  ProductionDeliveryApi,
  ProductionReceiptApi,
  DispatchedApi,
  GeneralPurchaseApi, RawMaterialOpeningStockApi,
  purchaseInwardEntryApi,

} from "./uniformService";
import SizeMasterApi from "./uniformService/SizeMasterService";
import ColorMasterApi from "./uniformService/ColorMasterService";
import FabricMasterApi from "./uniformService/FabricMasterService";
import StyleMasterApi from "./uniformService/StyleMasterService";
import ItemMasterApi from "./uniformService/ItemMasterService";
import ItemTypeMasterApi from "./uniformService/ItemTypeMasterService";
import PanelMasterApi from "./uniformService/PanelMasterService";
import CuttingReceiptApi from "./uniformService/CuttingReceiptServices";
import sizeTemplateApi from "./uniformService/SizeTemplateMasterServices";
import ContentMasterApi from "./uniformService/ContentMasterServices";
import CountsMasterApi from "./uniformService/CountsMasterServices";
import PercentageApi from "./uniformService/Percentage";
import EmailApi from "./uniformService/Email.Services";
import tagTypeMasterApi from "./uniformService/TagTypeMasterServices";
import CertificateMasterApi from "./uniformService/CertificateMasterService";
import UnitOfMeasurementMasterApi from "./uniformService/UnitOfMeasurementServices";
import partyMasterNewApi from "./services/PartyMasterNewService";




const commonReducers = {
  openTabs,
  countryMaster: countryMasterApi.reducer,
  pageMaster: pageMasterApi.reducer,
  stateMaster: stateMasterApi.reducer,
  cityMaster: cityMasterApi.reducer,
  departmentMaster: departmentMasterApi.reducer,
  employeeCategoryMaster: employeeCategoryMasterApi.reducer,
  finYearMaster: finYearMasterApi.reducer,
  roleMaster: rolesMasterApi.reducer,
  userMaster: userMasterApi.reducer,
  employeeMaster: employeeMasterApi.reducer,
  branchMaster: branchMasterApi.reducer,
  companyMaster: companyMasterApi.reducer,
  pageGroupMaster: pageGroupMasterApi.reducer,
  productBrandMaster: productBrandMasterApi.reducer,
  productCategoryMaster: productCategoryMasterApi.reducer,
  productSubCategoryMaster: productSubCategoryMasterApi.reducer,
  productMaster: productMasterApi.reducer,
  partyMaster: partyMasterApi.reducer,
  partyCategoryMaster: partyCategoryMasterApi.reducer,
  purchaseBill: purchaseBillApi.reducer,
  styleSheet: styleSheetApi.reducer,
  stock: stockApi.reducer,
  salesBill: salesBillApi.reducer,
  purchaseReturn: purchaseReturnApi.reducer,
  salesReturn: salesReturnApi.reducer,
  uomMaster: uomMasterApi.reducer,
  quotes: quotesApi.reducer,
  leadForm: leadFormApi.reducer,
  orderImport: OrderImportApi.reducer,
  projectPayment: projectPaymentFormApi.reducer,
  [projectApi.reducerPath]: projectApi.reducer,
  [invoiceApi.reducerPath]: invoiceApi.reducer,
  sample: SampleApi.reducer,
  sizeMaster: SizeMasterApi.reducer,
  colorMaster: ColorMasterApi.reducer,
  fabricMaster: FabricMasterApi.reducer,
  certificateMaster: CertificateMasterApi.reducer,

  panelMaster: PanelMasterApi.reducer,
  gauge: GaugeApi.reducer,
  styleMaster: StyleMasterApi.reducer,
  itemMaster: ItemMasterApi.reducer,
  classMaster: ClassMasterApi.reducer,
  itemTypeMaster: ItemTypeMasterApi.reducer,
  styleTypeMaster: StyleTypeMasterApi.reducer,
  [OrderApi.reducerPath]: OrderApi.reducer,
  [CuttingOrderApi.reducerPath]: CuttingOrderApi.reducer,
  design: DesignApi.reducer,
  loopLength: LoopLengthApi.reducer,
  gsm: GsmApi.reducer,
  dia: DiaApi.reducer,
  po: PoApi.reducer,
  paytermMaster: PaytermMasterApi.reducer,
  taxTermMaster: TaxTermMasterApi.reducer,
  taxTemplate: TaxTemplateApi.reducer,
  accessoryGroupMaster: AccessoryGroupMasterApi.reducer,
  accessoryItemMaster: AccessoryItemMasterApi.reducer,
  accessoryMaster: AccessoryMasterApi.reducer,
  termsAndConditionsMaster: TermsAndConditionsMasterApi.reducer,
  yarnTypeMaster: YarnTypeMasterApi.reducer,
  yarnBlendMaster: YarnBlendMasterApi.reducer,
  yarnMaster: YarnMasterApi.reducer,
  locationMaster: LocationMasterApi.reducer,
  directInwardOrReturn: DirectInwardOrReturnApi.reducer,
  directCancelOrReturn: DirectCancelOrReturnApi.reducer,
  purchaseCancel: PurchaseCancelApi.reducer,
  cuttingDelivery: CuttingDeliveryApi.reducer,
  cuttingReceipt: CuttingReceiptApi.reducer,
  lossReason: LossReasonApi.reducer,
  processDelivery: ProcessDeliveryApi.reducer,
  process: ProcessMasterApi.reducer,
  productionDelivery: ProductionDeliveryApi.reducer,
  dispatched: DispatchedApi.reducer,
  generalPurchase: GeneralPurchaseApi.reducer,
  RawMaterialOpeningStock: RawMaterialOpeningStockApi.reducer,
  currencyMaster: CurrencyMasterApi.reducer,
  SizeMasterTemplate: sizeTemplateApi.reducer,
  contentMaster: ContentMasterApi.reducer,
  countsMaster: CountsMasterApi.reducer,
  machineMaster: machineMasterApi.reducer,
  percentageMaster: PercentageApi.reducer,
  Email: EmailApi.reducer,
  tagTypeMaster: tagTypeMasterApi.reducer,
  unitOfMeasurementMaster: UnitOfMeasurementMasterApi.reducer,
  [ProductionReceiptApi.reducerPath]: ProductionReceiptApi.reducer,
  [purchaseInwardEntryApi.reducerPath]: purchaseInwardEntryApi.reducer,
  [partyMasterNewApi.reducerPath]: partyMasterNewApi.reducer,
  [sampleEntryApi.reducerPath]:sampleEntryApi.reducer,
  [designationMasterApi.reducerPath]:designationMasterApi.reducer



}
const commonMiddleware = [countryMasterApi.middleware,
pageMasterApi.middleware,
stateMasterApi.middleware,
cityMasterApi.middleware,
departmentMasterApi.middleware,
employeeCategoryMasterApi.middleware,
finYearMasterApi.middleware,
rolesMasterApi.middleware,
userMasterApi.middleware,
employeeMasterApi.middleware,
branchMasterApi.middleware,
companyMasterApi.middleware,
pageGroupMasterApi.middleware,
productBrandMasterApi.middleware,
productCategoryMasterApi.middleware,
productSubCategoryMasterApi.middleware,
productMasterApi.middleware,
partyMasterApi.middleware,
partyCategoryMasterApi.middleware,
purchaseBillApi.middleware,
styleSheetApi.middleware,
stockApi.middleware,
salesBillApi.middleware,
purchaseReturnApi.middleware,
salesReturnApi.middleware,
uomMasterApi.middleware,
quotesApi.middleware,
leadFormApi.middleware,
projectApi.middleware,
invoiceApi.middleware,
projectPaymentFormApi.middleware,
OrderImportApi.middleware,
SampleApi.middleware,
SizeMasterApi.middleware,
ColorMasterApi.middleware,
StyleMasterApi.middleware,
FabricMasterApi.middleware,
CertificateMasterApi.middleware,
AccessoryGroupMasterApi.middleware,
AccessoryItemMasterApi.middleware,
AccessoryMasterApi.middleware,
PanelMasterApi.middleware,
ItemMasterApi.middleware,
ItemTypeMasterApi.middleware,
OrderApi.middleware,
CuttingOrderApi.middleware,
StyleTypeMasterApi.middleware,
ClassMasterApi.middleware,
GaugeApi.middleware,
GsmApi.middleware,
LoopLengthApi.middleware,
DiaApi.middleware,
DesignApi.middleware,
PoApi.middleware,
PaytermMasterApi.middleware,
TaxTermMasterApi.middleware,
TaxTemplateApi.middleware,

TermsAndConditionsMasterApi.middleware,
YarnTypeMasterApi.middleware,
YarnMasterApi.middleware,
YarnBlendMasterApi.middleware,
LocationMasterApi.middleware,
DirectInwardOrReturnApi.middleware,
DirectCancelOrReturnApi.middleware,
PurchaseCancelApi.middleware,
CuttingDeliveryApi.middleware,
CuttingReceiptApi.middleware,
LossReasonApi.middleware,
ProcessDeliveryApi.middleware,
ProcessMasterApi.middleware,
ProductionDeliveryApi.middleware,
ProductionReceiptApi.middleware,
DispatchedApi.middleware,
GeneralPurchaseApi.middleware,
RawMaterialOpeningStockApi.middleware,
CurrencyMasterApi.middleware,
sizeTemplateApi.middleware,
ContentMasterApi.middleware,
CountsMasterApi.middleware,
machineMasterApi.middleware,
PercentageApi.middleware,
EmailApi.middleware,
tagTypeMasterApi.middleware,
UnitOfMeasurementMasterApi.middleware,
purchaseInwardEntryApi.middleware,
partyMasterNewApi.middleware,
sampleEntryApi.middleware,
designationMasterApi.middleware
];




const store = configureStore({
  reducer: {
    ...commonReducers,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    }).concat(commonMiddleware),
});

export default store;