import { hexStrArrToStr, toAddress } from './utils';
import type { CheckpointWriter } from '@snapshot-labs/checkpoint';

// export async function handleDeploy() {
//   // Run logic as at the time Contract was deployed.
// }

// This decodes the new_post events data and stores successfully
// decoded information in the `posts` table.
//
// See here for the original logic used to create post transactions:
// https://gist.github.com/perfectmak/417a4dab69243c517654195edf100ef9#file-index-ts
export async function handleTransfer({ block, tx, event, mysql }: Parameters<CheckpointWriter>[0]) {
  if (!event) return;

  const from = toAddress(event.data[0]);
  const to = toAddress(event.data[1]);
  const value = BigInt(event.data[2]);
  const timestamp = block.timestamp;
  const blockNumber = block.block_number;

  // transfer object matches fields of Transfer type in schema.gql
  const transfer = {
    id: `${tx.transaction_hash}`,
    from,
    to,
    value,
    tx_hash: tx.transaction_hash,
    created_at: timestamp,
    created_at_block: blockNumber
  };

  // table names are `lowercase(TypeName)s` and can be interacted with sql
  await mysql.queryAsync('INSERT IGNORE INTO transfers SET ?', [transfer]);
}
