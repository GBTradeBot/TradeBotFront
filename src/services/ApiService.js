import makeApolloClient from './utils/makeApolloClient';
import gql from 'graphql-tag';

const GET_ACCOUNTS = gql`
  query GetAccounts {
    accounts {
      id
      email
      activity_status
      balance
      gauth
      should_run
      proxy {
        host
        port
      }
    }
  }
`;

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
        gauth: $gAuthSecret
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

const SUBSCRIBE_ACCOUNTS = gql`
  subscription SubscribeAccounts {
    accounts {
      id
      email
      activity_status
      balance
      gauth
      should_run
      proxy {
        host
        port
      }
    }
  }
`;

const UPDATE_ACCOUNT = gql`
  mutation UpdateAccount(
    $email: String
    $backups: String
    $gAuthSecret: String
    $notes: String
    $password: String
    $platform: String
    $profileId: String
    $scheduler_config: String
    $shouldRun: Boolean
    $strategy_config: String
  ) {
    update_Account(
      where: { email: { _eq: $email } }
      _set: {
        email: $email
        backups: $backups
        gAuthSecret: $gAuthSecret
        notes: $notes
        password: $password
        platform: $platform
        profileId: $profileId
        scheduler_config: $scheduler_config
        shouldRun: $shouldRun
        strategy_config: $strategy_config
      }
    ) {
      returning {
        email
        backups
        gAuthSecret
        notes
        password
        platform
        profileId
        scheduler_config
        shouldRun
        strategy_config
      }
    }
  }
`;

const CHANGE_ACCOUNT_STATUS = gql`
  mutation UpdateAccountStatus($email: String, $activityStatus: String) {
    update_Account(
      where: { email: { _eq: $email } }
      _set: { activityStatus: $activityStatus }
    ) {
      returning {
        email
        activityStatus
        backups
        gAuthSecret
        notes
        password
        platform
        profileId
        scheduler_config
        shouldRun
        strategy_config
      }
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

class ApiService {
  client;

  constructor(client) {
    this.client = client;
  }

  getAccounts = async () => {
    try {
      const result = await this.client.query({
        query: GET_ACCOUNTS,
      });
      return result.data.accounts;
    } catch (err) {
      console.log('ERROR:', err);
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
      console.log('ERROR:', err);
    }
  };

  createAccount = async (data) => {
    try {
      const proxies = await this.getProxiesByHostPort(
        data.proxyIp,
        data.proxyPort
      );
      console.log(proxies);
      console.log(data);
      if (proxies.length > 0) {
        const result = await this.client.mutate({
          mutation: CONNECT_ACCOUNT_TO_PROXY,
          variables: {
            email: data.email,
            password: data.password,
            gauth: data.gAuthSecret,
            proxyId: proxies[0].id,
          },
        });
        console.log(result);
        return result.data.insert_accounts;
      } else {
        const result = await this.client.mutate({
          mutation: CREATE_ACCOUNT_WITH_PROXY,
          variables: {
            email: data.email,
            password: data.password,
            gauth: data.gAuthSecret,
            proxyIp: data.proxyIp,
            proxyPort: data.proxyPort,
            proxyLogin: data.proxyLogin,
            proxyPass: data.proxyPass,
          },
        });
        console.log(result);
        return result.data.insert_accounts;
      }
    } catch (err) {
      console.log('ERROR:', err);
    }
  };

  updateAccount = async (data) => {
    try {
      const result = await this.client.mutate({
        mutation: UPDATE_ACCOUNT,
        variables: {
          email: data.email,
          password: data.password,
          gAuthSecret: data.gAuthSecret,
          backups: data.backups,
          notes: data.notes,
          platform: data.platform,
          profileId: data.profileId,
          shouldRun: data.shouldRun,
          scheduler_config: data.scheduler_config,
          strategy_config: data.strategy_config,
        },
      });
      console.log(result);
      return result.data.Account;
    } catch (err) {
      console.log('ERROR:', err);
    }
  };

  updateAccountStatus = async (email, status) => {
    try {
      const result = await this.client.mutate({
        mutation: CHANGE_ACCOUNT_STATUS,
        variables: {
          email,
          activityStatus: status,
        },
      });
      console.log(result);
      return result.data.Account;
    } catch (err) {
      console.log('ERROR:', err);
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
      return result.data.Account;
    } catch (err) {
      console.log('ERROR:', err);
    }
  };
}

const client = makeApolloClient(
  process.env.REACT_APP_API_URL,
  process.env.REACT_APP_API_WS_URL
);
const apiService = new ApiService(client);
export { client, apiService, SUBSCRIBE_ACCOUNTS };
