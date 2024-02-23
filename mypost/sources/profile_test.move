#[test_only]
#[allow(unused_use)]
module mypost::profile_test {
    use sui::test_scenario as ts;
    use sui::tx_context;
    use sui::test_utils;
    use mypost::profile::{Self, Global, Profile, ProfilePool, PROFILE};
    use sui::transfer;
    use sui::sui::SUI;
    use sui::object_table;
    use sui::object::{Self, ID};
    use sui::clock::{Self, Clock};
    use sui::coin;
    use std::debug;

    const ADMIN: address = @0xAD;
    const ALICE: address = @0xA;
    const BOB: address = @0xB;
    const PROTOCOL: address = @0xC;

    const MINIMUM_FUND: u64 = 1;

    #[test]
    fun test_create() { 
        let ts = ts::begin(ADMIN);
        {
            ts::next_tx(&mut ts, ADMIN);
            profile::init_for_testing(
                test_utils::create_one_time_witness<PROFILE>(), 
                ts::ctx(&mut ts)
            );
            profile::create_global(ts::ctx(&mut ts));
        };
        {
            ts::next_tx(&mut ts, ADMIN);
            let global: Global = ts::take_shared(&ts);
            assert!(ts::has_most_recent_shared<Global>(), 1);
            ts::return_shared<Global>(global);
        };
        {
            ts::next_tx(&mut ts, ALICE);
            let global: Global = ts::take_shared(&ts);
            let coin = coin::mint_for_testing<SUI>(MINIMUM_FUND, ts::ctx(&mut ts));
            let clock: Clock = clock::create_for_testing(ts::ctx(&mut ts));
            profile::create_profile_pool(
                b"alice",
                b"bio",
                b"avatar",
                &mut global,
                &clock,
                ts::ctx(&mut ts)
            );
            ts::return_shared<Global>(global);
            clock::destroy_for_testing(clock);
            coin::burn_for_testing(coin);
        };
        {
            ts::next_tx(&mut ts, ALICE);
            assert!(ts::has_most_recent_for_sender<Profile>(&ts), 1);
            assert!(ts::has_most_recent_shared<ProfilePool>(), 1);
            
        };
        {
            ts::next_tx(&mut ts, BOB);
            let global: Global = ts::take_shared(&ts);
            //let coin = coin::mint_for_testing<SUI>(MINIMUM_FUND, ts::ctx(&mut ts));
            let clock: Clock = clock::create_for_testing(ts::ctx(&mut ts));
            profile::create_profile_pool(
                b"bob",
                b"bio",
                b"avatar",
                &mut global,
                &clock,
                ts::ctx(&mut ts)
            );
            ts::return_shared<Global>(global);
            clock::destroy_for_testing(clock);
            //coin::burn_for_testing(coin);
        };
        {
            ts::next_tx(&mut ts, BOB);
            let global: Global = ts::take_shared(&ts);
            let follower_pool: ProfilePool = ts::take_shared(&ts);
            let following_pool: ProfilePool = ts::take_shared(&ts);
            let bob_profile: Profile = ts::take_from_sender(&ts);
            let clock: Clock = clock::create_for_testing(ts::ctx(&mut ts));
            let coin = coin::mint_for_testing<SUI>(300000, ts::ctx(&mut ts));
            profile::follow(coin, ADMIN, &mut global, 
            &mut bob_profile, &mut following_pool, &mut follower_pool,
            &clock, ts::ctx(&mut ts) );
            ts::return_shared<Global>(global);
            ts::return_shared<ProfilePool>(following_pool);
            ts::return_shared<ProfilePool>(follower_pool);
            ts::return_to_sender<Profile>(&ts, bob_profile);
            clock::destroy_for_testing(clock);
            //coin::burn_for_testing(coin);
        };
        {
            ts::next_tx(&mut ts, ALICE);
            let global: Global = ts::take_shared(&ts);
            let alice_profile: Profile = ts::take_from_sender(&ts);
            let follower_pool: ProfilePool = ts::take_shared(&ts);
            let following_pool: ProfilePool = ts::take_shared(&ts);
            let clock: Clock = clock::create_for_testing(ts::ctx(&mut ts));
            profile::unfollow(&global, ADMIN, 
            &mut alice_profile, 
            &mut following_pool, &mut follower_pool, 
            &clock, ts::ctx(&mut ts));
            ts::return_shared<Global>(global);
            ts::return_shared<ProfilePool>(following_pool);
            ts::return_shared<ProfilePool>(follower_pool);
            ts::return_to_sender<Profile>(&ts, alice_profile);
            clock::destroy_for_testing(clock);


        };
        ts::end(ts);
    }
}