/*
    After creating the Property collection, and minting its shares tokens 
    (fractionalShares), they will have to be registered. The `registry` module
    is a layer dedicated to regulations where all the necessary steps to tokenize 
    the shares is being defined/set. For the time being, we assume there are no
    constraints for registering and we only interested in interacting with it.  
*/
module propertize_addr::registry{
    use std::signer;
    use aptos_std::table::{Self, Table};
    use aptos_framework::object::{Self, Object};
    use propertize_addr::property::{FractionalShareToken};

    friend propertize_addr::marketplace; 

    //
    // Errors
    //
    const ERROR_REGISTRY_EXISTS: u64 = 0;
    const ERROR_REGISTERY_DOES_NOT_EXIST: u64 = 1;
    const ENOT_A_PROPERTY: u64 = 1;
    
    //
    // Structs
    //
    struct RegisteredToken has drop, store {    // RegisteredProperty -> RegisteredToken
        // only the address of fractional share token will be needed.
        token_address: address,  // TODO: should not be promped by the user
        owner_address: address, // to be updated everytime ownership is changed
        timestamp_seconds: u64,
        // TODO: add event
    }

    struct Registry has key {
        tokens_list: Table<address, RegisteredToken>,
    }

    //
    // Asserts
    //
    // TODO: Asserts registry exists
    public fun assert_registry_exists(
        account_address: address,
    ) {
        // assert that `Registry` exists
        //assert!(table::exists<Registry>(account_address), ERROR_REGISTERY_DOES_NOT_EXIST);
    }

    // TODO: Asserts registry does not exist
    public fun assert_registry_does_not_exist(
        account_address: address,
    ) {
        // TODO: assert that `Registry` does not exist
    }

    public fun assert_lengths_are_equal(
        addresses: vector<address>,
        token_addresses: vector<address>,
        timestamps: vector<u64>
    ) {
        // TODO: assert that the lengths of `addresses`, `property_addresses`, and `timestamps` are all equal
    }

    public fun assert_token_address_exists(){
        // TODO
    }

    public fun assert_token_address_does_not_exist(){
        // TODO
    }

    //
    // Entry functions
    //
    /**
    * Initializes registry module
    * @param account - account signer executing the function
    * 
    **/

    public entry fun init_registry(
        account: &signer,
    ) {
        //TODO: assert_registry_does_not_exist(account);

        // Instantiate `Registry` resource 
        let new_registry = Registry {
            tokens_list: table::new(),
        };
        // move Registry resource under the signer account
        move_to(account, new_registry);
    }

    public entry fun register_token(
        account: &signer,
        token_address: address
    ) acquires Registry {
        // TODO: asserts account is registry owner.
        // TODO: asserts token is not registered.
        // gets the signer address
        let signer_address = signer::address_of(account);

        let registry = borrow_global_mut<Registry>(signer_address);

        let new_token = RegisteredToken {
            token_address: token_address/*verify the use*/,
            owner_address: signer_address,
            timestamp_seconds: 0, /*should correspond to the current time*/
        };    

        // adds the new token into the registry
        table::upsert(&mut registry.tokens_list, signer_address, new_token);    
    }

    public(friend) entry fun transfer_token_ownership() {}

    //
    // Unit testing
    // 
    // TODO: create registry and add FractionalShare Token
    // TODO: create more than one registry
    // TODO: create registry and register a non-FractionaShare Token
}