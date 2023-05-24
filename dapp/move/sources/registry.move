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
    
    //
    // Structs
    //
    /*consider removing `drop`*/
    struct RegisteredProperty has drop, store {
        property_address: address,  // TODO: should not be promped by the user
        owner_address: address, // to be updated everytime ownership is changed
        timestamp_seconds: u64,
        // TODO: add event
    }

    struct Registry has key {
        properties_list: Table<address, RegisteredProperty>,
        // signer_capability: account::SignerCapability,

    }

    //
    // Asserts
    //
    public fun assert_registry_exists(
        account_address: address,
    ) {
        // assert that `Registry` exists
        //assert!(table::exists<Registry>(account_address), ERROR_REGISTERY_DOES_NOT_EXIST);
    }

    public fun assert_registry_does_not_exist(
        account_address: address,
    ) {
        // TODO: assert that `Registry` does not exist
    }

    public fun assert_lengths_are_equal(
        addresses: vector<address>,
        property_addresses: vector<address>,
        timestamps: vector<u64>
    ) {
        // TODO: assert that the lengths of `addresses`, `property_addresses`, and `timestamps` are all equal
    }

    public fun assert_property_address_exists(){
        // TODO
    }

    public fun assert_property_address_does_not_exist(){
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
            properties_list: table::new(),
        };
        // move Registry resource under the signer account
        move_to(account, new_registry);
    }

    public entry fun register_property(
        account: &signer,
        property_address: address
    ) acquires Registry {
        // gets the signer address
        let signer_address = signer::address_of(account);

        let registry = borrow_global_mut<Registry>(signer_address);

        let new_property = RegisteredProperty {
            property_address: property_address/*verify the use*/,
            owner_address: signer_address,
            timestamp_seconds: 0, /*should correspond to the current time*/
        };    

        // adds the new property into the registry
        table::upsert(&mut registry.properties_list, signer_address, new_property);    
    }

    public(friend) entry fun transfer_property_ownership() {}
}