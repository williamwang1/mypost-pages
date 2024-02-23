#[allow(unused_use)]
#[lint_allow(self_transfer)]
module mypost::reply { 
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


    struct Reply has key, store {
        id: UID,
        content: String,
        owner: address,
        transaction: String,
    }

    struct ReplyAccess has key, store {
        id: UID,
        reply_id: ID,
        pool_id: ID,
        profile_id: ID,
        accessor_address: address,
        price: u64,
        timestamp_ms: u64
    }

    struct ReplyPool has key {
        id: UID,
        for: ID,
        initial_price: u64,
        price: u64,
        last_price: u64,
        owner: address,
        cofficient: u64,
        owner_profile: ID,
        no_of_accessors: u64,
        accessors: ObjectTable<address, ReplyAccess>,
        balance: Balance<SUI>,
    }

    struct ReplyCreated has copy, drop {
        reply_id: ID,
        pool_id: ID,
        profile_id: ID,
        transaction_digest: String,
        timestamp_ms: u64
    }

    struct ReplyAccessBought has copy, drop {
        access_id: ID,
        transaction_id: ID,
        profile_id: ID,
        buyer: address,
        transaction_digest: String,
        reply_digest: String,
        price: u64,
        timestamp_ms: u64
    }

    // struct ReplyAccessSold has copy, drop {
    //     access_id: ID,
    //     transaction_id: ID,
    //     profile_id: ID,
    //     seller: address,
    //     transaction_digest: String,
    //     reply_digest: String,
    //     price: u64,
    //     timestamp_ms: u64
    // }

    #[lint_allow(self_transfer)]
    public entry fun create (
        profile_pool: &mut ProfilePool,
        content: vector<u8>,
        coffient: u64,
        transaction_digest: vector<u8>,
        reply_digest: vector<u8>,
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

        let reply = Reply {
            id: id,
            content: string::utf8(content),
            owner: sender(ctx),
            transaction: string::utf8(transaction_digest),
        };
        let pool = ReplyPool {
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
            ReplyCreated{
                reply_id: inner_id,
                pool_id: pool_inner_id,
                profile_id: profile_id,
                transaction_digest: string::utf8(transaction_digest),
                timestamp_ms: clock::timestamp_ms(clock),
            }
        );

        let access = ReplyAccess{
            id: access_id,
            reply_id: inner_id,
            pool_id: pool_inner_id,
            profile_id: profile_id,
            accessor_address: sender(ctx),
            price: 0,
            timestamp_ms: clock::timestamp_ms(clock),
        };
        event::emit(
            ReplyAccessBought{
                access_id: acess_inner_id,
                transaction_id: inner_id,
                profile_id: profile_id,
                buyer: sender(ctx),
                transaction_digest: string::utf8(transaction_digest),
                reply_digest: string::utf8(reply_digest),
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

    

}