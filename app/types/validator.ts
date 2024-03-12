export type Validator = {
  address: string;
  pub_key: {
    type: string;
    value: string;
  };
  voting_power: string;
  proposer_priority: string;
};