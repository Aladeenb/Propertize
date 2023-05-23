/*
    - Property is a collection of fractionalShare tokens 
    - FractionalShare tokens represent fractional shares of the property.
    - Property collection is created upon module publishing and initialization.
    - Only the collection creator can mint/burn fractionalShare tokens.
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
    - TODO: mint/burn FractionalShare tokens must not be "direct". 
    It won't be convinient for entities to have their FractionalShare tokens burnt
    without any notice or agreement. A protection layer have to be implemented.
*/
module propertize_addr::property {
    use std::error;
    use std::option;
    use std::string::{Self, String};
    use std::signer;

    use aptos_framework::object::{Self, Object};
    use aptos_token_objects::collection;
    use aptos_token_objects::token;
    use aptos_token_objects::property_map;

    //
    // Errors
    //
    /// The token does not exist
    const ETOKEN_DOES_NOT_EXIST: u64=1;
    /// The token  exists
    const ETOKEN_EXISTS: u64=2;
    /// The signer is not the token creator 
    const ENOT_CREATOR: u64=3;
    /// The signer is not the token owner
    const ENOT_OWNER: u64=4;
    /// The remaining supply is null
    const EREMAINING_SUPPLY_IS_NULL: u64=5;
    /// The remaining supply is sufficient
    const EREMAINING_SUPPLY_IS_NOT_SUFFICIENT: u64=6;

    /// The Property token collection name
    const COLLECTION_NAME: vector<u8> = b"Property Collection Name";
    /// The Property token collection description
    const COLLECTION_DESCRIPTION: vector<u8> = b"Property Collection Description";
    /// The Property token collection URI
    const COLLECTION_URI: vector<u8> = b"Property Collection URI";

    //
    // Structs
    //
    struct FractionalShareToken has key {
        /// Ref to burn token
        burn_ref: token::BurnRef,
        /// Ref to modify the state of props of the token
        property_mutator_ref: property_map::MutatorRef,
    }

    struct OwnershipShare has key {
        ownership_percentage: u64,
    }
    
    //
    // Asserts
    //
    /// Asserts that the token exists
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

    /// Asserts the creator of the token is `creator`
    inline fun assert_creator<T: key>(creator: &signer, token: &Object<T>) {
        assert!(
            token::creator(*token) == signer::address_of(creator),
            error::permission_denied(ENOT_CREATOR),
        );
    }

    /// Asserts the creator of the token is `owner`
    inline fun assert_owner<T: key>(owner: &signer, token: &Object<T>) {
        assert!(
            object::owner(*token) == signer::address_of(owner),
            error::permission_denied(ENOT_OWNER),
        );
    }

    /// Asserts the remaining supply is not 0
    inline fun assert_remaining_supply_is_not_null<T: key>(remaining_supply: u64) {
        assert!(
            remaining_supply > 0,
            error::out_of_range(EREMAINING_SUPPLY_IS_NULL),
        );
    }   

    /// TODO: Asserts the remaining supply is greater or equal to the new ownership share  
    inline fun assert_remaining_supply_is_sufficient<T: key>(){}

    //
    // Initialize function (not entry)
    //
    /**
    * Initializes the module, creating the property colelction. The creator of the module is the creator of the
    * property collection. As this init function is called only once when the module is published, there will
    * be only one property collection.
    * @param account - account signer executing the function
    * for params, refer to: [object-token-module]
    **/
    fun init_module(sender: &signer) {
        create_property_collection(sender);
    }



    //
    // View functions
    //
    #[view]
    /// Returns the fractional share token
    public fun fractional_share_token(token: Object<FractionalShareToken>): Object<FractionalShareToken> {
        token
    }

    #[view]
    /// Returns the ownership percentage of the fractional share token
    public fun fractional_share_percentage(token: Object<FractionalShareToken>): u64 acquires OwnershipShare {
        let ownership_percentage = borrow_global<OwnershipShare>(object::object_address(&token));
        ownership_percentage.ownership_percentage
    }

    //
    // Functions
    //
    /*
    * Creates the property collection.
    * This function creates a collections with fixed supply using the module constants
    * for description, name, and URI defined above.
    TODO: royalty none? 
    */
    fun create_property_collection(creator: &signer) {
        // Constructs the strings from the bytes.
        let description = string::utf8(COLLECTION_DESCRIPTION);
        let supply = 100;
        let name = string::utf8(COLLECTION_NAME);
        let uri = string::utf8(COLLECTION_URI);
        collection::create_fixed_collection(
            creator,
            description,
            supply,
            name,
            option::none(),
            uri
        );
    }

    //
    // Entry functions
    //
    /// Mints fractional share token (only the collection owner can call this function)
    public entry fun mint_fractional_share_token(
        owner: &signer,
        description: String,
        name: String,
        uri: String,
    ) {
        // The collection name is used to locate the collection object and to create a new token object.
        let collection = string::utf8(COLLECTION_NAME);
        // Creates the fractional share token, and get the constructor ref of the token. The constructor ref
        // is used to generate the refs of the token.
        let constructor_ref = token::create_named_token(
            owner,
            collection,
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


        // Published the FractionalShareToken resource
        let fractional_share_token = FractionalShareToken {
            burn_ref,
            property_mutator_ref,
        };
        move_to(&object_signer, fractional_share_token);
    }

    /// Burn the token, and destroy the FractionalShareToken
    /// and OwnershipShare resources, and the property map.
    // TODO: something wrong with `burn` function: https://github.com/Aladeenb/Propertize/issues/3 
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

    /// Transfer the fractional share token to `transfer_to` address.
    public entry fun transfer_fractional_share(owner: &signer, to: &signer, token: Object<FractionalShareToken>) {
        // Assert token exists
        assert_token_exists(&token);
        // Assert the owner is the the owner of the token to be transferred 
        assert_owner(owner, &token);
        object::transfer(owner, token, signer::address_of(to));

    }

    /// TODO: transfer the collection to another address.
    //public entry fun transfer_property_collection(owner: &signer, to: &signer) {
    //}

    /// Set the ownership share percentage.
    /// This is directly correlated with total supply decalred above.
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
//
    //  // Updates the remaining total supply
    //  // TODO: probs there is a better way to update the remaining supply
    //  supply = supply + (ownership_share_pecentage - new_ownership_share_pecentage);
    //  // Updates the ownership share percentage
    //  ownership_share_pecentage = new_ownership_share_pecentage;
    //}
        

    //
    // Unit Testing
    //
    #[test(creator = @0x123, user1 = @0x456)]
    fun test_mint_and_transfer(creator: &signer, user1: &signer) {
        // Creator creates the Property Collection
        create_property_collection(creator);

        // Creator mints a Fractional Share Token
        let token_name = string::utf8(b"Fractional Share Token #1");
        let token_description = string::utf8(b"Fractional Share Token #1 Description");
        let token_uri = string::utf8(b"Fractional Share Token #1 URI");

        // Creates Fractional Share Token 
        mint_fractional_share_token(
            creator,
            token_description,
            token_name,
            token_uri,
        );
        let collection_name = string::utf8(COLLECTION_NAME);
        let token_address = token::create_token_address(
            &signer::address_of(creator),
            &collection_name,
            &token_name
        );
        let token = object::address_to_object<FractionalShareToken>(token_address);
        // Asserts the owner of the token is the creator
        assert_owner(creator, &token);
        // Transfers the token to user1
        transfer_fractional_share(creator, user1, token);
        // Asserts the new owner of the token is user1
        assert_owner(user1, &token);
        // Asserts the burnt token exists before burning
        assert_token_exists(&token);
    }
    // Test not passing: https://github.com/Aladeenb/Propertize/issues/3
    #[test(creator = @0x123)]
    fun test_mint_and_burn(creator: &signer) acquires FractionalShareToken {
        // Creator creates the Property Collection
        create_property_collection(creator);

        // Creator mints a Fractional Share Token
        let token_name = string::utf8(b"Fractional Share Token #1");
        let token_description = string::utf8(b"Fractional Share Token #1 Description");
        let token_uri = string::utf8(b"Fractional Share Token #1 URI");

        // Creates Fractional Share Token 
        mint_fractional_share_token(
            creator,
            token_description,
            token_name,
            token_uri,
        );
        let collection_name = string::utf8(COLLECTION_NAME);
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
        //assert_token_does_not_exist(&token);
    }   

}