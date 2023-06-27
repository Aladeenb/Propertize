# Propertize

A prototype for managing real estate with Aptos as infrastructure.

## Writeup
Investing in real estate can be challenging because it typically requires a significant amount of money to enter the industry. The average prices of real estate properties start at six figures, making it extremely difficult for people who fall into categories such as fresh graduates, low-income earners, and those with average incomes to participate in the industry. Unfortunately, these groups represent the majority of the population and face significant barriers when it comes to accessing real estate investments.

Propertize introduces an innovative solution that opens up opportunities for people to participate in the real estate market. It enables properties to be divided into smaller units and sold based on their valuation. This fractional ownership model significantly lowers the entry barrier for individuals looking to invest in real estate. By breaking down the ownership of a property into smaller, more affordable units, Propertize makes it accessible for a broader range of people, including those who would typically find it challenging to enter the industry. This new approach democratizes real estate investment, providing individuals with a remarkable opportunity to participate and benefit from the potential returns of the property market.

Moreover, Propertize offers an additional advantage to real estate owners facing financial difficulties. Rather than being compelled to sell their entire property when in dire straits, they can now choose to sell fractional shares of it. This approach grants them access to immediate liquidity by selling only a portion of their property while retaining ownership of the remaining shares.

> The approach can be similar to how company stocks work.

**Use Case Example**
- Alice has a property worth 500k$ mints a fractional share that is equivalent to 1%. 
- This fractional share worths 5k$, affordable for broader range of investors, like "Bob".
- Bob buys this share.
- Bob is now a part of a DAO that owns this property.
- Based on how much of % owned, the DAO participants have different roles and privilges e.g:
    - 0.1% - 10%: only yields earned from the property (such as renting)
    - 10.1% - 30%: yields + decision making votes
    - equal or greater than 30.1%: idk yet but you get the idea.

The main focus for now is to implement the follwoing functionalties:
 - Property `creating` and Fractional share token `minting`
 - Fractional share token `registering` (regulations layer)
 - Fractional share token `ownership transfer` (no sale)
 - Fractional share token `sale` via the marketplace
