import { hexStrArrToStr, toAddress } from './utils';
import type { CheckpointWriter } from '@snapshot-labs/checkpoint';

export async function handle_account_created({
  block,
  tx,
  rawEvent,
  mysql
}: Parameters<CheckpointWriter>[0]) {
  if (!rawEvent) return;

  const from_address = rawEvent.from_address;
  const timestamp = block.timestamp;
  const blockNumber = block.block_number;

  const account_create = {
    id: `${tx.transaction_hash}`,
    // tx_hash: tx.transaction_hash,
    from_address: from_address,
    created_at: timestamp,
    created_at_block: blockNumber
  };

  // table names are `lowercase(TypeName)s` and can be interacted with sql
  await mysql.queryAsync('INSERT IGNORE INTO account_creates SET ?', [account_create]);
}
export async function handle_account_upgraded({
  block,
  tx,
  rawEvent,
  mysql
}: Parameters<CheckpointWriter>[0]) {
  if (!rawEvent) return;
  const implementation = toAddress(rawEvent.data[0]);
  const from_address = rawEvent.from_address;
  const timestamp = block.timestamp;
  const blockNumber = block.block_number;

  // transfer object matches fields of Transfer type in schema.gql
  const account_upgrade = {
    id: `${tx.transaction_hash}`,
    // tx_hash: tx.transaction_hash,
    from_address: from_address,
    created_at: timestamp,
    created_at_block: blockNumber,
    implementation: implementation
  };

  // table names are `lowercase(TypeName)s` and can be interacted with sql
  await mysql.queryAsync('INSERT IGNORE INTO account_upgrades SET ?', [account_upgrade]);
}
