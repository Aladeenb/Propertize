/*
    After creating the Property collection, and minting its shares tokens 
    (fractionalShares), they will have to be registered. The `registry` module
    is a layer dedicated to regulations where all the necessary steps to tokenize 
    the shares is being defined/set. For the time being, we assume there are no
    constraints for registering and we only interested in interacting with it.
    - TODO: register objects?  
*/
module propertize_addr::registry{
    // TODO: alphabetical order
    use std::signer;
    use aptos_std::table::{Self, Table};
    use aptos_framework::object;
    use propertize_addr::property::{FractionalShareToken};

    use propertize_addr::property;

    //
    // Errors
    //
    const ERROR_REGISTRY_EXISTS: u64 = 0;
    const ERROR_REGISTERY_DOES_NOT_EXIST: u64 = 1;
    const ENOT_A_PROPERTY: u64 = 1;
    // The signer is not the token owner
    const ENOT_OWNER: u64 = 4;
    
    //
    // Structs
    //
    struct RegisteredToken has drop, store {  
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

    ) {
        // assert that `Registry` exists
        //assert!(table::exists<Registry>(account_address), ERROR_REGISTERY_DOES_NOT_EXIST);
    }

    // TODO: Asserts registry does not exist
    public fun assert_registry_does_not_exist(

    ) {
        // TODO: assert that `Registry` does not exist
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
        create_registry(account)
    }

    fun create_registry(account: &signer){
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
        // TODO: asserts account is the registry owner.
        // TODO: asserts token is not registered.
        // gets the signer address
        let signer_address = signer::address_of(account);

        let registry = borrow_global_mut<Registry>(signer_address);

        let new_token = RegisteredToken {
            token_address: token_address,
            owner_address: signer_address,
            timestamp_seconds: 0, /*should correspond to the current time*/
        };    

        // adds the new token into the registry
        table::upsert(&mut registry.tokens_list, signer_address, new_token);    
    }

    // Transfer registered Fractional share token
    public entry fun transfer_registered_token(
        owner: &signer,
        to: &signer,
        token_address: address
    ) { 
        // TODO: Asserts `to` has a registry  
        // TODO: Asserts token is registered    
        property::transfer_fractional_share(
            owner, 
            to, 
            object::address_to_object<FractionalShareToken>(token_address)
            );
        // TODO: Transfer it to the registry
    }

    //
    // Unit testing
    // 
    #[test_only]
    use aptos_token_objects::collection;
    #[test_only]
    use std::string;
    #[test_only]
    use aptos_token_objects::token;


    // TODO: create registry and add FractionalShare Token
    // TODO: create more than one registry
    // TODO: create registry and register a non-FractionaShare Token
    #[test(owner = @0x123, to = @0x456)]
    // Transfer Token from registry to another
    fun test_transfer_token_from_registry(owner: &signer, to: &signer) acquires Registry {
        // Creates a collection
        let owner_address = signer::address_of(owner);
        let collection_name = string::utf8(b"Collection name");
        let collection_description = string::utf8(b"collection description");
        let collection_uri = string::utf8(b"https://www.aladeen.me");
        property::create_property_collection(owner, collection_description, collection_name, collection_uri);
        
        collection::create_collection_address(&owner_address, &collection_name);

        // Mints a fractional share token
        let token_name = string::utf8(b"Fractional Share Token #1");
        let token_description = string::utf8(b"Fractional Share Token #1 Description");
        let token_uri = string::utf8(b"Fractional Share Token #1 URI");

        // Creates Fractional Share Token 
        property::mint_fractional_share_token(
            owner,
            collection_name,
            token_description,
            token_name,
            token_uri,
        );
        let token_address = token::create_token_address(
            &signer::address_of(owner),
            &collection_name,
            &token_name
        );
        let token = object::address_to_object<FractionalShareToken>(token_address);

        // Creates Registry
        create_registry(owner);
        // Registers the minted fractional share token
        register_token(owner,  token_address);
        // Tranfers the minted fractional share token
        transfer_registered_token(owner, to, token_address);
        // Assert `to` is the new owner of the token
        property::assert_owner(to, &token);
    }

}