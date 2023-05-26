/*
    - Property is a collection of fractionalShare tokens 
    - FractionalShare tokens represent fractional shares of the property.
    - Property collection is created upon module publishing and initialization.
    - Only the collection owner can mint/burn fractionalShare tokens.
    - FractionalShare tokens are transferable.
    - FractionalShare tokens have custom attribute called OwnershipShare.
    - OwnershipShare represents the percentage of Property ownership 
    belongs to the FractionalShare.
    - TODO: the owner of the collection is the one who should be able 
    to mint/burn tokens. Not the creator. 

    - TODO: other FractionalShare attributes to consider:
        - Size: size in the property that belongs to FractionalShare.
        - Valuation: The estimated value of the FractionalShare.
        - Governance and voting rights?
        - History: Historical data of the FractionalShare.
        - Levels/Badges: Defines how much of custody the FractionalShare represents.
    - TODO: mint/burn FractionalShare tokens must not be "direct". 
    It won't be convinient for entities to have their FractionalShare tokens burnt
    without any notice or agreement. A protection layer have to be implemented.
    DAO implementation is one solution for that.
    - TODO: Ownership share is mutable and can be modified even after minting
    the fractional share token. I'm still exploring ways for a good implementation.
    - TODO: What is internal collection?
*/
module propertize_addr::property {
    // TODO: alphabetical order
    use std::error;
    use std::option;
    use std::string::{Self, String};
    use std::signer;

    use aptos_framework::object::{Self, Object};
    use aptos_token_objects::collection;
    use aptos_token_objects::token;
    use aptos_token_objects::property_map;

    // To use transfer()
    friend propertize_addr::marketplace; 

    //
    // Errors
    //
    // The token does not exist
    const ETOKEN_DOES_NOT_EXIST: u64 = 1;
    // The token  exists
    const ETOKEN_EXISTS: u64 = 2;
    // The signer is not the token creator 
    const ENOT_CREATOR: u64 = 3;
    // The signer is not the token owner
    const ENOT_OWNER: u64 = 4;
    // The remaining supply is null
    const EREMAINING_SUPPLY_IS_NULL: u64 = 5;
    // The remaining supply is sufficient
    const EREMAINING_SUPPLY_IS_NOT_SUFFICIENT: u64 = 6;
    // The collection does not exist
    const ECOLLECTION_EXISTS: u64 = 7;
    // The collection exists
    const ECOLLECTION_DOES_NOT_EXIST: u64 = 8;

    // TODO: these shouldn't be constants.
    // The Property token collection name
    const COLLECTION_NAME: vector<u8> = b"Property";
    // The Property token collection description
    const COLLECTION_DESCRIPTION: vector<u8> = b"Property Collection Description";
    // The Property token collection URI
    const COLLECTION_URI: vector<u8> = b"Property Collection URI";
    // The Property token Supply, fixed to 100 for now.
    const SUPPLY: u64 = 100; 

    //
    // Structs
    //
    struct FractionalShareToken has key {
        // Ref to burn token
        burn_ref: token::BurnRef,
        // Ref to modify the state of props of the token
        property_mutator_ref: property_map::MutatorRef,
    }

    struct OwnershipShare has key {
        ownership_percentage: u64,
    }
    
    //
    // Asserts
    //
    // Asserts that the collection exists
    //inline fun assert_collection_exists<T: key>(collection: &Object<T>){
    //    let collection_address = object::object_address(collection);
    //    assert!(
    //        exists<T>(collection_address),
    //        error::not_found(ECOLLECTION_DOES_NOT_EXIST),
    //    );
    //}

    // Asserts that the collection does not exist
    //inline fun assert_collection_does_not_exist<T: key>(token: &Object<T>){
    //    let token_address = object::object_address(token);
    //    assert!(
    //        exists<T>(token_address),
    //        error::not_found(ETOKEN_DOES_NOT_EXIST),
    //    );
    //}

    // Asserts that the token exists
    inline fun assert_token_exists<T: key>(token: &Object<T>){
        let token_address = object::object_address(token);
        assert!(
            exists<T>(token_address),
            error::not_found(ETOKEN_DOES_NOT_EXIST),
        );
    }

    // Asserts the burnt token does not exist after burning
    inline fun assert_token_does_not_exist<T: key>(token: &Object<T>){
        let token_address = object::object_address(token);
        assert!(
            !exists<T>(token_address),
            error::already_exists(ETOKEN_EXISTS),
        );
    }

    // Asserts the owner is the `creator`
    inline fun assert_creator<T: key>(creator: &signer, token: &Object<T>) {
        assert!(
            token::creator(*token) == signer::address_of(creator),
            error::permission_denied(ENOT_CREATOR),
        );
    }

    // Asserts the owner is the `owner`
    public inline fun assert_owner<T: key>(owner: &signer, token: &Object<T>) {
        assert!(
            object::owner(*token) == signer::address_of(owner),
            error::permission_denied(ENOT_OWNER),
        );
    }

    // Asserts the remaining supply is not 0
    inline fun assert_remaining_supply_is_not_null<T: key>(remaining_supply: u64) {
        assert!(
            remaining_supply > 0,
            error::out_of_range(EREMAINING_SUPPLY_IS_NULL),
        );
    } 

    // TODO: Asserts max supply is not 0

    // TODO: Asserts the collection exists
    //inline fun assert_collection_exists(){
    //    collection::check_collection_exists(mutator_ref.self); 
    //} 


    // TODO: Asserts the remaining supply is greater or equal to the new ownership share  
    inline fun assert_remaining_supply_is_sufficient<T: key>(){}

    //
    // View Functions
    //
    // TODO: Returns the collection


    // Returns the fractional share token
    #[view]
    public fun view_fractional_share_token(token: Object<FractionalShareToken>): Object<FractionalShareToken> {
        // TODO: Asserts token exists
        token
    }

    #[view]
    public fun view_fractional_share_token_address(token: Object<FractionalShareToken>): address {
        // TODO: Asserts token exists
        let token_address = object::object_address(&token);
        token_address
    }

    // Returns the ownership percentage of the fractional share token
    #[view]
    public fun view_fractional_share_percentage(token: Object<FractionalShareToken>): u64 acquires OwnershipShare {
        // TODO: Asserts token exists
        let ownership_percentage = borrow_global<OwnershipShare>(object::object_address(&token));
        ownership_percentage.ownership_percentage
    }

    //
    // Mutators
    //
    // Set Collection Description
    //public entry fun set__collection_description(
    //    owner: &signer,
    //    new_description: String,
    //) {
    //    // TODO: Asserts that collection `owner` is the one executing the function.
    //
    //    let constructor_ref = create_collection_helper(owner, collection_name);
    //    let mutator_ref = collection::generate_mutator_ref(&constructor_ref);
    //    collection::set_description(&mutator_ref, new_description);
    //}
    
    //Set Collection URI
    //set_uri(&mutator_ref, uri);

    // Set the ownership share percentage.
    // This is directly correlated with total supply decalred above.
    //public entry fun set_ownership_share_percentage(
    //    creator: &signer,
    //    token: Object<FractionalShareToken>,
    //    new_ownership_share_pecentage: u64
    //) acquires OwnershipShare, FractionalShareToken {
    //  // TODO: how to get the remaining token supply?
    //  let remaining_supply = supply;
    //  // Asserts that `creator` is the collection owner.
    //  assert_creator(creator, &token);
    //  // Asserts that remaining supply is not null
    //  assert_remaining_supply_is_not_null(remaining_supply);
    //  // TODO: Asserts that the new ownership share pecentage is less or equal than the available supply
    //  //assert_remaining_supply_is_sufficient();
    //  let token_address = object::object_address(&token);
    //  let ownership_share_pecentage = borrow_global_mut<OwnershipShare>(token_address);

    //  // Updates the remaining total supply
    //  // TODO: probs there is a better way to update the remaining supply
    //  supply = supply + (ownership_share_pecentage - new_ownership_share_pecentage);
    //  // Updates the ownership share percentage
    //  ownership_share_pecentage = new_ownership_share_pecentage;
    //}

    /*
    * Creates the property collection.
    * This function creates a collections with fixed supply alongside
    * the description, the name, and the URI.
    TODO: what is royalty used for?
    */
    public fun create_property_collection(
        creator: &signer,
        description: String,
        name: String,
        uri: String,
    ) {                   
        //let description = string::utf8(COLLECTION_DESCRIPTION);
        //let name = string::utf8(COLLECTION_NAME);
        //let uri = string::utf8(COLLECTION_URI);
        // Creates the property collection
        collection::create_fixed_collection(
            creator,
            description,
            SUPPLY,
            name,
            option::none(),
            uri
        );
    }

    //
    // Entry functions
    //
    // Mints fractional share token (only the collection owner can call this function)
    public entry fun mint_fractional_share_token(
        owner: &signer,
        collection_name: String,
        description: String,
        name: String,
        uri: String,
    ) {
        // Creates the fractional share token, and get the constructor ref of the token. The constructor ref
        // is used to generate the refs of the token.
        let constructor_ref = token::create_named_token(
            owner,
            collection_name,
            description,
            name,
            option::none(),
            uri,
        );

        // Generates the object signer and the refs. The object signer is used to publish a resource
        // (OwnershipShare) under the token object address. The refs are used to manage the token.
        let object_signer = object::generate_signer(&constructor_ref);
        let burn_ref = token::generate_burn_ref(&constructor_ref);
        let property_mutator_ref = property_map::generate_mutator_ref(&constructor_ref);

        // Initializes the ownership share percentage as 20.
        // TODO: the ownership share percentage should not be defined when minting the token
        let properties = property_map::prepare_input(vector[], vector[], vector[]);
        property_map::init(&constructor_ref, properties);
        property_map::add_typed(
            &property_mutator_ref,
            string::utf8(b"Ownership Share"),
            20  // TODO: should be set when intercation with the function
        );

        // Publishes the FractionalShareToken resource
        let fractional_share_token = FractionalShareToken {
            burn_ref,
            property_mutator_ref,
        };
        move_to(&object_signer, fractional_share_token);
    }

    // Burn the token, and destroy the FractionalShareToken
    // and OwnershipShare resources, and the property map.
    public entry fun burn(creator: &signer, token: Object<FractionalShareToken>) acquires FractionalShareToken {
        assert_creator(creator, &token);
        let fractional_share_token = move_from<FractionalShareToken>(object::object_address(&token));
        
        let FractionalShareToken {
            burn_ref,
            property_mutator_ref,
        } = fractional_share_token;

        property_map::burn(property_mutator_ref);
        token::burn(burn_ref);
        // TODO: should the supply be decremented after burning a token?
    } 

    // Transfer the fractional share token to `transfer_to` address.
    public entry fun transfer_fractional_share(owner: &signer, to: &signer, token: Object<FractionalShareToken>) {
        // Assert token exists
        assert_token_exists(&token);
        // Assert the owner is the the owner of the token to be transferred 
        assert_owner(owner, &token);
        object::transfer(owner, token, signer::address_of(to));

    }

    // Transfers the collection to another address.
    /*
    * transferring a collection involves transferring all the tokens belongs
    * to that collection. This will require ungated_transfer to be enabled. 
    * While transferring a collection is possible, doing so will require the
    * the consent of token owners. Setting a DAO dedicated for each collection 
    * is one solution for this.
    */
    public entry fun transfer_property_collection(
        owner: &signer, 
        to: &signer,
        collection_name: String,
    ) { 
        let collection_address = collection::create_collection_address(&signer::address_of(owner), &collection_name);
        let collection = object::address_to_object<collection::Collection>(collection_address);
        // TODO: Asserts the collection exists?
        //collection::check_collection_exists(collection_address);
        // TODO: Asserts `owner` is the property owner
        // TODO: Asserts `to` is a valid address
        //object::enable_ungated_transfer
        object::transfer(owner, collection, signer::address_of(to));
        //object::disable_ungated_transfer
    }


        

    //
    // Unit Testing
    //
    #[test(creator = @0x123, user1 = @0x456)]
    fun test_mint_and_transfer(creator: &signer, user1: &signer) {
        let collection_name = string::utf8(b"Property Collection #1");
        let collection_description = string::utf8(b"Property Collection #1 Description");
        let collection_uri = string::utf8(b"Property Collection #1 URI");

        // Creator creates the Property Collection
        create_property_collection(creator, collection_description, collection_name, collection_uri);

        // Creator mints a Fractional Share Token
        let token_name = string::utf8(b"Fractional Share Token #1");
        let token_description = string::utf8(b"Fractional Share Token #1 Description");
        let token_uri = string::utf8(b"Fractional Share Token #1 URI");

        // Creates Fractional Share Token 
        mint_fractional_share_token(
            creator,
            collection_name,
            token_description,
            token_name,
            token_uri,
        );
        let token_address = token::create_token_address(
            &signer::address_of(creator),
            &collection_name,
            &token_name
        );
        let token = object::address_to_object<FractionalShareToken>(token_address);
        // Gets token address
        view_fractional_share_token_address(token);
        // Asserts the owner of the token is the creator
        assert_owner(creator, &token);
        // Transfers the token to user1
        transfer_fractional_share(creator, user1, token);
        // Asserts the new owner of the token is user1
        assert_owner(user1, &token);
        // Asserts the burnt token exists before burning
        assert_token_exists(&token);
        // Gets token address
        view_fractional_share_token_address(token);
    }

    #[test(creator = @0x123)]
    fun test_mint_and_burn(creator: &signer) acquires FractionalShareToken {
        let collection_name = string::utf8(b"Property Collection #1");
        let collection_description = string::utf8(b"Property Collection #1 Description");
        let collection_uri = string::utf8(b"Property Collection #1 URI");
        // Creator creates the Property Collection
        create_property_collection(creator, collection_description, collection_name, collection_uri);


        // Creator mints a Fractional Share Token
        let token_name = string::utf8(b"Fractional Share Token #1");
        let token_description = string::utf8(b"Fractional Share Token #1 Description");
        let token_uri = string::utf8(b"Fractional Share Token #1 URI");

        // Creates Fractional Share Token 
        mint_fractional_share_token(
            creator,
            collection_name,
            token_description,
            token_name,
            token_uri,
        );
        let token_address = token::create_token_address(
            &signer::address_of(creator),
            &collection_name,
            &token_name
        );
        let token = object::address_to_object<FractionalShareToken>(token_address);
        // Asserts the owner of the token is the creator
        assert_owner(creator, &token);
        // Asserts the burnt token exists before burning
        assert_token_exists(&token);
        // Burns the token
        burn(creator, token);
        // Asserts the burnt token does not exist after burning
        assert_token_does_not_exist(&token);
    }   

    #[test(owner = @0x123, to = @0x456)]
    #[expected_failure(abort_code = 0x50003, location = aptos_framework::object)]
    fun test_create_and_transfer_collection(owner: &signer, to: &signer){
        let owner_address = signer::address_of(owner);
        let collection_name = string::utf8(b"Property Collection #1");
        let collection_description = string::utf8(b"Property Collection #1 Description");
        let collection_uri = string::utf8(b"Property Collection #1 URI");
        // Creator creates the Property Collection
        create_property_collection(owner, collection_description, collection_name, collection_uri);
        let collection = object::address_to_object<collection::Collection>(
            collection::create_collection_address(&owner_address, &collection_name),
        );
        // Asserts the collection owner is `owner`
        assert!(object::owner(collection) == owner_address, 1);
        // TODO: Assert the collection exists
        object::transfer(owner, collection, signer::address_of(to));
    }

    // TODO
    #[test]
    fun test_view_and_set_collection_properties(){}

}