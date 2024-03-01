#[allow(unused_use)]
#[lint_allow(self_transfer)]
module mypost::profile {
    friend mypost::transaction;
    friend mypost::reply;
    friend mypost::repost;
    use std::option::{Self, Option};
    use std::string::{Self, String};
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::clock::{Self, Clock};
    use sui::balance::{Self, Balance};
    use sui::transfer;
    use sui::package;
    use sui::object::{Self, ID, UID};
    use sui::tx_context::{Self, TxContext, sender};
    use sui::url::{Self, Url};
    use sui::object_table::{Self, ObjectTable};
    use mypost::transaction::{Self, Transaction};
    use mypost::price::{Self};
    use sui::event;
    use std::debug;

    const PROFILE_EXISTS: u64 = 0;
    const PROFILE_NOT_EXISTS: u64 = 1;
    const NOT_FOLLOWING: u64 = 2;
    const CANNOT_FOLLOW_SELF: u64 = 3;
    const INSUFFICIENT_FUND: u64 = 1;
    //const MINIMUM_FUND: u64 = 1;

    const RPOFILE_OWNER_FEE_PERCENT: u64 = 5;
    const PROTOCOL_FEE_PERCENT: u64 = 1;
    // const SUI_MIST: u64 = 1000000000;


    struct Profile has key {
        id: UID,
        owner: address,
        name: String,
        bio: String,
        avatar: String,
        // assets - ft in sui, wish, wish well, ft in other chains, nfts in other chains
    }

    struct TransactionMetadata has key, store {
        id: UID,
        transaction_id: ID,
        pool_id: ID,
        profile_id: ID,
        price: u64,
        timestamp_ms: u64
    }

    struct Follower has key, store {
        id: UID,
        follower_profile: ID,
        price: u64,
        timestamp_ms: u64
    }

    struct Following has key, store {
        id: UID,
        following_profile: ID,
        price: u64,
        timestamp_ms: u64
    }


    struct FollowCreated has copy, drop {
        following_id: ID,
        follower_id: ID,
        following_profile: ID,
        following: address,
        follower: address,
        follower_profile: ID,
        price: u64,
        timestamp_ms: u64
    }

    struct UnFollowCreated has copy, drop {
        following_id: ID,
        follower_id: ID,
        following_profile: ID,
        following: address,
        follower: address,
        follower_profile: ID,
        price: u64,
        timestamp_ms: u64
    }


    struct ProfilePool has key {
        id: UID,
        for: ID,
        initial_price: u64,
        price: u64,
        last_price: u64,
        balance: Balance<SUI>,
        owner: address,
        no_of_followers: u64,
        no_of_followings: u64,
        followers: ObjectTable<address, Follower>,
        followings: ObjectTable<address, Following>,
        transactions: ObjectTable<ID, TransactionMetadata>
    }

    struct Global has key, store {
        id: UID,
        owner: address,
        profiles: ObjectTable<address, ProfileMetaData>
    }

    struct ProfileMetaData has key, store {
        id: UID,
        for: ID,
        pool: ID
    }

    struct ProfileMetaDataCreated has copy, drop {
        id: ID,
        for: ID,
        pool: ID,
        timestamp_ms: u64
    }

    struct ProfileChecked has copy, drop {
        meta_id: ID,
        profile_id: ID,
        pool_id: ID,
        exist: bool
    }

    struct PROFILE has drop {}

    fun init(otw: PROFILE, ctx: &mut TxContext) {
        // Claim the `Publisher` for the package!
        let publisher = package::claim(otw, ctx);
        transfer::public_transfer(publisher, sender(ctx));
        // create global, make it share object
        let global_profiles = Global{
            id: object::new(ctx),
            owner: tx_context::sender(ctx),
            profiles: object_table::new(ctx)
        };
        //debug::print(&global_profiles);
        transfer::share_object(global_profiles);
    }

    entry fun edit_profile(
        name: vector<u8>,
        bio: vector<u8>,
        avatar: vector<u8>,
        profile: &mut Profile,
        ctx: &mut TxContext
    ) {
        profile.avatar = string::utf8(avatar);
        profile.bio = string::utf8(bio);
        profile.name = string::utf8(name);
    }

    #[lint_allow(self_transfer)]
    public entry fun create_profile_pool(
        name: vector<u8>,
        bio: vector<u8>,
        avatar: vector<u8>,
        global: &mut Global,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        //check whether have profile created
        let exists = object_table::contains(&global.profiles, sender(ctx));
        assert!(!exists, PROFILE_EXISTS);

        let id = object::new(ctx);
        let inner_id = object::uid_to_inner(&id);
        let pool_id = object::new(ctx);
        let inner_pool_id = object::uid_to_inner(&pool_id);
        let metadata_id = object::new(ctx);
        let metadata_inner_id = object::uid_to_inner(&metadata_id);
        let follower_id = object::new(ctx);
        let inner_follower_id = object::uid_to_inner(&follower_id);
        let following_id = object::new(ctx);
        let inner_following_id = object::uid_to_inner(&following_id);

        let pool = ProfilePool{
            id: pool_id,
            for: inner_id,
            initial_price: 0,
            price: 0,
            last_price: 0,
            balance: balance::zero(),
            owner: sender(ctx),
            no_of_followers: 0,
            no_of_followings: 0,
            followers: object_table::new(ctx),
            followings: object_table::new(ctx),
            transactions: object_table::new(ctx)
        };

        let profile = Profile{
            id: id,
            owner: sender(ctx),
            name: string::utf8(name),
            bio: string::utf8(bio),
            avatar: string::utf8(avatar),
        };

        let data = ProfileMetaData{id: metadata_id, for: inner_id, pool: inner_pool_id};
        event::emit(
            ProfileMetaDataCreated {
                id: metadata_inner_id,
                for: inner_id,
                pool: inner_pool_id,
                timestamp_ms: clock::timestamp_ms(clock),
            }
        );
        object_table::add(&mut global.profiles, sender(ctx), data);

        //let current_price = getPrice(profile.no_of_followers);
        let follower = Follower {
            id: follower_id,
            follower_profile: inner_id,
            price: 0,
            timestamp_ms: clock::timestamp_ms(clock),
        };
        let following = Following {
            id: following_id,
            following_profile: inner_id,
            price: 0,
            timestamp_ms: clock::timestamp_ms(clock),
        };
        event::emit(
            FollowCreated {
                follower_id: inner_follower_id,
                following_id: inner_following_id,
                following: sender(ctx),
                following_profile: inner_id,
                follower: sender(ctx),
                follower_profile: inner_id,
                price: 0,
                timestamp_ms: clock::timestamp_ms(clock),
            }
        );
        // update following profile
        object_table::add(&mut pool.followers, sender(ctx), follower);
        pool.no_of_followers = 1;
        // update follower profile
        object_table::add(&mut pool.followings, sender(ctx), following);
        pool.no_of_followings =  1;
        // update profile pool price
        pool.price = price::getProfilePrice(1);
        transfer::transfer( profile, sender(ctx));
        transfer::share_object(pool);
    }

    public fun get_metadata(key: address, global: &Global) {
        let exists = object_table::contains(&global.profiles, key);
        let profile_id: ID = object::id_from_address(key);
        let meta_id: ID = object::id_from_address(key);
        let pool_id: ID = object::id_from_address(key);
        if (exists) {
            let data = object_table::borrow(&global.profiles, key);
            meta_id = object::uid_to_inner(&data.id);
            pool_id = data.pool;
            profile_id = data.for;
        };
        event::emit(
                ProfileChecked{
                    meta_id: meta_id,
                    profile_id: profile_id,
                    pool_id: pool_id,
                    exist: exists
                }
            );
    }

    #[lint_allow(self_transfer)]
    public entry fun follow(payment: Coin<SUI>, 
        protocol_destination: address,
        global: &mut Global, 
        my_profile: &mut Profile, 
        following_pool: &mut ProfilePool, 
        follower_pool: &mut ProfilePool,
        clock: &Clock,
        ctx: &mut TxContext) {
        // make sure sender is not owner
        let following_profile_exists = object_table::contains(&global.profiles, following_pool.owner);
        let follower_profile_exists = object_table::contains(&global.profiles, my_profile.owner);
        assert!(following_profile_exists, PROFILE_NOT_EXISTS);
        assert!(follower_profile_exists, PROFILE_NOT_EXISTS);
        let follower_id = object::new(ctx);
        let following_id = object::new(ctx);
        let inner_following_id = object::uid_to_inner(&following_id);
        let inner_follower_id = object::uid_to_inner(&follower_id);
        assert!(following_pool.owner != sender(ctx), CANNOT_FOLLOW_SELF);
        let value = coin::value(&payment);

        let current_price = price::getProfilePrice(following_pool.no_of_followers);
        let subjectFee = current_price * RPOFILE_OWNER_FEE_PERCENT / 100;
        let protocolFee = current_price * PROTOCOL_FEE_PERCENT / 100;
        assert!(value >= current_price + subjectFee + protocolFee, INSUFFICIENT_FUND);
        //coin::split(&mut payment, current_price, ctx);
        //TODO 
        let price_coin = coin::split(&mut payment, current_price, ctx);
        
        balance::join(&mut following_pool.balance, coin::into_balance(price_coin));
        //transfer::public_transfer(coin::split(&mut payment, current_price, ctx), object::uid_to_address(&pool.id));
        transfer::public_transfer(coin::split(&mut payment, subjectFee, ctx), following_pool.owner);
        transfer::public_transfer(coin::split(&mut payment, protocolFee, ctx), protocol_destination);
        transfer::public_transfer(payment, tx_context::sender(ctx));

       // let _following_summary = object_table::borrow(&global.profiles, profile.owner);
        // let follow = Follow {
        //     id: follower_id,
        //     following: profile.owner,
        //     following_profile: object::uid_to_inner(&profile.id),
        //     follower: my_profile.owner,
        //     follower_profile: object::uid_to_inner(&my_profile.id),
        //     price: current_price,
        // };
        let follower = Follower {
            id: follower_id,
            follower_profile: object::uid_to_inner(&my_profile.id),
            price: current_price,
            timestamp_ms: clock::timestamp_ms(clock),
        };
        let following = Following {
            id: following_id,
            following_profile: following_pool.for,
            price: current_price,
            timestamp_ms: clock::timestamp_ms(clock),
        };
        event::emit(
            FollowCreated {
                follower_id: inner_follower_id,
                following_id: inner_following_id,
                following: following_pool.owner,
                following_profile: following_pool.for,
                follower: my_profile.owner,
                follower_profile: object::uid_to_inner(&my_profile.id),
                price: current_price,
                timestamp_ms: clock::timestamp_ms(clock),
            }
        );
        // update following profile
        //debug::print(&following_pool.owner);
        object_table::add(&mut following_pool.followers, sender(ctx), follower);
        following_pool.no_of_followers = following_pool.no_of_followers + 1;
        // update follower profile
        //debug::print(&follower_pool.owner);
        object_table::add(&mut follower_pool.followings, following_pool.owner, following);
        follower_pool.no_of_followings = follower_pool.no_of_followings + 1;
        // update profile pool price
        following_pool.last_price = current_price;
        following_pool.price = price::getProfilePrice(following_pool.no_of_followers);
    }

    #[lint_allow(self_transfer)]
    public entry fun unfollow(
        global: &Global, 
        protocol_destination: address,
        follower_profile: &mut Profile, 
        following_pool: &mut ProfilePool, 
        follower_pool: &mut ProfilePool,
        clock: &Clock,
        ctx: &mut TxContext) {
            let follower = object_table::contains(&following_pool.followers, follower_profile.owner);
            let following = object_table::contains(&follower_pool.followings, following_pool.owner);
            assert!(follower, NOT_FOLLOWING);
            assert!(following, NOT_FOLLOWING);
            let following_profile_exists = object_table::contains(&global.profiles, following_pool.owner);
            let follower_profile_exists = object_table::contains(&global.profiles, follower_profile.owner);
            assert!(following_profile_exists, PROFILE_NOT_EXISTS);
            assert!(follower_profile_exists, PROFILE_NOT_EXISTS);

            let current_price = price::getProfilePrice(following_pool.no_of_followers - 1);
            let subjectFee = current_price * RPOFILE_OWNER_FEE_PERCENT / 100;
            let protocolFee = current_price * PROTOCOL_FEE_PERCENT / 100;
            // remove coin from pool
            let revenue = balance::split(&mut following_pool.balance, current_price -  subjectFee -  protocolFee);
            
            let subject = balance::split(&mut revenue, subjectFee);
            let subject_coin = coin::from_balance(subject, ctx);
            let protocol = balance::split(&mut revenue, protocolFee);
            let protocol_coin = coin::from_balance(protocol, ctx);
            let revenue_coin = coin::from_balance(revenue, ctx);

            transfer::public_transfer(revenue_coin, sender(ctx));
            transfer::public_transfer(subject_coin, following_pool.owner);
            transfer::public_transfer(protocol_coin, protocol_destination);
            
            // update following profile
            let followernft = object_table::remove(&mut following_pool.followers, follower_profile.owner);
            let Follower {id: follower_id, follower_profile: _, price: _, timestamp_ms: _} = followernft;
            let inner_follower_id = object::uid_to_inner(&follower_id);
            object::delete(follower_id);
            following_pool.no_of_followers = following_pool.no_of_followers - 1;
            // update follower profile
            let followingnft = object_table::remove(&mut follower_pool.followings, following_pool.owner);
            let Following {id: following_id, following_profile: _, price: _, timestamp_ms: _} = followingnft;
            let inner_following_id = object::uid_to_inner(&following_id);
            object::delete(following_id);
            event::emit(
            UnFollowCreated {
                follower_id: inner_follower_id,
                following_id: inner_following_id,
                following: following_pool.owner,
                following_profile: following_pool.for,
                follower: follower_profile.owner,
                follower_profile: object::uid_to_inner(&follower_profile.id),
                price: current_price,
                timestamp_ms: clock::timestamp_ms(clock),
            }
        );
        follower_pool.no_of_followings = follower_pool.no_of_followings - 1;
        following_pool.last_price = current_price;
        following_pool.price = price::getProfilePrice(following_pool.no_of_followers);
    }




    public(friend) fun get_profile_id(pool: &ProfilePool): ID {
        let id = pool.for;
        (id)
    }

    public(friend) fun add_transaction(
        pool: &mut ProfilePool, 
        id: ID, 
        pool_id: ID,
        profile_id: ID,
        price: u64,
        clock: &Clock,
        ctx: &mut TxContext
        ) {
        let transaction_metadata = TransactionMetadata {
            id: object::new(ctx),
            transaction_id: id,
            pool_id: pool_id,
            profile_id: profile_id,
            price: price,
            timestamp_ms: clock::timestamp_ms(clock)
        };
            object_table::add(&mut pool.transactions, id, transaction_metadata);
    }




    #[test_only]
    public fun init_for_testing(otw: PROFILE, ctx: &mut TxContext) {
        init(otw, ctx);
    }

    #[test_only]
    public fun create_global(ctx: &mut TxContext) {
        let global = Global {
            id: object::new(ctx),
            owner: tx_context::sender(ctx),
            profiles: object_table::new(ctx)
        };
        transfer::public_share_object(global);
    }
}