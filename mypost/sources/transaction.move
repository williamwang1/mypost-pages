#[allow(unused_use)]
module mypost::transaction {
    use sui::object::{Self, ID, UID};
    use sui::tx_context::{Self, TxContext, sender};
    use sui::object_table::{Self, ObjectTable};
    use sui::event;
    use std::string::{Self, String};
    use sui::sui::SUI;
    use sui::clock::{Self, Clock};
    use sui::balance::{Self, Balance};
    use mypost::profile::{Self, Profile};
    use sui::transfer;

    struct Transaction has key, store {
        id: UID,
        content: Content,
        owner: address,
        no_of_accessors: u64,
        accessors: ObjectTable<address, Access>,
    }

    struct Access has key, store {
        id: UID,
        transaction_id: ID,
        profile_id: ID,
        accessor_profile: ID,
        price: u64,
        //timestamp_ms: u64
    }

    struct Content has store {
        content: String,
        for: ID
    }

    struct TransactionPool has key {
        id: UID,
        for: ID,
        initial_price: u64,
        price: u64,
        balance: Balance<SUI>,
    }

    struct TransactionCreated has copy, drop {
        transaction_id: ID,
        pool_id: ID,
        profile_id: ID,
        timestamp_ms: u64
    }

    struct AccessBought has copy, drop {
        access_id: ID,
        transaction_id: ID,
        profile_id: ID,
        accessor_profile: ID,
        price: u64,
        timestamp_ms: u64
    }

    #[lint_allow(self_transfer)]
    entry fun create (
        profile: &mut Profile,
        content: vector<u8>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let id = object::new(ctx);
        let inner_id = object::uid_to_inner(&id);
        let pool_id = object::new(ctx);
        let inner_pool_id = object::uid_to_inner(&pool_id);
        let acessor_id = object::new(ctx);
        let acessor_inner_id = object::uid_to_inner(&acessor_id);
        let profile_id = profile::get_profile_id(profile);

        let content = Content{
            for: inner_id,
            content: string::utf8(content),
        };
        let transaction = Transaction{
            id: id,
            content: content,
            owner: sender(ctx),
            no_of_accessors: 0,
            accessors: object_table::new(ctx)
        };

        let pool = TransactionPool{
            id: pool_id,
            for: inner_id,
            initial_price: 0,
            price: 0,
            balance: balance::zero(),
        };
        event::emit(
            TransactionCreated{
                transaction_id: inner_id,
                pool_id: inner_pool_id,
                profile_id: profile_id,
                timestamp_ms: clock::timestamp_ms(clock),
            }
        );
        let access = Access{
            id: acessor_id,
            transaction_id: inner_id,
            profile_id: profile_id,
            accessor_profile: profile_id,
            price: 0,
            //timestamp_ms: clock::timestamp_ms(clock)
        };
        event::emit(
            AccessBought{
                access_id: acessor_inner_id,
                transaction_id: inner_id,
                profile_id: profile_id,
                accessor_profile: profile_id,
                price: 0,
                timestamp_ms: clock::timestamp_ms(clock)
            }
        );

        profile::add_transaction(profile, inner_id, inner_pool_id, profile_id, 0, clock, ctx);
        object_table::add(&mut transaction.accessors, sender(ctx), access);
        transaction.no_of_accessors = 1;
        pool.price = getPrice(1);
        transfer::transfer( transaction, sender(ctx));
        transfer::share_object(pool);
    }

    fun getPrice(no_of_accessors: u64): u64 {
        let initial_price: u64 = 10000000; // 0.01 SUI
        let price = no_of_accessors * no_of_accessors * initial_price / 16000;
        // pool.price = price;
        (price)
    }

}