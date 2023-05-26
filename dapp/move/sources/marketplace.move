/*
    reference: https://github.com/aptos-labs/aptos-core/blob/4d9b880fda867ec7f24e42dcdab2209590b5b61a/aptos-move/move-examples/token_objects/marketplace/sources/marketplace.move
    - A simple marketplace to trade fractional share tokens
    - TODO: Add Fee concept to the marketplace
    - TODO: should also support collection trade.
*/
module propertize_addr::marketplace {

    use aptos_framework::coin::{Self, Coin};
    use aptos_framework::object;
    use aptos_std::table::{Self, Table};
    use propertize_addr::property::{FractionalShareToken};
    use std::signer;
    use std::string::{Self, String};

    //
    // Errors
    //
    const ECOMMISSION_ZERO: u64 = 3;
    
    const ECOMMISSION_TOO_HIGH: u64 = 4;


    //
    // Structs
    //

    // Marketplace
    /*
    * Description.
    */
    struct Listing has key {
        listed_tokens: Table<address, ListedToken>,
    }

    // Listing
    /*
    * A listing for a single Token on the marketplace.
    * The marketplace will own the token until it is bought or unlisted
    */
    // TODO: should also support collection or make another Listing struct for collections?
    struct ListedToken has drop, store {  
        // only the address of fractional share token will be needed.
        token_address: address,  // TODO: should not be promped by the user
        owner_address: address, // to be updated everytime ownership is changed
        price: u64,
        // TODO: add event
    }

    // TODO: FeeConfig
    /*
    * To prevent spam and earn from each sale
    */

    //
    // Asserts
    //

    // TODO: Asserts The token is registered

    // TODO: Asserts The token is not registered

    // Asserts commission is less than 10 (randomly picked)
    inline fun assert_commission_is_less_than_limit(commission: u64) {
        assert!(commission != 0, ECOMMISSION_ZERO);
        assert!(commission < 10, ECOMMISSION_TOO_HIGH);
    }

    //
    // Initialize Function
    //
    entry fun init_listing<CoinType> (
        listing_owner: &signer,
    ) {
        // TODO: asserts the listing doesn't exist
        // Creates listing
        create_listing(
            listing_owner,
        );
    }

    fun create_listing(
        listing_owner: &signer,
        ){
        //let listing_owner_address: address = signer::address_of(listing_owner);

        // Instantiate `Listing` resource 
        let new_listing = Listing {
            listed_tokens: table::new(),
        };
        // move Marketplace resource under the marketplace owner
        move_to(listing_owner, new_listing);
    }

    //
    // Mutators
    //


    //
    // Marketplace functions
    //

    // List token for sale
    /*
    * Seller executes this function to list a token for sale
    */
    public entry fun list_token(
        token_address: address,
        owner: &signer,
        price: u64,
    ) acquires Listing {
        // TODO: asserts seller is the token owner.
        // TODO: asserts token is registered.
        // TODO: asserts token is not listed.
        // gets the seller address
        let owner_address = signer::address_of(owner);

        let listing = borrow_global_mut<Listing>(owner_address);

        let new_listed_token = ListedToken {
            token_address: token_address,
            owner_address: owner_address,
            price: price, /*should correspond to the current time*/
        };    

        // adds the new token into the registry
        table::upsert(&mut listing.listed_tokens, owner_address, new_listed_token);    
    }

    // Buy a token
    public entry fun buy_token(){}

    // Set the commission made on every sale
    /*
    * Note: This cannot be > 10 (a random number for now) 
    */ 

    //
    // View Functions
    //

    //
    // Functions
    //

    //
    // Entry Functions
    //

    //
    // Unit Testing
    //


}