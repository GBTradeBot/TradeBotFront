const LOCALE_VALUE = 'en';
import { balanceToNumber } from './accountToBanned';
import operateSolvedChallenges from './operateSolvedChalenges';

const columnDefsAccounts = [
  {
    field: 'id',
    headerName: 'ID',
    filter: 'agNumberColumnFilter',
    editable: true,
    enableRowGroup: true,
    checkboxSelection: true,
    headerCheckboxSelection: true,
    headerCheckboxSelectionFilteredOnly: true,
    width: 100,
    maxWidth: 100,
  },
  {
    field: 'email',
    headerName: 'Email',
    filter: 'agTextColumnFilter',
    editable: true,
    enableRowGroup: true,
    valueGetter: (params) => {
      return params.data.email;
    },
    valueSetter: (params) => {
      var newVal = params.newValue;
      var valueChanged = params.data.email !== newVal;
      if (valueChanged) {
        params.data.email = newVal;
      }
      return valueChanged;
    },
  },
  {
    field: 'activity_status',
    headerName: 'Status',
    filter: 'agTextColumnFilter',
    editable: true,
    enableRowGroup: true,
    valueGetter: (params) => {
      return params.data.activity_status;
    },
    valueSetter: (params) => {
      var newVal = params.newValue;
      var valueChanged = params.data.activity_status !== newVal;
      if (valueChanged) {
        params.data.activity_status = newVal;
      }
      return valueChanged;
    },
    width: 90,
    maxWidth: 90,
  },
  {
    field: 'scheduler_account_info.block_reason',
    headerName: 'Reason',
    editable: true,
    enableRowGroup: false,
    width: 90,
    maxWidth: 450,
  },
  {
    field: 'should_run',
    headerName: 'Should run',
    editable: true,
    enableRowGroup: true,
    cellRenderer: (params) => {
      return params.value.toString();
    },
    width: 90,
    maxWidth: 90,
  },
  {
    headerName: 'Freezed',
    filter: 'agNumberColumnFilter',
    editable: true,
    enableRowGroup: true,
    valueGetter: function sumField(params) {
      return balanceToNumber(params.data.freezed_balance);
    },
    valueFormatter: (param) =>
      balanceToNumber(param.data.freezed_balance).toLocaleString(LOCALE_VALUE),
    width: 110,
    maxWidth: 110,
  },
  {
    headerName: 'Available',
    filter: 'agNumberColumnFilter',
    editable: true,
    enableRowGroup: true,
    valueGetter: function sumField(params) {
      return balanceToNumber(params.data.available_balance);
    },
    valueFormatter: (param) =>
      balanceToNumber(param.data.available_balance).toLocaleString(
        LOCALE_VALUE
      ),
    width: 110,
    maxWidth: 110,
  },
  {
    headerName: 'Total',
    valueGetter: function sumField(params) {
      return (
        balanceToNumber(params.data.freezed_balance) +
        balanceToNumber(params.data.available_balance)
      );
    },
    filter: 'agNumberColumnFilter',
    editable: true,
    enableRowGroup: true,
    valueFormatter: (param) =>
      (
        balanceToNumber(param.data.freezed_balance) +
        balanceToNumber(param.data.available_balance)
      ).toLocaleString(LOCALE_VALUE),
    width: 100,
    maxWidth: 100,
  },
  {
    field: 'proxy.host',
    headerName: 'Proxy ip',
    filter: 'agTextColumnFilter',
    editable: true,
    hide: true,
    enableRowGroup: true,
  },
  {
    field: 'proxy.port',
    headerName: 'Port',
    filter: 'agNumberColumnFilter',
    editable: true,
    hide: true,
    enableRowGroup: false,
    width: 90,
    maxWidth: 90,
  },
  {
    field: 'strategy_name',
    headerName: 'Strategy',
    editable: true,
    enableRowGroup: true,
  },
  {
    field: 'origin',
    headerName: 'Origin',
    editable: true,
    enableRowGroup: true,
  },
  {
    field: 'group',
    headerName: 'Group',
    editable: true,
    hide: true,
    enableRowGroup: true,
  },
  {
    valueGetter: function sumField(params) {
      return params.data.objectives_progress
        ? params.data.objectives_progress.list
        : 0;
    },
    headerName: 'List',
    filter: 'agNumberColumnFilter',
    suppressToolPanel: true,
    editable: true,
    hide: true,
    enableRowGroup: true,
    width: 80,
    maxWidth: 80,
  },
  {
    valueGetter: function sumField(params) {
      return params.data.objectives_progress
        ? params.data.objectives_progress.buy_now
        : 0;
    },
    headerName: 'Buy now',
    filter: 'agNumberColumnFilter',
    suppressToolPanel: true,
    editable: true,
    hide: true,
    enableRowGroup: true,
    width: 110,
    maxWidth: 110,
  },
  {
    field: 'workshift_id',
    headerName: 'Workshift',
    editable: true,
    suppressToolPanel: true,
    enableRowGroup: true,
  },
  // {
  //   field: 'serverId',
  //   headerName: 'Server Id',
  //   suppressToolPanel: true,
  //   enableRowGroup: true,
  // },
  {
    field: 'requests',
    headerName: 'Requests',
    filter: 'agNumberColumnFilter',
    suppressToolPanel: true,
    enableRowGroup: true,
  },
  {
    field: 'minutes_active',
    headerName: 'Minutes',
    filter: 'agNumberColumnFilter',
    suppressToolPanel: true,
    enableRowGroup: true,
  },
  {
    valueGetter: function sumField(params) {
      return operateSolvedChallenges(params.data.accounts_challenges);
    },
    headerName: 'Challenges',
    filter: 'agTextColumnFilter',
    suppressToolPanel: true,
    enableRowGroup: true,
  },
];

export default columnDefsAccounts;
