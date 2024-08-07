import makeApolloClient from './utils/makeApolloClient';
import gql from 'graphql-tag';

const GET_ACCOUNTS = gql`
  query GetAccounts {
    accounts {
      id
      email
      activity_status
      freezed_balance
      available_balance
      gauth
      should_run
      platform
      password
      strategy_name
      group
      origin
      proxy_id
      account_owner
      proxy {
        host
        port
      }
      objectives_progress {
        buy_now
        list
      }
      # accounts_challenges {
      #   sbc_name
      #   challenge_index
      #   solved_at
      # }
      scheduler_account_info {
        block_reason
        blocked_at
        service_name
        scheduler_config {
          id
        }
      }
      ban_analytics_info {
        ban_alalytics_config {
          id
        }
      }
      general_account_id
      # general_account {
      #   id
      #   solutions {
      #     is_solved
      #     expires_at
      #     challenge_index
      #     sbc_name
      #   }
      # }
      workshift_id
    }
  }
`;

const GET_WORKER_SERVICES = gql`
  query GetWorkerServices {
    worker_services {
      service_name
    }
  }
`

const UPDATE_ACCOUNT = gql`
  mutation MyMutation7($id: Int!, $_set: accounts_set_input!) {
    update_accounts_by_pk(pk_columns: { id: $id }, _set: $_set) {
      id
    }
  }
`;

const CREATE_NEW_PROXY = gql`
  mutation CreateProxy(
    $object: proxies_insert_input!
  ) {
    insert_proxies_one(
      object: $object
    ) {
      id
      host
      port
    }
  }
`

const CREATE_NEW_GENERAL_ACC = gql`
  mutation CreateGeneralAcc(
    $email: String
  ) {
    insert_general_accounts_one(
      object: {email: $email}
    ) {
      id
    }
  }
`

const GET_GENERAL_ACC_BY_EMAIL = gql`
  query GetGeneralAccByEmail(
    $email: String
  ) {
    general_accounts(where: {email: {_eq: $email}}) {
      id
    }
  }
`

const GET_EXISTING_ACCOUNT_OWNER = gql`
  query GetMulingCreds(
    $account_owner: String
  ) {
    mulling_creds(where: {account_owner: {_eq: $account_owner}}) {
      account_owner
    }
  }
`

const CREATE_NEW_MULING_CREDS = gql`
  mutation CreateMulingCreds(
    $account_owner: String
  ) {
    insert_mulling_creds_one(
      object: {account_owner: $account_owner}
    ) {
      account_owner
    }
  }
`

const CONNECT_ACCOUNT_TO_PROXY = gql`
  mutation CreateAccount(
    $email: String
    $password: String
    $gauth: String
    $proxyId: Int
  ) {
    insert_accounts(
      objects: {
        email: $email
        password: $password
        gauth: $gauth
        proxy_id: $proxyId
      }
    ) {
      returning {
        email
        gauth
        password
      }
    }
  }
`;

const GET_PROXIES_BY_HOST_PORT = gql`
  query GetProxiesByHostPort($host: String, $port: String) {
    proxies(where: { _and: { host: { _eq: $host }, port: { _eq: $port } } }) {
      id
    }
  }
`;

const GET_PROXY_BY_PK = gql`
  query ProxyByPk($id: Int!) {
    proxies_by_pk(id: $id) {
      id
    }
  }
`;

const CREATE_ACCOUNT_WITH_PROXY = gql`
  mutation CreateAccount(
    $email: String
    $password: String
    $gauth: String
    $proxyIp: String
    $proxyPort: String
    $proxyLogin: String
    $proxyPass: String
  ) {
    insert_accounts(
      objects: {
        email: $email
        password: $password
        gauth: $gauth
        proxy: {
          data: {
            host: $proxyIp
            port: $proxyPort
            username: $proxyLogin
            password: $proxyPass
          }
        }
      }
    ) {
      returning {
        email
        gauth
        password
        proxy {
          id
          host
          port
          username
          password
        }
      }
    }
  }
`;

const GET_ALL_ACCOUNTS = gql`
  query GetAllAccounts {
    accounts {
      id
      email
    },
  }
`

const GET_ALL_PROXIES = gql`
  query GetAllProxies {
    proxies {
      id
      host
      port
    },
  }
`

const CREATE_ACCOUNT_FOR_EXCHANGE = gql`
  mutation CreateAccount(
    $object: accounts_insert_input!
  ) {
    insert_accounts_one(object: $object) {
      id
    }
  }
`

const SUBSCRIBE_ACCOUNTS = gql`
  subscription SubscribeAccounts {
    accounts {
      id
      email
      activity_status
      available_balance
      freezed_balance
      gauth
      should_run
      platform
      strategy_name
      password
      group
      proxy {
        host
        port
      }
      objectives_progress {
        buy_now
        list
      }
      accounts_challenges {
        sbc_name
        challenge_index
        solved_at
      }
      workshift_id
    }
  }
`;

const DELETE_ACCOUNT = gql`
  mutation DeleteAccountByPk($id: Int!) {
    delete_accounts_by_pk(id: $id) {
      id
    }
  }
`;

const DELETE_ACCOUNTS = gql`
  mutation DeleteAccounts($ids: [Int!]!) {
    delete_accounts(where: { id: { _in: $ids } }) {
      affected_rows
    }
  }
`;

const SET_STRATEGY_NAME = gql`
  mutation SetStrategyName($ids: [Int!]!, $strategy_name: String) {
    update_accounts_many(
      updates: {
        where: { id: { _in: $ids } }
        _set: { strategy_name: $strategy_name }
      }
    ) {
      affected_rows
    }
  }
`;

const SET_BAN_CONFIG = gql`
  mutation UpdateBanAnalyticsId($ids: [Int!]!, $ban_analytics_config_id: Int) {
    update_ban_analytics_info(
      where: { account_id: { _in: $ids } }
      _set: { ban_analytics_config_id: $ban_analytics_config_id }
    ) {
      affected_rows
    }
  }
`;

const SET_SCHEDULER_CONFIG = gql`
  mutation UpdateBanAnalyticsId($ids: [Int!]!, $config_id: Int) {
    update_scheduler_account_info(
      where: { account_id: { _in: $ids } }
      _set: { config_id: $config_id }
    ) {
      affected_rows
    }
  }
`;

const SET_SERVICE_NAME = gql`
  mutation UpdateBanAnalyticsId($ids: [Int!]!, $service_name: String) {
    update_scheduler_account_info(
      where: { account_id: { _in: $ids } }
      _set: { service_name: $service_name }
    ) {
      affected_rows
    }
  }
`;

const GET_HISTORY_ITEMS = gql`
  query GetHistoryItems($ids: [Int!]!) {
    history_items(where: { account_id: { _in: $ids } }) {
      account_id
      actual_end
      actual_start
      captcha_failed_count
      captcha_solved_count
      minutes_active
      minutes_paused
      requests_made
      scheduled_end
      scheduled_start
      strategy_name
      id
      sbc_submits
    }
  }
`;

const GET_HISTORY_ITEMS_BY_TIME = gql`
  query GetHistoryItems($from: timestamp, $to: timestamp, $ids: [Int!]!) {
    history_items(
      where: {
        _or: [
          {
            scheduled_end: { _is_null: false, _gt: $from }
            scheduled_start: { _is_null: false, _lt: $to }
            account_id: { _in: $ids }
          }
          {
            account: { activity_status: { _in: [ON, PAUSED] } }
            scheduled_start: { _gt: $from }
            account_id: { _in: $ids }
          }
        ]
      }
    ) {
      account_id
      actual_end
      actual_start
      scheduled_end
      scheduled_start
      requests_made
      minutes_active
      strategy_name
      sbc_submits
    }
  }
`;

const GET_SCHEDULER_ACC_INFO = gql`
  query GetSchedulerAccInfo($ids: [Int!]!) {
    scheduler_account_info(where: { account_id: { _in: $ids } }) {
      account_id
      config_id
      id
    }
  }
`;

class ApiService {
  client;

  constructor(client) {
    this.client = client;
  }

  refresh = async () => {
    const client = makeApolloClient(
      process.env.REACT_APP_API_URL,
      process.env.REACT_APP_API_WS_URL,
      localStorage.getItem('adminSecret')
    );
    this.client = client;
  };

  getAccounts = async () => {
    try {
      const result = await this.client.query({
        query: GET_ACCOUNTS,
      });
      return result.data.accounts;
    } catch (err) {
      console.error('ERROR getAccounts:', err);
    }
  };

  getProxiesByHostPort = async (host, port) => {
    try {
      const result = await this.client.query({
        query: GET_PROXIES_BY_HOST_PORT,
        variables: {
          host,
          port,
        },
      });
      return result.data.proxies;
    } catch (err) {
      console.error('ERROR getProxiesByHostPort:', err);
    }
  };

  getProxyByPk = async (id) => {
    try {
      const result = await this.client.query({
        query: GET_PROXY_BY_PK,
        variables: {
          id,
        },
      });
      return result.data.proxies_by_pk;
    } catch (err) {
      console.error('ERROR getProxyByPk:', err);
    }
  };

  createAccount = async (data) => {
    try {
      if (data.proxyId) {
        let proxy = await this.getProxyByPk(data.proxyId);
        if (proxy) {
          const result = await this.client.mutate({
            mutation: CONNECT_ACCOUNT_TO_PROXY,
            variables: {
              email: data.email,
              password: data.password,
              gauth: data.gauth,
              proxyId: data.proxyId,
            },
          });
          console.log(result);
          return result.data.insert_accounts;
        } else {
          throw new Error('no such proxy id');
        }
      } else {
        const proxies_ids = (
          await this.getProxiesByHostPort(data.proxyLogin, data.proxyPass)
        )?.data?.proxies?.map(({ id }) => id);
        let result;
        if (proxies_ids && proxies_ids.length > 0) {
          result = await this.client.mutate({
            mutation: CREATE_ACCOUNT_WITH_PROXY,
            variables: {
              email: data.email,
              password: data.password,
              gauth: data.gauth,
              proxyId: proxies_ids[0],
            },
          });
        } else {
          result = await this.client.mutate({
            mutation: CREATE_ACCOUNT_WITH_PROXY,
            variables: {
              email: data.email,
              password: data.password,
              gauth: data.gauth,
              proxyIp: data.proxyIp,
              proxyPort: data.proxyPort,
              proxyLogin: data.proxyLogin,
              proxyPass: data.proxyPass,
            },
          });
        }

        console.log(result);
        return result.data.insert_accounts;
      }
    } catch (err) {
      console.error('ERROR createAccount:', err);
      console.error({
        email: data.email,
        password: data.password,
        gauth: data.gauth,
        proxyIp: data.proxyIp,
        proxyPort: data.proxyPort,
        proxyLogin: data.proxyLogin,
        proxyPass: data.proxyPass,
      });
    }
  };

  updateAccount = async (account) => {
    try {
      delete account.__typename;
      delete account.proxy;
      delete account.requests;
      delete account.minutes_active;
      delete account.available_balance;
      delete account.freezed_balance;
      delete account.scheduler_account_info;
      delete account.ban_analytics_info;
      delete account.general_account;
      delete account.service_name;
      const result = await this.client.mutate({
        mutation: UPDATE_ACCOUNT,
        variables: {
          id: account.id,
          _set: account,
        },
      });
      console.log(result);
    } catch (err) {
      console.error('ERROR updateAccount:', err);
    }
  };

  deleteAccount = async (id) => {
    try {
      const result = await this.client.mutate({
        mutation: DELETE_ACCOUNT,
        variables: {
          id,
        },
      });
      console.log(result);
    } catch (err) {
      console.error('ERROR deleteAccount:', err);
    }
  };

  deleteAccounts = async (ids) => {
    try {
      const result = await this.client.mutate({
        mutation: DELETE_ACCOUNTS,
        variables: {
          ids,
        },
      });
      console.log(result);
    } catch (err) {
      console.error('ERROR deleteAccounts:', err);
    }
  };

  setStrategyName = async (ids, strategy_name) => {
    try {
      const result = await this.client.mutate({
        mutation: SET_STRATEGY_NAME,
        variables: {
          ids,
          strategy_name,
        },
      });
      console.log(result);
    } catch (err) {
      console.error('ERROR setStrategyName:', err);
    }
  };

  setBanConfig = async (ids, ban_analytics_config_id) => {
    try {
      const result = await this.client.mutate({
        mutation: SET_BAN_CONFIG,
        variables: {
          ids,
          ban_analytics_config_id,
        },
      });
      console.log(result);
    } catch (err) {
      console.error('ERROR setBanConfig:', err);
    }
  };

  setSchedulerConfig = async (ids, config_id) => {
    try {
      const result = await this.client.mutate({
        mutation: SET_SCHEDULER_CONFIG,
        variables: {
          ids,
          config_id,
        },
      });
      console.log(result);
    } catch (err) {
      console.error('ERROR setSchedulerConfig:', err);
    }
  };

  setServiceName = async (ids, service_name) => {
    try {
      const result = await this.client.mutate({
        mutation: SET_SERVICE_NAME,
        variables: {
          ids,
          service_name,
        },
      });
      console.log(result);
    } catch (err) {
      console.error('ERROR setServiceName:', err);
    }
  };

  getHistoryItems = async (ids) => {
    try {
      const result = await this.client.query({
        query: GET_HISTORY_ITEMS,
        variables: {
          ids,
        },
      });
      return result.data.history_items;
    } catch (err) {
      console.error('ERROR getHistoryItems:', err);
    }
  };

  getActiveServices = async () => {
    try {
      const result = await this.client.query({
        query: GET_WORKER_SERVICES,
      });
      return result.data.worker_services;
    } catch (err) {
      console.error('ERROR getActiveServices:', err);
    }
  };

  getSchedulerInfo = async (ids) => {
    try {
      const result = await this.client.query({
        query: GET_SCHEDULER_ACC_INFO,
        variables: {
          ids,
        },
      });
      return result.data.scheduler_account_info;
    } catch (err) {
      console.error('ERROR getSchedulerInfo:', err);
    }
  };

  getHistoryItemsByTime = async (from, to, ids) => {
    try {
      console.log(from.toISOString());
      console.log(to.toISOString());
      const result = await this.client.query({
        query: GET_HISTORY_ITEMS_BY_TIME,
        variables: {
          from: from.toISOString(),
          to: to.toISOString(),
          ids: ids,
        },
      });

      return result.data.history_items || [];
    } catch (err) {
      console.log('ERROR getHistoryItems:', err);
      return [];
    }
  };

  getAllAccounts = async () => {
    try {
      const result = await this.client.query({
        query: GET_ALL_ACCOUNTS
      });

      return result.data.accounts || [];
    } catch (err) {
      console.log('ERROR getAllAccounts:', err);
      return [];
    }
  };

  getAllProxies = async () => {
    try {
      const result = await this.client.query({
        query: GET_ALL_PROXIES
      });

      return result.data.proxies || [];
    } catch (err) {
      console.log('ERROR getAllProxies:', err);
      return [];
    }
  };

  createNewProxy = async (object) => {
    try {
      const result = await this.client.mutate({
        mutation: CREATE_NEW_PROXY,
        variables: {
          object
        },
      });
      console.log(result);

      return result.data.insert_proxies_one;
    } catch (err) {
      console.error('ERROR createNewProxy:', err);
    }
  };

  getExistingGeneralAcc = async(email) => {
    try {
      const result = await this.client.query({
        query: GET_GENERAL_ACC_BY_EMAIL,
        variables: {
          email
        },
      });
      console.log(result);

      return result.data.general_accounts || [];
    } catch (err) {
      console.error('ERROR getExistingGeneralAcc:', err);
    }
  }

  createGeneralAccount = async (email) => {
    try {
      const result = await this.client.mutate({
        mutation: CREATE_NEW_GENERAL_ACC,
        variables: {
          email
        },
      });
      console.log(result);

      return result.data.insert_general_accounts_one;
    } catch (err) {
      console.error('ERROR createGeneralAccount:', err);
    }
  };

  getExistingMullingCreds = async(account_owner) => {
    try {
      const result = await this.client.query({
        query: GET_EXISTING_ACCOUNT_OWNER,
        variables: {
          account_owner
        },
      });
      console.log(result);

      return result.data.mulling_creds || [];
    } catch (err) {
      console.error('ERROR getExistingMullingCreds:', err);
    }
  }

  createMullingCreds = async (account_owner) => {
    try {
      const result = await this.client.mutate({
        mutation: CREATE_NEW_MULING_CREDS,
        variables: {
          account_owner
        },
      });
      console.log(result);

      return result.data.insert_mulling_creds_one;
    } catch (err) {
      console.error('ERROR createMullingCreds:', err);
    }
  };

  createAccountForExchange = async (object) => {
    try {
      const result = await this.client.mutate({
        mutation: CREATE_ACCOUNT_FOR_EXCHANGE,
        variables: {
          object
        },
      });
      console.log(result);

      return result.data.insert_accounts_one;
    } catch (err) {
      console.error('ERROR createAccountForExchange:', err);
    }
  };
}

const client = makeApolloClient(
  process.env.REACT_APP_API_URL,
  process.env.REACT_APP_API_WS_URL,
  localStorage.getItem('adminSecret')
);
const apiService = new ApiService(client);
export { client, apiService, SUBSCRIBE_ACCOUNTS };
