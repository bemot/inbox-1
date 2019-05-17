# Ian Hecker
# Tool to quickly calculate ethereum pricing of writing to smart contract storage

print('please enter the following constants for computation:\n' 
    + '-----------------------------------------------------')
ethereum_market_price_USD = float(input('USD per Ether, as a float number: '))
amount_of_gas_used        = float(input('Amount of gas consumed, as an int:'))
gas_price                 = float(input('Gwei per gas unit, as an int:     '))

# should be 1 billion gwei, or 10^9
gwei_per_ether = 1000000000.0

USD_per_gwei = ethereum_market_price_USD / gwei_per_ether
total_gwei_owed = gas_price * amount_of_gas_used

total_in_USD = USD_per_gwei * total_gwei_owed

print('\nThe total cost in $USD is: $%s' % total_in_USD)