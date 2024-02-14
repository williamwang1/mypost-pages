#[test_only]
module mypost::transaction_test {
    use sui::test_scenario as ts;
    use transaction:{Self, }
    const ALICE: address = @0xA;
    const BOB:   address = @0xB;

    #[test]
    fun test_create() {
        let ts = ts::begin(ALICE);
        {
            ts::next_tx(&mut ts, ALICE);

            // profile::create_global(ts::ctx(&mut ts));
        };
    }
}