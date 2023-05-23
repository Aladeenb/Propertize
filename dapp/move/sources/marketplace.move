// TODO: difference between use and friend?

module propertize_addr::marketplace {
    use aptos_std::table::{Self, Table};

    use aptos_framework::object::{Object};
    use propertize_addr::property::{FractionalShareToken};

    //
    // Errors
    //

    //
    // Asserts
    //

    // Getters, use #[view]

    struct SaleList has key {
        properties: Table<u64, address>,
        timestamp: u64,
    }



    // TODO: list for prev. sales. usefull for history
    struct Sold has store, drop, copy {
        new_owner: address,
        property: Object<FractionalShareToken>,
        timestamp: u64, // TODO: make use of time framework
    } 

    //
    // Entry functions
    //
    public entry fun init_list(account: &signer){
        let properties_owner = SaleList {
            properties: table::new(),
            //set_task_event: account::new_event_handle<ToSell>(account),
            timestamp: 0,
        };
        // move the SaleList resource under the signer account
        move_to(account, properties_owner);
    }

    // TODO: list a property for sale
    entry fun list_property(){}




    // swapping nft for money
    // TODO: buy a property. Verify func logic
    public entry fun buy_property(
        from: &signer,
        object: Object<FractionalShareToken>,
        to: address,
    ){
        propertize_addr::registry::transfer_property_ownership(from, object, to)
    }


    // TODO: add Transfer function specific to lending.

}