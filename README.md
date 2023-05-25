# Propertize

A prototype for managing real estate with Aptos as infrastructure.

## Writeup
The problem: Investing in real estate can be challenging because it typically requires a significant amount of money to enter the industry. The average prices of real estate properties start at six figures, making it extremely difficult for people who fall into categories such as fresh graduates, low-income earners, and those with average incomes to participate in the industry. Unfortunately, these groups represent the majority of the population and face significant barriers when it comes to accessing real estate investments.

Propertize introduces an innovative solution that opens up opportunities for people to participate in the real estate market. It enables properties to be divided into smaller units and sold based on their valuation. This fractional ownership model significantly lowers the entry barrier for individuals looking to invest in real estate. By breaking down the ownership of a property into smaller, more affordable units, Propertize makes it accessible for a broader range of people, including those who would typically find it challenging to enter the industry. This new approach democratizes real estate investment, providing individuals with a remarkable opportunity to participate and benefit from the potential returns of the property market.

**Use Case Example**
- Alice has a property worth 500k$ has a fractional share that is equivalent to 1%. 
- This fractional share worths 5k$, affordable price for everyone.
- Bob buys this share.
- Bob is now a part of a DAO that owns this property.
- Based on how much of % owned, the DAO participants have different privilges e.g:
    - 0.1% - 10%: only yields earned from the property
    - 10.1% - 30%: yields + decision making votes
    - you get the idea.

The main focus for now is to implement the main functionalties:
 - Property creating and Fractional share token minting 
 - Fractional share token registering (regulations layer)
 - Fractional share token ownership transfer (no sale)
 - Fractional share token sale via marketplace

> Almost similar to how buying company stocks work.

Below is what was done so far:
### Modules
#### Property
- `Property` is a collection of `fractionalShare` tokens 
- `FractionalShare` tokens represent fractional shares of the property.
- Only the collection owner can mint/burn fractionalShare tokens.
- `FractionalShare` tokens are transferable.
- `FractionalShare` tokens have custom attribute called `OwnershipShare`.
- `OwnershipShare` represents the percentage of Property ownership 
belongs to the `FractionalShare`. And it is correlated with the collection `supply`

##### TODO
- The owner of the collection is the one who should be able 
to mint/burn tokens. Not the creator. 

- Other FractionalShare attributes to consider:
    - Size: size in the property that belongs to FractionalShare.
    - Valuation: The estimated value of the FractionalShare.
    - Governance and voting rights?
    - History: Historical data of the FractionalShare.
    - Levels/Badges: Defines how much of custody the FractionalShare represents.
- `mint`/`burn` Fractional Share tokens must not be **"direct"**. 
It won't be convinient for the owners of Fractional Share to have their tokens burnt without their consent. A protection layer have to be implemented.
> DAO implementation is one solution for that.

##### Questions
- What is internal collection? and how to make use of it?

-----------------------------------------------------------------

## Overview
### Modules
- `Property` module is based on object token model. (used [ambassador](https://github.com/aptos-labs/aptos-core/tree/main/aptos-move/move-examples/token_objects/ambassador) as a reference). Only one object can be set for now, `living area`.
- `Registry` module is a list containing the token address as well as the owner's. You can think of it as a layer to get the property "approved" by certain entities, whether it's a government or anything else. 
- The `Marketplace` module will contain the functionalities for swapping ownership for coins. The marketplace will feature only buying and selling for now, auctions and leasing will come next.

### mint and sell scenario: 
1. The user will "mint" the token.
2. Once minted, the user will have to manually store it in the registry (this step should be automatic).
3. Once the token is in the registry, the user can decide whether to list it for sale or not. If so, the token will be added to the marketplace.
4. The token is sold, its ownership will be transferred to the buyer (swap coins for token).