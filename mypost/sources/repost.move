#[allow(unused_use)]
#[lint_allow(self_transfer)]
module mypost::repost { 
    use sui::object::{Self, ID, UID};
    use sui::tx_context::{Self, TxContext, sender};
    use sui::object_table::{Self, ObjectTable};
    use sui::event;
    use sui::coin::{Self, Coin};
    use std::string::{Self, String};
    use sui::sui::SUI;
    use sui::clock::{Self, Clock};
    use sui::balance::{Self, Balance};
    use mypost::profile::{Self, Profile, ProfilePool};
    use mypost::price::{Self};
    use sui::transfer;
    use std::vector;
    use std::debug;

    const RPOFILE_OWNER_FEE_PERCENT: u64 = 5;
    const RPOFILE_OWNER_BUY_FEE_PERCENT: u64 = 4;
    const PROTOCOL_FEE_PERCENT: u64 = 1;
    const PROTOCOL_BUY_FEE_PERCENT: u64 = 1;


    const INSUFFICIENT_FUND: u64 = 1;
    const NOT_ALLOWED_BOUGHT: u64 = 2;
    const NOT_BOUGHT: u64 = 3;


    struct Repost has key, store {
        id: UID,
        content: String,
        owner: address,
        transaction: String,
    }

    struct RepostAccess has key, store {
        id: UID,
        repost_id: ID,
        pool_id: ID,
        profile_id: ID,
        accessor_address: address,
        price: u64,
        timestamp_ms: u64
    }

    struct RepostPool has key {
        id: UID,
        for: ID,
        initial_price: u64,
        price: u64,
        last_price: u64,
        owner: address,
        cofficient: u64,
        owner_profile: ID,
        no_of_accessors: u64,
        accessors: ObjectTable<address, RepostAccess>,
        balance: Balance<SUI>,
    }

    struct RepostCreated has copy, drop {
        repost_id: ID,
        pool_id: ID,
        profile_id: ID,
        transaction_digest: String,
        timestamp_ms: u64
    }

    struct RepostAccessBought has copy, drop {
        access_id: ID,
        repost_id: ID,
        profile_id: ID,
        pool_id: ID,
        buyer: address,
        transaction_digest: String,
        repost_digest: String,
        price: u64,
        timestamp_ms: u64
    }

    struct RepostAccessSold has copy, drop {
        access_id: ID,
        repost_id: ID,
        profile_id: ID,
        pool_id: ID,
        seller: address,
        transaction_digest: String,
        repost_digest: String,
        price: u64,
        timestamp_ms: u64
    }

    #[lint_allow(self_transfer)]
    public entry fun create (
        profile_pool: &mut ProfilePool,
        content: vector<u8>,
        coffient: u64,
        transaction_digest: vector<u8>,
        repost_digest: vector<u8>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let id = object::new(ctx);
        let inner_id = object::uid_to_inner(&id);
        let pool_id = object::new(ctx);
        let pool_inner_id = object::uid_to_inner(&pool_id);
        let profile_id = profile::get_profile_id(profile_pool);
        let access_id = object::new(ctx);
        let acess_inner_id = object::uid_to_inner(&access_id);

        let reply = Repost {
            id: id,
            content: string::utf8(content),
            owner: sender(ctx),
            transaction: string::utf8(transaction_digest),
        };
        let pool = RepostPool {
            id: pool_id,
            for: pool_inner_id,
            initial_price: 0,
            price: 0,
            last_price: 0,
            owner: sender(ctx),
            cofficient: coffient,
            owner_profile: profile_id,
            no_of_accessors: 0,
            accessors: object_table::new(ctx),
            balance: balance::zero(),
        };
        event::emit(
            RepostCreated {
                repost_id: inner_id,
                pool_id: pool_inner_id,
                profile_id: profile_id,
                transaction_digest: string::utf8(transaction_digest),
                timestamp_ms: clock::timestamp_ms(clock),
            }
        );

        let access = RepostAccess {
            id: access_id,
            repost_id: inner_id,
            pool_id: pool_inner_id,
            profile_id: profile_id,
            accessor_address: sender(ctx),
            price: 0,
            timestamp_ms: clock::timestamp_ms(clock),
        };
        event::emit(
            RepostAccessBought{
                access_id: acess_inner_id,
                repost_id: inner_id,
                profile_id: profile_id,
                pool_id: pool_inner_id,
                buyer: sender(ctx),
                transaction_digest: string::utf8(transaction_digest),
                repost_digest: string::utf8(repost_digest),
                price: 0,
                timestamp_ms: clock::timestamp_ms(clock),
            }
        );
        object_table::add(&mut pool.accessors, sender(ctx), access);
        pool.no_of_accessors = 1;
        pool.price = price::getReplyPrice(1, coffient);
        transfer::transfer( reply, sender(ctx));
        transfer::share_object(pool);
    }

    public fun get_no_of_accessors(tpool: &RepostPool): u64 {
        (tpool.no_of_accessors)
    }

    public entry fun buy (
        payment: Coin<SUI>, 
        protocol_destination: address,
        transaction_digest: vector<u8>,
        reply_digest: vector<u8>,
        pool: &mut RepostPool,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        // check bought access or not
        let bought = object_table::contains(&pool.accessors, sender(ctx));
        assert!(!bought, NOT_ALLOWED_BOUGHT);
        // balance is ennough 
        let current_price = price::getReplyPrice(pool.no_of_accessors, pool.cofficient);
        let value = coin::value(&payment);
        assert!(value >= current_price, INSUFFICIENT_FUND);
        let subjectFee = current_price * RPOFILE_OWNER_BUY_FEE_PERCENT / 100;
        let subject_coin = coin::split(&mut payment, subjectFee, ctx);
        transfer::public_transfer(subject_coin, sender(ctx));
        let protocolFee = current_price * PROTOCOL_BUY_FEE_PERCENT / 100;
        let protocol_coin = coin::split(&mut payment, protocolFee, ctx);
        transfer::public_transfer(protocol_coin, protocol_destination);
        let price_coin = coin::split(&mut payment, current_price - subjectFee - protocolFee, ctx);
        balance::join(&mut pool.balance, coin::into_balance(price_coin));

        transfer::public_transfer(payment, sender(ctx));

        let access_id = object::new(ctx);
        let access_inner_id = object::uid_to_inner(&access_id);
        let pool_inner_id = object::uid_to_inner(&pool.id);
        let owner_profile_id = pool.owner_profile;
        let access = RepostAccess {
            id: access_id,
            repost_id: pool.for,
            profile_id: owner_profile_id,
            pool_id: pool_inner_id,
            accessor_address: sender(ctx),
            price: current_price,
            timestamp_ms: clock::timestamp_ms(clock)
        };
        event::emit(
            RepostAccessBought {
                access_id: access_inner_id,
                profile_id: owner_profile_id,
                repost_id: pool.for,
                pool_id: object::uid_to_inner(& pool.id),
                price: current_price,
                transaction_digest: string::utf8(transaction_digest),
                repost_digest: string::utf8(reply_digest),
                buyer: sender(ctx),
                timestamp_ms: clock::timestamp_ms(clock)
            }
        );
        object_table::add(&mut pool.accessors, sender(ctx), access);
        pool.no_of_accessors = pool.no_of_accessors + 1;
        pool.last_price = current_price;
        pool.price = price::getReplyPrice(pool.no_of_accessors, pool.cofficient);
    }


     #[lint_allow(self_transfer)]
    entry fun sell (
        protocol_destination: address,
        transaction_digest: vector<u8>,
        reply_digest: vector<u8>,
        pool: &mut RepostPool,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        // check bought access or not
        let bought = object_table::contains(&pool.accessors, sender(ctx));
        assert!(bought, NOT_BOUGHT);

        let sold_price = price::getReplyPrice(pool.no_of_accessors - 1, pool.cofficient);

        let subject_fee = sold_price * RPOFILE_OWNER_FEE_PERCENT / 100;
        let protocol_fee = sold_price * PROTOCOL_FEE_PERCENT / 100;


        let revenue = balance::split(&mut pool.balance, sold_price - subject_fee - protocol_fee);
        let subject_fee_balance = balance::split(&mut revenue, subject_fee);
        let protocol_fee_balance = balance::split(&mut revenue, protocol_fee);

        let subject_coin = coin::from_balance(subject_fee_balance, ctx);
        transfer::public_transfer(subject_coin, sender(ctx));
        let protocol_coin = coin::from_balance(protocol_fee_balance, ctx);
        transfer::public_transfer(protocol_coin, protocol_destination);
        let revenue_coin = coin::from_balance(revenue, ctx);
        //debug::print(&revenue_coin);
        transfer::public_transfer(revenue_coin, sender(ctx));
        debug::print(&pool.balance);
        let access = object_table::remove(&mut pool.accessors, sender(ctx));
        let RepostAccess{id: access_id, accessor_address:_, 
        price: _, profile_id: _, repost_id: _, pool_id: _,
        timestamp_ms: _} = access;
        let owner_profile_id = pool.owner_profile;
        //let owner_profile_id = object::id_from_bytes(owner_profile);
        event::emit(
            RepostAccessSold {
                access_id: object::uid_to_inner(&access_id),
                repost_id: pool.for,
                profile_id: owner_profile_id,
                pool_id: object::uid_to_inner(&pool.id),
                repost_digest: string::utf8(reply_digest),
                price: sold_price,
                transaction_digest: string::utf8(transaction_digest),
                seller: sender(ctx),
                timestamp_ms: clock::timestamp_ms(clock)
            }
        );
        object::delete(access_id);
        pool.no_of_accessors = pool.no_of_accessors - 1;
        pool.last_price = sold_price;
        pool.price = price::getReplyPrice(pool.no_of_accessors, pool.cofficient);
    }



}