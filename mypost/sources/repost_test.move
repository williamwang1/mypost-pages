#[test_only]
#[allow(unused_use)]
module mypost::repost_test {
    use sui::test_scenario as ts;
    use mypost::repost::{Self, RepostPool, Repost, RepostAccess};
    use mypost::profile::{Self, Global, Profile, ProfilePool, PROFILE};
    use sui::test_utils;
    use sui::sui::SUI;
    use sui::clock::{Self, Clock};
    use sui::coin;

    const ADMIN: address = @0xAD;
    const ALICE: address = @0xA;
    const BOB:   address = @0xB;

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
            ts::next_tx(&mut ts, ALICE);
            let global: Global = ts::take_shared(&ts);
            //let coin = coin::mint_for_testing<SUI>(MINIMUM_FUND, ts::ctx(&mut ts));
            let clock: Clock = clock::create_for_testing(ts::ctx(&mut ts));
            profile::create_profile_pool(
                b"name",
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
            //let coin = coin::mint_for_testing<SUI>(MINIMUM_FUND, ts::ctx(&mut ts));
            let clock: Clock = clock::create_for_testing(ts::ctx(&mut ts));
            profile::create_profile_pool(
                b"name",
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
            ts::next_tx(&mut ts, ALICE);
            let pool: ProfilePool = ts::take_shared(&ts);
            let clock: Clock = clock::create_for_testing(ts::ctx(&mut ts));
            repost::create(&mut pool, 
            b"conent",
            5000,
            b"digest",
            b"digest",
            &clock,
            ts::ctx(&mut ts));
            ts::return_shared<ProfilePool>(pool);
            clock::destroy_for_testing(clock);
        }; 
        {
            ts::next_tx(&mut ts, ALICE);
            assert!(ts::has_most_recent_for_sender<Repost>(&ts), 1);
            assert!(ts::has_most_recent_shared<RepostPool>(), 1);
            let tpool: RepostPool = ts::take_shared(&ts);
            let number = repost::get_no_of_accessors(&tpool);
            assert!(number == 1, 1);
            ts::return_shared<RepostPool>(tpool);
        };
        {
            ts::next_tx(&mut ts, BOB);
            let coin = coin::mint_for_testing<SUI>(200000, ts::ctx(&mut ts));
            let tpool: RepostPool = ts::take_shared(&ts);
            let clock: Clock = clock::create_for_testing(ts::ctx(&mut ts));
            repost::buy(coin, ADMIN, b"digest",  b"digest",&mut tpool, &clock, ts::ctx(&mut ts));
            ts::return_shared<RepostPool>(tpool);
            clock::destroy_for_testing(clock);
        };
        {
            ts::next_tx(&mut ts, BOB);
            let tpool: RepostPool = ts::take_shared(&ts);
            let number = repost::get_no_of_accessors(&tpool);
            assert!(number == 2, 1);
            ts::return_shared<RepostPool>(tpool);
        };
        {
            ts::next_tx(&mut ts, ALICE);
            //let coin = coin::mint_for_testing<SUI>(200000, ts::ctx(&mut ts));
            let tpool: RepostPool = ts::take_shared(&ts);
            let clock: Clock = clock::create_for_testing(ts::ctx(&mut ts));
            repost::sell(ADMIN, b"digest", b"digest", &mut tpool, &clock, ts::ctx(&mut ts));
            ts::return_shared<RepostPool>(tpool);
            clock::destroy_for_testing(clock);
        };
        ts::end(ts);
    }
}