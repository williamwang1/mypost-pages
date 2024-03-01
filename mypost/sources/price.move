

module mypost::price {
    friend mypost::reply;
    friend mypost::transaction;
    friend mypost::profile;
    friend mypost::repost;

    const SUI_MIST: u64 = 1000000000;

    public(friend) fun getReplyPrice(no_of_accessors: u64, cofficient: u64): u64 {
        let price = no_of_accessors * no_of_accessors * SUI_MIST / cofficient;
        // pool.price = price;
        (price)
    }

    public(friend) fun getTransactionPrice(no_of_accessors: u64, cofficient: u64): u64 {
        let price = no_of_accessors * no_of_accessors * SUI_MIST / cofficient;
        // pool.price = price;
        (price)
    }

    public(friend) fun getProfilePrice(no_of_accessors: u64): u64 {
        let price = no_of_accessors * no_of_accessors * SUI_MIST / 5000;
        // pool.price = price;
        (price)
    }

}