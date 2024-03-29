import requests
import json

graph_url = 'http://localhost:3000/'

def submit_query(query: str) -> dict:
    request = requests.post(graph_url, "", json={"query": query})
    if request.status_code != 200:
        raise Exception(f"Query failed. Return code is {request.status_code}\n{query}")

    result = request.json()

    return result

def query_account_creates():
    account_creates = []
    offset = 0
    chunk_size = 1000
    while True:
        query = """
          {
            account_creates(
                first: %d, 
                skip: %d,
                orderBy: created_at_block,
                orderDirection: asc
            ) {
                id
                from_address
                created_at
                created_at_block
            }
          }
          """ % (
            chunk_size,
            offset,
        )
        result = submit_query(query)
        account_create_records = result["data"]["account_creates"]
        if len(account_create_records) == 0:
            break
        account_creates+=account_create_records

        offset += chunk_size
    last_query_block = account_creates[-1]['created_at_block'] - 1
    with open(f'data/account_creates_up_to_block_{last_query_block}.json', 'w') as f:
        json.dump({"account_creates":account_creates}, f)
    
    # return account_creates

def query_account_upgrades():
    account_upgrades = []
    offset = 0
    chunk_size = 1000
    while True:
        query = """
          {
            account_upgrades(
                first: %d, 
                skip: %d,
                orderBy: created_at_block,
                orderDirection: asc
            ) {
                id
                from_address
                created_at
                created_at_block
                implementation
            }
          }
          """ % (
            chunk_size,
            offset,
        )
        result = submit_query(query)
        account_upgrade_records = result["data"]["account_upgrades"]
        if len(account_upgrade_records) == 0:
            break
        account_upgrades+=account_upgrade_records

        offset += chunk_size
    last_query_block = account_upgrades[-1]['created_at_block'] - 1
    with open(f'data/account_upgrades_up_to_block_{last_query_block}.json', 'w') as f:
        json.dump({"account_upgrades":account_upgrades}, f)
    # return account_upgrades